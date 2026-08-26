import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { adminApi, clearToken, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // a stored token is treated as logged in; a stale one gets cleared by the
    // 401 interceptor on the first admin request
    const [admin, setAdmin] = useState(() => {
        const stored = localStorage.getItem('portfolio_admin');
        if (!getToken() || !stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            clearToken();
            return null;
        }
    });

    // session state resolves synchronously, so consumers never wait
    const ready = true;

    const login = useCallback(async (credentials) => {
        const data = await adminApi.login(credentials);
        setToken(data.accessToken);
        localStorage.setItem('portfolio_admin', JSON.stringify(data.admin));
        setAdmin(data.admin);
        return data.admin;
    }, []);

    const logout = useCallback(async () => {
        try {
            await adminApi.logout();
        } catch {
            // logging out locally matters more than the round trip succeeding
        }
        clearToken();
        localStorage.removeItem('portfolio_admin');
        setAdmin(null);
    }, []);

    const value = useMemo(
        () => ({ admin, ready, login, logout, isAuthed: Boolean(admin) }),
        [admin, ready, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
