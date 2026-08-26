import SingletonForm from '../../components/admin/SingletonForm';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'tagline', label: 'Tagline', wide: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'location', label: 'Location' },
    { name: 'copyright', label: 'Copyright' },
    { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
    { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
    { name: 'twitterUrl', label: 'Twitter URL', type: 'url' },
    { name: 'instagramUrl', label: 'Instagram URL', type: 'url' },
    { name: 'facebookUrl', label: 'Facebook URL', type: 'url' },
    { name: 'tiktokUrl', label: 'TikTok URL', type: 'url' },
];

export default function AdminFooter() {
    return (
        <SingletonForm
            title="Footer"
            description="Contact details and social links."
            fields={FIELDS}
            fetcher={publicApi.footer}
            save={adminApi.saveFooter}
        />
    );
}
