import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Mail, Trash2 } from 'lucide-react';
import { adminApi, apiMessage } from '../../lib/api';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Toast from '../../components/admin/Toast';
import useToast from '../../components/admin/useToast';
import { EASE } from '../../components/motion/variants';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);
    const { toast, push } = useToast();

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let alive = true;
        adminApi
            .messages(page)
            .then((data) => {
                if (!alive) return;
                setMessages(data?.contacts ?? []);
                setPagination(data?.pagination ?? null);
                setLoading(false);
            })
            .catch((err) => {
                if (!alive) return;
                push(apiMessage(err, 'Failed to load messages'), 'error');
                setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [page, push, reloadKey]);

    const load = useCallback(() => setReloadKey((key) => key + 1), []);

    const destroy = async (id) => {
        try {
            await adminApi.deleteMessage(id);
            push('Message deleted');
            load();
        } catch (err) {
            push(apiMessage(err, 'Delete failed'), 'error');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold">Messages</h1>
                <p className="mt-1 text-sm text-mist-500">
                    {pagination?.totalItems ?? 0} received from your contact form.
                </p>
            </div>

            {loading ? (
                <Loader />
            ) : messages.length === 0 ? (
                <EmptyState title="No messages yet" hint="Submissions from the contact form land here." />
            ) : (
                <ul className="grid gap-3">
                    {messages.map((message, i) => {
                        const open = openId === message._id;
                        return (
                            <motion.li
                                key={message._id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: EASE, delay: i * 0.03 }}
                                className="glass glow-ring overflow-hidden rounded-xl"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenId(open ? null : message._id)}
                                    className="flex w-full items-center gap-4 p-4 text-left"
                                >
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-glow-500/15 text-glow-300">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-mist-100">
                                            {message.subject || '(no subject)'}
                                        </span>
                                        <span className="block truncate text-xs text-mist-500">
                                            {message.name} · {message.email}
                                        </span>
                                    </span>
                                    <span className="shrink-0 font-mono text-[10px] text-mist-600">
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.32, ease: EASE }}
                                            className="overflow-hidden border-t border-white/[0.06]"
                                        >
                                            <div className="p-5">
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-mist-300">
                                                    {message.message}
                                                </p>
                                                <div className="mt-5 flex gap-3">
                                                    <a
                                                        href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || '')}`}
                                                        className="rounded-lg bg-glow-500 px-4 py-2 text-xs font-medium text-ink-950 hover:bg-glow-400"
                                                    >
                                                        Reply
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(message._id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-xs text-mist-400 transition-colors hover:border-rose-500/50 hover:text-rose-400"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.li>
                        );
                    })}
                </ul>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-mist-400 disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs text-mist-500">
                        {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-mist-400 disabled:opacity-40"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            <Toast toast={toast} />
        </div>
    );
}
