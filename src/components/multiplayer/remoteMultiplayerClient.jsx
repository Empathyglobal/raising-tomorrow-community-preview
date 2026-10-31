import { DEMO_UNAVAILABLE } from '@/api/base44Client';
const unavailable = async () => {
  throw Object.assign(new Error(DEMO_UNAVAILABLE.remote), { code: 'DEMO_SERVICE_UNAVAILABLE' });
};
// Existing interface retained; hosted sessions are impossible in this copy.
export const mpCreateSession = unavailable;
export const mpJoinSession = unavailable;
export const mpGetSession = unavailable;
export const mpCommitSession = unavailable;
