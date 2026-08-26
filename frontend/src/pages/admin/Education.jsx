import ResourceManager from '../../components/admin/ResourceManager';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'title', label: 'Qualification', required: true, placeholder: 'BSc (Hons) in Information Technology' },
    { name: 'institution', label: 'Institution', placeholder: 'Texas College of Management and IT' },
    { name: 'affiliation', label: 'Affiliation', placeholder: 'Affiliated with Lincoln University' },
    { name: 'institutionUrl', label: 'Institution link', type: 'url' },
    { name: 'period', label: 'Period', placeholder: 'Graduated 2026' },
    { name: 'location', label: 'Location', placeholder: 'Kathmandu, Nepal' },
    { name: 'kind', label: 'Kind', placeholder: 'degree', hint: 'degree, training or certification — picks the icon' },
    { name: 'status', label: 'Status badge', placeholder: 'Graduated' },
    { name: 'order', label: 'Sort order', type: 'number' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3, wide: true },
    {
        name: 'highlights',
        label: 'What it covered',
        type: 'textarea',
        rows: 5,
        wide: true,
        hint: 'One point per line',
    },
    { name: 'techStack', label: 'Tech covered', wide: true, hint: 'Comma separated' },
    { name: 'isActive', label: 'Visible', type: 'checkbox', checkboxLabel: 'Show on the site' },
];

export default function AdminEducation() {
    return (
        <ResourceManager
            title="Education"
            singular="education entry"
            description="Degrees, training and certifications."
            fields={FIELDS}
            fetcher={publicApi.education}
            create={adminApi.createEducation}
            update={adminApi.updateEducation}
            remove={adminApi.deleteEducation}
            primary="title"
            secondary={(item) => [item.institution, item.period].filter(Boolean).join(' · ')}
        />
    );
}
