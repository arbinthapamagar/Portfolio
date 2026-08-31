import ResourceManager from '../../components/admin/ResourceManager';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'title', label: 'Role', required: true, placeholder: 'Software Developer — Matat Technology' },
    { name: 'company', label: 'Company', placeholder: 'Matat' },
    { name: 'companyUrl', label: 'Company link', type: 'url', placeholder: 'https://matat.co.il/' },
    { name: 'period', label: 'Period', placeholder: 'Jul – Aug 2026' },
    { name: 'location', label: 'Location', placeholder: 'Kathmandu, Nepal' },
    { name: 'liveUrl', label: 'Product link', type: 'url' },
    { name: 'current', label: 'Current', type: 'checkbox', checkboxLabel: 'Still working on this' },
    { name: 'order', label: 'Sort order', type: 'number' },
    {
        name: 'description',
        label: 'What the role was',
        type: 'textarea',
        rows: 4,
        required: true,
        wide: true,
    },
    {
        name: 'highlights',
        label: 'Highlights',
        type: 'textarea',
        rows: 6,
        wide: true,
        hint: 'One per line — these become the numbered list on the detail page',
    },
    {
        name: 'products',
        label: 'Products worked on',
        type: 'textarea',
        rows: 9,
        wide: true,
        hint: 'Name | https://link | short summary, then what you did on it as dashed lines underneath. Each product renders as its own block on the role.',
    },
    { name: 'techStack', label: 'Tech stack', wide: true, hint: 'Comma separated' },
    { name: 'imageUrl', label: 'Image', type: 'file', wide: true },
];

export default function AdminExperience() {
    return (
        <ResourceManager
            title="Experience"
            singular="experience entry"
            description="Your work history timeline."
            fields={FIELDS}
            fetcher={publicApi.experience}
            create={adminApi.createExperience}
            update={adminApi.updateExperience}
            remove={adminApi.deleteExperience}
            multipart
            primary="title"
            secondary={(item) => [item.company, item.period].filter(Boolean).join(' · ')}
            thumbnail={(item) => item.imageUrl}
        />
    );
}
