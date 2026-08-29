import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const NATInput = ({ answer, showCorrectAnswer, correctAnswer, onAnswerChange }) => {
    const [localValue, setLocalValue] = useState(answer || '');
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = useCallback((e) => {
        const value = e.target.value;
        setLocalValue(value);
        onAnswerChange(value === '' ? null : value);
    }, [onAnswerChange]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    }, []);

    // Show correct answer indicator when in review mode
    const showAnswer = showCorrectAnswer && correctAnswer !== undefined && correctAnswer !== null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="space-y-4"
        >
            <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Answer
                </label>

                <div className="relative">
                    <input
                        type="number"
                        step="any"
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        disabled={showCorrectAnswer}
                        className={`input-dark max-w-xs md:max-w-md transition-all duration-200 ${showCorrectAnswer ? 'bg-white/3' : ''
                            } ${isFocused && !showCorrectAnswer ? 'ring-2 ring-neon-cyan/50 border-neon-cyan/50' : ''}`}
                        placeholder="Enter numerical value"
                        aria-label="Numerical answer input"
                        autoComplete="off"
                    />

                    {!showCorrectAnswer && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: isFocused ? 1 : 0, x: isFocused ? 0 : 10 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-cyan/60"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </motion.div>
                    )}
                </div>

                {!showCorrectAnswer && localValue !== '' && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-neon-cyan/60 mt-2 flex items-center gap-1"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Answer recorded
                    </motion.p>
                )}
            </div>

            {/* Correct Answer Display in Review Mode */}
            {showAnswer && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-emerald-400">Correct Answer</p>
                            <p className="text-lg font-mono text-emerald-300 mt-0.5">{correctAnswer}</p>
                        </div>
                    </div>

                    {/* User's answer comparison */}
                    {localValue !== '' && localValue !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-3 bg-night-800/50 rounded-lg border border-white/10"
                        >
                            <p className="text-xs text-slate-500 mb-1">Your Answer</p>
                            <p className={`font-mono text-lg ${String(localValue) === String(correctAnswer) ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {localValue}
                                <span className="text-sm font-normal ml-2">
                                    {String(localValue) === String(correctAnswer) ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default NATInput;