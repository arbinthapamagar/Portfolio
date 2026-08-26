import { motion, useScroll, useSpring } from 'motion/react';

// thin gradient bar pinned to the top of the viewport
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

    return (
        <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-glow-500 via-glow-400 to-cyan-glow"
        />
    );
}
