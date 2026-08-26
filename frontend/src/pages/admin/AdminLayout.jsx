import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
    Briefcase, Building2, FileText, FolderKanban, GraduationCap, Home, LayoutDashboard,
    LogOut, Mail, MessageSquareQuote, PanelsTopLeft, Sparkles, Type,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/Loader';
import { EASE } from '../../components/motion/variants';

const NAV = [
    { to: '/admin', end: true, label: 'Overview', Icon: LayoutDashboard },
    { to: '/admin/hero', label: 'Hero', Icon: PanelsTopLeft },
    { to: '/admin/about', label: 'About', Icon: FileText },
    { to: '/admin/skills', label: 'Skills', Icon: Sparkles },
    { to: '/admin/projects', label: 'Projects', Icon: FolderKanban },
    { to: '/admin/experience', label: 'Experience', Icon: Briefcase },
    { to: '/admin/education', label: 'Education', Icon: GraduationCap },
    { to: '/admin/testimonials', label: 'Testimonials', Icon: MessageSquareQuote },
    { to: '/admin/clients', label: 'Clients', Icon: Building2 },
    { to: '/admin/headings', label: 'Headings', Icon: Type },
    { to: '/admin/footer', label: 'Footer', Icon: Home },
    { to: '/admin/messages', label: 'Messages', Icon: Mail },
];

export default function AdminLayout() {
    const { isAuthed, ready, admin, logout } = useAuth();
    const location = useLocation();

    if (!ready) {
        return (
            <div className="grid min-h-screen place-items-center">
                <Loader label="Checking session" />
            </div>
        );
    }

    if (!isAuthed) return <Navigate to="/admin/login" replace />;

    return (
        <div className="flex min-h-screen bg-ink-950">
            <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/[0.06] bg-ink-900 lg:flex">
                <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-glow-500 font-display text-sm font-bold text-ink-950">
                        A
                    </span>
                    <span className="font-display text-sm font-semibold">Portfolio CMS</span>
                </div>

                <nav className="flex-1 overflow-y-auto p-3">
                    <ul className="grid gap-0.5">
                        {NAV.map(({ to, label, Icon, end }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                            isActive
                                                ? 'text-mist-100'
                                                : 'text-mist-500 hover:text-mist-200'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <motion.span
                                                    layoutId="admin-nav"
                                                    className="absolute inset-0 rounded-lg bg-glow-500/15 ring-1 ring-glow-500/25"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                />
                                            )}
                                            <Icon className="relative z-10 h-4 w-4" />
                                            <span className="relative z-10">{label}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="border-t border-white/[0.06] p-3">
                    <p className="px-3 pb-2 text-xs text-mist-600">{admin?.email}</p>
                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mist-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                    >
                        <LogOut className="h-4 w-4" /> Sign out
                    </button>
                </div>
            </aside>

            <div className="min-w-0 flex-1">
                {/* mobile nav */}
                <div className="sticky top-0 z-30 flex gap-1 overflow-x-auto border-b border-white/[0.06] bg-ink-900/90 px-3 py-2 backdrop-blur lg:hidden">
                    {NAV.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `shrink-0 rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
                                    isActive ? 'bg-glow-500 text-ink-950' : 'text-mist-500'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="mx-auto max-w-4xl p-6 lg:p-10"
                    >
                        <Outlet />
                    </motion.main>
                </AnimatePresence>
            </div>
        </div>
    );
}
