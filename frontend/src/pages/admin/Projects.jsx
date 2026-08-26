import ResourceManager from '../../components/admin/ResourceManager';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'title', label: 'Title', required: true },
    { name: 'role', label: 'Your role', placeholder: 'Solo developer' },
    { name: 'description', label: 'One-line description', type: 'textarea', rows: 3, required: true, wide: true },
    { name: 'problemSolved', label: 'Problem it solved', type: 'textarea', rows: 3, required: true, wide: true },
    { name: 'stack', label: 'Stack', required: true, wide: true, hint: 'Comma separated — React, Node.js, MongoDB' },
    { name: 'liveDemo', label: 'Live demo URL', type: 'url' },
    { name: 'github', label: 'GitHub URL', type: 'url' },
    { name: 'demoVideo', label: 'Demo video embed URL', type: 'url', wide: true },
    { name: 'order', label: 'Sort order', type: 'number' },
    { name: 'featured', label: 'Featured', type: 'checkbox', checkboxLabel: 'Pin to the top' },
    { name: 'screenshots', label: 'Screenshots', type: 'file', multiple: true, wide: true, hint: 'Up to 6. Uploading replaces the existing set.' },
];

export default function AdminProjects() {
    return (
        <ResourceManager
            title="Projects"
            singular="project"
            description="The case studies shown on your portfolio."
            fields={FIELDS}
            fetcher={publicApi.projects}
            create={adminApi.createProject}
            update={adminApi.updateProject}
            remove={adminApi.deleteProject}
            multipart
            primary="title"
            secondary={(item) => item.stack?.join(' · ')}
            thumbnail={(item) => item.screenshots?.[0]?.url}
            // the controller reads links as flat liveDemo / github fields
            fromItem={(item) => ({
                ...item,
                liveDemo: item.links?.liveDemo || '',
                github: item.links?.github || '',
            })}
        />
    );
}
