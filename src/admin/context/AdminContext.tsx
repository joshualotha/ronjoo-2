import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { adminLogin as apiLogin, adminLogout as apiLogout, adminMe } from '../../services/adminApi';

interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: 'super-admin' | 'content-editor';
  avatar?: string;
}

interface AdminContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notificationCount: number;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setNotificationCount: (count: number) => void;
  refreshMe: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('admin_token');
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  // Check session on mount
  useEffect(() => {
    // If there's no token, we're definitely not authenticated.
    // Avoid calling /me (it will always 401 and creates confusing noise on login page).
    if (!token) {
      setIsLoading(false);
      return;
    }

    adminMe()
      .then((res) => {
        setUser(res.user as AdminUser);
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        try {
          sessionStorage.removeItem('admin_token');
        } catch {
          // ignore
        }
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      const nextToken = (res as any)?.token as string | undefined;
      const nextUser = (res as any)?.user as AdminUser | undefined;
      if (!nextToken || !nextUser) return false;
      setToken(nextToken);
      sessionStorage.setItem('admin_token', nextToken);
      setUser(nextUser);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore logout errors
    }
    try {
      sessionStorage.removeItem('admin_token');
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return;
    const res = await adminMe();
    setUser((res.user as AdminUser) ?? null);
  }, [token]);

  return (
    <AdminContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        notificationCount,
        login,
        logout,
        setNotificationCount,
        refreshMe,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
