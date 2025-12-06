'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@prisma/client';

interface AuthContextType {
    user: Omit<User, 'password'> | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterFormData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<Omit<User, 'password'>>) => Promise<void>;
    isLoading: boolean;
}

interface RegisterFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    birthDate?: Date;
    newsletter?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    // Load user from localStorage on mount and refresh token
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setAccessToken(storedToken);
                setUser(JSON.parse(storedUser));

                // Try to refresh token immediately to ensure validity
                try {
                    const response = await fetch('/api/auth/refresh', {
                        method: 'POST',
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setAccessToken(data.accessToken);
                        localStorage.setItem('accessToken', data.accessToken);
                    } else if (response.status === 401) {
                        // If refresh fails with 401, session is invalid
                        setUser(null);
                        setAccessToken(null);
                        localStorage.removeItem('user');
                        localStorage.removeItem('accessToken');
                    }
                } catch (error) {
                    console.error('Token refresh failed on init:', error);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    // Refresh token periodically
    useEffect(() => {
        if (!accessToken) return;

        const refreshInterval = setInterval(async () => {
            try {
                const response = await fetch('/api/auth/refresh', {
                    method: 'POST',
                });

                if (response.ok) {
                    const data = await response.json();
                    setAccessToken(data.accessToken);
                    localStorage.setItem('accessToken', data.accessToken);
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
            }
        }, 14 * 60 * 1000); // Refresh every 14 minutes

        return () => clearInterval(refreshInterval);
    }, [accessToken]);

    const login = async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de connexion');
        }

        const data = await response.json();
        setUser(data.user);
        setAccessToken(data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('accessToken', data.accessToken);
    };

    const register = async (formData: RegisterFormData) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur d\'inscription');
        }

        const data = await response.json();
        setUser(data.user);
        setAccessToken(data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('accessToken', data.accessToken);
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
    };

    const updateUser = async (data: Partial<Omit<User, 'password'>>) => {
        if (!accessToken) throw new Error('Non authentifié');

        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur de mise à jour');
        }

        const result = await response.json();
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, register, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
