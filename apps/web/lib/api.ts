'use client';

export type UserRole = "producer" | "buyer" | "transportador" | "admin";

const FALLBACK_API = "http://localhost:4000";
const rawApiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
export const apiEnabled = Boolean(rawApiBase);
export const apiBase = rawApiBase || FALLBACK_API;

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

async function safeFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
    const base = apiBase;
    try {
        const res = await fetch(`${base}${path}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers || {}),
            },
        });
        if (!res.ok) {
            const msg = await res.text();
            return { ok: false, error: `HTTP ${res.status}: ${msg}` };
        }
        const data = (await res.json()) as T;
        return { ok: true, data };
    } catch (err: any) {
        return { ok: false, error: err?.message || "Erro desconhecido" };
    }
}

export type MetaResponse = {
    signalsTimestamp: string | null;
    counts: { products: number; offers: number; demands: number; matches: number };
};

export const fetchMeta = () => safeFetch<MetaResponse>("/api/meta");

export type Product = { id: string; name: string; unit: string; category?: string | null };
export const fetchProducts = () => safeFetch<{ products: Product[] }>("/api/products");

export type MatchDTO = {
    id: string;
    status: string;
    createdAt: string;
    product: { id: string; name: string; unit: string };
    offer: { id: string; qty: number; window: string | null; location: { lat: number | null; lng: number | null }; user: { id: string; name: string | null; role: UserRole } };
    demand: { id: string; qty: number; window: string | null; location: { lat: number | null; lng: number | null }; user: { id: string; name: string | null; role: UserRole } };
    distanceKm: number | null;
    windowFit: number | null;
    riskScore: number | null;
    rationale: string[];
    guidance: any;
};

export const fetchMatches = () => safeFetch<{ matches: MatchDTO[] }>("/api/matches");

type OfferInput = {
    userId: string;
    productId: string;
    qty: number;
    window?: string;
    lat?: number;
    lng?: number;
};

export const createOffer = (payload: OfferInput) =>
    safeFetch("/api/offers", {
        method: "POST",
        body: JSON.stringify(payload),
    });

type DemandInput = {
    userId: string;
    productId: string;
    qty: number;
    window?: string;
    lat?: number;
    lng?: number;
};

export const createDemand = (payload: DemandInput) =>
    safeFetch("/api/demands", {
        method: "POST",
        body: JSON.stringify(payload),
    });

type UserInput = {
    role: UserRole;
    name: string;
    phone: string;
    email?: string;
    lat?: number;
    lng?: number;
};

export const createUser = (payload: UserInput) =>
    safeFetch("/api/users", {
        method: "POST",
        body: JSON.stringify(payload),
    });

// Routing
export const fetchOptimizeRoute = (payload: any) =>
    safeFetch("/api/routing/optimize", {
        method: "POST",
        body: JSON.stringify(payload),
    });

// AI
export const fetchAIExplainMatch = (matchData: any) =>
    safeFetch<{ explanation: string }>("/api/ai/explain/match", {
        method: "POST",
        body: JSON.stringify({ matchData }),
    });

export const fetchAIRecommendRoute = (routePlan: any) =>
    safeFetch<{ explanation: string }>("/api/ai/explain/route", {
        method: "POST",
        body: JSON.stringify({ routePlan }),
    });


export const demoIds = {
    producerUser: process.env.NEXT_PUBLIC_DEMO_PRODUCER_ID || "",
    buyerUser: process.env.NEXT_PUBLIC_DEMO_BUYER_ID || "",
    product: process.env.NEXT_PUBLIC_DEMO_PRODUCT_ID || "",
};

export const apiBaseLabel = apiBase;

// Local registry helpers to keep IDs coerent mesmo sem backend
const LOCAL_USER_KEY = "agrocoop:user-local";
const LOCAL_PRODUCTS_KEY = "agrocoop:produtos-locais";

const createId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export type MockUser = { id: string; role: UserRole; name: string; phone?: string };
export function ensureMockUser(role: UserRole = "buyer"): MockUser {
    if (typeof window === "undefined") {
        return { id: demoIds.buyerUser || "local-buyer", role, name: "Usuário Local" };
    }
    const stored = window.localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored) as MockUser;
            return parsed;
        } catch {
            // fall through
        }
    }
    const localUser: MockUser = {
        id: demoIds.buyerUser || createId(),
        role,
        name: role === "buyer" ? "Comprador Local" : "Produtor Local",
        phone: "+55" + Math.floor(Math.random() * 1_000_000_000),
    };
    window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    return localUser;
}

export type MockProduct = { id: string; name: string; unit: string };
export function ensureMockProducts(): MockProduct[] {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored) as MockProduct[];
        } catch {
            // ignore
        }
    }
    const products: MockProduct[] = [
        { id: demoIds.product || createId(), name: "Tomate", unit: "kg" },
        { id: createId(), name: "Alface", unit: "un" },
        { id: createId(), name: "Batata", unit: "kg" },
    ];
    window.localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return products;
}
