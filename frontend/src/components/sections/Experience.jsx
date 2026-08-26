import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import { EASE } from '../motion/variants';

function TimelineItem({ item, index }) {
    const isLeft = index % 2 === 0;

    return (
        <div
            className={`relative flex w-full items-start gap-6 md:gap-0 ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
        >
            {/* node on the spine */}
            <motion.span
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.15 }}
                className="absolute left-[7px] top-8 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-ink-900 bg-glow-400 shadow-[0_0_16px_rgba(167,139,250,0.9)] md:left-1/2"
            />

            <motion.div
                initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: EASE }}
                className={`ml-8 w-full md:ml-0 md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
            >
                <div className="group glass glow-ring overflow-hidden rounded-2xl">
                    {item.imageUrl && (
                        <div className="aspect-[16/9] overflow-hidden bg-ink-850">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-3 p-5">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                            {item.createdAt && (
                                <span className="shrink-0 font-mono text-[10px] text-mist-600">
                                    {new Date(item.createdAt).getFullYear()}
                                </span>
                            )}
                        </div>

                        <p className="text-sm leading-relaxed text-mist-500">{item.description}</p>

                        {item.techStack && (
                            <ul className="flex flex-wrap gap-1.5">
                                {String(item.techStack)
                                    .split(',')
                                    .map((tech) => tech.trim())
                                    .filter(Boolean)
                                    .map((tech) => (
                                        <li
                                            key={tech}
                                            className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-mist-400"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                            </ul>
                        )}

                        {item.liveUrl && (
                            <a
                                href={item.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-fit items-center gap-1 text-sm font-medium text-glow-300 transition-colors hover:text-glow-200"
                            >
                                Visit
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function Experience({ experience = [], heading }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.8', 'end 0.4'],
    });
    // the spine "draws itself" as the timeline scrolls
    const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
    const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section id="experience" className="relative px-6 py-28 lg:py-36">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    heading={heading}
                    align="center"
                    fallback={{
                        label: 'Journey',
                        titlePlain: 'Where I have',
                        titleHighlight: 'worked.',
                        subtitle: 'Roles, builds and the problems they solved.',
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
                    <div ref={ref} className="relative mt-16 flex flex-col gap-12">
                        {/* static rail */}
                        <div className="absolute inset-y-0 left-[7px] w-px bg-white/[0.07] md:left-1/2" />
                        {/* animated fill */}
                        <motion.div
                            style={{ scaleY }}
                            className="absolute inset-y-0 left-[7px] w-px origin-top bg-gradient-to-b from-glow-500 via-glow-400 to-cyan-glow md:left-1/2"
                        />
                        {/* travelling glow */}
                        <motion.div
                            aria-hidden="true"
                            style={{ top: glowY }}
                            className="absolute left-[7px] h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/70 to-transparent blur-[2px] md:left-1/2"
                        />

                        {experience.map((item, i) => (
                            <TimelineItem key={item._id || i} item={item} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
