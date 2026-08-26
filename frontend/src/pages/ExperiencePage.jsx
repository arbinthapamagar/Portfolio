import { useSiteData } from '../context/SiteDataContext';
import PageShell from '../components/layout/PageShell';
import Experience from '../components/sections/Experience';
import Testimonials from '../components/sections/Testimonials';

export default function ExperiencePage() {
    const { data } = useSiteData();

    return (
        <PageShell path="/experience" title="Experience">
            <Experience experience={data.experience} heading={data.headings.experience} />
            <Testimonials testimonials={data.testimonials} heading={data.headings.testimonials} />
        </PageShell>
    );
}
