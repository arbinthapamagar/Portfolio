const BASE =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-mist-100 outline-none transition-colors placeholder:text-mist-600 focus:border-glow-400/60 focus:bg-white/[0.05]';

// one input renderer for every admin form
export default function Field({ field, value, onChange, onFile }) {
    const { name, label, type = 'text', placeholder, required, hint, options, multiple } = field;

    return (
        <label className={`block ${field.wide ? 'sm:col-span-2' : ''}`}>
            <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-mist-500 uppercase">
                {label}
                {required && <span className="ml-1 text-glow-400">*</span>}
            </span>

            {type === 'textarea' && (
                <textarea
                    name={name}
                    rows={field.rows || 4}
                    required={required}
                    value={value ?? ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${BASE} resize-none`}
                />
            )}

            {type === 'file' && (
                <input
                    name={name}
                    type="file"
                    accept={field.accept || 'image/*'}
                    multiple={multiple}
                    onChange={onFile}
                    className="w-full rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm text-mist-400 file:mr-3 file:rounded-lg file:border-0 file:bg-glow-500/20 file:px-3 file:py-1.5 file:text-xs file:text-glow-200 hover:border-glow-400/40"
                />
            )}

            {type === 'checkbox' && (
                <span className="flex items-center gap-2.5 pt-1">
                    <input
                        name={name}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={onChange}
                        className="h-4 w-4 accent-[var(--color-glow-500)]"
                    />
                    <span className="text-sm text-mist-400">{field.checkboxLabel || 'Enabled'}</span>
                </span>
            )}

            {type === 'select' && (
                <select name={name} value={value ?? ''} onChange={onChange} className={BASE}>
                    {(options || []).map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-ink-800">
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}

            {!['textarea', 'file', 'checkbox', 'select'].includes(type) && (
                <input
                    name={name}
                    type={type}
                    required={required}
                    value={value ?? ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={BASE}
                />
            )}

            {hint && <span className="mt-1 block text-[11px] text-mist-600">{hint}</span>}
        </label>
    );
}
