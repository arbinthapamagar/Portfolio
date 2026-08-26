import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Clock, Mail, MapPin, Phone, Send, TriangleAlert } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons';
import { apiMessage, publicApi } from '../../lib/api';
import SectionHeader from '../ui/SectionHeader';
import GlowButton from '../ui/GlowButton';
import Reveal from '../motion/Reveal';
import { EASE, fadeUp, stagger } from '../motion/variants';

const FIELDS = [
    { name: 'name', label: 'Your name', type: 'text', placeholder: 'Jane Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@company.com' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Project enquiry' },
];

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function Contact({ heading, footer }) {
    const [form, setForm] = useState(EMPTY);
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [error, setError] = useState('');

    const update = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setStatus('sending');
        setError('');
        try {
            await publicApi.sendContact(form);
            setStatus('sent');
            setForm(EMPTY);
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            setError(apiMessage(err, 'Could not send your message'));
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="relative overflow-hidden px-6 py-28 lg:py-36">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 h-[26rem] w-[50rem] -translate-x-1/2 rounded-full opacity-45 blur-[140px]"
                style={{ background: 'radial-gradient(circle, rgba(111,92,216,0.26), transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-6xl">
                <SectionHeader
                    heading={heading}
                    fallback={{
                        label: 'Contact',
                        titlePlain: 'Let us build',
                        titleHighlight: 'something.',
                        subtitle:
                            'Got a project, a role, or a rough idea? Send it over — I read everything.',
                    }}
                />

                <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                    <motion.div
                        variants={stagger(0.1)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        className="flex flex-col gap-4"
                    >
                        {footer?.email && (
                            <motion.a
                                variants={fadeUp}
                                href={`mailto:${footer.email}`}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                                className="glass glow-ring flex items-center gap-4 rounded-2xl p-5"
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-glow-500/15 text-glow-300">
                                    <Mail className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                        Email
                                    </span>
                                    <span className="block truncate text-sm text-mist-200">
                                        {footer.email}
                                    </span>
                                </span>
                            </motion.a>
                        )}

                        {footer?.location && (
                            <motion.div
                                variants={fadeUp}
                                className="glass flex items-center gap-4 rounded-2xl p-5"
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-berry-400/15 text-berry-400">
                                    <MapPin className="h-4 w-4" />
                                </span>
                                <span>
                                    <span className="block font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                        Based in
                                    </span>
                                    <span className="block text-sm text-mist-200">{footer.location}</span>
                                </span>
                            </motion.div>
                        )}

                        {footer?.phone && (
                            <motion.a
                                variants={fadeUp}
                                href={`tel:${String(footer.phone).replace(/\s+/g, '')}`}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                                className="glass flex items-center gap-4 rounded-2xl p-5"
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-glow-500/15 text-glow-300">
                                    <Phone className="h-4 w-4" />
                                </span>
                                <span>
                                    <span className="block font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                        Phone
                                    </span>
                                    <span className="block text-sm text-mist-200">{footer.phone}</span>
                                </span>
                            </motion.a>
                        )}

                        {/* balances the column against the form, and answers the
                            question everyone actually has before writing */}
                        <motion.div
                            variants={fadeUp}
                            className="glass glow-ring rounded-2xl p-5"
                        >
                            <div className="flex items-center gap-4">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/12 text-emerald-300">
                                    <Clock className="h-4 w-4" />
                                </span>
                                <span>
                                    <span className="block font-mono text-[10px] tracking-widest text-mist-600 uppercase">
                                        Availability
                                    </span>
                                    <span className="flex items-center gap-2 text-sm text-mist-200">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        </span>
                                        Open to work
                                    </span>
                                </span>
                            </div>
                            <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs leading-relaxed text-mist-500">
                                Software development and AI/RAG work, freelance or full time. I read every
                                message and usually reply within a day.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex gap-2.5">
                            {footer?.githubUrl && (
                                <motion.a
                                    href={footer.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub"
                                    whileHover={{ y: -4 }}
                                    className="glass flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl text-mist-300 transition-colors hover:text-glow-300"
                                >
                                    <Github className="h-4 w-4" />
                                    <span className="font-mono text-xs">GitHub</span>
                                </motion.a>
                            )}
                            {footer?.linkedinUrl && (
                                <motion.a
                                    href={footer.linkedinUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                    whileHover={{ y: -4 }}
                                    className="glass flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl text-mist-300 transition-colors hover:text-glow-300"
                                >
                                    <Linkedin className="h-4 w-4" />
                                    <span className="font-mono text-xs">LinkedIn</span>
                                </motion.a>
                            )}
                        </motion.div>
                    </motion.div>

                    <Reveal direction="right" distance={40}>
                        <form onSubmit={submit} className="glass glow-ring rounded-2xl p-6 sm:p-8">
                            <div className="grid gap-5 sm:grid-cols-2">
                                {FIELDS.map((field) => (
                                    <div
                                        key={field.name}
                                        className={field.name === 'subject' ? 'sm:col-span-2' : ''}
                                    >
                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block font-mono text-[10px] tracking-widest text-mist-500 uppercase"
                                        >
                                            {field.label}
                                        </label>
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type={field.type}
                                            required
                                            value={form[field.name]}
                                            onChange={update}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist-100 transition-colors outline-none placeholder:text-mist-600 focus:border-glow-400/60 focus:bg-white/[0.05]"
                                        />
                                    </div>
                                ))}

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block font-mono text-[10px] tracking-widest text-mist-500 uppercase"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={update}
                                        placeholder="Tell me what you are building..."
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist-100 transition-colors outline-none placeholder:text-mist-600 focus:border-glow-400/60 focus:bg-white/[0.05]"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                <GlowButton type="submit" disabled={status === 'sending'} magnetic={false}>
                                    {status === 'sending' ? 'Sending…' : 'Send message'}
                                    <Send className="h-4 w-4" />
                                </GlowButton>

                                <AnimatePresence mode="wait">
                                    {status === 'sent' && (
                                        <motion.p
                                            key="sent"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ ease: EASE }}
                                            className="inline-flex items-center gap-1.5 text-sm text-emerald-400"
                                        >
                                            <Check className="h-4 w-4" /> Message sent — I will reply soon.
                                        </motion.p>
                                    )}
                                    {status === 'error' && (
                                        <motion.p
                                            key="error"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="inline-flex items-center gap-1.5 text-sm text-rose-400"
                                        >
                                            <TriangleAlert className="h-4 w-4" /> {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
