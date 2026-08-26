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
    education: [],
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

        // keyed rather than positional: a plain array of promises has to stay in
        // lockstep with Object.keys(EMPTY), and silently mis-assigns every
        // section the moment someone inserts one in the wrong place
        const sources = {
            hero: publicApi.hero,
            about: publicApi.about,
            footer: publicApi.footer,
            services: publicApi.services,
            clients: publicApi.clients,
            projects: publicApi.projects,
            experience: publicApi.experience,
            education: publicApi.education,
            testimonials: publicApi.testimonials,
            headings: publicApi.headings,
        };

        const keys = Object.keys(sources);
        Promise.allSettled(keys.map((key) => sources[key]())).then((results) => {
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
