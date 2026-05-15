import { useState, useEffect, useCallback } from 'react';
import { db, TABLES } from '../database';
import type { UserSchema, BusinessUnitSchema, AWSSchema } from '../database/schema';

interface AuthState {
  user: UserSchema | null;
  selectedBU: BusinessUnitSchema | null;
  selectedAWS: AWSSchema | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    selectedBU: null,
    selectedAWS: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await db.getById(TABLES.USERS, 'session');
      if (session) {
        const user = await db.getById(TABLES.USERS, session.userId);
        if (user) {
          // Do not keep plain-text passwords in runtime state
          const safeUser = { ...user } as any;
          if ('password' in safeUser) delete safeUser.password;
          setState({
            user: safeUser,
            selectedBU: session.selectedBU || null,
            selectedAWS: session.selectedAWS || null,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
    } catch {}
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const login = useCallback(async (user: UserSchema) => {
    // Ensure we don't persist plain-text passwords into session storage.
    const sessionRecord: any = { ...user, id: 'session', userId: (user as any).id, selectedBU: null, selectedAWS: null };
    if ('password' in sessionRecord) delete sessionRecord.password;
    await db.insert(TABLES.USERS, sessionRecord);
    setState({ user, selectedBU: null, selectedAWS: null, isAuthenticated: true, isLoading: false });
  }, []);

  const selectBU = useCallback((bu: BusinessUnitSchema) => {
    setState((prev) => ({ ...prev, selectedBU: bu }));
  }, []);

  const selectAWS = useCallback((aws: AWSSchema) => {
    setState((prev) => ({ ...prev, selectedAWS: aws }));
  }, []);

  const logout = useCallback(async () => {
    await db.delete(TABLES.USERS, 'session');
    setState({ user: null, selectedBU: null, selectedAWS: null, isAuthenticated: false, isLoading: false });
  }, []);

  return { ...state, login, selectBU, selectAWS, logout };
}
