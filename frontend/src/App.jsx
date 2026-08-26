import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteDataProvider } from './context/SiteDataContext';
import Loader from './components/ui/Loader';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';

// the admin bundle is only needed once you sign in
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

// one route per nav destination, each reusing the section it shows on the home page
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'));

const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminHero = lazy(() => import('./pages/admin/Hero'));
const AdminAbout = lazy(() => import('./pages/admin/About'));
const AdminSkills = lazy(() => import('./pages/admin/Skills'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminExperience = lazy(() => import('./pages/admin/Experience'));
const AdminEducation = lazy(() => import('./pages/admin/Education'));
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'));
const AdminClients = lazy(() => import('./pages/admin/Clients'));
const AdminHeadings = lazy(() => import('./pages/admin/Headings'));
const AdminFooter = lazy(() => import('./pages/admin/Footer'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));

// react-router keeps scroll position across routes; the portfolio wants the top,
// except for in-page #anchors coming from the home page
function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const target = document.getElementById(hash.slice(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname, hash]);

    return null;
}

const Fallback = (
    <div className="grid min-h-screen place-items-center">
        <Loader />
    </div>
);

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SiteDataProvider>
                    <ScrollToTop />
                    <Suspense fallback={Fallback}>
                        <Routes>
                            <Route element={<PublicLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/skills" element={<SkillsPage />} />
                                <Route path="/projects" element={<ProjectsPage />} />
                                <Route path="/experience" element={<ExperiencePage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/project/:id" element={<ProjectDetail />} />
                                <Route path="/experience/:id" element={<ExperienceDetail />} />
                            </Route>

                            <Route path="/admin/login" element={<Login />} />
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="hero" element={<AdminHero />} />
                                <Route path="about" element={<AdminAbout />} />
                                <Route path="skills" element={<AdminSkills />} />
                                <Route path="projects" element={<AdminProjects />} />
                                <Route path="experience" element={<AdminExperience />} />
                                <Route path="education" element={<AdminEducation />} />
                                <Route path="testimonials" element={<AdminTestimonials />} />
                                <Route path="clients" element={<AdminClients />} />
                                <Route path="headings" element={<AdminHeadings />} />
                                <Route path="footer" element={<AdminFooter />} />
                                <Route path="messages" element={<AdminMessages />} />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </SiteDataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
