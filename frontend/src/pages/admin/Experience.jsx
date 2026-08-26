import ResourceManager from '../../components/admin/ResourceManager';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'title', label: 'Role / company', required: true },
    { name: 'liveUrl', label: 'Link', type: 'url', required: true },
    { name: 'description', label: 'What you worked on', type: 'textarea', rows: 4, required: true, wide: true },
    { name: 'techStack', label: 'Tech stack', required: true, wide: true, hint: 'Comma separated' },
    { name: 'imageUrl', label: 'Image', type: 'file', required: true, wide: true },
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
            secondary={(item) => item.techStack}
            thumbnail={(item) => item.imageUrl}
        />
    );
}
