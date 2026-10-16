const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function route({ user = { id: 'owner' }, rpcError = null, sendError = null } = {}) {
  const calls = [];
  const exports = {};
  const supabase = {
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
