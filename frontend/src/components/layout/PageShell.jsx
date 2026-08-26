import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Aurora from '../motion/Aurora';
import Magnetic from '../motion/Magnetic';
import { EASE } from '../motion/variants';

// the nav order, so every page can offer its neighbours at the bottom
export const PAGES = [
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/experience', label: 'Experience' },
    { path: '/contact', label: 'Contact' },
];

function Pager({ path }) {
    const i = PAGES.findIndex((p) => p.path === path);
    const prev = i > 0 ? PAGES[i - 1] : null;
    const next = i >= 0 && i < PAGES.length - 1 ? PAGES[i + 1] : null;

    return (
        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between gap-4 border-t border-white/5 px-6 pt-10 pb-24">
            {prev ? (
                <Magnetic strength={0.2}>
                    <Link
                        to={prev.path}
                        className="group flex flex-col gap-1 text-left transition-colors hover:text-white"
                    >
                        <span className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            Previous
                        </span>
                        <span className="flex items-center gap-2 font-display text-xl font-semibold text-mist-300 group-hover:text-glow-300 sm:text-2xl">
                            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                            {prev.label}
                        </span>
                    </Link>
                </Magnetic>
            ) : (
                <span />
            )}

            {next ? (
                <Magnetic strength={0.2}>
                    <Link
                        to={next.path}
                        className="group flex flex-col gap-1 text-right transition-colors hover:text-white"
                    >
                        <span className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            Next
                        </span>
                        <span className="flex items-center gap-2 font-display text-xl font-semibold text-mist-300 group-hover:text-glow-300 sm:text-2xl">
                            {next.label}
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </Link>
                </Magnetic>
            ) : (
                <span />
            )}
        </div>
    );
}

/**
 * Wrapper for the standalone nav pages. Each one reuses the same section
 * component the home page scrolls through, so there is a single source of truth
 * for the markup — this only supplies the page chrome around it.
 */
export default function PageShell({ path, title, children }) {
    return (
        <div className="relative">
            <Aurora className="opacity-50" />

            <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-2 sm:pt-44">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                    className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase"
                >
                    <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-glow-300">
                        <Home className="h-3 w-3" />
                        Home
                    </Link>
                    <span className="text-mist-700">/</span>
                    <span className="text-glow-300">{title}</span>
                </motion.div>

                {/* the line grows out from the left as the page settles */}
                <motion.div
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
                    className="mt-6 h-px origin-left bg-gradient-to-r from-glow-500/70 via-glow-500/15 to-transparent"
                />
            </div>

            {/* the sections carry their own py-28; trim the top so it isn't doubled */}
            <div className="[&>section]:pt-12 [&>section]:lg:pt-16">{children}</div>

            <Pager path={path} />
        </div>
    );
}
