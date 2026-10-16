const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./tests/browser',timeout:60000,expect:{timeout:10000},fullyParallel:false,workers:1,retries:0,
 reporter:[['list'],['html',{open:'never'}]],outputDir:'qa/browser-results',
 use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'node tests/server.cjs',url:'http://127.0.0.1:4173',reuseExistingServer:false,timeout:15000},
 projects:[
  {name:'desktop-chromium',use:{browserName:'chromium',viewport:{width:1280,height:900}}},
  {name:'phone-webkit',use:{browserName:'webkit',viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  {name:'small-phone-chromium',use:{browserName:'chromium',viewport:{width:320,height:800},isMobile:true,hasTouch:true}},
  {name:'desktop-webkit',use:{browserName:'webkit',viewport:{width:1440,height:1000}}}
 ]
});
