const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json'};
const app=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)});
});
app.listen(4173,'127.0.0.1',()=>process.stdout.write('Moto Cardz QA server: http://127.0.0.1:4173\n'));
// CI-only control port: genuinely stop the origin, rather than emulate browser offline.
// WebKit offline emulation can reject even literal service-worker responses:
// https://github.com/microsoft/playwright/issues/42775
http.createServer((req,res)=>{
 if(req.method!=='POST'||!['/offline','/online'].includes(req.url)){res.writeHead(404).end();return}
 res.setHeader('Content-Type','application/json');
 if(req.url==='/offline'){
  if(!app.listening){res.end('{"online":false}');return}
  app.close(()=>res.end('{"online":false}'));app.closeAllConnections();
 }else{
  if(app.listening){res.end('{"online":true}');return}
  app.listen(4173,'127.0.0.1',()=>res.end('{"online":true}'));
 }
}).listen(4174,'127.0.0.1');
