import { motion } from 'motion/react';
import { Award, BookOpen, Building2, CalendarDays, GraduationCap, MapPin } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import TechIcon from '../ui/TechIcon';
import { EASE } from '../motion/variants';

const KIND_ICONS = { degree: GraduationCap, training: BookOpen, certification: Award };

const splitStack = (value) =>
    String(value || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

function EducationCard({ item, index }) {
    const Icon = KIND_ICONS[String(item.kind || '').toLowerCase()] || GraduationCap;
    const stack = splitStack(item.techStack);
    const highlights = item.highlights || [];

    return (
        <motion.article
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
            className="group glass glow-ring relative overflow-hidden rounded-3xl p-6 sm:p-8"
        >
            {/* the mortarboard drifts behind the card as decoration */}
            <motion.span
                aria-hidden="true"
                animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -top-6 -right-4 text-glow-500/[0.07]"
            >
                <Icon className="h-40 w-40" />
            </motion.span>

            <div className="relative flex items-start gap-4">
                <motion.span
                    whileHover={{ rotate: -8, scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-glow-500/25 to-berry-400/20 text-glow-300"
                >
                    <Icon className="h-6 w-6" />
                </motion.span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="font-display text-xl leading-tight font-semibold sm:text-2xl">
                            {item.title}
                        </h3>
                        {item.status && (
                            <span className="shrink-0 rounded-full border border-glow-400/25 bg-glow-500/[0.08] px-3 py-1 font-mono text-[10px] tracking-widest text-glow-300 uppercase">
                                {item.status}
                            </span>
                        )}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-mist-500">
                        {item.institution && (
                            <span className="inline-flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-glow-400/70" />
                                {item.institutionUrl ? (
                                    <a
                                        href={item.institutionUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline decoration-glow-500/40 underline-offset-2 transition-colors hover:text-glow-300"
                                    >
                                        {item.institution}
                                    </a>
                                ) : (
                                    item.institution
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

                    {item.affiliation && (
                        <p className="mt-3 inline-block rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-mist-400">
                            {item.affiliation}
                        </p>
                    )}
                </div>
            </div>

            {item.description && (
                <p className="relative mt-6 max-w-3xl text-sm leading-relaxed text-mist-400">
                    {item.description}
                </p>
            )}

            {highlights.length > 0 && (
                <motion.ul
                    className="relative mt-6 grid gap-2.5"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 'some' }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                >
                    {highlights.map((line, i) => (
                        <motion.li
                            key={i}
                            variants={{
                                hidden: { opacity: 0, x: -12 },
                                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
                            }}
                            className="flex gap-3 text-sm leading-relaxed text-mist-300/85"
                        >
                            <span
                                aria-hidden="true"
                                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-glow-400/70"
                            />
                            {line}
                        </motion.li>
                    ))}
                </motion.ul>
            )}

            {stack.length > 0 && (
                <ul className="relative mt-6 flex flex-wrap gap-2">
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
        </motion.article>
    );
}

export default function Education({ education = [], heading }) {
    const entries = education.filter((e) => e.isActive !== false);
    if (!entries.length) return null;

    return (
        <section id="education" className="relative overflow-hidden px-6 py-28 lg:py-36">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 left-0 h-80 w-[32rem] rounded-full opacity-50 blur-[130px]"
                style={{ background: 'radial-gradient(circle, rgba(111,92,216,0.20), transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-5xl">
                <SectionHeader
                    heading={heading}
                    fallback={{
                        label: 'Education',
                        titlePlain: 'How I',
                        titleHighlight: 'learned it.',
                        subtitle: 'The degree, and the training that turned it into a working stack.',
                    }}
                />

                <div className="mt-14 grid gap-6">
                    {entries.map((item, i) => (
                        <EducationCard key={item._id || i} item={item} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
