import { Fragment, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import Aurora from '../motion/Aurora';
import GlowButton from '../ui/GlowButton';
import Marquee from '../motion/Marquee';
import PortraitPlate from '../ui/PortraitPlate';
import { EASE } from '../motion/variants';

const FALLBACK = {
    title: 'Arbeen Thapa Magar',
    subtitle: 'Software developer building agentic AI, RAG systems and web platforms.',
    buttonText: 'View my work',
    buttonLink: '#projects',
    photo: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27800%27%20height%3D%271000%27%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%0A%3Cstop%20offset%3D%270%27%20stop-color%3D%27%235b4a7a%27/%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%23c9a97e%27/%3E%3C/linearGradient%3E%3C/defs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%271000%27%20fill%3D%27url%28%23g%29%27/%3E%0A%3Ccircle%20cx%3D%27400%27%20cy%3D%27390%27%20r%3D%27150%27%20fill%3D%27%232a2246%27%20opacity%3D%27.85%27/%3E%0A%3Cpath%20d%3D%27M150%201000c0-160%20112-270%20250-270s250%20110%20250%20270z%27%20fill%3D%27%232a2246%27%20opacity%3D%27.85%27/%3E%0A%3Ctext%20x%3D%27400%27%20y%3D%27960%27%20font-family%3D%27monospace%27%20font-size%3D%2730%27%20fill%3D%27%23fdf8ec%27%20text-anchor%3D%27middle%27%20opacity%3D%27.8%27%3EPREVIEW%20ONLY%3C/text%3E%3C/svg%3E',
};

const TICKER = [
    'React', 'Node.js', 'Express', 'MongoDB', 'Tailwind', 'JWT Auth', 'Cloudinary', 'REST APIs',
];

export default function Hero({ hero, tickerItems = [] }) {
    const ref = useRef(null);
    // each word masks in behind overflow-hidden, which also clips the glow on the
    // accent word into a hard rectangle — so the clip is released once the last
    // word has landed
    const [revealed, setRevealed] = useState(false);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

    // content drifts up and fades as you scroll past the fold
    const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
    // the portrait pulls back against that drift, so it lags the type — depth
    // without a second scroll listener
    const photoY = useTransform(scrollYProgress, [0, 1], [0, -55]);

    const data = { ...FALLBACK, ...(hero || {}) };
    const words = data.title.split(' ');
    const ticker = tickerItems.length ? tickerItems.map((t) => t.text || t) : TICKER;
    const portrait = data.photo;

    // beside a portrait the name lives in a column, so it sets smaller than it
    // does across the full centred fold
    const titleSize = portrait
        ? 'text-[clamp(2.4rem,6.4vw,4.7rem)]'
        : 'text-[clamp(2.6rem,9vw,6.5rem)]';

    const copy = (
        <div className={portrait ? 'text-center lg:text-left' : 'text-center'}>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur"
            >
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-mist-300 uppercase">
                    Available for work
                </span>
            </motion.div>

            <h1 className={`font-display ${titleSize} leading-[0.95] font-bold tracking-tight`}>
                {words.map((word, i) => (
                    <Fragment key={i}>
                        <span
                            className={`inline-block pb-[0.08em] align-bottom ${
                                revealed ? '' : 'overflow-hidden'
                            }`}
                        >
                            <motion.span
                                className="inline-block"
                                initial={{ y: '110%', opacity: 0 }}
                                animate={{ y: '0%', opacity: 1 }}
                                transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.09 }}
                                onAnimationComplete={
                                    i === words.length - 1 ? () => setRevealed(true) : undefined
                                }
                            >
                                {i === words.length - 1 ? (
                                    /* the halo is a second copy of the word, blurred
                                       underneath: a shadow or filter on the clipped
                                       gradient itself makes Chrome paint the whole
                                       box instead of the glyphs */
                                    <span className="relative inline-block">
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 select-none text-glow-400/40 blur-[14px]"
                                        >
                                            {word}
                                        </span>
                                        <span className="relative bg-gradient-to-br from-glow-300 via-glow-400 to-berry-400 bg-clip-text text-transparent">
                                            {word}
                                        </span>
                                    </span>
                                ) : (
                                    word
                                )}
                            </motion.span>
                        </span>
                        {/* the separator sits outside the clip, or overflow-hidden
                            swallows it and the names run together */}
                        {i < words.length - 1 ? ' ' : ''}
                    </Fragment>
                ))}
            </h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
                className={`mt-7 max-w-xl text-base leading-relaxed text-mist-400 sm:text-lg ${
                    portrait ? 'mx-auto lg:mx-0' : 'mx-auto'
                }`}
            >
                {data.subtitle}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
                className={`mt-10 flex flex-wrap items-center gap-3 ${
                    portrait ? 'justify-center lg:justify-start' : 'justify-center'
                }`}
            >
                <GlowButton as="a" href={data.buttonLink || '#projects'}>
                    {data.buttonText}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </GlowButton>
                <GlowButton as="a" href="#contact" variant="ghost">
                    <Sparkles className="h-4 w-4" />
                    Let's talk
                </GlowButton>
            </motion.div>
        </div>
    );

    return (
        <section
            ref={ref}
            id="hero"
            className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-36 pb-16"
        >
            <Aurora />

            {/* faint grid floor */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    maskImage: 'radial-gradient(ellipse 70% 55% at 50% 45%, #000 40%, transparent 100%)',
                }}
            />

            <motion.div
                style={{ y, opacity, scale }}
                className={`relative z-10 w-full ${portrait ? 'max-w-6xl' : 'max-w-5xl'}`}
            >
                {portrait ? (
                    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                        {copy}
                        <motion.div
                            style={{ y: photoY }}
                            className="mx-auto w-full max-w-[17.5rem] sm:max-w-[19rem] lg:mr-0 lg:ml-auto lg:max-w-[23rem]"
                        >
                            <PortraitPlate
                                src={portrait}
                                alt={`Portrait of ${data.title}`}
                                delay={0.35}
                                priority
                            />
                        </motion.div>
                    </div>
                ) : (
                    copy
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="relative z-10 mt-16 w-full max-w-4xl"
            >
                <Marquee items={ticker} duration={30} />
            </motion.div>

            <motion.a
                href="#about"
                aria-label="Scroll to about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-mist-600 transition-colors hover:text-glow-300"
            >
                <motion.span
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                    className="block"
                >
                    <ArrowDown className="h-5 w-5" />
                </motion.span>
            </motion.a>
        </section>
    );
}
