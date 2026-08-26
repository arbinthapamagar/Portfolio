import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Magnetic from '../motion/Magnetic';

const LINKS = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
];

export default function Navbar({ resumeUrl }) {
    const { scrollY } = useScroll();
    const [condensed, setCondensed] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('');

    useMotionValueEvent(scrollY, 'change', (latest) => setCondensed(latest > 40));

    // highlight the link for whichever section is currently on screen
    useEffect(() => {
        const ids = LINKS.map((l) => l.href.slice(1));
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActive(`#${visible.target.id}`);
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: [0.1, 0.5] }
        );
        ids.forEach((id) => {
            const node = document.getElementById(id);
            if (node) observer.observe(node);
        });
        return () => observer.disconnect();
    }, []);

    // lock body scroll while the mobile sheet is open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
            >
                <motion.nav
                    animate={{
                        maxWidth: condensed ? 880 : 1200,
                        backgroundColor: condensed ? 'rgba(14,14,21,0.72)' : 'rgba(14,14,21,0)',
                        borderColor: condensed ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
                        paddingTop: condensed ? 10 : 16,
                        paddingBottom: condensed ? 10 : 16,
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto flex items-center justify-between rounded-full border px-5 backdrop-blur-xl"
                >
                    <Link to="/" className="group flex items-center gap-2.5">
                        <motion.span
                            className="grid h-8 w-8 place-items-center rounded-lg bg-glow-500 font-display text-sm font-bold text-white"
                            whileHover={{ rotate: 90, borderRadius: '50%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        >
                            A
                        </motion.span>
                        <span className="font-display text-sm font-semibold tracking-tight">
                            Arbeen
                        </span>
                    </Link>

                    <ul className="hidden items-center gap-1 md:flex">
                        {LINKS.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="relative block rounded-full px-4 py-2 text-sm text-mist-300 transition-colors hover:text-white"
                                >
                                    {active === link.href && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 rounded-full bg-white/[0.07]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-2">
                        {resumeUrl && (
                            <Magnetic className="hidden sm:inline-block">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-glow-400/40 bg-glow-500/10 px-4 py-2 text-sm font-medium text-glow-300 transition-colors hover:bg-glow-500/20"
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
                            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-mist-300 md:hidden"
                        >
                            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
                        <ul className="flex h-full flex-col items-center justify-center gap-2">
                            {LINKS.map((link, i) => (
                                <motion.li
                                    key={link.href}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.06 * i + 0.1, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="font-display text-3xl font-semibold text-mist-300 transition-colors hover:text-glow-300"
                                    >
                                        {link.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
