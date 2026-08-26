import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { EASE } from '../motion/variants';

export default function Testimonials({ testimonials = [], heading }) {
    const [[index, direction], setState] = useState([0, 0]);

    const paginate = useCallback(
        (step) => {
            setState(([current]) => {
                const next = (current + step + testimonials.length) % testimonials.length;
                return [next, step];
            });
        },
        [testimonials.length]
    );

    // auto-advance, reset whenever the slide changes
    useEffect(() => {
        if (testimonials.length < 2) return;
        const timer = setTimeout(() => paginate(1), 6500);
        return () => clearTimeout(timer);
    }, [index, paginate, testimonials.length]);

    if (!testimonials.length) return null;

    const active = testimonials[index];

    const variants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
    };

    return (
        <section id="testimonials" className="relative overflow-hidden px-6 py-28 lg:py-36">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(223,199,155,0.11), transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-4xl">
                <SectionHeader
                    heading={heading}
                    align="center"
                    fallback={{
                        label: 'Testimonials',
                        titlePlain: 'What people',
                        titleHighlight: 'say.',
                    }}
                />

                <div className="relative mt-14 min-h-[19rem]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.blockquote
                            key={active._id || index}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: EASE }}
                            className="glass glow-ring flex flex-col items-center gap-6 rounded-3xl px-7 py-12 text-center sm:px-12"
                        >
                            <Quote className="h-8 w-8 text-glow-500/50" />

                            <p className="max-w-2xl font-display text-lg leading-relaxed text-mist-200 sm:text-xl">
                                “{active.reviewText}”
                            </p>

                            {active.rating > 0 && (
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.15 + i * 0.06 }}
                                        >
                                            <Star
                                                className={`h-4 w-4 ${
                                                    i < active.rating
                                                        ? 'fill-glow-400 text-glow-400'
                                                        : 'text-mist-600'
                                                }`}
                                            />
                                        </motion.span>
                                    ))}
                                </div>
                            )}

                            <footer className="flex items-center gap-3">
                                {active.avatar && (
                                    <img
                                        src={active.avatar}
                                        alt={active.name}
                                        loading="lazy"
                                        className="h-11 w-11 rounded-full border border-white/10 object-cover"
                                    />
                                )}
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-mist-100">{active.name}</p>
                                    <p className="text-xs text-mist-500">{active.company}</p>
                                </div>
                            </footer>
                        </motion.blockquote>
                    </AnimatePresence>
                </div>

                {testimonials.length > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <motion.button
                            type="button"
                            aria-label="Previous testimonial"
                            onClick={() => paginate(-1)}
                            whileHover={{ scale: 1.1, x: -2 }}
                            whileTap={{ scale: 0.92 }}
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-glow-400/50 hover:text-glow-300"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </motion.button>

                        <div className="flex gap-2">
                            {testimonials.map((item, i) => (
                                <button
                                    key={item._id || i}
                                    type="button"
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    onClick={() => setState([i, i > index ? 1 : -1])}
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: i === index ? 28 : 8,
                                        background:
                                            i === index ? 'var(--color-glow-400)' : 'rgba(255,255,255,0.16)',
                                    }}
                                />
                            ))}
                        </div>

                        <motion.button
                            type="button"
                            aria-label="Next testimonial"
                            onClick={() => paginate(1)}
                            whileHover={{ scale: 1.1, x: 2 }}
                            whileTap={{ scale: 0.92 }}
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist-400 transition-colors hover:border-glow-400/50 hover:text-glow-300"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </motion.button>
                    </div>
                )}
            </div>
        </section>
    );
}
