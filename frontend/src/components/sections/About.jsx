import { motion } from 'motion/react';
import { Briefcase, Download, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import Reveal from '../motion/Reveal';
import Parallax from '../motion/Parallax';
import Counter from '../motion/Counter';
import Marquee from '../motion/Marquee';
import SectionHeader from '../ui/SectionHeader';
import GlowButton from '../ui/GlowButton';
import TechIcon from '../ui/TechIcon';
import PortraitPlate from '../ui/PortraitPlate';
import githubPortrait from '../../assets/github-portrait.jpg';
import { stagger, fadeUp, EASE } from '../motion/variants';

const FALLBACK_TITLE = 'Software developer — backend-leaning, agentic AI and RAG';

/* A row of counters nobody can check is worse than no counters, so these are
   derived from what the site actually contains. Admin-entered stats still win. */
function derivedStats({ projects, experience, services }) {
    const techCount = new Set(services.flatMap((s) => s.items || [])).size;
    // products now live on the role that shipped them, so this counts products
    // rather than rows — the timeline also carries administration roles, which
    // ship nothing and would have inflated the old figure
    const productCount = experience.flatMap((role) => role.products || []).length;
    return [
        { value: String(projects.length), label: 'Projects built' },
        productCount
            ? { value: String(productCount), label: 'Products shipped on' }
            : { value: String(experience.length), label: 'Roles' },
        { value: String(techCount), label: 'Technologies' },
    ].filter((stat) => stat.value !== '0');
}

/* the stack strip shows in both states — with a portrait it sits under the
   plate, without one it closes out the at-a-glance card */
function WorkingWith({ items, className = '' }) {
    return (
        <div className={className}>
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                <Sparkles className="h-3 w-3 text-glow-400/70" />
                Working with
            </p>
            <motion.ul
                className="mt-4 flex flex-wrap gap-2"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 'some' }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            >
                {items.map((tech) => (
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
    );
}

/* the facts that used to stand in for a missing portrait now sit under every
   portrait instead — a photo and "currently / education / based in" answer
   different questions, and losing the second one to upload the first was a
   trade nobody asked for */
function AtAGlance({ currentRole, degree, location, topStack }) {
    return (
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
                            <dd className="mt-1 text-sm leading-snug text-mist-200">{degree.title}</dd>
                            {degree.institution && (
                                <dd className="mt-0.5 text-xs text-mist-500">{degree.institution}</dd>
                            )}
                        </div>
                    </div>
                )}

                {location && (
                    <div className="flex gap-3.5">
                        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-glow-500/15 text-glow-300">
                            <MapPin className="h-4 w-4" />
                        </span>
                        <div>
                            <dt className="font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                Based in
                            </dt>
                            <dd className="mt-1 text-sm text-mist-200">{location}</dd>
                        </div>
                    </div>
                )}
            </dl>

            {topStack.length > 0 && (
                <WorkingWith items={topStack} className="mt-7 border-t border-white/[0.06] pt-6" />
            )}
        </motion.div>
    );
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
    // an uploaded portrait wins; the bundled one keeps the column from ever
    // standing empty
    const portrait = about?.photo || githubPortrait;

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
                        <div className="relative">
                            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-glow-500/20 via-transparent to-berry-400/20 blur-2xl" />

                            <div className="flex flex-col gap-6">
                                <PortraitPlate src={portrait} alt="Portrait" />
                                <AtAGlance
                                    currentRole={currentRole}
                                    degree={degree}
                                    location={footer?.location}
                                    topStack={topStack}
                                />
                            </div>
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
