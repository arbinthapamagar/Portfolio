import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

// shifts children as the section scrolls past — `speed` is in px of total travel
export default function Parallax({ children, speed = 60, className = '' }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

    return (
        <div ref={ref} className={className}>
            <motion.div style={{ y }}>{children}</motion.div>
        </div>
    );
}
