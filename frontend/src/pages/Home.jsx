import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import GithubProfile from '../components/sections/GithubProfile';
import Experience from '../components/sections/Experience';
import Education from '../components/sections/Education';
import Testimonials from '../components/sections/Testimonials';
import Clients from '../components/sections/Clients';
import Contact from '../components/sections/Contact';
import Magnetic from '../components/motion/Magnetic';
import { EASE } from '../components/motion/variants';

// each home section doubles as a teaser for its own page
function SeeAll({ to, label }) {
    return (
        <div className="mx-auto -mt-16 max-w-6xl px-6 pb-16">
            <Magnetic strength={0.2} className="inline-block">
                <Link
                    to={to}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-base font-medium text-mist-200 transition-colors hover:border-glow-400/50 hover:text-mist-100"
                >
                    {label}
                    <motion.span
                        aria-hidden="true"
                        className="inline-block"
                        initial={false}
                        whileHover={{ x: 3, y: -3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </motion.span>
                </Link>
            </Magnetic>
        </div>
    );
}

export default function Home() {
    const { data, booted } = useSiteData();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: booted ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
        >
            <Hero hero={data.hero} tickerItems={data.about?.tickerItems} />

            <About
                about={data.about}
                heading={data.headings.about}
                projects={data.projects}
                experience={data.experience}
                education={data.education}
                services={data.services}
                footer={data.footer}
            />
            <SeeAll to="/about" label="More about me" />

            <Skills services={data.services} heading={data.headings.skills} />
            <SeeAll to="/skills" label="See the full stack" />

            <Projects projects={data.projects} heading={data.headings.projects} limit={6} />
            <SeeAll to="/projects" label="Browse all projects" />

            {/* the curated projects above are the pitch; this is the live feed */}
            <GithubProfile githubUrl={data.footer?.githubUrl} heading={data.headings.github} />

            <Experience experience={data.experience} heading={data.headings.experience} />
            <Education education={data.education} heading={data.headings.education} />
            <SeeAll to="/experience" label="Full experience & testimonials" />

            <Clients clients={data.clients} />
            <Testimonials testimonials={data.testimonials} heading={data.headings.testimonials} />
            <Contact heading={data.headings.contact} footer={data.footer} />
        </motion.div>
    );
}
