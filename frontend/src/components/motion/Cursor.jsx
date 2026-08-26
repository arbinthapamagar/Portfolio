import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

// glow dot + trailing ring; disabled on touch devices where there is no cursor
export default function Cursor() {
    const [enabled] = useState(
        () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
    );
    const [hot, setHot] = useState(false);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const ringX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
    const ringY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

    useEffect(() => {
        if (!enabled) return;

        const move = (event) => {
            x.set(event.clientX);
            y.set(event.clientY);
            const target = event.target;
            setHot(Boolean(target?.closest?.('a, button, [data-cursor="hot"]')));
        };

        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [enabled, x, y]);

    if (!enabled) return null;

    return (
        <>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[80] h-1.5 w-1.5 rounded-full bg-glow-300"
                style={{ x, y, translateX: '-50%', translateY: '-50%' }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[80] rounded-full border border-glow-400/60"
                style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
                animate={{
                    width: hot ? 46 : 26,
                    height: hot ? 46 : 26,
                    opacity: hot ? 1 : 0.55,
                    backgroundColor: hot ? 'rgba(167,139,250,0.12)' : 'rgba(167,139,250,0)',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            />
        </>
    );
}
