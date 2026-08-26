import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowLeft, ArrowUpRight, Images, Star, Target, UserRound, Wrench, X,
} from 'lucide-react';
import { Github } from '../components/ui/BrandIcons';
import { publicApi } from '../lib/api';
import { useSiteData } from '../context/SiteDataContext';
import Loader from '../components/ui/Loader';
import GlowButton from '../components/ui/GlowButton';
import Reveal from '../components/motion/Reveal';
import Aurora from '../components/motion/Aurora';
import Magnetic from '../components/motion/Magnetic';
import TechIcon, { brandHex } from '../components/ui/TechIcon';
import { EASE } from '../components/motion/variants';

/* the stack logos double as the hero art when a project has no screenshot */
function StackHero({ project }) {
    const stack = (project.stack || []).slice(0, 8);

    return (
        <div className="glass relative aspect-[16/7] overflow-hidden rounded-3xl">
            <motion.div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.14]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
                animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            />

            {/* the project initial, oversized and drifting behind the logos */}
            <motion.span
                aria-hidden="true"
                animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.08, 0.05] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 grid place-items-center font-display text-[13rem] leading-none font-bold text-mist-100"
            >
                {project.title?.charAt(0)}
            </motion.span>

            <div className="relative grid h-full place-items-center p-8">
                <motion.ul
                    className="flex flex-wrap justify-center gap-4"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
                >
                    {stack.map((tech) => {
                        const hex = brandHex(tech);
                        return (
                            <motion.li
                                key={tech}
                                variants={{
                                    hidden: { opacity: 0, y: 22, scale: 0.8 },
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: { type: 'spring', stiffness: 260, damping: 20 },
                                    },
                                }}
                                whileHover={{ y: -6, scale: 1.08 }}
                                className="grid h-14 w-14 place-items-center rounded-2xl border backdrop-blur"
                                style={{
                                    borderColor: hex ? `${hex}3d` : 'rgba(255,255,255,0.09)',
                                    backgroundColor: hex ? `${hex}12` : 'rgba(255,255,255,0.03)',
                                }}
                                title={tech}
                            >
                                <TechIcon name={tech} className="h-7 w-7" />
                            </motion.li>
                        );
                    })}
                </motion.ul>
            </div>
        </div>
    );
}

