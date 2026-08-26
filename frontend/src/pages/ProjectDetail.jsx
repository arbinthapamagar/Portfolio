import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Github } from '../components/ui/BrandIcons';
import { publicApi } from '../lib/api';
import Loader from '../components/ui/Loader';
import GlowButton from '../components/ui/GlowButton';
import Reveal from '../components/motion/Reveal';
import Aurora from '../components/motion/Aurora';
import ScrollProgress from '../components/motion/ScrollProgress';
import { EASE, fadeUp, stagger } from '../components/motion/variants';

export default function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [state, setState] = useState('loading');

    useEffect(() => {
        let alive = true;
        publicApi
            .project(id)
            .then((data) => {
                if (!alive) return;
                setProject(data);
                setState('ready');
            })
            .catch(() => alive && setState('error'));
        return () => {
            alive = false;
        };
    }, [id]);

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
                    <Link to="/" className="mt-4 inline-block text-sm text-glow-300 hover:text-glow-200">
                        ← Back to portfolio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grain relative min-h-screen">
            <ScrollProgress />
            <Aurora className="opacity-60" />

            <div className="relative mx-auto max-w-4xl px-6 py-24">
                <Link
                    to="/#projects"
                    className="group inline-flex items-center gap-2 text-sm text-mist-500 transition-colors hover:text-glow-300"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to projects
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                    className="mt-8 font-display text-4xl leading-tight font-bold sm:text-5xl"
                >
                    {project.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                    className="mt-4 text-lg leading-relaxed text-mist-400"
                >
                    {project.description}
                </motion.p>

                <motion.div
                    variants={stagger(0.06, 0.3)}
                    initial="hidden"
                    animate="show"
                    className="mt-6 flex flex-wrap gap-1.5"
                >
                    {(project.stack || []).map((tech) => (
                        <motion.span
                            key={tech}
                            variants={fadeUp}
                            className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-mist-400"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </motion.div>

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

                <div className="mt-14 grid gap-8 sm:grid-cols-2">
                    <Reveal>
                        <h2 className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            The problem
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-mist-400">
                            {project.problemSolved}
                        </p>
                    </Reveal>

                    {project.role && (
                        <Reveal delay={0.1}>
                            <h2 className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                                My role
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-mist-400">{project.role}</p>
                        </Reveal>
                    )}
                </div>

                {project.demoVideo && (
                    <Reveal className="mt-14">
                        <div className="glass aspect-video overflow-hidden rounded-2xl">
                            <iframe
                                src={project.demoVideo}
                                title={`${project.title} demo`}
                                allowFullScreen
                                className="h-full w-full"
                            />
                        </div>
                    </Reveal>
                )}

                {project.screenshots?.length > 0 && (
                    <div className="mt-14 flex flex-col gap-6">
                        {project.screenshots.map((shot, i) => (
                            <Reveal key={shot.publicId || i} delay={i * 0.05}>
                                <motion.img
                                    src={shot.url}
                                    alt={`${project.title} screenshot ${i + 1}`}
                                    loading="lazy"
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.5, ease: EASE }}
                                    className="w-full rounded-2xl border border-white/[0.07]"
                                />
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
