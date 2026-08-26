import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Star } from 'lucide-react';
import { Github } from '../ui/BrandIcons';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import { EASE } from '../motion/variants';

function ProjectCard({ project, index }) {
    const [hovered, setHovered] = useState(false);
    const cover = project.screenshots?.[0]?.url;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group glass glow-ring relative flex flex-col overflow-hidden rounded-2xl"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-ink-850">
                {cover ? (
                    <motion.img
                        src={cover}
                        alt={project.title}
                        loading="lazy"
                        animate={{ scale: hovered ? 1.07 : 1 }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-800 to-ink-850">
                        <span className="font-display text-4xl font-bold text-white/5">
                            {project.title?.charAt(0)}
                        </span>
                    </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />

                {project.featured && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-glow-400/30 bg-ink-950/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-glow-300 uppercase backdrop-blur">
                        <Star className="h-2.5 w-2.5 fill-current" /> Featured
                    </span>
                )}

                {/* action bar slides up on hover */}
                <AnimatePresence>
                    {hovered && (project.links?.liveDemo || project.links?.github) && (
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            transition={{ duration: 0.32, ease: EASE }}
                            className="absolute right-3 bottom-3 flex gap-2"
                        >
                            {project.links?.liveDemo && (
                                <a
                                    href={project.links.liveDemo}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${project.title} live demo`}
                                    className="grid h-9 w-9 place-items-center rounded-lg bg-glow-500 text-white transition-colors hover:bg-glow-400"
                                >
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            )}
                            {project.links?.github && (
                                <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${project.title} source`}
                                    className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-ink-950/85 text-mist-200 backdrop-blur transition-colors hover:text-white"
                                >
                                    <Github className="h-4 w-4" />
                                </a>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl leading-snug font-semibold">
                        {project.title}
                    </h3>
                    {project.role && (
                        <span className="shrink-0 rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-mist-500">
                            {project.role}
                        </span>
                    )}
                </div>

                <p className="text-sm leading-relaxed text-mist-500">{project.description}</p>

                {project.problemSolved && (
                    <p className="border-l border-glow-500/40 pl-3 text-xs leading-relaxed text-mist-600">
                        <span className="text-glow-400/80">Problem: </span>
                        {project.problemSolved}
                    </p>
                )}

                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {(project.stack || []).slice(0, 6).map((tech) => (
                        <li
                            key={tech}
                            className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-mist-400"
                        >
                            {tech}
                        </li>
                    ))}
                </ul>

                <Link
                    to={`/project/${project._id}`}
                    className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium text-glow-300 transition-colors hover:text-glow-200"
                >
                    Case study
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            </div>
        </motion.article>
    );
}

export default function Projects({ projects = [], heading }) {
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
    const visible =
        filter === 'All' ? projects : projects.filter((p) => (p.stack || []).includes(filter));

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
                    <div className="mt-10 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setFilter(tag)}
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
                                        filter === tag ? 'text-white' : 'text-mist-500 hover:text-mist-300'
                                    }`}
                                >
                                    {tag}
                                </span>
                            </button>
                        ))}
                    </div>
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
