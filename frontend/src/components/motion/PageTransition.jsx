import { motion } from 'motion/react';
import { EASE, EASE_SOFT } from './variants';

/**
 * Route-level entrance. The wipe is a separate absolutely-positioned layer so
 * it can animate over the content without affecting layout, and the content
 * itself lifts + unblurs behind it.
 */
export default function PageTransition({ children, routeKey }) {
    return (
        <motion.div key={routeKey} className="relative">
            {/* light sweep that clears off the top as the page settles */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-40 origin-top bg-gradient-to-b from-glow-500/20 via-ink-950 to-ink-950"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.62, ease: EASE_SOFT }}
                style={{ transformOrigin: 'top' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.12 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
