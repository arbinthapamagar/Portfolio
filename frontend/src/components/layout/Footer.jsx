import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Facebook, Github, Instagram, Linkedin, Tiktok, Twitter } from '../ui/BrandIcons';
import Reveal from '../motion/Reveal';
import githubAvatar from '../../assets/github-avatar.jpg';

const SOCIALS = [
    { key: 'githubUrl', Icon: Github, label: 'GitHub' },
    { key: 'linkedinUrl', Icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitterUrl', Icon: Twitter, label: 'Twitter' },
    { key: 'instagramUrl', Icon: Instagram, label: 'Instagram' },
    { key: 'facebookUrl', Icon: Facebook, label: 'Facebook' },
    { key: 'tiktokUrl', Icon: Tiktok, label: 'TikTok' },
];

export default function Footer({ footer, photo }) {
    const links = SOCIALS.filter((s) => footer?.[s.key]);

    // the handle is read off the GitHub url rather than written twice
    const githubUrl = footer?.githubUrl;
    const handle = githubUrl ? `@${githubUrl.replace(/\/+$/, '').split('/').pop()}` : '';

    const profile = (
        <>
            <span className="relative shrink-0">
                <img
                    src={photo || githubAvatar}
                    alt="Arbeen Thapa Magar"
                    loading="lazy"
                    className="h-14 w-14 rounded-full border border-white/12 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* same signal the hero opens with, at avatar scale */}
                <span
                    aria-hidden="true"
                    className="absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-ink-950 bg-emerald-400"
                />
            </span>
            <span className="min-w-0">
                {handle && (
                    <span className="block truncate font-display text-base font-semibold text-mist-100 transition-colors group-hover:text-glow-300">
                        {handle}
                    </span>
                )}
                <span className="mt-0.5 block font-mono text-[10px] tracking-[0.18em] text-mist-600 uppercase">
                    {footer?.location || 'Available for work'}
                </span>
            </span>
        </>
    );

    return (
        <footer className="relative overflow-hidden border-t border-white/5 bg-ink-950">
            {/* oversized wordmark bleeding off the bottom edge */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-6 select-none">
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 0.045, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center font-display text-[18vw] leading-none font-bold tracking-tighter text-mist-100"
                >
                    ARBEEN
                </motion.p>
            </div>

            <div className="relative mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-10 md:grid-cols-3">
                    <Reveal>
                        {/* profile card: the portrait from the about column at avatar
                            scale, pointing back at the GitHub profile it came from */}
                        {githubUrl ? (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group inline-flex items-center gap-4"
                            >
                                {profile}
                            </a>
                        ) : (
                            <div className="group inline-flex items-center gap-4">{profile}</div>
                        )}

                        <p className="mt-5 font-display text-lg font-semibold">{footer?.tagline}</p>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist-500">
                            Building fast, well-structured web platforms — from REST APIs to the
                            interfaces on top of them.
                        </p>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <h3 className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            Get in touch
                        </h3>
                        <ul className="mt-4 space-y-2.5 text-sm text-mist-300">
                            {footer?.email && (
                                <li>
                                    <a
                                        href={`mailto:${footer.email}`}
                                        className="inline-flex items-center gap-2 transition-colors hover:text-glow-300"
                                    >
                                        <Mail className="h-3.5 w-3.5" /> {footer.email}
                                    </a>
                                </li>
                            )}
                            {footer?.phone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5" /> {footer.phone}
                                </li>
                            )}
                            {footer?.location && (
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5" /> {footer.location}
                                </li>
                            )}
                        </ul>
                    </Reveal>

                    <Reveal delay={0.16}>
                        <h3 className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            Elsewhere
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                            {links.map(({ key, Icon, label }) => (
                                <motion.a
                                    key={key}
                                    href={footer[key]}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    whileHover={{ y: -4, scale: 1.08 }}
                                    whileTap={{ scale: 0.94 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-mist-300 transition-colors hover:border-glow-400/50 hover:text-glow-300"
                                >
                                    <Icon className="h-4 w-4" />
                                </motion.a>
                            ))}
                        </div>
                    </Reveal>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-mist-600 sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} {footer?.copyright}
                    </p>
                    <Link to="/admin/login" className="transition-colors hover:text-mist-300">
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
}
