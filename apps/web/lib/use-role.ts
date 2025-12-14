'use client';

import { useCallback, useEffect, useMemo, useState } from "react";

export type UserRole = "producer" | "buyer";

const ROLE_STORAGE_KEY = "agrocoop:role";
const ROLE_COOKIE = "agrocoop_role";

const getCookieValue = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const readStoredRole = (): UserRole | null => {
    if (typeof window === "undefined") return null;
    try {
        const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
        if (stored === "producer" || stored === "buyer") return stored;
    } catch (err) {
        console.warn("[role] failed to read localStorage", err);
    }

    const cookieRole = getCookieValue(ROLE_COOKIE);
    if (cookieRole === "producer" || cookieRole === "buyer") return cookieRole;

    return null;
};

const persistRole = (role: UserRole) => {
    if (typeof window !== "undefined") {
        try {
            window.localStorage.setItem(ROLE_STORAGE_KEY, role);
        } catch (err) {
            console.warn("[role] failed to persist role in localStorage", err);
        }
        const days = 30;
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${ROLE_COOKIE}=${role}; path=/; expires=${expires}`;
    }
};

export const clearStoredRole = () => {
    if (typeof window !== "undefined") {
        try {
            window.localStorage.removeItem(ROLE_STORAGE_KEY);
        } catch (err) {
            console.warn("[role] failed to clear localStorage", err);
        }
        document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
    }
};

export function useRole(defaultRole?: UserRole) {
    const [role, setRole] = useState<UserRole | null>(defaultRole ?? null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const stored = readStoredRole();
        if (stored) {
            setRole(stored);
        } else if (defaultRole) {
            persistRole(defaultRole);
            setRole(defaultRole);
        }
        setHydrated(true);
    }, [defaultRole]);

    const setAndPersistRole = useCallback((next: UserRole) => {
        persistRole(next);
        setRole(next);
    }, []);

    return useMemo(
        () => ({
            role,
            setRole: setAndPersistRole,
            hydrated,
        }),
        [role, setAndPersistRole, hydrated],
    );
}
