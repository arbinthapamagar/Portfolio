import { motion } from 'motion/react';

// slow drifting colour blobs behind the hero / section backgrounds
export default function Aurora({ className = '' }) {
    return (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            <motion.div
                className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(139,124,232,0.32), transparent 70%)' }}
                animate={{ x: [0, 90, -30, 0], y: [0, 60, 20, 0], scale: [1, 1.15, 0.95, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full blur-[130px]"
                style={{ background: 'radial-gradient(circle, rgba(223,199,155,0.15), transparent 70%)' }}
                animate={{ x: [0, -70, 30, 0], y: [0, -50, 30, 0], scale: [1, 0.9, 1.1, 1] }}
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full blur-[110px]"
                style={{ background: 'radial-gradient(circle, rgba(168,58,110,0.24), transparent 70%)' }}
                animate={{ x: [0, 50, -40, 0], y: [0, -30, 10, 0] }}
                transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}
