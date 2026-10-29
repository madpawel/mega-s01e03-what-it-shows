import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { causeOf, sameCause, uniqueById, groupByCause } from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';
import { DEDUPE_CASES } from '../src/lib/kb/dedupe-cases.ts';
import { routes } from '../server/entry-server.js';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const reports = read('src/lib/data/reports-4471.json');
const tenants = fs.readdirSync('src/lib/data/tenants').map(f => read('src/lib/data/tenants/' + f));
const tenantOf = r => tenants.find(t => t.handle === r.tenant);
const checks = [];
function check(name, fn) { fn(); checks.push(name); console.log('PASS ' + name); }
const merged = uniqueById(reports).filter(r => r.mergedInto === 4471);
const groups = groupByCause(merged, tenantOf);
check('427 rows deduplicate to 412 reports', () => { assert.equal(reports.length,427); assert.equal(merged.length,412); });
check('causes partition the ticket into 379 parser and 33 hint', () => {
  assert.deepEqual(Object.fromEntries(groups.map(g=>[g.cause,g.reports.length])),{parser:379,hint:33});
});
check('intake tags and browser locale do not decide cause', () => {
  const r = {...reports[0], meta:{browserLocale:'en-US',intakeTag:'hint'}};
  assert.equal(causeOf(r,tenantOf(r)), 'parser');
});
check('tenant form and locale are evaluated dynamically', () => {
  const t = tenantOf({tenant:'alder.physio'});
  assert.equal(causeOf({channel:'form'},t),'hint');
  assert.equal(causeOf({channel:'form'},{...t,form:'booking-v2'}),'parser');
  assert.equal(causeOf({channel:'form'},{...t,locale:'en-US'}),null);
  assert.equal(causeOf({channel:'form'},undefined),null);
});
check('all five dedupe counterexamples run correctly', () => {
  assert.deepEqual(DEDUPE_CASES.map(c=>sameCause(c.a,tenantOf(c.a),c.b,tenantOf(c.b))),[true,false,false,true,false]);
});
const route='/kb/decisions/0002-triage-by-cause';
const html=fs.readFileSync('rendered'+route+'/index.html','utf8');
check('real rendered page contains computed counts and footnote',()=>{
  assert.match(html,/<strong>412<\/strong>/);
  assert.match(html,/<code>parser<\/code><\/td>\s*<td\b[^>]*>379<\/td>/);
  assert.match(html,/<code>hint<\/code><\/td>\s*<td\b[^>]*>33<\/td>/);
  assert.match(html,/5 reports read as a one-day move/);
  assert.match(html,/parser ×356 · hint ×23/);
  assert.match(html,/hint ×18 · parser ×15/);
});
check('frontmatter reaches RenderStamp and derives the reference',()=>{
  assert.equal(deskRef('madpawel / MEGA S01E03 / harness-assisted'),'DR-DQ5R-MEEX');
  assert(html.includes(deskRef('madpawel / MEGA S01E03 / harness-assisted')));
  assert(!html.includes('no desk ref:'));
});
check('all KB routes render and the index discovers the new page',()=>{
  assert.equal(routes.length,5);
  for(const route of routes) assert(fs.existsSync('rendered'+route+'/index.html'));
  assert(fs.readFileSync('rendered/kb/index.html','utf8').includes('href="'+route+'"'));
});
check('client JS and CSS assets exist for hydration and presentation',()=>{
  for(const match of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) assert(fs.existsSync('rendered'+match[1]),match[1]);
  assert.match(html,/<script type="module"/);
  assert.match(html,/stylesheet/);
});
check('all original exported files remain byte-identical',()=>{
  const baseline=read('source-baseline.json');
  for(const [p,expected] of Object.entries(baseline)) {
    const actual=createHash('sha256').update(fs.readFileSync(p)).digest('hex');
    assert.equal(actual,expected,p);
  }
});
const hash=createHash('sha256').update(html).digest('hex');
fs.writeFileSync('verification.json',JSON.stringify({checks,route,deskRef:deskRef('madpawel / MEGA S01E03 / harness-assisted'),renderedSha256:hash,generatedAt:new Date().toISOString()},null,2)+'\n');
console.log(`${checks.length} checks passed`);
