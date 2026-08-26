import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Box, Code, Database, Server, Sparkles, Terminal, Wrench, Zap,
    ChevronRight, Layers, Shield, Cloud, Palette, Smartphone, GitBranch, Check,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import TechIcon, { brandHex } from '../ui/TechIcon';
import { EASE } from '../motion/variants';

const FALLBACK = [
    {
        title: 'Core — JavaScript & Node',
        description: 'Where most of my work lives.',
        icon: 'zap',
        items: ['JavaScript', 'Node.js', 'Express', 'REST APIs', 'JWT Auth', 'TypeScript'],
    },
    {
        title: 'AI, Agents & RAG',
        description: 'Agentic systems and retrieval, built end to end.',
        icon: 'sparkles',
        items: ['LangChain', 'LangGraph', 'ChromaDB', 'Ollama', 'FastAPI', 'Anthropic API'],
    },
];

// a fixed map instead of a barrel import — importing all of lucide added ~700kb
const ICONS = {
    code: Code, server: Server, database: Database, wrench: Wrench,
    sparkles: Sparkles, cloud: Cloud, git: GitBranch, gitbranch: GitBranch,
    layers: Layers, palette: Palette, smartphone: Smartphone,
    terminal: Terminal, shield: Shield, zap: Zap, box: Box,
};

function GroupIcon({ name, className = 'h-5 w-5' }) {
    const Icon = ICONS[String(name || '').toLowerCase().replace(/[-_\s]/g, '')] || Sparkles;
    return <Icon className={className} />;
}

/* ------------------------------- tech chip ------------------------------- */

