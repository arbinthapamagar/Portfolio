import { motion } from 'motion/react';
import { directional } from './variants';

// scroll-triggered reveal — the workhorse wrapper used by every section
export default function Reveal({
    children,
    direction = 'up',
    distance = 28,
    delay = 0,
    once = true,
    amount = 0.25,
    className = '',
    as = 'div',
}) {
    const MotionTag = motion[as] || motion.div;
    const variants = directional(direction, distance);

    return (
        <MotionTag
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount }}
            transition={{ delay }}
        >
            {children}
        </MotionTag>
    );
}
