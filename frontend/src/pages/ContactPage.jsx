import { useSiteData } from '../context/SiteDataContext';
import PageShell from '../components/layout/PageShell';
import Contact from '../components/sections/Contact';

export default function ContactPage() {
    const { data } = useSiteData();

    return (
        <PageShell path="/contact" title="Contact">
            <Contact heading={data.headings.contact} footer={data.footer} />
        </PageShell>
    );
}
