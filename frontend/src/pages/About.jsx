import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

const About = () => {
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

    const team = [
        {
            name: 'Mehtab Ali',
            role: 'Founder & Lead Developer',
            bio: 'Full-stack developer passionate about education technology and competitive exam preparation.',
            avatar: 'MA'
        },
        {
            name: 'Priya Sharma',
            role: 'Content Manager',
            bio: 'Curates and verifies all questions to ensure accuracy and relevance for exam preparation.',
            avatar: 'PS'
        },
        {
            name: 'Rahul Kumar',
            role: 'Backend Engineer',
            bio: 'Builds scalable APIs and manages database infrastructure for seamless user experience.',
            avatar: 'RK'
        },
        {
            name: 'Anita Desai',
            role: 'UI/UX Designer',
            bio: 'Designs intuitive interfaces that make complex exam preparation simple and enjoyable.',
            avatar: 'AD'
        }
    ];

    const techStack = [
        { name: 'React 18', category: 'Frontend', color: 'bg-blue-500/20 text-blue-400' },
        { name: 'Vite', category: 'Build Tool', color: 'bg-yellow-500/20 text-yellow-400' },
        { name: 'Tailwind CSS', category: 'Styling', color: 'bg-cyan-500/20 text-cyan-400' },
        { name: 'Redux Toolkit', category: 'State Management', color: 'bg-purple-500/20 text-purple-400' },
        { name: 'Framer Motion', category: 'Animations', color: 'bg-pink-500/20 text-pink-400' },
        { name: 'KaTeX', category: 'Math Rendering', color: 'bg-orange-500/20 text-orange-400' },
        { name: 'Node.js', category: 'Backend', color: 'bg-green-500/20 text-green-400' },
        { name: 'Express', category: 'API Framework', color: 'bg-gray-500/20 text-gray-400' },
        { name: 'MongoDB', category: 'Database', color: 'bg-emerald-500/20 text-emerald-400' },
        { name: 'JWT', category: 'Authentication', color: 'bg-red-500/20 text-red-400' },
        { name: 'AWS S3', category: 'File Storage', color: 'bg-amber-500/20 text-amber-400' },
        { name: 'Docker', category: 'Deployment', color: 'bg-blue-600/20 text-blue-400' }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <AnimatedBackground />
            <Navbar />

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
                            <span className="text-white">About </span>
                            <span className="text-gradient">Gate PYQ</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            Your comprehensive platform for mastering competitive exams through
                            previous year questions, smart practice tools, and personalized analytics.
                        </motion.p>
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

                    {/* Mission & Vision */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mb-20"
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
                                    Our <span className="text-gradient">Mission</span>
                                </h2>
                                <div className="space-y-4 text-slate-300 leading-relaxed">
                                    <p>
                                        Gate PYQ was born from a simple realization: students preparing for competitive exams
                                        like GATE, JEE, NEET, SSC,UGC-NET and UPSC spend countless hours searching for quality previous
                                        year questions scattered across multiple sources.
                                    </p>
                                    <p>
                                        Our mission is to <span className="text-white font-medium">centralize, organize, and enhance</span>
                                        the exam preparation experience. We believe that every student deserves access to
                                        high-quality practice material without the frustration of hunting through forums,
                                        PDFs, and outdated websites.
                                    </p>
                                    <p>
                                        By combining a vast question bank with intelligent practice tools, detailed analytics,
                                        and a beautiful user experience, we aim to make exam preparation more effective,
                                        efficient, and even enjoyable.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="relative"
                            >
                                <div className="glass-card p-8 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-violet/10" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">Smart Practice</h3>
                                                <p className="text-slate-400">Adaptive algorithms that identify your weak areas and recommend targeted practice.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">Deep Analytics</h3>
                                                <p className="text-slate-400">Comprehensive performance tracking with insights that help you improve faster.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">Quality Content</h3>
                                                <p className="text-slate-400">Expert-verified questions with detailed explanations and LaTeX-rendered formulas.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
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

                    {/* Tech Stack */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                Built with <span className="text-gradient">Modern Technology</span>
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                A carefully selected stack for performance, scalability, and developer experience.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {techStack.map((tech, index) => (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                                    className="glass-card p-4 text-center hover:glass-card-hover group"
                                >
                                    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold ${tech.color} group-hover:scale-105 transition-transform duration-200`}>
                                        {tech.name}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-2 capitalize">{tech.category.toLowerCase()}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Team Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                Meet the <span className="text-gradient">Team</span>
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                A passionate group of developers, educators, and designers working together to revolutionize exam preparation.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                                    className="glass-card p-6 text-center hover:glass-card-hover group"
                                >
                                    <div className="relative mx-auto mb-4">
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-2xl font-bold text-night-900">
                                            {member.avatar}
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.2 + index * 0.1 }}
                                            className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan/50 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <h3 className="font-semibold text-white text-lg mb-1">{member.name}</h3>
                                    <p className="text-neon-cyan text-sm font-medium mb-3">{member.role}</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="glass-card p-8 md:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-violet/10" />
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                    Ready to Start Your <span className="text-gradient">Journey</span>?
                                </h2>
                                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                    Join thousands of students who are already improving their scores with Gate PYQ.
                                    Free to start, no credit card required.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a href="/register" className="btn-primary px-8 py-3 text-lg">
                                        Get Started Free
                                    </a>
                                    <a href="/contact" className="btn-ghost px-8 py-3 text-lg">
                                        Contact Sales
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
};

export default About;
