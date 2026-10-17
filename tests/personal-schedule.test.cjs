const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ts = require('typescript');
const fs = require('node:fs');
const api = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/personal-schedule.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:api,Date});
test('week begins on Monday even when viewed on Sunday',()=>{
  assert.equal(api.weekStart(new Date(2026,9,25,15)).getDate(),19);
  assert.equal(api.moveDays(new Date(2026,9,19),7).getDate(),26);
});
test('validates title and date ordering, permits overnight plans',()=>{
  assert.ok(api.validateSchedule(' ','2026-10-19T09:00','2026-10-19T10:00'));
  assert.ok(api.validateSchedule('Work','invalid','2026-10-19T10:00'));
  assert.ok(api.validateSchedule('Work','2026-10-19T10:00','2026-10-19T09:00'));
  assert.equal(api.validateSchedule('Work','2026-10-19T23:00','2026-10-20T01:00'),'');
});
test('totals clip at week boundaries and exclude meetings and time off',()=>{
  const entries=[{kind:'Scheduled work',starts_at:'2026-10-18T23:00Z',ends_at:'2026-10-19T02:00Z'},{kind:'Meeting',starts_at:'2026-10-19T09:00Z',ends_at:'2026-10-19T10:00Z'}];
  assert.equal(api.scheduledHours(entries,new Date('2026-10-19T00:00Z'),new Date('2026-10-26T00:00Z')),2);
});
