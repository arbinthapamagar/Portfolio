import { AnimatePresence, motion } from 'motion/react';
import { Check, TriangleAlert } from 'lucide-react';

export default function Toast({ toast }) {
    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className={`fixed right-6 bottom-6 z-[90] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm backdrop-blur-xl ${
                        toast.type === 'error'
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    }`}
                >
                    {toast.type === 'error' ? (
                        <TriangleAlert className="h-4 w-4" />
                    ) : (
                        <Check className="h-4 w-4" />
                    )}
                    {toast.message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
