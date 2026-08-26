import Reveal from '../motion/Reveal';
import TextReveal from '../motion/TextReveal';

// heading block driven by the sectionHeading collection, with sensible fallbacks
export default function SectionHeader({ heading, fallback = {}, align = 'left', className = '' }) {
    const label = heading?.label || fallback.label;
    const titlePlain = heading?.titlePlain || fallback.titlePlain || '';
    const titleHighlight = heading?.titleHighlight || fallback.titleHighlight || '';
    const subtitle = heading?.subtitle || fallback.subtitle;

    const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

    return (
        <div className={`flex flex-col ${alignment} gap-4 ${className}`}>
            {label && (
                <Reveal>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-glow-300 uppercase">
                        <span className="h-1 w-1 rounded-full bg-glow-400" />
                        {label}
                    </span>
                </Reveal>
            )}

            <h2 className="font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
                {titlePlain && <TextReveal as="span" text={titlePlain} className="block" />}
                {titleHighlight && (
                    <TextReveal
                        as="span"
                        text={titleHighlight}
                        delay={0.1}
                        className="block bg-gradient-to-r from-glow-400 via-glow-300 to-cyan-glow bg-clip-text text-transparent"
                    />
                )}
            </h2>

            {subtitle && (
                <Reveal delay={0.15}>
                    <p
                        className={`max-w-2xl text-base leading-relaxed text-mist-500 ${
                            align === 'center' ? 'mx-auto' : ''
                        }`}
                    >
                        {subtitle}
                    </p>
                </Reveal>
            )}
        </div>
    );
}
