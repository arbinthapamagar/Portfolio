import { motion } from 'motion/react';
import { EASE } from './variants';

// splits a heading into words and lifts each one out of a clipped line
export default function TextReveal({
    text = '',
    className = '',
    wordClassName = '',
    delay = 0,
    stagger = 0.055,
    as = 'h2',
}) {
    const MotionTag = motion[as] || motion.h2;
    const words = String(text).split(' ').filter(Boolean);

    return (
        <MotionTag
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: stagger, delayChildren: delay } },
            }}
            aria-label={text}
        >
            {words.map((word, i) => (
                <span
                    key={`${word}-${i}`}
                    className="inline-block overflow-hidden align-bottom"
                    aria-hidden="true"
                >
                    <motion.span
                        className={`inline-block ${wordClassName}`}
                        variants={{
                            hidden: { y: '110%', opacity: 0 },
                            show: {
                                y: '0%',
                                opacity: 1,
                                transition: { duration: 0.75, ease: EASE },
                            },
                        }}
                    >
                        {word}
                        {i < words.length - 1 ? ' ' : ''}
                    </motion.span>
                </span>
            ))}
        </MotionTag>
    );
}
