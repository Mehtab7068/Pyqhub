import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Animated background decoration with floating particles
 */
const BackgroundDecoration = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate initial particles
        const initialParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.3 + 0.1,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 5,
        }));
        setParticles(initialParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />

            {/* Floating particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-neon-cyan/30 animate-float"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: p.opacity,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

/**
 * Animated icon with pulse and rotation effects
 */
const AnimatedIcon = ({ className = 'w-24 h-24', color = 'text-amber-400', bgColor = 'bg-amber-500/10' }) => {
    return (
        <div className={`relative w-28 h-28 mx-auto mb-8 flex items-center justify-center ${className}`}>
            {/* Outer pulse ring */}
            <div className={`absolute inset-0 rounded-full ${bgColor} animate-pulse-ring`} />
            {/* Middle ring */}
            <div className={`absolute inset-4 rounded-full ${bgColor} animate-pulse-ring`} style={{ animationDelay: '0.5s' }} />
            {/* Inner ring */}
            <div className={`absolute inset-8 rounded-full ${bgColor} animate-pulse-ring`} style={{ animationDelay: '1s' }} />
            {/* Icon */}
            <svg className={`relative ${color} w-14 h-14 animate-float-slow`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                <circle cx="12" cy="12" r="10" className="opacity-30" />
            </svg>
        </div>
    );
};

/**
 * Context badge component showing exam/branch/subject/chapter hierarchy
 */
const ContextHierarchy = ({ exam, branch, subject, chapter }) => {
    const items = [
        { label: 'Exam', value: exam, icon: '🏛️', color: 'text-neon-cyan' },
        { label: 'Branch', value: branch, icon: '📚', color: 'text-emerald-400' },
        { label: 'Subject', value: subject, icon: '📖', color: 'text-violet-400' },
        ...(chapter ? [{ label: 'Chapter', value: chapter, icon: '📂', color: 'text-amber-400' }] : []),
    ];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 flex-wrap">
            {items.map((item, index) => (
                <React.Fragment key={item.label}>
                    {index > 0 && (
                        <span className="text-white/20 mx-1 sm:mx-2 hidden sm:inline-block">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    )}
                    <div className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all duration-300">
                        <span className="text-2xl animate-bounce-slow">{item.icon}</span>
                        <div className="text-left hidden sm:block">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                            <p className={`font-semibold text-sm ${item.color}`}>{item.value}</p>
                        </div>
                        <div className="text-center sm:hidden">
                            <p className={`font-semibold text-sm ${item.color}`}>{item.value}</p>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

/**
 * Animated CTA button with hover/tap effects
 */
const CTAButton = ({ onClick, children, icon: Icon, variant = 'primary', className = '' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const baseStyles = 'inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-night-900';

    const variants = {
        primary: 'bg-gradient-to-r from-neon-cyan to-neon-blue text-night-900 hover:from-neon-blue hover:to-neon-cyan focus:ring-neon-cyan shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)]',
        secondary: 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 focus:ring-white/20',
        outline: 'bg-transparent border-2 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 focus:ring-neon-cyan',
    };

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={`${baseStyles} ${variants[variant]} ${className} relative overflow-hidden`}
            style={{
                transform: isPressed ? 'scale(0.97)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 10px 40px -10px rgba(34, 211, 238, 0.4)' : 'none',
            }}
        >
            <span className="relative z-10 flex items-center gap-3">
                {Icon && <Icon className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
                <span>{children}</span>
            </span>
            {/* Shine effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine ${isHovered ? '' : 'opacity-0'}`} />
        </button>
    );
};

/**
 * Feature card for suggestions
 */
const SuggestionCard = ({ icon: Icon, title, description, color = 'neon-cyan', delay = 0 }) => {
    return (
        <div className={`group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all duration-300 animate-slide-up`} style={{ animationDelay: `${delay}s` }}>
            <div className={`absolute top-4 right-4 w-12 h-12 rounded-full ${color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

/**
 * Stats display showing what's missing
 */
const MissingStats = ({ subject, chapter }) => {
    const stats = [
        { label: 'Questions', value: '0', icon: '❓', color: 'text-rose-400' },
        { label: 'Chapters Covered', value: chapter ? '1' : '0', icon: '📂', color: 'text-amber-400' },
        { label: 'Years Available', value: '0', icon: '📅', color: 'text-emerald-400' },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div key={stat.label} className="relative p-4 rounded-2xl bg-white/5 border border-white/10 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-xl">{stat.icon}</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
                        <p className={`text-xs uppercase tracking-wider ${stat.color}`}>{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

const NoQuestionsPage = ({ exam, branch, subject, chapter, onReset }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-night-900 flex items-center justify-center">
                <Navbar />
                <div className="w-full max-w-2xl">
                    <div className="glass-card p-8 sm:p-12 text-center animate-pulse">
                        <div className="w-20 h-20 mx-auto mb-6 bg-amber-500/10 rounded-full flex items-center justify-center animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-night-900 relative overflow-hidden">
            <BackgroundDecoration />

            <Navbar />

            <main className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl">
                    <div className="glass-card p-6 sm:p-8 lg:p-10 relative overflow-hidden animate-fade-up">
                        {/* Top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-blue to-emerald-400" />

                        <div className="relative z-10">
                            {/* Animated Icon */}
                            <AnimatedIcon />

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-slate-100 via-neon-cyan to-emerald-400 bg-clip-text text-transparent animate-slide-down">
                                No Questions Available
                            </h1>

                            {/* Subtitle */}
                            <p className="text-slate-300 text-center text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                                There are currently no questions available for this selection.
                            </p>

                            {/* Context Hierarchy */}
                            <ContextHierarchy exam={exam} branch={branch} subject={subject} chapter={chapter} />

                            {/* Missing Stats */}
                            <MissingStats subject={subject} chapter={chapter} />

                            {/* Suggestions */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-100 text-center mb-6">
                                    <span className="relative inline-block">
                                        Suggestions
                                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-emerald-400" />
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <SuggestionCard
                                        icon={() => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
                                        title="Upload Questions"
                                        description="Admins can upload questions via the Admin Upload page for this subject."
                                        color="neon-cyan"
                                        delay={0}
                                    />
                                    <SuggestionCard
                                        icon={() => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 18.75h12a2.25 2.25 0 002.25-2.25V3M3.75 3h16.5M16.5 12a2.25 2.25 0 01-2.25 2.25H5.25M16.5 18.75a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V15a2.25 2.25 0 012.25-2.25h9M9 12h.008v.008H9V12Z" /></svg>}
                                        title="Check Other Chapters"
                                        description="This subject may have questions in other chapters. Try selecting a different chapter."
                                        color="emerald-400"
                                        delay={0.1}
                                    />
                                    <SuggestionCard
                                        icon={() => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21H3c-3.14 0-5.747-2.165-5.989-5.034a2.025 2.025 0 01.879-1.618l7.96-2.387a2.025 2.025 0 011.618.879c.725 1.965 2.686 3.413 4.989 3.413h1.5" /></svg>}
                                        title="Contact Admin"
                                        description="Request an administrator to upload questions for this subject/chapter."
                                        color="violet-400"
                                        delay={0.2}
                                    />
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                <CTAButton
                                    onClick={onReset}
                                    icon={() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
                                >
                                    Go to Admin Upload
                                </CTAButton>
                                <CTAButton
                                    onClick={onReset}
                                    variant="outline"
                                    icon={() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>}
                                >
                                    Back to Selection
                                </CTAButton>
                            </div>

                            {/* Helpful tip */}
                            <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                <svg className="w-5 h-5 text-neon-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-slate-400">
                                    Tip: Questions are organized by <strong className="text-slate-200">Exam → Branch → Subject → Chapter → Year</strong>.
                                    Make sure questions exist at all levels of this hierarchy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NoQuestionsPage;