import React, { createContext, useContext } from 'react';
import { DEMO_USER } from '@/api/base44Client';
const AuthContext = createContext(null);
const demoState = Object.freeze({
  user: DEMO_USER, isAuthenticated: false,
  isLoadingAuth: false, isLoadingPublicSettings: false, authError: null,
  appPublicSettings: { id: 'local-demo', public_settings: { requires_auth: false } },
  isDemo: true, logout: () => {}, navigateToLogin: () => {}, checkAppState: async () => {},
});
export function AuthProvider({ children }) {
  return <AuthContext.Provider value={demoState}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
