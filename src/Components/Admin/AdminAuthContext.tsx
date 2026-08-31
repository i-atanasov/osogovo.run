import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface AdminProfile {
    email: string;
    name?: string;
    picture?: string;
    googleSub?: string;
}

interface AdminAuthContextValue {
    admin: AdminProfile | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: (credential: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

const getAdminAuthUrl = (path: string) => `${apiUrl}${path}`;

export const AdminAuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshSession = async () => {
        if (!apiUrl) {
            setAdmin(null);
            setError("Missing API URL configuration");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get<{ admin: AdminProfile }>(getAdminAuthUrl("/admin/auth/me"), {
                withCredentials: true,
            });
            setAdmin(response.data.admin);
            setError(null);
        } catch (sessionError) {
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async (credential: string) => {
        if (!apiUrl) {
            setError("Missing API URL configuration");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post<{ admin: AdminProfile }>(
                getAdminAuthUrl("/admin/auth/google"),
                { credential },
                { withCredentials: true },
            );
            setAdmin(response.data.admin);
            setError(null);
        } catch (signInError) {
            setAdmin(null);
            setError("Google profile is not allowed for admin access");
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        if (apiUrl) {
            await axios.post(getAdminAuthUrl("/admin/auth/logout"), {}, { withCredentials: true });
        }
        setAdmin(null);
    };

    useEffect(() => {
        refreshSession();
    }, []);

    return (
        <AdminAuthContext.Provider value={{ admin, loading, error, signInWithGoogle, signOut, refreshSession }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);

    if (!context) {
        throw new Error("useAdminAuth must be used within AdminAuthProvider");
    }

    return context;
};
