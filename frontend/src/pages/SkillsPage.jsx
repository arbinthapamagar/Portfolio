import { useSiteData } from '../context/SiteDataContext';
import PageShell from '../components/layout/PageShell';
import Skills from '../components/sections/Skills';

export default function SkillsPage() {
    const { data } = useSiteData();

    return (
        <PageShell path="/skills" title="Skills">
            <Skills services={data.services} heading={data.headings.skills} />
        </PageShell>
    );
}
