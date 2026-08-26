import axios from 'axios';

// vite proxies /api -> http://localhost:8000 in dev (see vite.config.js)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    withCredentials: true,
});

const TOKEN_KEY = 'portfolio_access_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// the backend sets secure cookies, which browsers drop on http://localhost,
// so we also carry the access token in the Authorization header
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401 && window.location.pathname.startsWith('/admin')) {
            clearToken();
            if (window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// every controller wraps its payload in apiResponse -> { data: { ... } }
export const unwrap = (response) => response?.data?.data;

export const apiMessage = (error, fallback = 'Something went wrong') =>
    error?.response?.data?.message?.trim() || error?.message || fallback;

/* ---------------- public reads ---------------- */
export const publicApi = {
    hero: () => api.get('/hero/getHero').then(unwrap),
    about: () => api.get('/about/getAbout').then(unwrap),
    footer: () => api.get('/footer/getFooter').then(unwrap),
    services: () => api.get('/service/getService').then((r) => unwrap(r)?.services ?? []),
    clients: () => api.get('/client/getClient').then((r) => unwrap(r)?.clients ?? []),
    projects: () => api.get('/project/getProject?limit=0').then((r) => unwrap(r)?.projects ?? []),
    project: (id) => api.get(`/project/getProject/${id}`).then(unwrap),
    experience: () =>
        api.get('/experience/getExperience?limit=0').then((r) => unwrap(r)?.experience ?? []),
    experienceItem: (id) => api.get(`/experience/getExperience/${id}`).then(unwrap),
    education: () => api.get('/education/getEducation').then((r) => unwrap(r)?.education ?? []),
    testimonials: () =>
        api.get('/testimonial/getTestimonial?limit=0').then((r) => unwrap(r)?.testimonials ?? []),
    headings: () => api.get('/sectionHeading/getSectionHeading').then((r) => unwrap(r)?.headings ?? {}),
    sendContact: (payload) => api.post('/contact/contact-us', payload).then(unwrap),
};

/* ---------------- admin ---------------- */
export const adminApi = {
    login: (payload) => api.post('/admin/login', payload).then(unwrap),
    logout: () => api.post('/admin/logout').then(unwrap),
    avatar: () => api.get('/admin/getAvatar').then(unwrap),

    messages: (page = 1) =>
        api.get(`/contact/getContactMessage?page=${page}`).then(unwrap),
    deleteMessage: (id) => api.delete(`/contact/deleteContact/${id}`).then(unwrap),

    saveHero: (formData) => api.post('/hero/hero', formData).then(unwrap),
    saveAbout: (formData) => api.post('/about/about', formData).then(unwrap),
    uploadResume: (formData) => api.post('/about/resume', formData).then(unwrap),
    saveFooter: (payload) => api.post('/footer/footer', payload).then(unwrap),
    saveHeading: (payload) => api.post('/sectionHeading/sectionHeading', payload).then(unwrap),
    deleteHeading: (section) =>
        api.delete(`/sectionHeading/sectionHeadingDelete/${section}`).then(unwrap),

    createProject: (formData) => api.post('/project/project', formData).then(unwrap),
    updateProject: (id, formData) => api.patch(`/project/projectEdit/${id}`, formData).then(unwrap),
    deleteProject: (id) => api.delete(`/project/projectDelete/${id}`).then(unwrap),

    createExperience: (formData) => api.post('/experience/experience', formData).then(unwrap),
    updateExperience: (id, formData) =>
        api.patch(`/experience/experienceEdit/${id}`, formData).then(unwrap),
    deleteExperience: (id) => api.delete(`/experience/experienceDelete/${id}`).then(unwrap),

    createTestimonial: (formData) => api.post('/testimonial/testimonial', formData).then(unwrap),
    updateTestimonial: (id, formData) =>
        api.patch(`/testimonial/testimonialEdit/${id}`, formData).then(unwrap),
    deleteTestimonial: (id) => api.delete(`/testimonial/testimonialDelete/${id}`).then(unwrap),

    createEducation: (payload) => api.post('/education/education', payload).then(unwrap),
    updateEducation: (id, payload) =>
        api.patch(`/education/educationEdit/${id}`, payload).then(unwrap),
    deleteEducation: (id) => api.delete(`/education/educationDelete/${id}`).then(unwrap),

    createService: (payload) => api.post('/service/service', payload).then(unwrap),
    updateService: (id, payload) => api.patch(`/service/serviceEdit/${id}`, payload).then(unwrap),
    deleteService: (id) => api.delete(`/service/serviceDelete/${id}`).then(unwrap),

    createClient: (formData) => api.post('/client/client', formData).then(unwrap),
    updateClient: (id, formData) => api.patch(`/client/clientEdit/${id}`, formData).then(unwrap),
    deleteClient: (id) => api.delete(`/client/clientDelete/${id}`).then(unwrap),
};

export default api;
