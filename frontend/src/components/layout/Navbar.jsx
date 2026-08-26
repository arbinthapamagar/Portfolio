import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Magnetic from '../motion/Magnetic';
import { EASE } from '../motion/variants';

// every destination is now its own route rather than an in-page anchor
const LINKS = [
    { to: '/about', label: 'About' },
    { to: '/skills', label: 'Skills' },
    { to: '/projects', label: 'Projects' },
    { to: '/experience', label: 'Experience' },
    { to: '/contact', label: 'Contact' },
];

export default function Navbar({ resumeUrl }) {
    const { scrollY } = useScroll();
    const { pathname } = useLocation();
    const [condensed, setCondensed] = useState(false);
    const [open, setOpen] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => setCondensed(latest > 40));

    // close the mobile sheet whenever a route actually changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // lock body scroll while the mobile sheet is open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const isActive = (to) => pathname === to || pathname.startsWith(`${to}/`);

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                className="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:pt-7"
            >
                <motion.nav
                    animate={{
                        maxWidth: condensed ? 1180 : 1560,
                        backgroundColor: condensed ? 'rgba(14,14,21,0.78)' : 'rgba(14,14,21,0)',
                        borderColor: condensed ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0)',
                        paddingTop: condensed ? 18 : 28,
                        paddingBottom: condensed ? 18 : 28,
                    }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="mx-auto flex items-center justify-between rounded-[2rem] border px-6 backdrop-blur-xl sm:px-9"
                >
                    <Link to="/" className="group flex items-center gap-3.5">
                        <motion.span
                            className="grid h-14 w-14 place-items-center rounded-2xl bg-glow-500 font-display text-2xl font-bold text-white shadow-[0_0_32px_-8px_rgba(139,92,246,0.9)]"
                            whileHover={{ rotate: 90, borderRadius: '50%' }}
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        >
                            A
                        </motion.span>
                        <span className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                            Arbeen
                            {/* underline draws in from the left on hover */}
                            <span className="block h-[3px] w-0 rounded-full bg-gradient-to-r from-glow-400 to-cyan-glow transition-all duration-400 group-hover:w-full" />
                        </span>
                    </Link>

                    <ul className="hidden items-center gap-2 md:flex">
                        {LINKS.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="relative block rounded-full px-6 py-3 text-lg font-medium text-mist-300 transition-colors hover:text-white"
                                >
                                    {isActive(link.to) && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 rounded-full border border-glow-400/25 bg-white/[0.08]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        {resumeUrl && (
                            <Magnetic className="hidden sm:inline-block">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-glow-400/40 bg-glow-500/10 px-6 py-3 text-lg font-medium text-glow-300 transition-colors hover:bg-glow-500/20"
                                >
                                    Résumé
                                </a>
                            </Magnetic>
                        )}
                        <button
                            type="button"
                            aria-label="Toggle menu"
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                            className="grid h-13 w-13 place-items-center rounded-full border border-white/10 p-3 text-mist-300 transition-colors hover:text-white md:hidden"
                        >
                            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </motion.nav>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl md:hidden"
                    >
                        <ul className="flex h-full flex-col items-center justify-center gap-5">
                            {LINKS.map((link, i) => (
                                <motion.li
                                    key={link.to}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.06 * i + 0.1, ease: EASE }}
                                >
                                    <Link
                                        to={link.to}
                                        onClick={() => setOpen(false)}
                                        className={`font-display text-5xl font-bold transition-colors sm:text-6xl ${
                                            isActive(link.to)
                                                ? 'text-glow-300'
                                                : 'text-mist-300 hover:text-glow-300'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
