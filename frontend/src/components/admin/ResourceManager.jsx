import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import Field from './Field';
import Toast from './Toast';
import useToast from './useToast';
import Loader from '../ui/Loader';
import EmptyState from '../ui/EmptyState';
import { apiMessage } from '../../lib/api';
import { EASE } from '../motion/variants';

const blankFrom = (fields) =>
    fields.reduce((acc, f) => {
        if (f.type !== 'file') acc[f.name] = f.type === 'checkbox' ? false : '';
        return acc;
    }, {});

// generic list + create/edit/delete panel shared by every collection resource
export default function ResourceManager({
    title,
    // "Projects" -> "project" for the drawer heading
    singular = '',
    description,
    fields,
    fetcher,
    create,
    update,
    remove,
    multipart = false,
    primary = 'title',
    secondary,
    thumbnail,
    toPayload,
    fromItem,
}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(() => blankFrom(fields));
    const [files, setFiles] = useState({});
    const [editing, setEditing] = useState(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirming, setConfirming] = useState(null);
    const { toast, push } = useToast();

    const one = singular || title.toLowerCase().replace(/s$/, '');

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let alive = true;
        Promise.resolve(fetcher())
            .then((data) => {
                if (!alive) return;
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                if (!alive) return;
                push(apiMessage(err, 'Failed to load'), 'error');
                setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [fetcher, push, reloadKey]);

    // only ever called from event handlers, so the sync setState is fine here
    const load = useCallback(() => {
        setLoading(true);
        setReloadKey((key) => key + 1);
    }, []);

    const reset = () => {
        setForm(blankFrom(fields));
        setFiles({});
        setEditing(null);
    };

    const openCreate = () => {
        reset();
        setOpen(true);
    };

    const openEdit = (item) => {
        const base = fromItem ? fromItem(item) : item;
        const next = blankFrom(fields);
        for (const key of Object.keys(next)) {
            const value = base?.[key];
            // textarea fields hold one entry per line (experience highlights);
            // everything else is a comma-separated single line
            const isMultiline = fields.find((f) => f.name === key)?.type === 'textarea';
            next[key] = Array.isArray(value)
                ? value.join(isMultiline ? '\n' : ', ')
                : (value ?? next[key]);
        }
        setForm(next);
        setFiles({});
        setEditing(item);
        setOpen(true);
    };

    const change = (event) => {
        const { name, type, value, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const pickFile = (event) => {
        const { name, files: picked, multiple } = event.target;
        setFiles((prev) => ({ ...prev, [name]: multiple ? Array.from(picked) : picked[0] }));
    };

    const buildBody = () => {
        const source = toPayload ? toPayload(form) : form;
        if (!multipart) return source;

        const body = new FormData();
        for (const [key, value] of Object.entries(source)) {
            if (value !== undefined && value !== null && value !== '') body.append(key, value);
        }
        for (const [key, picked] of Object.entries(files)) {
            if (Array.isArray(picked)) picked.forEach((file) => body.append(key, file));
            else if (picked) body.append(key, picked);
        }
        return body;
    };

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const body = buildBody();
            if (editing) await update(editing._id, body);
            else await create(body);
            push(editing ? `${title} updated` : `${title} created`);
            setOpen(false);
            reset();
            load();
        } catch (err) {
            push(apiMessage(err, 'Save failed'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const destroy = async (item) => {
        try {
            await remove(item._id);
            push(`${title} deleted`);
            setConfirming(null);
            load();
        } catch (err) {
            push(apiMessage(err, 'Delete failed'), 'error');
        }
    };

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-semibold">{title}</h1>
                    {description && <p className="mt-1 text-sm text-mist-500">{description}</p>}
                </div>
                <motion.button
                    type="button"
                    onClick={openCreate}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full bg-glow-500 px-5 py-2.5 text-sm font-medium text-ink-950 shadow-[0_0_28px_-8px_rgba(139,92,246,0.8)] transition-colors hover:bg-glow-400"
                >
                    <Plus className="h-4 w-4" /> New
                </motion.button>
            </div>

            {loading ? (
                <Loader />
            ) : items.length === 0 ? (
                <EmptyState title={`No ${title.toLowerCase()} yet`} hint={`Create your first ${one} above.`} />
            ) : (
                <motion.ul layout className="grid gap-3">
                    <AnimatePresence mode="popLayout">
                        {items.map((item, i) => (
                            <motion.li
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.4, ease: EASE, delay: i * 0.03 }}
                                className="glass glow-ring flex items-center gap-4 rounded-xl p-4"
                            >
                                {thumbnail && (
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-850">
                                        {thumbnail(item) ? (
                                            <img
                                                src={thumbnail(item)}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-mist-100">
                                        {item[primary]}
                                    </p>
                                    {secondary && (
                                        <p className="truncate text-xs text-mist-500">{secondary(item)}</p>
                                    )}
                                </div>

                                <div className="flex shrink-0 gap-1.5">
                                    <button
                                        type="button"
                                        aria-label="Edit"
                                        onClick={() => openEdit(item)}
                                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-mist-400 transition-colors hover:border-glow-400/50 hover:text-glow-300"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Delete"
                                        onClick={() => setConfirming(item)}
                                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-mist-400 transition-colors hover:border-rose-500/50 hover:text-rose-400"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            )}

            {/* create / edit drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-[85] flex justify-end bg-ink-950/70 backdrop-blur-sm"
                    >
                        <motion.form
                            onSubmit={submit}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                            className="flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-ink-850"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                                <h2 className="font-display text-lg font-semibold">
                                    {editing ? `Edit ${one}` : `New ${one}`}
                                </h2>
                                <button
                                    type="button"
                                    aria-label="Close"
                                    onClick={() => setOpen(false)}
                                    className="grid h-8 w-8 place-items-center rounded-lg text-mist-500 hover:text-mist-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid flex-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2">
                                {fields.map((field) => (
                                    <Field
                                        key={field.name}
                                        field={{
                                            ...field,
                                            // images already exist when editing
                                            required: editing && field.type === 'file' ? false : field.required,
                                        }}
                                        value={form[field.name]}
                                        onChange={change}
                                        onFile={pickFile}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3 border-t border-white/10 px-6 py-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-glow-500 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-glow-400 disabled:opacity-60"
                                >
                                    {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl border border-white/10 px-5 text-sm text-mist-400 hover:text-mist-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* delete confirm */}
            <AnimatePresence>
                {confirming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setConfirming(null)}
                        className="fixed inset-0 z-[86] grid place-items-center bg-ink-950/75 px-6 backdrop-blur-sm"
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.94, y: 12 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.94, opacity: 0 }}
                            className="glass w-full max-w-sm rounded-2xl p-6"
                        >
                            <h3 className="font-display text-lg font-semibold">Delete this entry?</h3>
                            <p className="mt-2 text-sm text-mist-500">
                                “{confirming[primary]}” will be removed permanently, along with any
                                uploaded images.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => destroy(confirming)}
                                    className="flex-1 rounded-xl bg-rose-500/90 py-2.5 text-sm font-medium text-white hover:bg-rose-500"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirming(null)}
                                    className="rounded-xl border border-white/10 px-5 text-sm text-mist-400 hover:text-mist-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast toast={toast} />
        </div>
    );
}