function TechChip({ name, index }) {
    const [hovered, setHovered] = useState(false);
    const hex = brandHex(name);

    return (
        <motion.li
            variants={{
                hidden: { opacity: 0, y: 16, scale: 0.94 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
            }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            className="group/chip relative"
        >
            <div
                className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3.5 py-2.5 transition-colors duration-300"
                style={{
                    borderColor: hovered && hex ? `${hex}66` : 'rgba(255,255,255,0.08)',
                    backgroundColor: hovered && hex ? `${hex}14` : 'rgba(255,255,255,0.025)',
                }}
            >
                {/* brand-coloured wash that blooms from the logo on hover */}
                {hex && (
                    <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        initial={false}
                        animate={{ opacity: hovered ? 1 : 0 }}
                        transition={{ duration: 0.35 }}
                        style={{ background: `radial-gradient(90px circle at 18px 50%, ${hex}2e, transparent 70%)` }}
                    />
                )}
                <motion.span
                    className="relative shrink-0"
                    animate={{ scale: hovered ? 1.18 : 1, rotate: hovered ? -6 : 0 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 18 }}
                >
                    <TechIcon name={name} className="h-[18px] w-[18px]" />
                </motion.span>
                <span className="relative font-mono text-xs whitespace-nowrap text-mist-300">
                    {name}
                </span>
            </div>
        </motion.li>
    );
}

/* ------------------------------ group button ----------------------------- */

function GroupButton({ group, active, onSelect, index }) {
    return (
        <motion.button
            type="button"
            onClick={onSelect}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.55, ease: EASE, delay: index * 0.06 }}
            whileHover={{ x: active ? 0 : 5 }}
            className="group/btn relative w-full text-left"
        >
            {active && (
                <motion.span
                    layoutId="skill-active"
                    className="absolute inset-0 rounded-2xl border border-glow-400/30 bg-glow-500/[0.09]"
                    transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                />
            )}

            <span className="relative flex items-center gap-3.5 px-4 py-4">
                <motion.span
                    animate={{
                        rotate: active ? 0 : -4,
                        scale: active ? 1.06 : 1,
                        backgroundColor: active ? 'rgba(223,199,155,0.16)' : 'rgba(255,255,255,0.04)',
                        color: active ? '#f8efdc' : '#a99e93',
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                >
                    <GroupIcon name={group.icon} />
                </motion.span>

                <span className="min-w-0 flex-1">
                    <span
                        className={`block font-display text-[15px] leading-snug font-semibold transition-colors duration-300 ${
                            active ? 'text-glow-300' : 'text-mist-300 group-hover/btn:text-mist-100'
                        }`}
                    >
                        {group.title}
                    </span>
                    <span className="block font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                        {(group.items || []).length} tools
                    </span>
                </span>

                <motion.span
                    animate={{ x: active ? 2 : 0, opacity: active ? 1 : 0.35 }}
                    className={active ? 'text-glow-300' : 'text-mist-600'}
                >
                    <ChevronRight className="h-4 w-4" />
                </motion.span>
            </span>
        </motion.button>
    );
}

/* -------------------------------- section -------------------------------- */

export default function Skills({ services = [], heading }) {
    const groups = services.length ? services.filter((s) => s.isActive !== false) : FALLBACK;
    const [activeIndex, setActiveIndex] = useState(0);
    const active = groups[Math.min(activeIndex, groups.length - 1)] || null;
    const total = groups.reduce((n, g) => n + (g.items || []).length, 0);

    if (!active) return null;

    return (
        <section id="skills" className="relative overflow-hidden px-6 py-28 lg:py-36">
            {/* the wash drifts as you change group, so the panel never feels static */}
            <motion.div
                aria-hidden="true"
                key={`wash-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: EASE }}
                className="pointer-events-none absolute top-1/4 right-0 h-[34rem] w-[34rem] rounded-full blur-[130px]"
                style={{ background: 'radial-gradient(circle, rgba(111,92,216,0.24), transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-6xl">
                <SectionHeader
                    heading={heading}
                    fallback={{
                        label: 'Stack',
                        titlePlain: 'What I',
                        titleHighlight: 'work with.',
                        subtitle: 'Pick an area to see what I actually use it for.',
                    }}
                />

                <div className="mt-14 grid gap-6 lg:grid-cols-[21rem_1fr]">
                    {/* ------------------------- group rail ------------------------- */}
                    <div className="glass min-w-0 rounded-3xl p-2.5">
                        <div className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                            {groups.map((group, i) => (
                                <div key={group._id || group.title} className="min-w-[15rem] lg:min-w-0">
                                    <GroupButton
                                        group={group}
                                        index={i}
                                        active={i === activeIndex}
                                        onSelect={() => setActiveIndex(i)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/5 px-4 py-3.5">
                            <span className="font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                Total
                            </span>
                            <motion.span
                                key={total}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-display text-lg font-semibold text-glow-300"
                            >
                                {total}
                            </motion.span>
                        </div>
                    </div>

                    {/* ------------------------ detail panel ------------------------ */}
                    <div className="glass glow-ring relative min-w-0 overflow-hidden rounded-3xl p-6 sm:min-h-[26rem] sm:p-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active._id || active.title}
                                initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                                transition={{ duration: 0.5, ease: EASE }}
                            >
                                <div className="flex items-start gap-4">
                                    <motion.span
                                        initial={{ rotate: -20, scale: 0.7 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                                        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-glow-500/25 to-berry-400/20 text-glow-300"
                                    >
                                        <GroupIcon name={active.icon} className="h-6 w-6" />
                                    </motion.span>
                                    <div className="min-w-0">
                                        <h3 className="font-display text-xl leading-tight font-semibold break-words sm:text-3xl">
                                            {active.title}
                                        </h3>
                                        {active.description && (
                                            <p className="mt-1 text-sm text-mist-500">{active.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* the line sweeps across on every group change */}
                                <motion.div
                                    aria-hidden="true"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                                    className="my-6 h-px origin-left bg-gradient-to-r from-glow-500/60 via-berry-400/40 to-transparent"
                                />

                                {active.details && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                                        className="max-w-2xl text-sm leading-relaxed text-mist-300/90"
                                    >
                                        {active.details}
                                    </motion.p>
                                )}

                                {(active.highlights || []).length > 0 && (
                                    <motion.ul
                                        className="mt-7 grid gap-2.5"
                                        initial="hidden"
                                        animate="show"
                                        variants={{
                                            hidden: {},
                                            show: {
                                                transition: { staggerChildren: 0.06, delayChildren: 0.22 },
                                            },
                                        }}
                                    >
                                        {active.highlights.map((line, i) => (
                                            <motion.li
                                                key={i}
                                                variants={{
                                                    hidden: { opacity: 0, x: -14 },
                                                    show: {
                                                        opacity: 1,
                                                        x: 0,
                                                        transition: { duration: 0.5, ease: EASE },
                                                    },
                                                }}
                                                className="flex gap-3 text-sm leading-relaxed text-mist-300/85"
                                            >
                                                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-glow-500/15 text-glow-300">
                                                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                                                </span>
                                                {line}
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                )}

                                <motion.ul
                                    className="mt-8 flex flex-wrap gap-2.5"
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: {},
                                        show: { transition: { staggerChildren: 0.04, delayChildren: 0.45 } },
                                    }}
                                >
                                    {(active.items || []).map((item, i) => (
                                        <TechChip key={item} name={item} index={i} />
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
