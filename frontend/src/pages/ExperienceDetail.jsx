import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft, ArrowUpRight, Building2, CalendarDays, CheckCircle2, MapPin, Wrench,
} from 'lucide-react';
import { publicApi } from '../lib/api';
import { useSiteData } from '../context/SiteDataContext';
import Loader from '../components/ui/Loader';
import GlowButton from '../components/ui/GlowButton';
import Aurora from '../components/motion/Aurora';
import TechIcon from '../components/ui/TechIcon';
import Magnetic from '../components/motion/Magnetic';
import { EASE } from '../components/motion/variants';

const splitStack = (value) =>
    String(value || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

export default function ExperienceDetail() {
    const { id } = useParams();
    const { data } = useSiteData();
    // the list is already in context; only fall back to the network on a cold URL
    const cached = data.experience?.find((e) => e._id === id) || null;
    const [entry, setEntry] = useState(cached);
    const [state, setState] = useState(cached ? 'ready' : 'loading');

    useEffect(() => {
        if (cached) {
            setEntry(cached);
            setState('ready');
            return;
        }
        let alive = true;
        publicApi
            .experienceItem(id)
            .then((item) => {
                if (!alive) return;
                setEntry(item);
                setState('ready');
            })
            .catch(() => alive && setState('error'));
        return () => {
            alive = false;
        };
    }, [id, cached]);

    if (state === 'loading') {
        return (
            <div className="grid min-h-screen place-items-center">
                <Loader label="Loading role" />
            </div>
        );
    }

    if (state === 'error' || !entry) {
        return (
            <div className="grid min-h-screen place-items-center px-6 text-center">
                <div>
                    <p className="font-display text-2xl font-semibold">Role not found</p>
                    <Link
                        to="/experience"
                        className="mt-4 inline-block text-sm text-glow-300 hover:text-glow-200"
                    >
                        ← Back to experience
                    </Link>
                </div>
            </div>
        );
    }

    const stack = splitStack(entry.techStack);
    const highlights = entry.highlights || [];
    const siblings = (data.experience || []).filter((e) => e._id !== entry._id);

    return (
        <div className="relative min-h-screen">
            <Aurora className="opacity-55" />

            <div className="relative mx-auto max-w-4xl px-6 pt-40 pb-24 sm:pt-44">
                <Link
                    to="/experience"
                    className="group inline-flex items-center gap-2 text-sm text-mist-500 transition-colors hover:text-glow-300"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to experience
                </Link>

                {/* ------------------------------ header ------------------------------ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                    className="mt-8"
                >
                    {entry.current && (
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/[0.08] px-3 py-1 font-mono text-[10px] tracking-widest text-emerald-300 uppercase">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>
                            Current
                        </span>
                    )}

                    <h1 className="font-display text-4xl leading-tight font-bold sm:text-5xl">
                        {entry.title}
                    </h1>

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-mist-500">
                        {entry.company && (
                            <span className="inline-flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-glow-400/80" />
                                {entry.companyUrl ? (
                                    <a
                                        href={entry.companyUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline decoration-glow-500/40 underline-offset-2 transition-colors hover:text-glow-300"
                                    >
                                        {entry.company}
                                    </a>
                                ) : (
                                    entry.company
                                )}
                            </span>
                        )}
                        {entry.period && (
                            <span className="inline-flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-glow-400/80" />
                                {entry.period}
                            </span>
                        )}
                        {entry.location && (
                            <span className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-glow-400/80" />
                                {entry.location}
                            </span>
                        )}
                    </div>
                </motion.div>

                {/* ------------------------------ visual ------------------------------ */}
                {entry.imageUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
                        className="glass mt-10 overflow-hidden rounded-3xl"
                    >
                        <img
                            src={entry.imageUrl}
                            alt={entry.title}
                            className="w-full object-cover"
                        />
                    </motion.div>
                )}

                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
                    className="mt-10 text-lg leading-relaxed text-mist-300"
                >
                    {entry.description}
                </motion.p>

                {entry.liveUrl && (
                    <div className="mt-8">
                        <GlowButton as="a" href={entry.liveUrl} target="_blank" rel="noreferrer">
                            Visit the product
                            <ArrowUpRight className="h-4 w-4" />
                        </GlowButton>
                    </div>
                )}

                {/* ---------------------------- highlights ---------------------------- */}
                {highlights.length > 0 && (
                    <div className="mt-16">
                        <h2 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            <CheckCircle2 className="h-4 w-4 text-glow-400/80" />
                            What I shipped
                        </h2>

                        <motion.ul
                            className="mt-6 grid gap-3"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 'some' }}
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                        >
                            {highlights.map((line, i) => (
                                <motion.li
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 16 },
                                        show: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { duration: 0.5, ease: EASE },
                                        },
                                    }}
                                    whileHover={{ x: 4 }}
                                    className="glass flex gap-4 rounded-2xl p-5 transition-colors duration-300 hover:bg-white/[0.05]"
                                >
                                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-glow-500/15 font-mono text-[11px] font-semibold text-glow-300">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <p className="text-sm leading-relaxed text-mist-300">{line}</p>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                )}

                {/* ------------------------------- stack ------------------------------ */}
                {stack.length > 0 && (
                    <div className="mt-16">
                        <h2 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            <Wrench className="h-4 w-4 text-glow-400/80" />
                            Stack
                        </h2>

                        <motion.ul
                            className="mt-6 flex flex-wrap gap-3"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 'some' }}
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                        >
                            {stack.map((tech) => (
                                <motion.li
                                    key={tech}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.9 },
                                        show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
                                    }}
                                    whileHover={{ y: -4 }}
                                    className="glass flex items-center gap-2.5 rounded-xl px-4 py-3"
                                >
                                    <TechIcon name={tech} className="h-5 w-5" />
                                    <span className="font-mono text-xs text-mist-300">{tech}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                )}

                {/* ------------------------- other roles ------------------------- */}
                {siblings.length > 0 && (
                    <div className="mt-20 border-t border-white/5 pt-10">
                        <h2 className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            Other roles
                        </h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {siblings.map((other) => (
                                <Magnetic key={other._id} strength={0.15}>
                                    <Link
                                        to={`/experience/${other._id}`}
                                        className="group glass block rounded-2xl p-5 transition-colors duration-300 hover:bg-white/[0.05]"
                                    >
                                        <p className="font-display text-base font-semibold transition-colors group-hover:text-glow-200">
                                            {other.title}
                                        </p>
                                        <p className="mt-1.5 font-mono text-[10px] text-mist-600">
                                            {other.period}
                                        </p>
                                    </Link>
                                </Magnetic>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
