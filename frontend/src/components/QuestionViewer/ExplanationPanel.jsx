import React from 'react';
import { motion } from 'framer-motion';
import LatexRenderer from '../LatexRenderer';

const ExplanationPanel = ({ explanation }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="relative overflow-hidden"
        >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50" />

            <div className="relative p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25"
                    >
                        <svg className="w-5 h-5 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.734-.988-2.386l-.548-.547z" />
                        </svg>
                    </motion.div>
                    <div>
                        <h4 className="font-semibold text-amber-400 text-lg">Explanation</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Review the solution approach</p>
                    </div>
                </div>

                {/* Explanation Content */}
                <div className="prose prose-invert max-w-none">
                    <LatexRenderer content={explanation} className="text-slate-300 leading-relaxed latex-content" />
                </div>

                {/* Decorative bottom border */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
                    style={{ transformOrigin: 'left center' }}
                />
            </div>
        </motion.div>
    );
};

export default ExplanationPanel;