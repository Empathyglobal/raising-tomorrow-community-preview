/** Local compatibility facade: no SDK, credentials, URLs or network transport. */
export const DEMO_USER = Object.freeze({ id: 'local-demo-player', full_name: 'Demo Player', role: 'user', isDemo: true });
export const DEMO_UNAVAILABLE = Object.freeze({
  ai: 'AI features are unavailable in this local demo. No message was sent.',
  remote: 'Online multiplayer is unavailable in this local demo. Use local or pass-and-play multiplayer.',
  payments: 'Purchases and paid balances are unavailable in this local demo. No payment was created.',
  service: 'This hosted service is unavailable in this local demo. No request was sent.',
});
const clone = value => JSON.parse(JSON.stringify(value));
const unavailable = message => Object.assign(new Error(message), { code: 'DEMO_SERVICE_UNAVAILABLE' });
export function createDemoClient() {
  // Holds only locally seeded scenario definitions, never server records.
  let scenarioHooks = [];
  let nextId = 0;
  const matches = (record, filter = {}) => Object.entries(filter).every(([key, value]) => record[key] === value);
  const blockedWrite = async () => { throw unavailable(DEMO_UNAVAILABLE.service); };
  const readOnlyEntity = Object.freeze({
    list: async () => [], filter: async () => [], get: async () => null,
    create: blockedWrite, bulkCreate: blockedWrite, update: blockedWrite,
    delete: blockedWrite, deleteMany: blockedWrite,
  });
  const createHook = async value => {
    const record = { ...clone(value), id: `demo-hook-${++nextId}` };
    scenarioHooks.push(record);
    return clone(record);
  };
  const entities = Object.fromEntries([
    'ActionOptions', 'BadgeDefinition', 'BadgeEarned', 'BugReports', 'FlavorLibrary',
    'FunFacts', 'MicroEvents', 'MultiplayerSessions', 'SpecialStartDefinition',
    'StorybookAssets', 'Techniques', 'YearScenarios',
  ].map(name => [name, readOnlyEntity]));
  entities.ScenarioHooks = Object.freeze({
    list: async () => clone(scenarioHooks),
    filter: async filter => clone(scenarioHooks.filter(record => matches(record, filter))),
    get: async id => clone(scenarioHooks.find(record => record.id === id) || null),
    create: createHook,
    bulkCreate: async values => Promise.all(values.map(createHook)),
    delete: async id => { scenarioHooks = scenarioHooks.filter(record => record.id !== id); return { deleted: true }; },
    deleteMany: async filter => {
      const count = scenarioHooks.filter(record => matches(record, filter)).length;
      scenarioHooks = scenarioHooks.filter(record => !matches(record, filter));
      return { deleted: count };
    },
  });
  return Object.freeze({
    isDemo: true, entities: Object.freeze(entities),
    auth: Object.freeze({
      me: async () => ({ ...DEMO_USER }), isAuthenticated: async () => false,
      logout: async () => {},
      redirectToLogin: () => { throw unavailable('Accounts and sign-in are unavailable in this local demo.'); },
      deleteAccount: async () => { scenarioHooks = []; },
    }),
    appLogs: Object.freeze({ logUserInApp: async () => {} }),
    integrations: Object.freeze({ Core: Object.freeze({ InvokeLLM: async () => { throw unavailable(DEMO_UNAVAILABLE.ai); } }) }),
    functions: Object.freeze({ invoke: async name => {
      if (/gem|stripe|checkout|payment/i.test(String(name))) throw unavailable(DEMO_UNAVAILABLE.payments);
      if (/^mp/.test(String(name))) throw unavailable(DEMO_UNAVAILABLE.remote);
      throw unavailable(DEMO_UNAVAILABLE.service);
    } }),
  });
}
export const base44 = createDemoClient();
