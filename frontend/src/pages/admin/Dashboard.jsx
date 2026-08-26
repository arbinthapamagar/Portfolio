import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Briefcase, Building2, FolderKanban, Mail, MessageSquareQuote, Sparkles } from 'lucide-react';
import { adminApi, publicApi } from '../../lib/api';
import Counter from '../../components/motion/Counter';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, stagger } from '../../components/motion/variants';

const CARDS = [
    { key: 'projects', label: 'Projects', to: '/admin/projects', Icon: FolderKanban },
    { key: 'experience', label: 'Experience', to: '/admin/experience', Icon: Briefcase },
    { key: 'testimonials', label: 'Testimonials', to: '/admin/testimonials', Icon: MessageSquareQuote },
    { key: 'services', label: 'Skill groups', to: '/admin/skills', Icon: Sparkles },
    { key: 'clients', label: 'Clients', to: '/admin/clients', Icon: Building2 },
    { key: 'messages', label: 'Messages', to: '/admin/messages', Icon: Mail },
];

export default function Dashboard() {
    const { admin } = useAuth();
    const [counts, setCounts] = useState(null);

    useEffect(() => {
        let alive = true;
        Promise.allSettled([
            publicApi.projects(),
            publicApi.experience(),
            publicApi.testimonials(),
            publicApi.services(),
            publicApi.clients(),
            adminApi.messages(1),
        ]).then(([p, e, t, s, c, m]) => {
            if (!alive) return;
            setCounts({
                projects: p.status === 'fulfilled' ? p.value.length : 0,
                experience: e.status === 'fulfilled' ? e.value.length : 0,
                testimonials: t.status === 'fulfilled' ? t.value.length : 0,
                services: s.status === 'fulfilled' ? s.value.length : 0,
                clients: c.status === 'fulfilled' ? c.value.length : 0,
                messages: m.status === 'fulfilled' ? (m.value?.pagination?.totalItems ?? 0) : 0,
            });
        });
        return () => {
            alive = false;
        };
    }, []);

    return (
        <div>
            <div className="mb-9">
                <p className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                    Dashboard
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold">
                    Welcome back, {admin?.name || 'Arbeen'}.
                </h1>
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-glow-300 hover:text-glow-200"
                >
                    View live site <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
            </div>

            {!counts ? (
                <Loader />
            ) : (
                <motion.div
                    variants={stagger(0.07)}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {CARDS.map(({ key, label, to, Icon }) => (
                        <motion.div key={key} variants={fadeUp}>
                            <Link
                                to={to}
                                className="glass glow-ring group flex items-center justify-between rounded-2xl p-6 transition-colors hover:bg-white/[0.05]"
                            >
                                <div>
                                    <p className="font-display text-3xl font-bold text-glow-300">
                                        <Counter value={String(counts[key] ?? 0)} />
                                    </p>
                                    <p className="mt-1 text-xs tracking-wide text-mist-500 uppercase">
                                        {label}
                                    </p>
                                </div>
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.04] text-mist-400 transition-colors group-hover:text-glow-300">
                                    <Icon className="h-4.5 w-4.5" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
