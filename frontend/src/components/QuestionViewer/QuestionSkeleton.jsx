import React from 'react';
import { motion } from 'framer-motion';

const QuestionSkeleton = () => {
    return (
        <div className="glass-card p-6 md:p-8 space-y-6" role="status" aria-label="Loading question">
            {/* Header skeleton */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center gap-2"
            >
                <div className="h-8 w-24 rounded-full bg-white/10 animate-pulse" />
                <div className="h-8 w-28 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '100ms' }} />
                <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '200ms' }} />
            </motion.div>

            {/* Question text skeleton */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                <div className="h-6 w-3/4 rounded bg-white/10 animate-pulse" />
                <div className="h-6 w-full rounded bg-white/10 animate-pulse" style={{ animationDelay: '100ms' }} />
                <div className="h-6 w-5/6 rounded bg-white/10 animate-pulse" style={{ animationDelay: '200ms' }} />
            </motion.div>

            {/* Image skeleton */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="aspect-video rounded-xl bg-white/5 border border-white/10 animate-pulse"
            />

            {/* Options skeleton */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
            >
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/5 animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                    />
                ))}
            </motion.div>

            {/* NAT input skeleton */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
            >
                <div className="h-5 w-32 rounded bg-white/10 animate-pulse" />
                <div className="h-12 w-64 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
            </motion.div>
        </div>
    );
};

export default QuestionSkeleton;