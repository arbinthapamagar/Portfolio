import { motion } from 'motion/react';
import Magnetic from '../motion/Magnetic';

const BASE =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60';

// primary = filled violet with a sweeping sheen, ghost = outlined that fills on hover
export default function GlowButton({
    children,
    as: Tag = 'button',
    variant = 'primary',
    className = '',
    magnetic = true,
    ...props
}) {
    // motion.a / motion.button are stable references; motion.create() would build
    // a new component type on every render and remount the button mid-animation
    const MotionTag = (typeof Tag === 'string' && motion[Tag]) || motion.button;

    const skin =
        variant === 'primary'
            ? 'bg-glow-500 text-white shadow-[0_0_34px_-6px_rgba(139,92,246,0.75)] hover:bg-glow-400'
            : 'border border-white/15 bg-white/[0.03] text-mist-100 hover:border-glow-400/50 hover:text-white';

    const button = (
        <MotionTag
            className={`${BASE} ${skin} ${className}`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {/* diagonal sheen sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </MotionTag>
    );

    return magnetic ? <Magnetic className="inline-block">{button}</Magnetic> : button;
}
