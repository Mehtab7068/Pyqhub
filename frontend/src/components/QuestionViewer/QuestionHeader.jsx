import React from 'react';
import { motion } from 'framer-motion';

const QuestionHeader = ({
    questionType,
    marks,
    yearTag,
    questionNumber,
    _id,
    showCorrectAnswer
}) => {
    const typeColors = {
        MCQ: { bg: 'bg-neon-blue/20', text: 'text-neon-blue', border: 'border-neon-blue/30' },
        MSQ: { bg: 'bg-neon-violet/20', text: 'text-neon-violet', border: 'border-neon-violet/30' },
        NAT: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    };

    const typeConfig = typeColors[questionType] || typeColors.MCQ;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2"
        >
            <div className="flex flex-wrap items-center gap-2">
                <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}
                >
                    {questionType}
                </motion.span>

                <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30"
                >
                    {marks} Mark{marks !== 1 ? 's' : ''}
                </motion.span>

                {yearTag && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, duration: 0.2 }}
                        className="px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium border border-violet-500/30"
                    >
                        Year: {yearTag}
                    </motion.span>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex items-center gap-3"
            >
                <span className="text-sm text-slate-500 font-mono">
                    Q{questionNumber || _id?.slice(-6) || ''}
                </span>

                {showCorrectAnswer && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium border border-amber-500/30"
                    >
                        Review Mode
                    </motion.span>
                )}
            </motion.div>
        </motion.div>
    );
};

export default QuestionHeader;