import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoClient, DEMO_USER } from '../src/api/base44Client.js';
import { appParams } from '../src/lib/app-params.js';

test('scenario definitions remain local, copied, and isolated between clients', async () => {
  const client = createDemoClient();
  const seed = { packId: 'synthetic-test', nested: { title: 'Fictional example' } };
  const stored = await client.entities.ScenarioHooks.create(seed);
  seed.nested.title = 'changed';
  stored.nested.title = 'changed again';
  assert.equal((await client.entities.ScenarioHooks.list())[0].nested.title, 'Fictional example');
  assert.equal((await client.entities.ScenarioHooks.filter({ packId: 'synthetic-test' })).length, 1);
  assert.deepEqual(await createDemoClient().entities.ScenarioHooks.list(), []);
  assert.deepEqual(await client.entities.ScenarioHooks.deleteMany({ packId: 'synthetic-test' }), { deleted: 1 });
  assert.deepEqual(await client.entities.ScenarioHooks.list(), []);
  assert.deepEqual(await client.entities.ActionOptions.filter({ actionType: 'synthetic' }), []);
});

test('payments, AI, sessions, and unknown services fail closed without network', async () => {
  const originalFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = () => { networkCalls++; throw new Error('Network must not be used'); };
  try {
    const client = createDemoClient();
    for (const name of ['createGemCheckout', 'getPaidGemBalance', 'spendPaidGems', 'stripeWebhook', 'mpCreateSession', 'mpJoinSession', 'mpGetSession', 'mpCommitSession', 'metaBadges', 'unknownService']) {
      await assert.rejects(client.functions.invoke(name, { synthetic: true }), { code: 'DEMO_SERVICE_UNAVAILABLE' });
    }
    await assert.rejects(client.integrations.Core.InvokeLLM({ prompt: 'synthetic' }), /AI features are unavailable/);
    await assert.rejects(client.entities.BugReports.create({ title: 'synthetic' }), /unavailable/);
    await client.appLogs.logUserInApp('synthetic');
    assert.equal(networkCalls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test('identity is synthetic and no account or credentials are accepted', async () => {
  const client = createDemoClient();
  const user = await client.auth.me();
  assert.deepEqual(user, DEMO_USER);
  assert.equal(user.role, 'user');
  assert.equal(user.isDemo, true);
  user.role = 'admin';
  assert.equal((await client.auth.me()).role, 'user');
  assert.equal(await client.auth.isAuthenticated(), false);
  assert.throws(() => client.auth.redirectToLogin('https://example.invalid'), /unavailable/);
  assert.equal(appParams.appId, null);
  assert.equal(appParams.token, null);
  assert.equal(appParams.appBaseUrl, null);
  await client.auth.logout();
});

test('URL and browser storage cannot configure a production connection', async () => {
  const originalWindow = globalThis.window;
  globalThis.window = Object.defineProperties({}, {
    location: { get() { throw new Error('URL must not be read'); } },
    localStorage: { get() { throw new Error('Storage must not be read'); } },
  });
  try {
    const { appParams: isolatedParams } = await import('../src/lib/app-params.js?isolation-test');
    assert.equal(isolatedParams.token, null);
    assert.equal(isolatedParams.appId, null);
    assert.equal(isolatedParams.appBaseUrl, null);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
