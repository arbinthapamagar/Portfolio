import { useRef, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useMotionValue,
} from 'motion/react';
import { ArrowUpRight, Star } from 'lucide-react';
import { Github } from '../ui/BrandIcons';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import Tilt from '../motion/Tilt';
import TechIcon from '../ui/TechIcon';
import { EASE } from '../motion/variants';

function ProjectCard({ project, index }) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);
    const cover = project.screenshots?.[0]?.url;

    // pointer-tracked spotlight, kept in motion values so it never re-renders
    const mx = useMotionValue(50);
    const my = useMotionValue(50);
    const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(139,124,232,0.17), transparent 70%)`;

    const trackPointer = (event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(((event.clientX - rect.left) / rect.width) * 100);
        my.set(((event.clientY - rect.top) / rect.height) * 100);
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            // 'some' rather than a ratio: these cards are ~680px tall, so a
            // fractional threshold never resolves for the first row on a short
            // viewport and the reveal would never fire
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.75, ease: EASE, delay: (index % 3) * 0.09 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={trackPointer}
            ref={ref}
            className="group relative [perspective:1200px]"
        >
            <Tilt max={7} className="h-full">
                <motion.div
                    animate={{ y: hovered ? -6 : 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="glass glow-ring relative flex h-full flex-col overflow-hidden rounded-2xl"
                >
                    {/* spotlight that follows the pointer across the card */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                        style={{ background: spotlight }}
                    />

                    <div className="relative aspect-[16/10] overflow-hidden bg-ink-850">
                        {cover ? (
                            <motion.img
                                src={cover}
                                alt={project.title}
                                loading="lazy"
                                animate={{ scale: hovered ? 1.09 : 1, rotate: hovered ? -0.6 : 0 }}
                                transition={{ duration: 0.8, ease: EASE }}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br from-ink-800 to-ink-850">
                                {/* drifting grid so image-less cards still feel alive */}
                                <motion.div
                                    aria-hidden="true"
                                    className="absolute inset-0 opacity-[0.15]"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                                        backgroundSize: '32px 32px',
                                    }}
                                    animate={{ backgroundPosition: ['0px 0px', '32px 32px'] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                                />
                                <motion.span
                                    animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 0.12 : 0.06 }}
                                    transition={{ duration: 0.6, ease: EASE }}
                                    className="relative font-display text-6xl font-bold text-mist-100"
                                >
                                    {project.title?.charAt(0)}
                                </motion.span>
                            </div>
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />

                        {/* running index, top-right */}
                        <span className="absolute top-3 right-3 font-mono text-[11px] tracking-widest text-mist-100/25">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        {project.featured && (
                            <motion.span
                                animate={{ y: hovered ? -2 : 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-glow-400/30 bg-ink-950/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-glow-300 uppercase backdrop-blur"
                            >
                                <Star className="h-2.5 w-2.5 fill-current" /> Featured
                            </motion.span>
                        )}

                        {/* action bar slides up on hover */}
                        <AnimatePresence>
                            {hovered && (project.links?.liveDemo || project.links?.github) && (
                                <motion.div
                                    initial={{ y: 44, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 44, opacity: 0 }}
                                    transition={{ duration: 0.34, ease: EASE }}
                                    className="absolute right-3 bottom-3 z-30 flex gap-2"
                                >
                                    {project.links?.liveDemo && (
                                        <motion.a
                                            href={project.links.liveDemo}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`${project.title} live demo`}
                                            whileHover={{ scale: 1.12, rotate: 8 }}
                                            whileTap={{ scale: 0.94 }}
                                            className="grid h-10 w-10 place-items-center rounded-xl bg-glow-500 text-ink-950 transition-colors hover:bg-glow-400"
                                        >
                                            <ArrowUpRight className="h-4 w-4" />
                                        </motion.a>
                                    )}
                                    {project.links?.github && (
                                        <motion.a
                                            href={project.links.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`${project.title} source`}
                                            whileHover={{ scale: 1.12, rotate: -8 }}
                                            whileTap={{ scale: 0.94 }}
                                            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-ink-950/85 text-mist-300 backdrop-blur transition-colors hover:text-mist-100"
                                        >
                                            <Github className="h-4 w-4" />
                                        </motion.a>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative z-10 flex flex-1 flex-col gap-3 p-6">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-xl leading-snug font-semibold transition-colors duration-300 group-hover:text-glow-200">
                                {project.title}
                            </h3>
                            {project.role && (
                                <span className="shrink-0 rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-mist-500">
                                    {project.role}
                                </span>
                            )}
                        </div>

                        <p className="line-clamp-4 text-sm leading-relaxed text-mist-500">
                            {project.description}
                        </p>

                        {project.problemSolved && (
                            <p className="line-clamp-3 border-l border-glow-500/40 pl-3 text-xs leading-relaxed text-mist-600 transition-colors duration-300 group-hover:border-glow-400">
                                <span className="text-glow-400/80">Problem: </span>
                                {project.problemSolved}
                            </p>
                        )}

                        <motion.ul
                            className="mt-auto flex flex-wrap gap-1.5 pt-2"
                            initial="rest"
                            animate={hovered ? 'lift' : 'rest'}
                            variants={{ lift: { transition: { staggerChildren: 0.03 } }, rest: {} }}
                        >
                            {(project.stack || []).slice(0, 6).map((tech) => (
                                <motion.li
                                    key={tech}
                                    variants={{ rest: { y: 0 }, lift: { y: -2 } }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                                    className="flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-mist-400"
                                >
                                    <TechIcon name={tech} className="h-3 w-3" />
                                    {tech}
                                </motion.li>
                            ))}
                        </motion.ul>

                        <Link
                            to={`/project/${project._id}`}
                            className="group/link mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium text-glow-300 transition-colors hover:text-glow-200"
                        >
                            Case study
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                        </Link>
                    </div>
                </motion.div>
            </Tilt>
        </motion.article>
    );
}

export default function Projects({ projects = [], heading, limit }) {
    const [filter, setFilter] = useState('All');

    // build the filter row from whatever stacks actually exist, most-used first
    // (first-seen order would bury common tags behind one project's long stack)
    const counts = projects.reduce((acc, p) => {
        (p.stack || []).forEach((tech) => {
            acc[tech] = (acc[tech] || 0) + 1;
        });
        return acc;
    }, {});
    const tags = [
        'All',
        ...Object.keys(counts)
            .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
            .slice(0, 9),
    ];

    const matching =
        filter === 'All' ? projects : projects.filter((p) => (p.stack || []).includes(filter));
    // the home page shows a teaser; the /projects route shows everything
    const visible = limit ? matching.slice(0, limit) : matching;

    return (
        <section id="projects" className="relative px-6 py-28 lg:py-36">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    heading={heading}
                    fallback={{
                        label: 'Work',
                        titlePlain: 'Selected',
                        titleHighlight: 'projects.',
                        subtitle:
                            'A few things I have built end to end — the problem, the stack, and what I actually did.',
                    }}
                />

                {projects.length > 0 && tags.length > 2 && (
                    <motion.div
                        className="mt-10 flex flex-wrap gap-2"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                    >
                        {tags.map((tag) => (
                            <motion.button
                                key={tag}
                                type="button"
                                onClick={() => setFilter(tag)}
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                                }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative rounded-full px-4 py-1.5 font-mono text-xs tracking-wide transition-colors"
                            >
                                {filter === tag && (
                                    <motion.span
                                        layoutId="project-filter"
                                        className="absolute inset-0 rounded-full bg-glow-500"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span
                                    className={`relative z-10 ${
                                        filter === tag ? 'text-ink-950' : 'text-mist-500 hover:text-mist-300'
                                    }`}
                                >
                                    {tag}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                <div className="mt-10">
                    {visible.length === 0 ? (
                        <EmptyState
                            title="No projects published yet"
                            hint="Add your first project from the admin dashboard and it will show up here."
                        />
                    ) : (
                        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {visible.map((project, i) => (
                                    <ProjectCard key={project._id} project={project} index={i} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