export default function ProjectDetail() {
    const { id } = useParams();
    const { data } = useSiteData();
    const cached = data.projects?.find((p) => p._id === id) || null;
    const [project, setProject] = useState(cached);
    const [state, setState] = useState(cached ? 'ready' : 'loading');
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        if (cached) {
            setProject(cached);
            setState('ready');
            return;
        }
        let alive = true;
        publicApi
            .project(id)
            .then((item) => {
                if (!alive) return;
                setProject(item);
                setState('ready');
            })
            .catch(() => alive && setState('error'));
        return () => {
            alive = false;
        };
    }, [id, cached]);

    // esc closes the lightbox
    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e) => e.key === 'Escape' && setLightbox(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox]);

    if (state === 'loading') {
        return (
            <div className="grid min-h-screen place-items-center">
                <Loader label="Loading project" />
            </div>
        );
    }

    if (state === 'error' || !project) {
        return (
            <div className="grid min-h-screen place-items-center px-6 text-center">
                <div>
                    <p className="font-display text-2xl font-semibold">Project not found</p>
                    <Link to="/projects" className="mt-4 inline-block text-sm text-glow-300 hover:text-glow-200">
                        ← Back to projects
                    </Link>
                </div>
            </div>
        );
    }

    const shots = project.screenshots || [];
    const others = (data.projects || []).filter((p) => p._id !== project._id).slice(0, 4);

    return (
        <div className="relative min-h-screen">
            <Aurora className="opacity-55" />

            <div className="relative mx-auto max-w-4xl px-6 pt-40 pb-24 sm:pt-44">
                <Link
                    to="/projects"
                    className="group inline-flex items-center gap-2 text-sm text-mist-500 transition-colors hover:text-glow-300"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to projects
                </Link>

                {/* ------------------------------ header ------------------------------ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                    className="mt-8"
                >
                    {project.featured && (
                        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-glow-400/30 bg-glow-500/[0.08] px-3 py-1 font-mono text-[10px] tracking-widest text-glow-300 uppercase">
                            <Star className="h-2.5 w-2.5 fill-current" /> Featured
                        </span>
                    )}
                    <h1 className="font-display text-4xl leading-tight font-bold sm:text-5xl">
                        {project.title}
                    </h1>
                </motion.div>

                {/* ------------------------------- hero ------------------------------- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
                    className="mt-9"
                >
                    {shots[0]?.url ? (
                        <button
                            type="button"
                            onClick={() => setLightbox(shots[0].url)}
                            className="glass group block w-full overflow-hidden rounded-3xl"
                        >
                            <motion.img
                                src={shots[0].url}
                                alt={project.title}
                                className="aspect-[16/9] w-full object-cover"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.7, ease: EASE }}
                            />
                        </button>
                    ) : (
                        <StackHero project={project} />
                    )}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
                    className="mt-10 text-lg leading-relaxed text-mist-300"
                >
                    {project.description}
                </motion.p>

                <div className="mt-8 flex flex-wrap gap-3">
                    {project.links?.liveDemo && (
                        <GlowButton as="a" href={project.links.liveDemo} target="_blank" rel="noreferrer">
                            Live demo <ArrowUpRight className="h-4 w-4" />
                        </GlowButton>
                    )}
                    {project.links?.github && (
                        <GlowButton
                            as="a"
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            variant="ghost"
                        >
                            <Github className="h-4 w-4" /> Source
                        </GlowButton>
                    )}
                </div>

                {/* ----------------------------- the story ---------------------------- */}
                <div className="mt-16 grid gap-4 sm:grid-cols-5">
                    <Reveal className="sm:col-span-3">
                        <div className="glass h-full rounded-2xl p-6">
                            <h2 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                                <Target className="h-4 w-4 text-glow-400/80" />
                                The problem
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-mist-300">
                                {project.problemSolved}
                            </p>
                        </div>
                    </Reveal>

                    {project.role && (
                        <Reveal delay={0.1} className="sm:col-span-2">
                            <div className="glass h-full rounded-2xl p-6">
                                <h2 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                                    <UserRound className="h-4 w-4 text-glow-400/80" />
                                    My role
                                </h2>
                                <p className="mt-4 font-display text-lg leading-snug font-semibold text-glow-200">
                                    {project.role}
                                </p>
                            </div>
                        </Reveal>
                    )}
                </div>

                {/* ------------------------------- stack ------------------------------ */}
                {(project.stack || []).length > 0 && (
                    <div className="mt-16">
                        <h2 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            <Wrench className="h-4 w-4 text-glow-400/80" />
                            Built with
                        </h2>

                        <motion.ul
                            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 'some' }}
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                        >
                            {project.stack.map((tech) => {
                                const hex = brandHex(tech);
                                return (
                                    <motion.li
                                        key={tech}
                                        variants={{
                                            hidden: { opacity: 0, y: 14 },
                                            show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
                                        }}
                                        whileHover={{ y: -4 }}
                                        className="glass flex items-center gap-3 rounded-xl px-4 py-3"
                                        style={hex ? { borderColor: `${hex}26` } : undefined}
                                    >
                                        <TechIcon name={tech} className="h-5 w-5 shrink-0" />
                                        <span className="truncate font-mono text-xs text-mist-300">{tech}</span>
                                    </motion.li>
                                );
                            })}
                        </motion.ul>
                    </div>
                )}

                {project.demoVideo && (
                    <Reveal className="mt-16">
                        <div className="glass aspect-video overflow-hidden rounded-3xl">
                            <iframe
                                src={project.demoVideo}
                                title={`${project.title} demo`}
                                allowFullScreen
                                className="h-full w-full"
                            />
                        </div>
                    </Reveal>
                )}

                {/* ------------------------------ gallery ----------------------------- */}
                {shots.length > 1 && (
                    <div className="mt-16">
                        <h2 className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            <Images className="h-4 w-4 text-glow-400/80" />
                            Screens
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {shots.slice(1).map((shot, i) => (
                                <Reveal key={shot.publicId || i} delay={i * 0.05}>
                                    <button
                                        type="button"
                                        onClick={() => setLightbox(shot.url)}
                                        className="glass group block w-full overflow-hidden rounded-2xl"
                                    >
                                        <motion.img
                                            src={shot.url}
                                            alt={`${project.title} screenshot ${i + 2}`}
                                            loading="lazy"
                                            whileHover={{ scale: 1.04 }}
                                            transition={{ duration: 0.6, ease: EASE }}
                                            className="aspect-[16/10] w-full object-cover"
                                        />
                                    </button>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                )}

                {/* --------------------------- other projects -------------------------- */}
                {others.length > 0 && (
                    <div className="mt-20 border-t border-white/5 pt-10">
                        <h2 className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            More work
                        </h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {others.map((other) => (
                                <Magnetic key={other._id} strength={0.15}>
                                    <Link
                                        to={`/project/${other._id}`}
                                        className="group glass block rounded-2xl p-5 transition-colors duration-300 hover:bg-white/[0.05]"
                                    >
                                        <p className="font-display text-base leading-snug font-semibold transition-colors group-hover:text-glow-200">
                                            {other.title}
                                        </p>
                                        <ul className="mt-3 flex flex-wrap gap-1.5">
                                            {(other.stack || []).slice(0, 4).map((tech) => (
                                                <li key={tech} title={tech}>
                                                    <TechIcon name={tech} className="h-3.5 w-3.5" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Link>
                                </Magnetic>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ------------------------------ lightbox ------------------------------ */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        className="fixed inset-0 z-[80] grid place-items-center bg-ink-950/92 p-6 backdrop-blur-xl"
                    >
                        <motion.img
                            src={lightbox}
                            alt={project.title}
                            initial={{ scale: 0.93, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="max-h-full max-w-5xl rounded-2xl border border-white/10"
                        />
                        <button
                            type="button"
                            aria-label="Close image"
                            className="absolute top-6 right-6 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-ink-900/80 text-mist-300 transition-colors hover:text-mist-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
