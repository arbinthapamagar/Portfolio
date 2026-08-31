import { motion, useReducedMotion } from 'motion/react';
import { EASE } from '../motion/variants';

/* One frame for every portrait on the site — the hero and the about column both
   mount this, so a photo reads the same wherever it lands.

   Registration marks at the corners instead of a border, and a berry cast over
   the image so it belongs to the palette rather than looking like a snapshot
   dropped on top of it. Both retreat on hover, which makes the photo itself the
   thing you end up looking at. */

const MARK = 'pointer-events-none absolute h-5 w-5 border-glow-400/40 transition-all duration-500 ease-out';

export default function PortraitPlate({
    src,
    alt = 'Portrait',
    caption,
    sub,
    ratio = 'aspect-[4/5]',
    delay = 0,
    priority = false,
    className = '',
}) {
    const still = useReducedMotion();

    return (
        <motion.figure
            initial={still ? { opacity: 0 } : { opacity: 0, y: 22, scale: 1.04 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE, delay }}
            className={`group relative ${className}`}
        >
            <span aria-hidden="true" className={`${MARK} -top-2 -left-2 border-t border-l group-hover:-top-3.5 group-hover:-left-3.5`} />
            <span aria-hidden="true" className={`${MARK} -top-2 -right-2 border-t border-r group-hover:-top-3.5 group-hover:-right-3.5`} />
            <span aria-hidden="true" className={`${MARK} -bottom-2 -left-2 border-b border-l group-hover:-bottom-3.5 group-hover:-left-3.5`} />
            <span aria-hidden="true" className={`${MARK} -right-2 -bottom-2 border-r border-b group-hover:-right-3.5 group-hover:-bottom-3.5`} />

            <div className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 ${ratio}`}>
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    className="h-full w-full scale-[1.02] object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-100"
                />

                {/* palette cast — cool blueberry wash that clears on hover */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-berry-600/30 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-0"
                />
                {/* keeps the crop from floating, and carries the caption */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent"
                />

                {caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 p-5">
                        <p className="font-display text-sm font-medium text-mist-100">{caption}</p>
                        {sub && (
                            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-mist-300/75 uppercase">
                                {sub}
                            </p>
                        )}
                    </figcaption>
                )}
            </div>
        </motion.figure>
    );
}
