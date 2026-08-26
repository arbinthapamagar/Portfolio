import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react';

// 3d card tilt that follows the pointer, with a sheen that tracks it
export default function Tilt({ children, className = '', max = 9, sheen = true }) {
    const ref = useRef(null);
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);

    const config = { stiffness: 180, damping: 20 };
    const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), config);
    const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), config);

    const sheenX = useTransform(px, (v) => `${v * 100}%`);
    const sheenY = useTransform(py, (v) => `${v * 100}%`);
    const sheenBg = useMotionTemplate`radial-gradient(340px circle at ${sheenX} ${sheenY}, rgba(223,199,155,0.15), transparent 65%)`;

    const handleMove = (event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
    };

    const reset = () => {
        px.set(0.5);
        py.set(0.5);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className={`relative [perspective:900px] ${className}`}
        >
            {children}
            {sheen && (
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: sheenBg }}
                />
            )}
        </motion.div>
    );
}
