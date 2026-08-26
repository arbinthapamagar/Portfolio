import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Field from './Field';
import Toast from './Toast';
import useToast from './useToast';
import Loader from '../ui/Loader';
import { apiMessage } from '../../lib/api';

// hero / about / footer are single documents — load once, edit in place
export default function SingletonForm({
    title,
    description,
    fields,
    fetcher,
    save,
    multipart = false,
    toPayload,
    extra,
}) {
    const [form, setForm] = useState({});
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [current, setCurrent] = useState(null);
    const { toast, push } = useToast();

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let alive = true;
        Promise.resolve(fetcher())
            .then((data) => {
                if (!alive) return;
                setCurrent(data);
                const next = {};
                for (const field of fields) {
                    if (field.type === 'file') continue;
                    const value = data?.[field.name];
                    next[field.name] =
                        field.type === 'checkbox'
                            ? Boolean(value)
                            : Array.isArray(value)
                              ? JSON.stringify(value)
                              : (value ?? '');
                }
                setForm(next);
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
    }, [fetcher, fields, push, reloadKey]);

    const load = useCallback(() => {
        setLoading(true);
        setReloadKey((key) => key + 1);
    }, []);

    const change = (event) => {
        const { name, type, value, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const pickFile = (event) => {
        const { name, files: picked } = event.target;
        setFiles((prev) => ({ ...prev, [name]: picked[0] }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const source = toPayload ? toPayload(form) : form;
            let body = source;
            if (multipart) {
                body = new FormData();
                for (const [key, value] of Object.entries(source)) {
                    if (value !== undefined && value !== null && value !== '') {
                        body.append(key, value);
                    }
                }
                for (const [key, file] of Object.entries(files)) {
                    if (file) body.append(key, file);
                }
            }
            await save(body);
            push(`${title} saved`);
            setFiles({});
            load();
        } catch (err) {
            push(apiMessage(err, 'Save failed'), 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold">{title}</h1>
                {description && <p className="mt-1 text-sm text-mist-500">{description}</p>}
            </div>

            <form onSubmit={submit} className="glass rounded-2xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    {fields.map((field) => (
                        <Field
                            key={field.name}
                            field={field}
                            value={form[field.name]}
                            onChange={change}
                            onFile={pickFile}
                        />
                    ))}
                </div>

                <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 rounded-xl bg-glow-500 px-6 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-glow-400 disabled:opacity-60"
                >
                    {saving ? 'Saving…' : 'Save changes'}
                </motion.button>
            </form>

            {extra?.(current, load, push)}

            <Toast toast={toast} />
        </div>
    );
}
