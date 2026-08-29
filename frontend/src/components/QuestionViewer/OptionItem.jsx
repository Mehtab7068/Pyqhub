import React from 'react';
import { motion } from 'framer-motion';
import LatexRenderer from '../LatexRenderer';

const OptionItem = ({ option, index, onSelect, questionType }) => {
    const {
        id,
        text,
        optionLabel,
        isSelected,
        isCorrect,
        isWrong,
        isDisabled
    } = option;

    // Determine the visual state
    const getOptionClasses = () => {
        const baseClasses = 'w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden';

        if (isCorrect) {
            return `${baseClasses} border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]`;
        }
        if (isWrong) {
            return `${baseClasses} border-rose-500 bg-rose-500/10 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]`;
        }
        if (isSelected) {
            return `${baseClasses} border-neon-cyan bg-neon-cyan/10 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]`;
        }
        return `${baseClasses} border-white/10 hover:border-neon-cyan/50 hover:bg-white/5 text-slate-200`;
    };

    const getIndicator = () => {
        if (isCorrect) {
            return (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded-full text-white"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
            );
        }
        if (isWrong) {
            return (
                <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-6 h-6 flex items-center justify-center bg-rose-500 rounded-full text-white"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </motion.div>
            );
        }
        if (isSelected) {
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-6 h-6 flex items-center justify-center bg-neon-cyan rounded-full text-night-900"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
            );
        }
        // Default unselected state
        return (
            <div className="w-6 h-6 flex items-center justify-center border-2 border-white/30 rounded-full text-slate-500">
                <span className="font-medium text-sm">{optionLabel}</span>
            </div>
        );
    };

    const getGlowEffect = () => {
        if (isSelected && !isCorrect && !isWrong) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-transparent to-neon-cyan/20 blur-xl pointer-events-none"
                />
            );
        }
        if (isCorrect) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 blur-xl pointer-events-none"
                />
            );
        }
        if (isWrong) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-transparent to-rose-500/20 blur-xl pointer-events-none"
                />
            );
        }
        return null;
    };

    return (
        <motion.button
            onClick={() => onSelect(id)}
            disabled={isDisabled}
            className={`${getOptionClasses()} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!isDisabled && !isCorrect && !isWrong ? { y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            style={{ transitionDelay: `${index * 50}ms` }}
            aria-pressed={isSelected}
            aria-disabled={isDisabled}
            role={questionType === 'MSQ' ? 'checkbox' : 'radio'}
            tabIndex={isDisabled ? -1 : 0}
        >
            {getGlowEffect()}

            <div className="relative flex items-start gap-4">
                {/* Selection Indicator */}
                <div className="flex-shrink-0 mt-0.5">
                    {getIndicator()}
                </div>

                {/* Option Content */}
                <div className="flex-1 min-w-0">
                    <LatexRenderer content={text} className="leading-relaxed" />
                </div>

                {/* Status Badge */}
                {(isCorrect || isWrong) && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}
                    >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                    </motion.span>
                )}
            </div>

            {/* Animated border for selected state */}
            {isSelected && !isCorrect && !isWrong && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue to-neon-cyan"
                    style={{ transformOrigin: 'left center' }}
                />
            )}
        </motion.button>
    );
};

export default OptionItem;