import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { logoutUser } from '../app/slices/authSlice';
import AnimatedBackground from '../components/AnimatedBackground';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
    };

    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Vast Question Bank',
            description: 'Access thousands of previous year questions from GATE, JEE, NEET, UPSC and other competitive exams, all organized by branch, subject, and year.',
            color: 'from-neon-blue to-neon-cyan'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Smart Practice Modes',
            description: 'Practice with timed tests, subject-wise quizzes, or custom filters. Track your progress with detailed analytics and performance insights.',
            color: 'from-neon-violet to-neon-pink'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Progress Tracking',
            description: 'Monitor your improvement over time with detailed statistics, weak area identification, and personalized recommendations.',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
            title: 'LaTeX Support',
            description: 'Full mathematical notation support with KaTeX rendering for complex formulas, equations, and scientific expressions.',
            color: 'from-amber-500 to-orange-500'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: 'Secure & Private',
            description: 'Your data is protected with industry-standard encryption. We never share your personal information with third parties.',
            color: 'from-rose-500 to-pink-500'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            title: 'Offline Ready',
            description: 'Download questions and practice offline. Perfect for studying on the go without internet connectivity.',
            color: 'from-cyan-500 to-blue-500'
        }
    ];

    const stats = [
        { value: '50,000+', label: 'Questions Available' },
        { value: '15+', label: 'Exam Categories' },
        { value: '100,000+', label: 'Active Students' },
        { value: '99.9%', label: 'Uptime Guarantee' }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <AnimatedBackground />

            {/* Navbar is rendered by App.jsx layout, so we don't include it here */}

            <main className="relative z-10 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/20 border border-neon-blue/30 text-neon-blue text-sm font-medium mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                            </span>
                            Empowering Exam Preparation
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6"
                        >
                            <span className="text-white">Master Your </span>
                            <span className="text-gradient">Competitive Exams</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10"
                        >
                            Practice with thousands of previous year questions, track your progress with smart analytics,
                            and ace your GATE, JEE, NEET, UPSC and other competitive exams with confidence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            {isAuthenticated ? (
                                <>
                                    <Link to="/exam" className="btn-primary px-8 py-3 text-lg">
                                        Start Practicing
                                    </Link>
                                    <Link to="/about" className="btn-ghost px-8 py-3 text-lg">
                                        Learn More
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/exam" className="btn-primary px-8 py-3 text-lg">
                                        Start Practicing
                                    </Link>
                                    <Link to="/register" className="btn-ghost px-8 py-3 text-lg">
                                        Create Free Account
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </motion.section>

                    {/* Stats Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mb-20"
                    >
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                                    className="glass-card p-6 text-center hover:glass-card-hover relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                                    </div>
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-violet"
                                        style={{ transformOrigin: 'left center' }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Features Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                Key <span className="text-gradient">Features</span>
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Everything you need to ace your competitive exams, built with modern technology and thoughtful design.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                                    className="glass-card p-6 hover:glass-card-hover group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-night-900 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                    </div>
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.8 + index * 0.08, duration: 0.5 }}
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r"
                                        style={{
                                            background: feature.color.replace('from-', 'from-').replace('to-', 'to-'),
                                            transformOrigin: 'left center'
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* CTA Section for non-authenticated users */}
                    {!isAuthenticated && (
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="glass-card p-8 md:p-12 lg:p-16 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-violet/10" />
                                <div className="relative z-10 max-w-3xl mx-auto">
                                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                        Ready to Start Your <span className="text-gradient">Journey</span>?
                                    </h2>
                                    <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                        Join thousands of students who are already improving their scores with PYQ Platform.
                                        Free to start, no credit card required.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <Link to="/register" className="btn-primary px-8 py-3 text-lg">
                                            Get Started Free
                                        </Link>
                                        <Link to="/login" className="btn-ghost px-8 py-3 text-lg">
                                            Already have an account? Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* User Dashboard Preview for authenticated users */}
                    {isAuthenticated && (
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                    Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Student'}</span>!
                                </h2>
                                <p className="text-slate-400 max-w-2xl mx-auto">
                                    Continue your preparation journey. Pick up where you left off or start a new practice session.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Link to="/exam" className="glass-card p-6 hover:glass-card-hover group text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Start Practice</h3>
                                    <p className="text-slate-400">Choose your exam, branch, and subject to begin practicing</p>
                                </Link>

                                <Link to="/account" className="glass-card p-6 hover:glass-card-hover group text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">My Progress</h3>
                                    <p className="text-slate-400">View your statistics, weak areas, and improvement over time</p>
                                </Link>

                                <Link to="/account/edit" className="glass-card p-6 hover:glass-card-hover group text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Edit Profile</h3>
                                    <p className="text-slate-400">Update your information, preferences, and notification settings</p>
                                </Link>
                            </div>
                        </motion.section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;