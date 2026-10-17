/* MotoCardz Build 011: local-only XP and progression engine.
   Match rewards are granted once, on a completed match. No rewards for abandoning.
   This self-contained module can run in browsers and Node's test runner. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MotoProgression = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const STORAGE_KEY = 'motocardz.progress.v1';
  const MAX_LEVEL = 50;
  const COMPLETION_XP = 20;
  const WIN_BONUS = Object.freeze({ easy: 20, medium: 30, hard: 50 });
  const MAX_LEDGER = 512;
  const MODES = ['quick', 'duel'];

  // Increasing intervals; level 1 = 0 XP, level 2 = 100 XP, level 3 = 250 XP.
  // Keep the formula stable across builds to protect previously earned progress.
  function requiredXP(level) {
    if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) throw new RangeError('Invalid rider level');
    const n = level - 1;
    return 100 * n + 25 * n * (n - 1);
  }
  function riderLevel(totalXP) {
    const xp = Math.max(0, Number.isSafeInteger(totalXP) ? totalXP : 0);
    let level = 1;
    while (level < MAX_LEVEL && xp >= requiredXP(level + 1)) level++;
    return level;
  }
  function riderRank(level) {
    if (level >= 50) return 'Moto Legend';
    if (level >= 45) return 'Moto Master';
    if (level >= 35) return 'Elite Rider';
    if (level >= 25) return 'Pro Racer';
    if (level >= 15) return 'Track Rider';
    if (level >= 10) return 'Road Warrior';
    if (level >= 5) return 'Street Rider';
    return 'Rookie Rider';
  }
  function xpForMatch(difficulty, won) {
    if (!Object.prototype.hasOwnProperty.call(WIN_BONUS, difficulty) || typeof won !== 'boolean') {
      throw new TypeError('Invalid completed match');
    }
    return COMPLETION_XP + (won ? WIN_BONUS[difficulty] : 0);
  }
  const fresh = () => ({ version: 1, totalXP: 0, matches: 0, wins: 0, losses: 0, awardedIds: [] });
  function safeCount(value) { return Number.isSafeInteger(value) && value >= 0 ? value : 0; }
  function hydrate(storage) {
    try {
      const raw = JSON.parse(storage && storage.getItem(STORAGE_KEY) || 'null');
      if (!raw || raw.version !== 1 || typeof raw !== 'object') return fresh();
      const p = fresh();
      for (const field of ['totalXP', 'matches', 'wins', 'losses']) p[field] = safeCount(raw[field]);
      if (p.wins + p.losses > p.matches) return fresh();
      if (Array.isArray(raw.awardedIds)) {
        p.awardedIds = Array.from(new Set(raw.awardedIds.filter(id => typeof id === 'string' && id.length > 0 && id.length <= 128))).slice(-MAX_LEDGER);
      }
      return p;
    } catch (_) { return fresh(); }
  }
  function createStore(storage) {
    let state = hydrate(storage), sequence = 0;
    function save() {
      try { if (storage) storage.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch (_) { /* Browsers with blocked storage remain playable, with session-only progress. */ }
    }
    function newMatchId() {
      sequence++;
      return 'm-' + Date.now().toString(36) + '-' + sequence.toString(36) + '-' + Math.random().toString(36).slice(2, 14);
    }
    function snapshot() {
      const level = riderLevel(state.totalXP);
      const at = requiredXP(level);
      const next = level < MAX_LEVEL ? requiredXP(level + 1) : null;
      const progress = state.totalXP - at;
      const span = next === null ? 0 : next - at;
      return Object.freeze({
        totalXP: state.totalXP, matches: state.matches, wins: state.wins, losses: state.losses,
        level, rank: riderRank(level), maxLevel: MAX_LEVEL, xpInLevel: progress,
        xpForNextLevel: span, xpUntilNext: next === null ? 0 : next - state.totalXP,
        percent: next === null ? 100 : Math.min(100, Math.floor(100 * progress / span)),
        isMaxLevel: next === null
      });
    }
    function awardMatch(match) {
      if (!match || typeof match.id !== 'string' || match.id.length === 0 || match.id.length > 128 ||
          !MODES.includes(match.mode)) throw new TypeError('Invalid match identity');
      const earned = xpForMatch(match.difficulty, match.won);
      if (state.awardedIds.includes(match.id)) {
        return Object.freeze({ awarded: false, addedXP: 0, previousLevel: snapshot().level, profile: snapshot() });
      }
      const before = snapshot().level;
      state.totalXP = Math.min(Number.MAX_SAFE_INTEGER, state.totalXP + earned);
      state.matches++;
      if (match.won) state.wins++; else state.losses++;
      state.awardedIds.push(match.id);
      if (state.awardedIds.length > MAX_LEDGER) state.awardedIds.shift();
      save();
      return Object.freeze({ awarded: true, addedXP: earned, previousLevel: before, profile: snapshot() });
    }
    return Object.freeze({ newMatchId, awardMatch, snapshot });
  }
  return Object.freeze({ STORAGE_KEY, MAX_LEVEL, COMPLETION_XP, WIN_BONUS, requiredXP, riderLevel, riderRank, xpForMatch, createStore });
});
