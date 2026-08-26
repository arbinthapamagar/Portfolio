import Reveal from '../motion/Reveal';
import Marquee from '../motion/Marquee';

export default function Clients({ clients = [] }) {
    if (!clients.length) return null;

    const lead = clients[0];

    return (
        <section id="clients" className="relative border-y border-white/5 bg-ink-950/60 px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <div className="text-center">
                        <p className="font-mono text-[11px] tracking-[0.2em] text-mist-600 uppercase">
                            {lead?.heading || 'Trusted by'}
                        </p>
                        {lead?.subtitle && (
                            <p className="mx-auto mt-2 max-w-lg text-sm text-mist-500">
                                {lead.subtitle}
                            </p>
                        )}
                    </div>
                </Reveal>

                <div className="mt-10">
                    <Marquee
                        items={clients}
                        duration={26}
                        renderItem={(client) => (
                            <div className="group flex items-center gap-3 px-4 opacity-55 transition-opacity duration-300 hover:opacity-100">
                                {client.logo && (
                                    <img
                                        src={client.logo}
                                        alt={client.clientName}
                                        loading="lazy"
                                        className="h-9 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                                    />
                                )}
                                <span className="font-display text-sm font-medium whitespace-nowrap text-mist-300">
                                    {client.clientName}
                                </span>
                            </div>
                        )}
                    />
                </div>
            </div>
        </section>
    );
}
