const fs=require('node:fs');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function ensureTag(github,repo,tag,sha,core){
 let ref;
 try{ref=(await github.rest.git.getRef({...repo,ref:'tags/'+tag})).data}
 catch(error){
  if(error.status!==404)throw error;
  await github.rest.git.createRef({...repo,ref:'refs/tags/'+tag,sha});
  core.info('Created immutable checkpoint: '+tag);return;
 }
 let object=ref.object;
 for(let depth=0;object.type==='tag'&&depth<5;depth++)object=(await github.rest.git.getTag({...repo,tag_sha:object.sha})).data.object;
 if(object.type!=='commit'||object.sha!==sha)throw new Error('Release tag '+tag+' already points elsewhere; refusing to move it. Bump the release version/build.');
 core.info('Verified existing checkpoint: '+tag);
}

async function waitForPages(github,repo,sha,core,{wait=pause,attempts=40}={}){
 for(let attempt=0;attempt<attempts;attempt++){
  const {data}=await github.rest.actions.listWorkflowRunsForRepo({...repo,head_sha:sha,per_page:50});
  const run=data.workflow_runs.filter(r=>r.head_sha===sha&&r.name==='pages build and deployment').sort((a,b)=>b.id-a.id)[0];
  if(run?.status==='completed'){
   if(run.conclusion!=='success')throw new Error('Pages deployment did not succeed; no release tag created.');
   core.info('Verified successful Pages deployment: '+run.html_url);return;
  }
  if(attempt<attempts-1){core.info('Waiting for Pages deployment before tagging…');await wait(15000)}
 }
 throw new Error('Timed out waiting for Pages deployment; no release tag created.');
}

module.exports=async function checkpoint({github,context,core}){
 const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
 if(!/^\d+\.\d+\.\d+$/.test(pkg.version)||!/^\d{3}$/.test(pkg.motocardzBuild))throw new Error('Invalid release version/build');
 await waitForPages(github,context.repo,context.sha,core);
 await ensureTag(github,context.repo,'v2.1.7-build008','c4041b7345040e0d0c1c48463317ca9e1852d96b',core);
 await ensureTag(github,context.repo,'v2.1.8-build009','f975cd7fc789a7a0aece11b99bf95f52f457d096',core);
 await ensureTag(github,context.repo,'v'+pkg.version+'-build'+pkg.motocardzBuild,context.sha,core);
};
module.exports.ensureTag=ensureTag;
module.exports.waitForPages=waitForPages;
