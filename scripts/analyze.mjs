import fs from 'node:fs';
import { uniqueById, groupByCause, readAs } from '../src/lib/kb/causes.ts';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const reports = read('src/lib/data/reports-4471.json');
const notes = read('src/lib/data/desk-notes.json');
const tenants = fs.readdirSync('src/lib/data/tenants').map(f => read('src/lib/data/tenants/' + f));
const unique = uniqueById(reports);
const merged = unique.filter(r => r.mergedInto === 4471);
const groups = groupByCause(merged, r => tenants.find(t => t.handle === r.tenant));
const result = {
  exportDate: '2026-10-04',
  rawRows: reports.length, uniqueReports: unique.length,
  duplicateRows: reports.length - unique.length, mergedReports: merged.length,
  groups: groups.map(({reports,...g}) => ({
    ...g, count: reports.length, readAsOneDayMove: readAs({reports},notes.oneDayMove),
    reportIds: reports.map(r=>r.id),
  })),
};
console.log(JSON.stringify(result,null,2));
