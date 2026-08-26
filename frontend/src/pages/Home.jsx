import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { publicApi } from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Testimonials from '../components/sections/Testimonials';
import Clients from '../components/sections/Clients';
import Contact from '../components/sections/Contact';
import ScrollProgress from '../components/motion/ScrollProgress';
import Cursor from '../components/motion/Cursor';

const EMPTY = {
    hero: null,
    about: null,
    footer: null,
    services: [],
    clients: [],
    projects: [],
    experience: [],
    testimonials: [],
    headings: {},
};

export default function Home() {
    const [data, setData] = useState(EMPTY);
    const [booted, setBooted] = useState(false);

    // one parallel fetch for the whole page; a failing section just stays empty
    useEffect(() => {
        let alive = true;

        const keys = Object.keys(EMPTY);
        Promise.allSettled([
            publicApi.hero(),
            publicApi.about(),
            publicApi.footer(),
            publicApi.services(),
            publicApi.clients(),
            publicApi.projects(),
            publicApi.experience(),
            publicApi.testimonials(),
            publicApi.headings(),
        ]).then((results) => {
            if (!alive) return;
            const next = { ...EMPTY };
            results.forEach((result, i) => {
                if (result.status === 'fulfilled' && result.value != null) {
                    next[keys[i]] = result.value;
                } else if (result.status === 'rejected') {
                    console.warn(`failed to load ${keys[i]}:`, result.reason?.message);
                }
            });
            setData(next);
            setBooted(true);
        });

        return () => {
            alive = false;
        };
    }, []);

    return (
        <div className="grain relative min-h-screen">
            <Cursor />
            <ScrollProgress />
            <Navbar resumeUrl={data.about?.resumeUrl} />

            <motion.main initial={{ opacity: 0 }} animate={{ opacity: booted ? 1 : 0 }} transition={{ duration: 0.5 }}>
                <Hero hero={data.hero} tickerItems={data.about?.tickerItems} />
                <About about={data.about} heading={data.headings.about} />
                <Skills services={data.services} heading={data.headings.skills} />
                <Projects projects={data.projects} heading={data.headings.projects} />
                <Experience experience={data.experience} heading={data.headings.experience} />
                <Clients clients={data.clients} />
                <Testimonials testimonials={data.testimonials} heading={data.headings.testimonials} />
                <Contact heading={data.headings.contact} footer={data.footer} />
            </motion.main>

            <Footer footer={data.footer} />
        </div>
    );
}
