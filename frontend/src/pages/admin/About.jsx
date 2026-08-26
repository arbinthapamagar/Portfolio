import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import SingletonForm from '../../components/admin/SingletonForm';
import { adminApi, apiMessage, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'headingLine1', label: 'Heading line 1', placeholder: 'Who I' },
    { name: 'headingLine2', label: 'Heading line 2', placeholder: 'am.' },
    { name: 'title', label: 'Title', required: true, wide: true },
    { name: 'description', label: 'Description', type: 'textarea', rows: 5, required: true, wide: true },
    { name: 'mission', label: 'Mission / pull quote', type: 'textarea', rows: 3, required: true, wide: true },
    { name: 'ctaLabel', label: 'CTA label', placeholder: 'Download résumé' },
    { name: 'ctaNote', label: 'CTA note', placeholder: 'PDF · 120kb' },
    {
        name: 'stats',
        label: 'Stats',
        type: 'textarea',
        rows: 3,
        wide: true,
        hint: 'JSON array — [{"value":"3+","label":"Years building"}]',
    },
    {
        name: 'tickerItems',
        label: 'Ticker items',
        type: 'textarea',
        rows: 3,
        wide: true,
        hint: 'JSON array — [{"text":"React"},{"text":"Node.js"}]',
    },
    { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'About is live' },
    { name: 'photo', label: 'Portrait photo', type: 'file' },
];

// the resume is a separate endpoint, so it gets its own little panel below the form
function ResumePanel(current, reload, push) {
    return <ResumeUploader current={current} reload={reload} push={push} />;
}

function ResumeUploader({ current, reload, push }) {
    const [file, setFile] = useState(null);
    const [busy, setBusy] = useState(false);

    const upload = async () => {
        if (!file) return;
        setBusy(true);
        try {
            const body = new FormData();
            body.append('resume', file);
            await adminApi.uploadResume(body);
            push('Résumé uploaded');
            setFile(null);
            reload();
        } catch (err) {
            push(apiMessage(err, 'Résumé upload failed'), 'error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="glass mt-6 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold">Résumé</h2>
            <p className="mt-1 text-sm text-mist-500">
                A PDF recruiters can download from the nav and about section.
            </p>

            {current?.resumeUrl && (
                <a
                    href={current.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-glow-300 hover:text-glow-200"
                >
                    <Download className="h-3.5 w-3.5" /> Current résumé
                </a>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="flex-1 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm text-mist-400 file:mr-3 file:rounded-lg file:border-0 file:bg-glow-500/20 file:px-3 file:py-1.5 file:text-xs file:text-glow-200"
                />
                <button
                    type="button"
                    onClick={upload}
                    disabled={!file || busy}
                    className="inline-flex items-center gap-2 rounded-xl bg-glow-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-glow-400 disabled:opacity-50"
                >
                    <Upload className="h-4 w-4" />
                    {busy ? 'Uploading…' : 'Upload'}
                </button>
            </div>
        </div>
    );
}

export default function AdminAbout() {
    return (
        <SingletonForm
            title="About"
            description="Your bio, stats and résumé."
            fields={FIELDS}
            fetcher={publicApi.about}
            save={adminApi.saveAbout}
            multipart
            extra={ResumePanel}
        />
    );
}
