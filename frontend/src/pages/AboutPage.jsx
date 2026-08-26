import { useSiteData } from '../context/SiteDataContext';
import PageShell from '../components/layout/PageShell';
import About from '../components/sections/About';
import Clients from '../components/sections/Clients';

export default function AboutPage() {
    const { data } = useSiteData();

    return (
        <PageShell path="/about" title="About">
            <About about={data.about} heading={data.headings.about} />
            <Clients clients={data.clients} />
        </PageShell>
    );
}
