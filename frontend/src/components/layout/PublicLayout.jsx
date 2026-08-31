import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useSiteData } from '../../context/SiteDataContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Cursor from '../motion/Cursor';
import ScrollProgress from '../motion/ScrollProgress';
import PageTransition from '../motion/PageTransition';

// chrome shared by every public route, so the navbar never remounts between pages
export default function PublicLayout() {
    const { pathname } = useLocation();
    const { data } = useSiteData();

    return (
        <div className="grain relative min-h-screen">
            <Cursor />
            <ScrollProgress />
            <Navbar resumeUrl={data.about?.resumeUrl} />

            <AnimatePresence mode="wait" initial={false}>
                <PageTransition key={pathname} routeKey={pathname}>
                    <main>
                        <Outlet />
                    </main>
                </PageTransition>
            </AnimatePresence>

            <Footer footer={data.footer} photo={data.about?.photo} />
        </div>
    );
}
