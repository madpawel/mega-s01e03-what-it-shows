import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('rendered');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let p = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!p.startsWith(root + path.sep) && p !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404).end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(p)] ?? 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(4173, '127.0.0.1', () => console.log('Support KB: http://127.0.0.1:4173/kb'));
