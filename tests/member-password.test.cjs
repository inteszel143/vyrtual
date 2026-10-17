const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(path) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports });
  return exports;
}
const { validateMemberPassword } = load('src/lib/member-password.ts');
const { getSignInDestination } = load('src/lib/sign-in-destination.ts');
test('new invitees must supply a matching password of at least eight characters', () => {
  assert.match(validateMemberPassword('', '', true), /at least 8/);
  assert.match(validateMemberPassword('short', 'short', true), /at least 8/);
  assert.match(validateMemberPassword('long-password', 'different', true), /do not match/);
  assert.equal(validateMemberPassword('long-password', 'long-password', true), '');
});
test('keeping an existing password is allowed, but partial changes are rejected', () => {
  assert.equal(validateMemberPassword('', '', false), '');
  assert.match(validateMemberPassword('', 'confirmation', false), /at least 8/);
  assert.match(validateMemberPassword('long-password', '', false), /do not match/);
});
function client(owned, memberships, error = null) {
  return { from: () => ({ select: () => ({ limit: async () => ({ data: owned, error }) }) }), rpc: async () => ({ data: memberships, error }) };
}
test('members land in personal workspace; owners keep dashboard even with memberships', async () => {
  assert.equal(await getSignInDestination(client([], [{ member_type: 'Employee' }])), '/my-workspace');
  assert.equal(await getSignInDestination(client([], [{ member_type: 'Freelancer' }])), '/my-workspace');
  assert.equal(await getSignInDestination(client([{ id: 'owned' }], [{}])), '/dashboard');
  assert.equal(await getSignInDestination(client([], [])), '/dashboard');
});
test('membership lookup failures do not silently misroute users', async () => {
  await assert.rejects(getSignInDestination(client([], [], { message: 'unavailable' })), /Could not load/);
});
