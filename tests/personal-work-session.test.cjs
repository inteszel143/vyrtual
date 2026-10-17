const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function store() {
  const state = { user: 'user-a', rows: [], queryError: null, rpcError: null, authError: null, pendingRead: null, calls: [] };
  const query = {};
  for (const method of ['select', 'eq', 'or', 'order']) query[method] = () => query;
  query.range = async () => state.pendingRead ?? ({ data: state.rows, error: state.queryError });
  const client = {
    from: () => query,
    auth: { getUser: async () => ({ data: { user: state.user ? { id: state.user } : null }, error: state.authError }) },
    rpc: async (name, args) => { state.calls.push({ name, args }); return { error: state.rpcError }; },
  };
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync('src/lib/personal-work-session.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, { exports, require: () => ({ createClient: () => client }), Date, JSON, Set, Error });
  return { state, api: exports };
}
test('loads active and completed records from database timestamps', async () => {
  const { state, api } = store();
  state.rows = [{ id: 'done', started_at: '2026-10-17T01:00:00Z', ended_at: '2026-10-17T02:00:00Z' }, { id: 'running', started_at: '2026-10-17T03:00:00Z', ended_at: null }];
  await api.refreshPersonalWorkSession();
  assert.equal(api.getPersonalWorkSessionSnapshot(), Date.parse('2026-10-17T03:00:00Z'));
  assert.equal(JSON.parse(api.getPersonalWorkLogsSnapshot())[0].id, 'done');
  assert.equal(api.getPersonalWorkStatusSnapshot(), '');
  await api.timeOutOfPersonalWorkSession();
  assert.equal(state.calls[0].name, 'stop_personal_time_session');
  assert.equal(state.calls[0].args.session_id, 'running');
});
test('missing migration is actionable and blocks clock writes', async () => {
  const { state, api } = store(); state.queryError = { code: 'PGRST205' };
  await api.refreshPersonalWorkSession();
  assert.match(api.getPersonalWorkStatusSnapshot(), /migration/);
  await assert.rejects(api.timeInToPersonalWorkSession(), /migration/);
  assert.equal(state.calls.length, 0);
});
test('failed clock writes reject without optimistic sessions', async () => {
  const { state, api } = store(); await api.refreshPersonalWorkSession();
  state.rpcError = { code: 'unavailable' };
  await assert.rejects(api.timeInToPersonalWorkSession(), /Could not save/);
  assert.equal(api.getPersonalWorkSessionSnapshot(), 0);
  assert.equal(api.getPersonalWorkBusySnapshot(), false);
});
test('switching accounts clears previous records even when the next read fails', async () => {
  const { state, api } = store();
  state.rows = [{ id: 'old', started_at: '2026-10-17T01:00:00Z', ended_at: null }];
  await api.refreshPersonalWorkSession();
  state.user = 'user-b'; state.queryError = { code: 'unavailable' };
  await api.refreshPersonalWorkSession();
  assert.equal(api.getPersonalWorkSessionSnapshot(), 0);
  assert.equal(api.getPersonalWorkLogsSnapshot(), '[]');
});

test('Edzel logout then John login starts with no inherited timer or logs', async () => {
  const { state, api } = store();
  state.user = 'edzel';
  state.rows = [{ id: 'edzel-session', started_at: '2026-10-17T01:00:00Z', ended_at: null }];
  await api.refreshPersonalWorkSession();
  assert.ok(api.getPersonalWorkSessionSnapshot() > 0);
  api.resetPersonalWorkSession();
  assert.equal(api.getPersonalWorkSessionSnapshot(), 0);
  assert.equal(api.getPersonalWorkLogsSnapshot(), '[]');
  state.user = 'john'; state.rows = [];
  await api.refreshPersonalWorkSession();
  assert.equal(api.getPersonalWorkSessionSnapshot(), 0);
  assert.equal(api.getPersonalWorkStatusSnapshot(), '');
  state.user = 'edzel';
  state.rows = [{ id: 'edzel-session', started_at: '2026-10-17T01:00:00Z', ended_at: null }];
  await api.refreshPersonalWorkSession();
  assert.equal(api.getPersonalWorkSessionSnapshot(), Date.parse('2026-10-17T01:00:00Z'));
});
test('late Edzel database response cannot overwrite John clock', async () => {
  const { state, api } = store();
  state.user = 'edzel'; await api.refreshPersonalWorkSession();
  let resolveRead;
  state.pendingRead = new Promise(resolve => { resolveRead = resolve; });
  const oldRefresh = api.refreshPersonalWorkSession();
  await new Promise(resolve => setImmediate(resolve));
  api.resetPersonalWorkSession();
  state.user = 'john'; state.pendingRead = null; state.rows = [];
  await api.refreshPersonalWorkSession();
  resolveRead({ data: [{ id: 'edzel-old', started_at: '2026-10-17T01:00:00Z', ended_at: null }], error: null });
  await oldRefresh;
  assert.equal(api.getPersonalWorkSessionSnapshot(), 0);
  assert.equal(api.getPersonalWorkLogsSnapshot(), '[]');
});
test('unverified authentication clears cached timer instead of keeping it visible', async () => {
  const { state, api } = store();
  state.rows = [{ id: 'old', started_at: '2026-10-17T01:00:00Z', ended_at: null }];
  await api.refreshPersonalWorkSession();
  state.authError = { message: 'expired' }; state.user = null;
  await api.refreshPersonalWorkSession();
  assert.equal(api.getPersonalWorkSessionSnapshot(), 0);
  assert.equal(api.getPersonalWorkLogsSnapshot(), '[]');
});
test('clock action refuses stale account state before submitting an RPC', async () => {
  const { state, api } = store();
  state.rows = [{ id: 'edzel', started_at: '2026-10-17T01:00:00Z', ended_at: null }];
  await api.refreshPersonalWorkSession();
  state.user = 'john';
  await assert.rejects(api.timeOutOfPersonalWorkSession(), /account changed/);
  assert.equal(state.calls.length, 0);
  assert.equal(api.getPersonalWorkSessionSnapshot(), 0);
  assert.equal(api.getPersonalWorkBusySnapshot(), false);
});
