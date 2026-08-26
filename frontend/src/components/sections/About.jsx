import { motion } from 'motion/react';
import { Briefcase, Download, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import Reveal from '../motion/Reveal';
import Parallax from '../motion/Parallax';
import Counter from '../motion/Counter';
import Marquee from '../motion/Marquee';
import SectionHeader from '../ui/SectionHeader';
import GlowButton from '../ui/GlowButton';
import TechIcon from '../ui/TechIcon';
import { stagger, fadeUp, EASE } from '../motion/variants';

const FALLBACK_TITLE = 'Software developer — backend-leaning, agentic AI and RAG';

/* A row of counters nobody can check is worse than no counters, so these are
   derived from what the site actually contains. Admin-entered stats still win. */
function derivedStats({ projects, experience, services }) {
    const techCount = new Set(services.flatMap((s) => s.items || [])).size;
    return [
        { value: String(projects.length), label: 'Projects built' },
        { value: String(experience.length), label: 'Products shipped on' },
        { value: String(techCount), label: 'Technologies' },
    ].filter((s) => s.value !== '0');
}

export default function About({
    about,
    heading,
    projects = [],
    experience = [],
    education = [],
    services = [],
    footer,
}) {
    const derived = derivedStats({ projects, experience, services });
    const stats = about?.stats?.length ? about.stats : derived;
    const ticker = about?.tickerItems?.length ? about.tickerItems : [];
    const currentRole = experience.find((e) => e.current) || experience[0] || null;
    const degree = education.find((e) => e.kind === 'degree') || education[0] || null;
    const topStack = [...new Set(services.flatMap((s) => s.items || []))].slice(0, 10);

    // 'Software developer — backend-leaning, agentic AI and RAG' renders as two
    // lines, the specialism in the accent gradient
    const [titleHead, titleTail] = (about?.title || FALLBACK_TITLE)
        .split(/\s+[—–-]{1,2}\s+/)
        .slice(0, 2);

    return (
        <section id="about" className="relative overflow-hidden px-6 py-28 lg:py-36">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    heading={heading}
                    fallback={{
                        label: 'About',
                        titlePlain: about?.headingLine1 || 'Who I',
                        titleHighlight: about?.headingLine2 || 'am.',
                    }}
                />

                <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <div>
                        <Reveal>
                            {/* the headline statement — split on the em dash so the
                                specialism reads in the accent gradient */}
                            <h3 className="font-display text-3xl leading-[1.08] font-bold tracking-tight text-mist-100 sm:text-4xl lg:text-5xl">
                                {titleHead}
                                {titleTail && (
                                    <span className="block bg-gradient-to-r from-glow-300 via-glow-400 to-berry-300 bg-clip-text text-transparent">
                                        {titleTail}
                                    </span>
                                )}
                            </h3>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <p className="mt-5 text-base leading-[1.8] text-mist-400">
                                {about?.description ||
                                    'I build web platforms end to end — REST APIs with JWT auth, media pipelines on Cloudinary, and the React interfaces that sit on top of them. I care about clean data models and code that the next person can actually read.'}
                            </p>
                        </Reveal>

                        {about?.mission && (
                            <Reveal delay={0.18}>
                                <div className="glow-ring mt-6 rounded-2xl border-l-2 border-glow-500/60 bg-white/[0.02] py-4 pr-4 pl-5">
                                    <p className="text-sm leading-relaxed text-mist-300 italic">
                                        {about.mission}
                                    </p>
                                </div>
                            </Reveal>
                        )}

                        <motion.div
                            variants={stagger(0.1)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.4 }}
                            className="mt-10 grid grid-cols-3 gap-4"
                        >
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    className="glass glow-ring rounded-2xl px-4 py-5 text-center"
                                >
                                    <p className="font-display text-3xl font-bold text-glow-300 sm:text-4xl">
                                        <Counter value={stat.value} />
                                    </p>
                                    <p className="mt-1.5 text-[11px] leading-tight tracking-wide text-mist-500 uppercase">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <Reveal delay={0.2}>
                            <div className="mt-9 flex flex-wrap items-center gap-4">
                                {about?.resumeUrl && (
                                    <GlowButton as="a" href={about.resumeUrl} target="_blank" rel="noreferrer">
                                        <Download className="h-4 w-4" />
                                        {about.ctaLabel || 'Download résumé'}
                                    </GlowButton>
                                )}
                                {about?.resumeUrl && about?.ctaNote && (
                                    <span className="text-xs text-mist-600">{about.ctaNote}</span>
                                )}
                            </div>
                        </Reveal>
                    </div>

                    <Parallax speed={38} className="lg:sticky lg:top-32">
                        <div className="group relative">
                            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-glow-500/20 via-transparent to-berry-400/20 blur-2xl" />

                            {about?.photo ? (
                                <motion.div
                                    whileHover={{ scale: 1.015 }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                                    className="glass relative aspect-[4/5] overflow-hidden rounded-[1.75rem]"
                                >
                                    <img
                                        src={about.photo}
                                        alt={about?.title || 'Portrait'}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                                </motion.div>
                            ) : (
                                /* no portrait uploaded — a real snapshot beats an empty
                                   monogram card holding open a column of dead space */
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 'some' }}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    className="glass glow-ring relative overflow-hidden rounded-[1.75rem] p-7"
                                >
                                    <p className="font-mono text-[10px] tracking-[0.2em] text-mist-600 uppercase">
                                        At a glance
                                    </p>

                                    <dl className="mt-6 flex flex-col gap-5">
                                        {currentRole && (
                                            <div className="flex gap-3.5">
                                                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-glow-500/15 text-glow-300">
                                                    <Briefcase className="h-4 w-4" />
                                                </span>
                                                <div className="min-w-0">
                                                    <dt className="font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                                        Currently
                                                    </dt>
                                                    <dd className="mt-1 text-sm leading-snug text-mist-200">
                                                        {currentRole.title}
                                                        {currentRole.company && (
                                                            <>
                                                                {' at '}
                                                                {currentRole.companyUrl ? (
                                                                    <a
                                                                        href={currentRole.companyUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-glow-300 underline decoration-glow-500/40 underline-offset-2"
                                                                    >
                                                                        {currentRole.company}
                                                                    </a>
                                                                ) : (
                                                                    currentRole.company
                                                                )}
                                                            </>
                                                        )}
                                                    </dd>
                                                </div>
                                            </div>
                                        )}

                                        {degree && (
                                            <div className="flex gap-3.5">
                                                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-berry-400/15 text-berry-300">
                                                    <GraduationCap className="h-4 w-4" />
                                                </span>
                                                <div className="min-w-0">
                                                    <dt className="font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                                        Education
                                                    </dt>
                                                    <dd className="mt-1 text-sm leading-snug text-mist-200">
                                                        {degree.title}
                                                    </dd>
                                                    {degree.institution && (
                                                        <dd className="mt-0.5 text-xs text-mist-500">
                                                            {degree.institution}
                                                        </dd>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {footer?.location && (
                                            <div className="flex gap-3.5">
                                                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-glow-500/15 text-glow-300">
                                                    <MapPin className="h-4 w-4" />
                                                </span>
                                                <div>
                                                    <dt className="font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                                        Based in
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-mist-200">
                                                        {footer.location}
                                                    </dd>
                                                </div>
                                            </div>
                                        )}
                                    </dl>

                                    {topStack.length > 0 && (
                                        <div className="mt-7 border-t border-white/[0.06] pt-6">
                                            <p className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                                <Sparkles className="h-3 w-3 text-glow-400/70" />
                                                Working with
                                            </p>
                                            <motion.ul
                                                className="mt-4 flex flex-wrap gap-2"
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ once: true, amount: 'some' }}
                                                variants={{
                                                    hidden: {},
                                                    show: { transition: { staggerChildren: 0.04 } },
                                                }}
                                            >
                                                {topStack.map((tech) => (
                                                    <motion.li
                                                        key={tech}
                                                        variants={{
                                                            hidden: { opacity: 0, scale: 0.8 },
                                                            show: { opacity: 1, scale: 1 },
                                                        }}
                                                        whileHover={{ y: -3 }}
                                                        title={tech}
                                                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.03]"
                                                    >
                                                        <TechIcon name={tech} className="h-4 w-4" />
                                                    </motion.li>
                                                ))}
                                            </motion.ul>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </Parallax>
                </div>
            </div>

            {ticker.length > 0 && (
                <div className="mt-16">
                    <Marquee items={ticker} duration={34} reverse />
                </div>
            )}
        </section>
    );
}
