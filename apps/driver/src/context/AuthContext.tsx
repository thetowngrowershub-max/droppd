import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthSession } from '@droppd/shared';
import { mockApi } from '@droppd/shared';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SESSION_STORAGE_KEY = 'droppd.driver.session';

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  requestOtp: (phoneE164: string) => Promise<void>;
  verifyOtp: (phoneE164: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_STORAGE_KEY)
      .then((raw) => {
        if (raw) setSession(JSON.parse(raw));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      async requestOtp(phoneE164) {
        await mockApi.requestOtp(phoneE164);
      },
      async verifyOtp(phoneE164, code) {
        const nextSession = await mockApi.verifyOtp(phoneE164, code, 'driver');
        setSession(nextSession);
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      },
      async logout() {
        setSession(null);
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      },
      async deleteAccount() {
        if (!session) return;
        // Apple App Store Guideline 5.1.1(v) and Google Play's Account
        // Deletion policy both require this to be reachable from inside the
        // app. See backend/src/routes/account.ts for the server-side cascade
        // delete this triggers in production (including vehicle documents).
        await mockApi.deleteAccount(session.user.id);
        setSession(null);
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      },
    }),
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
