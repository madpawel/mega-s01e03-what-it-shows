import fs from 'node:fs';
import path from 'node:path';
import { renderRoute, routes } from '../server/entry-server.js';

const template = fs.readFileSync('dist/index.html', 'utf8');
fs.rmSync('rendered', { recursive: true, force: true });
fs.mkdirSync('rendered', { recursive: true });
fs.cpSync('dist/assets', 'rendered/assets', { recursive: true });
for (const route of routes) {
  const { head, body } = renderRoute(route);
  const html = template.replace('<!--ssr-head-->', head).replace('<!--ssr-body-->', body);
  const file = path.join('rendered', route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log(route + ' -> ' + file);
}
fs.writeFileSync('rendered/index.html', '<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/kb"><a href="/kb">Support KB</a></html>');
