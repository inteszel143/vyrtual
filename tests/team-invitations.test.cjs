const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function route({ user = { id: 'owner' }, rpcError = null, sendError = null, workspace = { id: "workspace-a", name: "Example" }, invitations = [], members = [], readError = null } = {}) {
  const calls = [];
  const exports = {};
  const supabase = {
    from: (table) => {
      const result = { data: table === 'workspaces' ? workspace : table === 'team_invitations' ? invitations : members, error: readError };
      const query = {
        select: () => query,
        eq: (column, value) => { calls.push({ table, column, value }); return query; },
        order: async () => result,
        maybeSingle: async () => result,
        then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
      };
      return query;
    },
    auth: { getUser: async () => ({ data: { user } }) },
    rpc: async (name, args) => {
      calls.push({ name, args });
      return { data: { email: 'person@example.com', token: 'invitation-token' }, error: rpcError };
    },
  };
  const code = ts.transpileModule(fs.readFileSync('src/app/api/team/invitations/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, Request, Response, URL, process: { env: {} },
    require: (name) => name === '@/lib/supabase/server' ? { createClient: async () => supabase } : {
      createClient: (_url, _key, options) => {
        assert.equal(options.auth.flowType, 'implicit');
        assert.equal(options.auth.persistSession, false);
        return { auth: { signInWithOtp: async (args) => { calls.push({ name: 'send', args }); return { error: sendError }; } } };
      },
    },
  });
  return { ...exports, calls };
}
const valid = { name: 'A Person', email: 'person@example.com', role: 'Designer', type: 'Employee', companyName: 'Example' };
function request(body = valid, origin = 'https://app.example') {
  return new Request('https://app.example/api/team/invitations', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
test('rejects cross-origin requests before authentication or email', async () => {
  const handler = route();
  assert.equal((await handler.POST(request(valid, 'https://other.example'))).status, 403);
  assert.equal(handler.calls.length, 0);
});
test('requires authentication for sends and directory reads', async () => {
  const handler = route({ user: null });
  assert.equal((await handler.POST(request())).status, 401);
  assert.equal((await handler.GET()).status, 401);
  assert.equal(handler.calls.length, 0);
});
test('rejects blank fields, invalid emails and invalid member types', async () => {
  for (const input of [{ name: '  ' }, { role: ' ' }, { email: 'invalid' }, { type: 'Owner' }, { companyName: '' }]) {
    const handler = route();
    assert.equal((await handler.POST(request({ ...valid, ...input }))).status, 400);
    assert.equal(handler.calls.length, 0);
  }
});
test('does not email when database authorization or duplicate check fails', async () => {
  const handler = route({ rpcError: { code: 'P0001', message: 'This email is already on the team.' } });
  assert.equal((await handler.POST(request())).status, 400);
  assert.equal(handler.calls.length, 1);
});
test('persists first, then sends recipient link without returning the token', async () => {
  const handler = route();
  const response = await handler.POST(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.deepEqual(handler.calls.map(call => call.name), ['prepare_team_invitation', 'send']);
  assert.equal(handler.calls[1].args.options.emailRedirectTo, 'https://app.example/invite/invitation-token');
});
test('email failure is reported as failure and can be retried', async () => {
  const handler = route({ sendError: { status: 429 } });
  const response = await handler.POST(request());
  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /saved.*rate limited/);
});

test('directory includes accepted members and pending invitations without duplicates', async () => {
  const handler = route({
    members: [{ user_id: 'member-a', email: 'joined@example.com', full_name: 'Joined Member', member_type: 'Employee', avatar_url: 'https://example.com/photo.jpg' }],
    invitations: [
      { id: 'accepted', email: 'joined@example.com', accepted_at: '2026-10-17T01:00:00Z' },
      { id: 'pending', email: 'pending@example.com', accepted_at: null },
    ],
  });
  const response = await handler.GET();
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.invitations.length, 2);
  assert.equal(result.invitations[0].joined, true);
  assert.equal(result.invitations[0].avatar_url, 'https://example.com/photo.jpg');
  assert.equal(result.invitations[1].joined, false);
  assert.equal(result.workspaceName, 'Example');
  assert.ok(handler.calls.some(call => call.column === 'owner_id' && call.value === 'owner'));
  assert.equal(handler.calls.filter(call => call.column === 'workspace_id' && call.value === 'workspace-a').length, 2);
});
test('account without an owned workspace gets a helpful empty state, not forbidden', async () => {
  const handler = route({ workspace: null });
  const response = await handler.GET();
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.match(result.notice, /owner account/);
  assert.deepEqual(result.invitations, []);
});
test('database failures are not presented as an empty team', async () => {
  const response = await route({ readError: { code: 'unavailable' } }).GET();
  assert.equal(response.status, 503);
});
