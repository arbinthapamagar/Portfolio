import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, TriangleAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiMessage } from '../../lib/api';
import Aurora from '../../components/motion/Aurora';
import { EASE } from '../../components/motion/variants';

export default function Login() {
    const { login, isAuthed, ready } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    if (ready && isAuthed) return <Navigate to="/admin" replace />;

    const change = (event) =>
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError('');
        try {
            // the login controller also compares confirmPassword, so send it
            await login({ ...form, confirmPassword: form.password });
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(apiMessage(err, 'Login failed'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="relative grid min-h-screen place-items-center px-6">
            <Aurora />

            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="glass glow-ring relative w-full max-w-sm rounded-2xl p-8"
            >
                <div className="mb-7 text-center">
                    <motion.span
                        initial={{ rotate: -12, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
                        className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-glow-500 font-display text-lg font-bold text-white"
                    >
                        A
                    </motion.span>
                    <h1 className="font-display text-xl font-semibold">Admin sign in</h1>
                    <p className="mt-1 text-xs text-mist-500">Manage your portfolio content</p>
                </div>

                <div className="grid gap-4">
                    <label className="block">
                        <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-mist-500 uppercase">
                            Email
                        </span>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={change}
                            autoComplete="username"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none transition-colors focus:border-glow-400/60"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-mist-500 uppercase">
                            Password
                        </span>
                        <input
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={change}
                            autoComplete="current-password"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none transition-colors focus:border-glow-400/60"
                        />
                    </label>
                </div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs text-rose-400"
                    >
                        <TriangleAlert className="h-3.5 w-3.5" /> {error}
                    </motion.p>
                )}

                <motion.button
                    type="submit"
                    disabled={busy}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-glow-500 py-3 text-sm font-medium text-white transition-colors hover:bg-glow-400 disabled:opacity-60"
                >
                    <LogIn className="h-4 w-4" />
                    {busy ? 'Signing in…' : 'Sign in'}
                </motion.button>
            </motion.form>
        </div>
    );
}
