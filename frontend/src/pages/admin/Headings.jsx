import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { adminApi, apiMessage, publicApi } from '../../lib/api';
import Loader from '../../components/ui/Loader';
import Toast from '../../components/admin/Toast';
import useToast from '../../components/admin/useToast';
import { EASE } from '../../components/motion/variants';

// the sections the public page actually looks up headings for
const SECTIONS = [
    { key: 'about', label: 'About' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'contact', label: 'Contact' },
];

const BLANK = { label: '', titlePlain: '', titleHighlight: '', subtitle: '' };
const INPUT =
    'w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none transition-colors focus:border-glow-400/60';

export default function AdminHeadings() {
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState(null);
    const { toast, push } = useToast();

    useEffect(() => {
        let alive = true;
        publicApi
            .headings()
            .then((headings) => {
                if (!alive) return;
                const next = {};
                for (const { key } of SECTIONS) {
                    const row = headings?.[key];
                    next[key] = {
                        label: row?.label ?? '',
                        titlePlain: row?.titlePlain ?? '',
                        titleHighlight: row?.titleHighlight ?? '',
                        subtitle: row?.subtitle ?? '',
                    };
                }
                setValues(next);
                setLoading(false);
            })
            .catch((err) => {
                if (!alive) return;
                push(apiMessage(err, 'Failed to load headings'), 'error');
                setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [push]);

    const change = (section, field, value) =>
        setValues((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

    const save = async (section) => {
        setSavingKey(section);
        try {
            await adminApi.saveHeading({ section, ...(values[section] || BLANK) });
            push(`${section} heading saved`);
        } catch (err) {
            push(apiMessage(err, 'Save failed'), 'error');
        } finally {
            setSavingKey(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold">Section headings</h1>
                <p className="mt-1 text-sm text-mist-500">
                    The eyebrow, title and subtitle above each section. The highlight half renders in
                    the violet gradient. Leave blank to use the built-in defaults.
                </p>
            </div>

            <div className="grid gap-4">
                {SECTIONS.map(({ key, label }, i) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                        className="glass rounded-2xl p-5"
                    >
                        <h2 className="mb-4 font-display text-base font-semibold">{label}</h2>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <input
                                value={values[key]?.label ?? ''}
                                onChange={(e) => change(key, 'label', e.target.value)}
                                placeholder="Eyebrow"
                                className={INPUT}
                            />
                            <input
                                value={values[key]?.titlePlain ?? ''}
                                onChange={(e) => change(key, 'titlePlain', e.target.value)}
                                placeholder="Title (plain)"
                                className={INPUT}
                            />
                            <input
                                value={values[key]?.titleHighlight ?? ''}
                                onChange={(e) => change(key, 'titleHighlight', e.target.value)}
                                placeholder="Title (highlighted)"
                                className={INPUT}
                            />
                            <input
                                value={values[key]?.subtitle ?? ''}
                                onChange={(e) => change(key, 'subtitle', e.target.value)}
                                placeholder="Subtitle"
                                className={`${INPUT} sm:col-span-3`}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => save(key)}
                            disabled={savingKey === key}
                            className="mt-4 rounded-lg bg-glow-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-glow-400 disabled:opacity-60"
                        >
                            {savingKey === key ? 'Saving…' : 'Save'}
                        </button>
                    </motion.div>
                ))}
            </div>

            <Toast toast={toast} />
        </div>
    );
}
