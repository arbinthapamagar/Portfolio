import { motion } from 'motion/react';

export default function Loader({ label = 'Loading' }) {
    return (
        <div className="flex items-center justify-center gap-3 py-16 text-mist-500">
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-glow-400"
                        animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.13,
                        }}
                    />
                ))}
            </div>
            <span className="font-mono text-xs tracking-widest uppercase">{label}</span>
        </div>
    );
}
