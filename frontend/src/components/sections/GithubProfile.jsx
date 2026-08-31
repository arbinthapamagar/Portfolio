import { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import { Github as GithubMark } from '../ui/BrandIcons';
import SectionHeader from '../ui/SectionHeader';
import GlowButton from '../ui/GlowButton';
import Marquee from '../motion/Marquee';
import Parallax from '../motion/Parallax';
import Tilt from '../motion/Tilt';
import NodeField from '../motion/NodeField';
import Counter from '../motion/Counter';
import TechIcon from '../ui/TechIcon';
import { EASE } from '../motion/variants';
import { fetchGithubSnapshot, githubHandle, relativeTime } from '../../lib/github';
import githubAvatar from '../../assets/github-avatar.jpg';

/* The profile card and the repo grid read from the live GitHub API rather than
   from the CMS, which is the whole point: the curated Projects section is what
   Arbeen chose to show, this is what he has actually been pushing. If GitHub is
   unreachable or rate-limits the visitor, the section removes itself instead of
   leaving an error on the page. */

function Stat({ label, value, small = false }) {
    return (
        <div>
            <p
                className={`font-display font-bold whitespace-nowrap text-glow-300 ${
                    small ? 'text-base leading-8' : 'text-2xl'
                }`}
            >
                {typeof value === 'number' ? <Counter value={String(value)} /> : value}
            </p>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.16em] text-mist-600 uppercase">
                {label}
            </p>
        </div>
    );
}

function RepoSkeleton() {
    return (
        <div className="glass animate-pulse rounded-2xl p-5">
            <div className="h-4 w-1/2 rounded bg-white/[0.06]" />
            <div className="mt-3 h-3 w-full rounded bg-white/[0.04]" />
            <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.04]" />
            <div className="mt-5 h-3 w-24 rounded bg-white/[0.04]" />
        </div>
    );
}

