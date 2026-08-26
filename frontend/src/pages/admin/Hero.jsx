import SingletonForm from '../../components/admin/SingletonForm';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'title', label: 'Title', required: true, hint: 'The last word is highlighted in violet' },
    { name: 'buttonText', label: 'Button text', required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 3, required: true, wide: true },
    { name: 'buttonLink', label: 'Button link', required: true, placeholder: '#projects' },
    { name: 'isActive', label: 'Active', type: 'checkbox', checkboxLabel: 'Hero is live' },
    { name: 'badgeImage1', label: 'Badge image 1', type: 'file' },
    { name: 'badgeImage2', label: 'Badge image 2', type: 'file' },
];

export default function AdminHero() {
    return (
        <SingletonForm
            title="Hero"
            description="The first thing visitors see above the fold."
            fields={FIELDS}
            fetcher={publicApi.hero}
            save={adminApi.saveHero}
            multipart
        />
    );
}
