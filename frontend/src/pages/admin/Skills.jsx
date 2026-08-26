import ResourceManager from '../../components/admin/ResourceManager';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'title', label: 'Group title', required: true, placeholder: 'Frontend' },
    { name: 'icon', label: 'Icon', placeholder: 'code', hint: 'A lucide icon name — code, server, database, wrench' },
    { name: 'description', label: 'Short description', type: 'textarea', rows: 2, wide: true },
    {
        name: 'details',
        label: 'Detail copy',
        type: 'textarea',
        rows: 4,
        wide: true,
        hint: 'Shown when a visitor opens the group on the public site',
    },
    {
        name: 'highlights',
        label: 'What you built with it',
        type: 'textarea',
        rows: 5,
        wide: true,
        hint: 'One point per line — shown as a checklist under the detail copy',
    },
    { name: 'items', label: 'Technologies', required: true, wide: true, hint: 'Comma separated — React, Tailwind, Vite' },
    { name: 'order', label: 'Sort order', type: 'number' },
    { name: 'isActive', label: 'Visible', type: 'checkbox', checkboxLabel: 'Show on the site' },
];

export default function AdminSkills() {
    return (
        <ResourceManager
            title="Skills"
            singular="skill group"
            description="The tech-stack cards grouped by area."
            fields={FIELDS}
            fetcher={publicApi.services}
            create={adminApi.createService}
            update={adminApi.updateService}
            remove={adminApi.deleteService}
            primary="title"
            secondary={(item) => item.items?.join(', ')}
        />
    );
}