export default function GithubProfile({ githubUrl, heading }) {
    const handle = githubHandle(githubUrl);
    const sectionRef = useRef(null);

    // a soft light that tracks the pointer across the whole section
    const glowX = useMotionValue(-400);
    const glowY = useMotionValue(-400);
    const spotlight = useMotionTemplate`radial-gradient(560px circle at ${glowX}px ${glowY}px, rgba(223,199,155,0.10), transparent 62%)`;

    const trackPointer = (event) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        glowX.set(event.clientX - rect.left);
        glowY.set(event.clientY - rect.top);
    };
    const [snapshot, setSnapshot] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!handle) return undefined;
        let alive = true;
        fetchGithubSnapshot(handle)
            .then((data) => alive && setSnapshot(data))
            .catch(() => alive && setFailed(true));
        return () => {
            alive = false;
        };
    }, [handle]);

    if (!handle || failed) return null;

    const user = snapshot?.user;
    const repos = snapshot?.repos ?? [];
    const lastPush = snapshot?.lastPush;
    const languages = snapshot?.languages ?? [];
    const recent = snapshot?.activity?.recent ?? [];

    return (
        <section
            id="github"
            ref={sectionRef}
            onPointerMove={trackPointer}
            className="relative overflow-hidden px-6 py-28 lg:py-36"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 -left-40 h-[30rem] w-[30rem] rounded-full opacity-40 blur-[130px]"
                style={{ background: 'radial-gradient(circle, rgba(139,124,232,0.22), transparent 70%)' }}
            />

            {/* drifting node mesh, pointer-reactive, paused off screen */}
            <NodeField className="opacity-[0.45]" />

            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: spotlight }}
            />

            <div className="relative mx-auto max-w-6xl">
                <SectionHeader
                    heading={heading}
                    fallback={{
                        label: 'GitHub',
                        titlePlain: 'Built in',
                        titleHighlight: 'the open.',
                        subtitle:
                            'What I have actually been pushing — public repositories pulled live from the GitHub API.',
                    }}
                />

                {recent.length > 0 && (
                    <div className="mt-10">
                        <Marquee
                            items={recent}
                            duration={38}
                            renderItem={(push) => (
                                <span className="flex items-center gap-10 font-mono text-[11px] tracking-[0.14em] text-mist-500 uppercase">
                                    <span className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-glow-400" />
                                        pushed {push.commits}{' '}
                                        {push.commits === 1 ? 'commit' : 'commits'} to{' '}
                                        <span className="text-mist-200">{push.repo}</span>
                                        <span className="text-mist-600">
                                            · {relativeTime(push.at)}
                                        </span>
                                    </span>
                                    <span className="text-berry-400">✦</span>
                                </span>
                            )}
                        />
                    </div>
                )}

                <div className="mt-12 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
                    <Parallax speed={26}>
                        <div className="glass spin-ring flex h-full flex-col rounded-[1.75rem] p-7">
                            <div className="flex items-center gap-4">
                                <span className="relative shrink-0">
                                    <img
                                        src={user?.avatar_url || githubAvatar}
                                        alt={`${user?.name || handle} on GitHub`}
                                        loading="lazy"
                                        className="h-18 w-18 rounded-full border border-white/12 object-cover"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute -right-1 -bottom-1 grid h-6 w-6 place-items-center rounded-full border-2 border-ink-800 bg-ink-950 text-mist-200"
                                    >
                                        <GithubMark className="h-3.5 w-3.5" />
                                    </span>
                                </span>
                                <div className="min-w-0">
                                    <p className="font-display text-lg leading-tight font-bold text-mist-100">
                                        {user?.name || 'Arbin Thapa Magar'}
                                    </p>
                                    <a
                                        href={githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-mono text-xs text-mist-500 transition-colors hover:text-glow-300"
                                    >
                                        @{handle}
                                    </a>
                                </div>
                            </div>

                            {user?.bio && (
                                <p className="mt-5 text-sm leading-relaxed text-mist-400">{user.bio}</p>
                            )}

                            {user?.location && (
                                <p className="mt-4 flex items-center gap-2 font-mono text-[11px] tracking-wide text-mist-600 uppercase">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {user.location}
                                </p>
                            )}

                            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-6">
                                <Stat label="Repos" value={user?.public_repos ?? '—'} />
                                <Stat label="Languages" value={languages.length || '—'} />
                                <Stat
                                    label="Last push"
                                    small
                                    value={lastPush ? relativeTime(lastPush) : '—'}
                                />
                            </div>

                            {languages.length > 0 && (
                                <div className="mt-7 border-t border-white/[0.06] pt-6">
                                    <p className="font-mono text-[10px] tracking-[0.16em] text-mist-600 uppercase">
                                        Most used
                                    </p>
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {languages.slice(0, 5).map(({ name, count }) => (
                                            <li
                                                key={name}
                                                title={`${count} ${count === 1 ? 'repository' : 'repositories'}`}
                                                className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-mist-300"
                                            >
                                                <TechIcon name={name} className="h-3.5 w-3.5" />
                                                {name}
                                                <span className="font-mono text-[10px] text-mist-600">
                                                    {count}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-7 pt-1 lg:mt-auto">
                                <GlowButton as="a" href={githubUrl} target="_blank" rel="noreferrer">
                                    <GithubMark className="h-4 w-4" />
                                    View profile
                                </GlowButton>
                            </div>
                        </div>
                    </Parallax>

                    <Parallax speed={-16}>
                        <div className="grid gap-4 sm:grid-cols-2">
                        {!snapshot &&
                            Array.from({ length: 4 }).map((_, i) => <RepoSkeleton key={i} />)}

                        {repos.map((repo, i) => (
                            <Tilt key={repo.id} className="group h-full rounded-2xl" max={8}>
                                <motion.a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    initial={{ opacity: 0, y: 26, rotateX: -8 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                                    className="glass glow-ring flex h-full flex-col rounded-2xl p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="font-display text-base leading-tight font-semibold text-mist-100 transition-colors group-hover:text-glow-300">
                                            {repo.name}
                                        </p>
                                        <ArrowUpRight className="h-4 w-4 shrink-0 text-mist-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-glow-300" />
                                    </div>

                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-500">
                                        {repo.description || 'No description yet.'}
                                    </p>

                                    <div className="mt-auto flex items-center gap-4 pt-5 font-mono text-[10px] tracking-wide text-mist-600 uppercase">
                                        {repo.language && (
                                            <span className="flex items-center gap-1.5">
                                                <TechIcon name={repo.language} className="h-3.5 w-3.5" />
                                                {repo.language}
                                            </span>
                                        )}
                                        {repo.stargazers_count > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3 w-3" />
                                                {repo.stargazers_count}
                                            </span>
                                        )}
                                        <span className="ml-auto normal-case">
                                            {relativeTime(repo.pushed_at)}
                                        </span>
                                    </div>
                                </motion.a>
                                </Tilt>
                            ))}
                        </div>
                    </Parallax>
                </div>
            </div>
        </section>
    );
}
