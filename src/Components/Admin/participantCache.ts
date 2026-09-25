export type CachedAdminParticipant = {
    email: string;
    name: string;
    distance: string;
    bib?: number | null;
    phone_number?: string | null;
};

const PARTICIPANTS_CACHE_KEY = "osogovo-admin-participants";

export const readCachedParticipants = <T extends CachedAdminParticipant>(): T[] => {
    try {
        const raw = window.localStorage.getItem(PARTICIPANTS_CACHE_KEY);
        return raw ? JSON.parse(raw) as T[] : [];
    } catch {
        return [];
    }
};

export const writeCachedParticipants = (participants: CachedAdminParticipant[]) => {
    try {
        window.localStorage.setItem(PARTICIPANTS_CACHE_KEY, JSON.stringify(participants));
    } catch {
        // Storage may be unavailable; live network loading still works.
    }
};
