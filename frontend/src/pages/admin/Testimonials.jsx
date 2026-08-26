import ResourceManager from '../../components/admin/ResourceManager';
import { adminApi, publicApi } from '../../lib/api';

const FIELDS = [
    { name: 'name', label: 'Name', required: true },
    { name: 'company', label: 'Company', required: true },
    { name: 'reviewText', label: 'Review', type: 'textarea', rows: 4, required: true, wide: true },
    { name: 'rating', label: 'Rating (0-5)', type: 'number' },
    { name: 'avatar', label: 'Avatar', type: 'file', required: true },
];

export default function AdminTestimonials() {
    return (
        <ResourceManager
            title="Testimonials"
            singular="testimonial"
            description="Client reviews shown in the carousel."
            fields={FIELDS}
            fetcher={publicApi.testimonials}
            create={adminApi.createTestimonial}
            update={adminApi.updateTestimonial}
            remove={adminApi.deleteTestimonial}
            multipart
            primary="name"
            secondary={(item) => item.company}
            thumbnail={(item) => item.avatar}
        />
    );
}
