import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';

// counts up once the stat scrolls into view; keeps any non-numeric suffix ("+", "%")
export default function Counter({ value, duration = 1.6, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const raw = String(value ?? '');
    const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.,]/g, '');

    // non-numeric values render as-is; numeric ones count up from zero
    const [display, setDisplay] = useState(() => (Number.isNaN(numeric) ? raw : '0'));

    useEffect(() => {
        if (!inView || Number.isNaN(numeric)) return;

        const controls = animate(0, numeric, {
            duration,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (latest) => {
                const rounded = numeric % 1 === 0 ? Math.round(latest) : latest.toFixed(1);
                setDisplay(String(rounded));
            },
        });
        return () => controls.stop();
    }, [inView, numeric, duration]);

    return (
        <span ref={ref} className={className}>
            {display}
            {Number.isNaN(numeric) ? '' : suffix}
        </span>
    );
}
