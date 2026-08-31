import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, CalendarDays, MapPin } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import TechIcon from '../ui/TechIcon';
import Magnetic from '../motion/Magnetic';
import { EASE } from '../motion/variants';

const splitStack = (value) =>
    String(value || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

function RoleCard({ item, index }) {
    const stack = splitStack(item.techStack);
    const highlights = item.highlights || [];

    return (
        <motion.article
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.06 }}
            className="group relative ml-10 md:ml-16"
        >
            {/* node on the spine, pinned to this card's header row */}
            <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.12 }}
                className="absolute top-9 -left-10 z-10 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-glow-400/40 bg-ink-900 md:-left-16"
            >
                <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.35, 0.9] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-glow-400/25"
                />
                <span className="relative h-2 w-2 rounded-full bg-glow-300" />
            </motion.span>

            <div className="glass glow-ring relative overflow-hidden rounded-3xl p-6 transition-colors duration-500 group-hover:bg-white/[0.045] sm:p-8">
                {/* header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h3 className="font-display text-xl leading-tight font-semibold sm:text-2xl">
                            {item.title}
                        </h3>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-mist-500">
                            {item.company && (
                                <span className="inline-flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 text-glow-400/70" />
                                    {item.companyUrl ? (
                                        <a
                                            href={item.companyUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="underline decoration-glow-500/40 underline-offset-2 transition-colors hover:text-glow-300"
                                        >
                                            {item.company}
                                        </a>
                                    ) : (
                                        item.company
                                    )}
                                </span>
                            )}
                            {item.period && (
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5 text-glow-400/70" />
                                    {item.period}
                                </span>
                            )}
                            {item.location && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-glow-400/70" />
                                    {item.location}
                                </span>
                            )}
                        </div>
                    </div>

                    {item.current && (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/[0.08] px-3 py-1 font-mono text-[10px] tracking-widest text-emerald-300 uppercase">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>
                            Current
                        </span>
                    )}
                </div>

                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-mist-400">
                    {item.description}
                </p>

                {/* the first two highlights act as a teaser for the detail page */}
                {highlights.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                        {highlights.slice(0, 2).map((line, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 'some' }}
                                transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.08 }}
                                className="flex gap-3 text-sm leading-relaxed text-mist-300/85"
                            >
                                <span
                                    aria-hidden="true"
                                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-glow-400/70"
                                />
                                {line}
                            </motion.li>
                        ))}
                    </ul>
                )}

                {stack.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                        {stack.map((tech) => (
                            <li
                                key={tech}
                                className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] text-mist-400"
                            >
                                <TechIcon name={tech} className="h-3.5 w-3.5" />
                                {tech}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">
                    <Magnetic strength={0.18} className="inline-block">
                        <Link
                            to={`/experience/${item._id}`}
                            className="group/cta inline-flex items-center gap-2 rounded-full bg-glow-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-glow-400"
                        >
                            {highlights.length > 2
                                ? `See all ${highlights.length} highlights`
                                : 'See the details'}
                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                        </Link>
                    </Magnetic>

                    {item.liveUrl && (
                        <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group/live inline-flex items-center gap-1.5 text-sm text-mist-500 transition-colors hover:text-glow-300"
                        >
                            Visit the product
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
                        </a>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

export default function Experience({ experience = [], heading }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
    // the spine "draws itself" as the timeline scrolls
    const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
    const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section id="experience" className="relative px-6 py-28 lg:py-36">
            <div className="mx-auto max-w-5xl">
                <SectionHeader
                    heading={heading}
                    fallback={{
                        label: 'Journey',
                        titlePlain: 'Where I have',
                        titleHighlight: 'worked.',
                        subtitle: 'The products I have shipped on, and what I actually changed in each.',
                    }}
                />

                {experience.length === 0 ? (
                    <div className="mt-14">
                        <EmptyState
                            title="No experience added yet"
                            hint="Add entries from the admin dashboard to populate this timeline."
                        />
                    </div>
                ) : (
                    <div ref={ref} className="relative mt-16 flex flex-col gap-8">
                        {/* static rail */}
                        <div className="absolute inset-y-0 left-0 w-px bg-white/[0.07] md:left-0" />
                        {/* animated fill */}
                        <motion.div
                            style={{ scaleY }}
                            className="absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-glow-500 via-glow-400 to-berry-400"
                        />
                        {/* travelling glow */}
                        <motion.div
                            aria-hidden="true"
                            style={{ top: glowY }}
                            className="absolute left-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-glow-300/80 to-transparent blur-[2px]"
                        />

                        {experience.map((item, i) => (
                            <RoleCard key={item._id || i} item={item} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
