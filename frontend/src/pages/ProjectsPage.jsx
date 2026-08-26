import { useSiteData } from '../context/SiteDataContext';
import PageShell from '../components/layout/PageShell';
import Projects from '../components/sections/Projects';

export default function ProjectsPage() {
    const { data } = useSiteData();

    return (
        <PageShell path="/projects" title="Projects">
            <Projects projects={data.projects} heading={data.headings.projects} />
        </PageShell>
    );
}
