/**
 * Public GitHub data for the profile section.
 *
 * Unauthenticated REST, so it runs straight from the browser: two requests per
 * visitor against a 60/hour limit. The contribution graph is deliberately not
 * here — that number only exists in the GraphQL API, which needs a token, and a
 * token cannot ship to the client.
 */
const API = 'https://api.github.com';

// how far back the activity graphics run. the public events feed only keeps ~90
// days (and at most 300 events), so anything longer would be a graph of nothing
export const ACTIVITY_DAYS = 91;

// the handle is read off the profile url the footer already stores
export const githubHandle = (url) => {
    if (!url) return '';
    const [handle] = String(url).replace(/\/+$/, '').split('/').slice(-1);
    return /^[\w-]+$/.test(handle) ? handle : '';
};

let inFlight = null;

export function fetchGithubSnapshot(username) {
    // one fetch per page load, shared by every mount — client-side navigation
    // back to the home page should not spend another request
    if (!inFlight) {
        inFlight = load(username).catch((err) => {
            inFlight = null;
            throw err;
        });
    }
    return inFlight;
}

const dayKey = (date) => date.toISOString().slice(0, 10);

/**
 * Real push activity, bucketed per day, from the public events feed.
 *
 * Every number here is a floor rather than a total: the feed is capped, so a
 * very busy fortnight can push older days out of range. Labels in the UI say
 * "public push activity" for exactly that reason — this is not the contribution
 * graph, which only exists behind an authenticated GraphQL call.
 */
function buildActivity(events) {
    const perDay = new Map();
    const repos = new Set();
    let commits = 0;

    for (const event of events) {
        if (event.type !== 'PushEvent') continue;
        const size = event.payload?.size ?? event.payload?.commits?.length ?? 1;
        const key = String(event.created_at).slice(0, 10);
        perDay.set(key, (perDay.get(key) || 0) + size);
        commits += size;
        if (event.repo?.name) repos.add(event.repo.name);
    }

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const series = [];
    for (let back = ACTIVITY_DAYS - 1; back >= 0; back -= 1) {
        const date = new Date(today);
        date.setDate(date.getDate() - back);
        const key = dayKey(date);
        series.push({ date: key, weekday: date.getDay(), count: perDay.get(key) || 0 });
    }

    // the newest pushes, grouped per repo per day: four separate one-commit
    // pushes to the same repo on the same afternoon is one line, not four
    const grouped = new Map();
    for (const event of events) {
        if (event.type !== 'PushEvent') continue;
        const repo = String(event.repo?.name || '').split('/').pop();
        const day = String(event.created_at).slice(0, 10);
        const key = `${repo}@${day}`;
        const size = event.payload?.size ?? event.payload?.commits?.length ?? 1;
        const found = grouped.get(key);
        if (found) {
            found.commits += size;
        } else {
            grouped.set(key, { id: key, repo, commits: size, at: event.created_at });
        }
    }
    const recent = [...grouped.values()].slice(0, 10);

    return { series, commits, reposTouched: repos.size, activeDays: perDay.size, recent };
}

async function loadEvents(username) {
    // two pages is the whole feed in practice; a failure here must not take the
    // rest of the section down with it
    try {
        const pages = await Promise.all([
            fetch(`${API}/users/${username}/events/public?per_page=100&page=1`),
            fetch(`${API}/users/${username}/events/public?per_page=100&page=2`),
        ]);
        const lists = await Promise.all(
            pages.map((res) => (res.ok ? res.json() : []))
        );
        return buildActivity(lists.flat());
    } catch {
        return null;
    }
}

async function load(username) {
    const [userRes, reposRes, activity] = await Promise.all([
        fetch(`${API}/users/${username}`),
        fetch(`${API}/users/${username}/repos?per_page=100&sort=pushed`),
        loadEvents(username),
    ]);

    if (!userRes.ok || !reposRes.ok) {
        throw new Error(`GitHub responded ${userRes.status}/${reposRes.status}`);
    }

    const user = await userRes.json();
    const all = await reposRes.json();

    // own work only, most starred first, then most recently pushed — the closest
    // thing to the pinned list without an authenticated call
    const own = all.filter((repo) => !repo.fork && !repo.archived);

    const repos = [...own]
        .sort(
            (a, b) =>
                b.stargazers_count - a.stargazers_count ||
                new Date(b.pushed_at) - new Date(a.pushed_at)
        )
        .slice(0, 6);

    // counted across everything, not just the six on screen, and ranked by how
    // many repositories each language actually carries
    const tally = new Map();
    for (const repo of own) {
        if (repo.language) tally.set(repo.language, (tally.get(repo.language) || 0) + 1);
    }
    const languages = [...tally.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    const lastPush = own.reduce(
        (latest, repo) => (!latest || repo.pushed_at > latest ? repo.pushed_at : latest),
        ''
    );

    return { user, repos, languages, lastPush, activity };
}

// "3 days ago" without pulling in a date library
export function relativeTime(iso) {
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.round(days / 30);
    if (months < 12) return `${months} mo ago`;
    const years = Math.round(months / 12);
    return `${years} yr ago`;
}
