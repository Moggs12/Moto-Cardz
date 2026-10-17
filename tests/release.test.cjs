const {test}=require('node:test');
const assert=require('node:assert/strict');
const {ensureTag,waitForPages}=require('../scripts/release-checkpoint.cjs');
const repo={owner:'example',repo:'game'},core={info(){}},notFound=Object.assign(new Error('missing'),{status:404});
test('release: missing tag is created at the exact tested commit',async()=>{
 let created;const github={rest:{git:{getRef:async()=>{throw notFound},createRef:async args=>{created=args}}}};
 await ensureTag(github,repo,'v2.1.9-build010','expected',core);assert.equal(created.sha,'expected');assert.equal(created.ref,'refs/tags/v2.1.9-build010');
});
test('release: existing correct tag is preserved and annotated tags are resolved',async()=>{
 let writes=0;const github={rest:{git:{getRef:async()=>({data:{object:{type:'tag',sha:'annotation'}}}),getTag:async()=>({data:{object:{type:'commit',sha:'expected'}}}),createRef:async()=>{writes++}}}};
 await ensureTag(github,repo,'version','expected',core);assert.equal(writes,0);
});
test('release: conflicting tag and permission errors fail without modifying a ref',async()=>{
 let writes=0;const github={rest:{git:{getRef:async()=>({data:{object:{type:'commit',sha:'other'}}}),createRef:async()=>{writes++}}}};
 await assert.rejects(ensureTag(github,repo,'version','expected',core),/refusing to move/);
 github.rest.git.getRef=async()=>{throw Object.assign(new Error('forbidden'),{status:403})};
 await assert.rejects(ensureTag(github,repo,'version','expected',core),/forbidden/);assert.equal(writes,0);
});
test('release: only a successful Pages run for this exact commit permits tagging',async()=>{
 let calls=0,waits=0;const github={rest:{actions:{listWorkflowRunsForRepo:async args=>{assert.equal(args.head_sha,'expected');return{data:{workflow_runs:++calls===1?[{id:1,head_sha:'old',name:'pages build and deployment',status:'completed',conclusion:'success'}]:[{id:2,head_sha:'expected',name:'pages build and deployment',status:'completed',conclusion:'success'}]}}}}}};
 await waitForPages(github,repo,'expected',core,{attempts:2,wait:async()=>{waits++}});assert.equal(waits,1);
});
test('release: failed or missing deployments block checkpoint creation',async()=>{
 const github={rest:{actions:{listWorkflowRunsForRepo:async()=>({data:{workflow_runs:[{id:1,head_sha:'expected',name:'pages build and deployment',status:'completed',conclusion:'failure'}]}})}}};
 await assert.rejects(waitForPages(github,repo,'expected',core,{attempts:1}),/did not succeed/);
 github.rest.actions.listWorkflowRunsForRepo=async()=>({data:{workflow_runs:[]}});
 await assert.rejects(waitForPages(github,repo,'expected',core,{attempts:1}),/Timed out/);
});
