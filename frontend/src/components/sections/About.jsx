import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import Reveal from '../motion/Reveal';
import Parallax from '../motion/Parallax';
import Counter from '../motion/Counter';
import Marquee from '../motion/Marquee';
import SectionHeader from '../ui/SectionHeader';
import GlowButton from '../ui/GlowButton';
import { stagger, fadeUp } from '../motion/variants';

const FALLBACK_STATS = [
    { value: '3+', label: 'Years building' },
    { value: '15+', label: 'Projects shipped' },
    { value: '10+', label: 'Happy clients' },
];

export default function About({ about, heading }) {
    const stats = about?.stats?.length ? about.stats : FALLBACK_STATS;
    const ticker = about?.tickerItems?.length ? about.tickerItems : [];

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
                            <h3 className="font-display text-2xl font-semibold text-mist-100">
                                {about?.title || 'Full-stack developer, backend-leaning'}
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

                    <Parallax speed={45} className="hidden lg:block">
                        <div className="group relative">
                            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-glow-500/25 via-transparent to-cyan-glow/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                            <motion.div
                                whileHover={{ scale: 1.015 }}
                                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                                className="glass relative aspect-[4/5] overflow-hidden rounded-[1.75rem]"
                            >
                                {about?.photo ? (
                                    <img
                                        src={about.photo}
                                        alt={about?.title || 'Portrait'}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-800 to-ink-850">
                                        <span className="font-display text-7xl font-bold text-white/5">
                                            AT
                                        </span>
                                    </div>
                                )}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                            </motion.div>
                        </div>
                    </Parallax>
                </div>
            </div>

            {ticker.length > 0 && (
                <div className="mt-20">
                    <Marquee items={ticker} duration={34} reverse />
                </div>
            )}
        </section>
    );
}
