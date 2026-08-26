import { useSiteData } from '../context/SiteDataContext';
import PageShell from '../components/layout/PageShell';
import About from '../components/sections/About';
import Education from '../components/sections/Education';
import Clients from '../components/sections/Clients';

export default function AboutPage() {
    const { data } = useSiteData();

    return (
        <PageShell path="/about" title="About">
            <About
                about={data.about}
                heading={data.headings.about}
                projects={data.projects}
                experience={data.experience}
                education={data.education}
                services={data.services}
                footer={data.footer}
            />
            <Education education={data.education} heading={data.headings.education} />
            <Clients clients={data.clients} />
        </PageShell>
    );
}
