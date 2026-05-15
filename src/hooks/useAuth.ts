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
    // Update React state
    setState((prev) => ({ ...prev, selectedBU: bu }));
    // Persist to database session
    try {
      db.update(TABLES.USERS, 'session', { selectedBU: bu });
      console.log('[useAuth] selectBU: Persisted to database -', bu.id, bu.name);
    } catch (err) {
      console.error('[useAuth] selectBU: Failed to persist -', err);
    }
  }, []);

  const selectAWS = useCallback((aws: AWSSchema) => {
    // Update React state
    setState((prev) => ({ ...prev, selectedAWS: aws }));
    // Persist to database session
    try {
      db.update(TABLES.USERS, 'session', { selectedAWS: aws });
      console.log('[useAuth] selectAWS: Persisted to database -', aws.id, aws.name);
    } catch (err) {
      console.error('[useAuth] selectAWS: Failed to persist -', err);
    }
  }, []);

  const logout = useCallback(async () => {
    await db.delete(TABLES.USERS, 'session');
    setState({ user: null, selectedBU: null, selectedAWS: null, isAuthenticated: false, isLoading: false });
  }, []);

  return { ...state, login, selectBU, selectAWS, logout };
}
