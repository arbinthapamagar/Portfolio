import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Aurora from '../components/motion/Aurora';

export default function NotFound() {
    return (
        <div className="relative grid min-h-screen place-items-center px-6 text-center">
            <Aurora />
            <div className="relative">
                <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-[8rem] leading-none font-bold text-white/[0.07] sm:text-[12rem]"
                >
                    404
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="-mt-8"
                >
                    <h1 className="font-display text-2xl font-semibold">This page does not exist</h1>
                    <Link
                        to="/"
                        className="mt-5 inline-block rounded-full bg-glow-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-glow-400"
                    >
                        Back to portfolio
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
