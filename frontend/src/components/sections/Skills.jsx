import { motion } from 'motion/react';
import {
    Code, Server, Database, Wrench, Sparkles, Cloud, GitBranch,
    Layers, Palette, Smartphone, Terminal, Shield, Zap, Box,
} from 'lucide-react';
import Tilt from '../motion/Tilt';
import SectionHeader from '../ui/SectionHeader';
import { stagger, fadeUp } from '../motion/variants';

const FALLBACK = [
    { title: 'Frontend', icon: 'code', items: ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'] },
    { title: 'Backend', icon: 'server', items: ['Node.js', 'Express', 'REST APIs', 'JWT Auth'] },
    { title: 'Databases', icon: 'database', items: ['MongoDB', 'Mongoose', 'MySQL'] },
    { title: 'Tools', icon: 'wrench', items: ['Git', 'Cloudinary', 'Postman', 'Vite'] },
];

// a fixed map instead of a barrel import — importing all of lucide added ~700kb
const ICONS = {
    code: Code,
    server: Server,
    database: Database,
    wrench: Wrench,
    sparkles: Sparkles,
    cloud: Cloud,
    git: GitBranch,
    gitbranch: GitBranch,
    layers: Layers,
    palette: Palette,
    smartphone: Smartphone,
    terminal: Terminal,
    shield: Shield,
    zap: Zap,
    box: Box,
};

function SkillIcon({ name }) {
    const Icon = ICONS[String(name || '').toLowerCase().replace(/[-_\s]/g, '')] || Sparkles;
    return <Icon className="h-5 w-5" />;
}

export default function Skills({ services = [], heading }) {
    const groups = services.length ? services.filter((s) => s.isActive !== false) : FALLBACK;

    return (
        <section id="skills" className="relative px-6 py-28 lg:py-36">
            {/* section-wide soft glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-[45rem] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.16), transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-6xl">
                <SectionHeader
                    heading={heading}
                    align="center"
                    fallback={{
                        label: 'Stack',
                        titlePlain: 'What I',
                        titleHighlight: 'work with.',
                        subtitle:
                            'The tools I reach for day to day — grouped so you can scan it in a few seconds.',
                    }}
                />

                <motion.div
                    variants={stagger(0.09)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {groups.map((group, i) => (
                        <motion.div key={group._id || i} variants={fadeUp}>
                            <Tilt max={7} className="group h-full">
                                <div className="glass glow-ring flex h-full flex-col gap-4 rounded-2xl p-6 transition-colors duration-300 hover:bg-white/[0.05]">
                                    <motion.div
                                        whileHover={{ rotate: -8, scale: 1.1 }}
                                        transition={{ type: 'spring', stiffness: 340, damping: 16 }}
                                        className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-glow-500/25 to-cyan-glow/15 text-glow-300"
                                    >
                                        <SkillIcon name={group.icon} />
                                    </motion.div>

                                    <div>
                                        <h3 className="font-display text-lg font-semibold">
                                            {group.title}
                                        </h3>
                                        {group.description && (
                                            <p className="mt-1 text-xs leading-relaxed text-mist-600">
                                                {group.description}
                                            </p>
                                        )}
                                    </div>

                                    <ul className="mt-auto flex flex-wrap gap-1.5">
                                        {(group.items || []).map((item) => (
                                            <li
                                                key={item}
                                                className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-mist-400 transition-colors group-hover:border-glow-400/25 group-hover:text-mist-300"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Tilt>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
