import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../lib/api';

const EMPTY = {
    hero: null,
    about: null,
    footer: null,
    services: [],
    clients: [],
    projects: [],
    experience: [],
    testimonials: [],
    headings: {},
};

const SiteDataContext = createContext({ data: EMPTY, booted: false });

/**
 * One fetch for the entire public site. Every nav destination is now its own
 * route, so without this each page transition would re-request all nine
 * endpoints; the provider lives above the router outlet and fetches once.
 */
export function SiteDataProvider({ children }) {
    const [data, setData] = useState(EMPTY);
    const [booted, setBooted] = useState(false);

    useEffect(() => {
        let alive = true;

        const keys = Object.keys(EMPTY);
        Promise.allSettled([
            publicApi.hero(),
            publicApi.about(),
            publicApi.footer(),
            publicApi.services(),
            publicApi.clients(),
            publicApi.projects(),
            publicApi.experience(),
            publicApi.testimonials(),
            publicApi.headings(),
        ]).then((results) => {
            if (!alive) return;
            const next = { ...EMPTY };
            results.forEach((result, i) => {
                if (result.status === 'fulfilled' && result.value != null) {
                    next[keys[i]] = result.value;
                } else if (result.status === 'rejected') {
                    console.warn(`failed to load ${keys[i]}:`, result.reason?.message);
                }
            });
            setData(next);
            setBooted(true);
        });

        return () => {
            alive = false;
        };
    }, []);

    const value = useMemo(() => ({ data, booted }), [data, booted]);

    return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);
