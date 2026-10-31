// Compatibility only. Never ingest URL parameters, browser tokens or environment credentials.
export const appParams = Object.freeze({
  appId: null, token: null, fromUrl: null, functionsVersion: null, appBaseUrl: null, isDemo: true,
});
