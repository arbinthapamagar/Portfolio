import ResourceManager from '../../components/admin/ResourceManager';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'clientName', label: 'Client name', required: true },
    { name: 'heading', label: 'Section heading', required: true, hint: 'Only the first client’s heading is shown' },
    { name: 'subtitle', label: 'Section subtitle', type: 'textarea', rows: 2, required: true, wide: true },
    { name: 'logo', label: 'Logo', type: 'file', required: true, wide: true },
];

export default function AdminClients() {
    return (
        <ResourceManager
            title="Clients"
            singular="client"
            description="Logos shown on the trusted-by marquee."
            fields={FIELDS}
            fetcher={publicApi.clients}
            create={adminApi.createClient}
            update={adminApi.updateClient}
            remove={adminApi.deleteClient}
            multipart
            primary="clientName"
            secondary={(item) => item.heading}
            thumbnail={(item) => item.logo}
        />
    );
}
