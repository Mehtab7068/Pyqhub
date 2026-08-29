import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success (in real app, this would be an actual API call)
        setSubmitStatus('success');
        setIsSubmitting(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email Us',
            description: 'Get a response within 24 hours',
            value: 'support@gatepyq.com',
            href: 'mailto:support@gatepyq.com'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Visit Us',
            description: 'Our office location',
            value: 'Bangalore, Karnataka, India',
            href: null
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Response Time',
            description: 'Typical response hours',
            value: 'Mon-Fri: 9AM - 6PM IST',
            href: null
        }
    ];

    const faqItems = [
        {
            question: 'How can I report an incorrect question or answer?',
            answer: 'You can use the "Report" button on any question page, or email us directly at support@gatepyq.com with the question ID and details of the issue.'
        },
        {
            question: 'Can I request new features or exam categories?',
            answer: 'Absolutely! We love hearing from our users. Send your feature requests to feedback@gatepyq.com and our team will review them for future updates.'
        },
        {
            question: 'Is there a mobile app available?',
            answer: 'Currently, we are a web-based platform optimized for all devices. A native mobile app is on our roadmap for future releases.'
        },
        {
            question: 'How do I delete my account and data?',
            answer: 'Go to Account Settings > Delete Account. This action is irreversible and will permanently remove all your data within 30 days.'
        }
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
                        className="text-center mb-16"
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
                            We'd love to hear from you
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6"
                        >
                            <span className="text-white">Contact </span>
                            <span className="text-gradient">Us</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            Have questions, feedback, or need help? Our team is here to assist you.
                            Fill out the form or reach out through any of our channels below.
                        </motion.p>
                    </motion.section>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="lg:col-span-1 space-y-6"
                        >
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                                    className="glass-card p-6 hover:glass-card-hover group"
                                >
                                    <div className="flex items-start gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-violet/20 flex items-center justify-center text-neon-cyan group-hover:from-neon-blue/40 group-hover:to-neon-violet/40 transition-all duration-300"
                                        >
                                            {item.icon}
                                        </motion.div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
                                            <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="text-neon-cyan hover:text-neon-blue text-sm font-medium transition-colors inline-flex items-center gap-1"
                                                >
                                                    {item.value}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <p className="text-slate-300 text-sm">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Social Links */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.4 }}
                                className="glass-card p-6"
                            >
                                <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Connect With Us
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        {
                                            name: 'GitHub', href: '#', icon: (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                                            )
                                        },
                                        {
                                            name: 'Twitter', href: '#', icon: (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                                            )
                                        },
                                        {
                                            name: 'LinkedIn', href: '#', icon: (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                            )
                                        },
                                        {
                                            name: 'Discord', href: '#', icon: (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-.214.076.076 0 0 0 .041-.106 13.107 13.107 0 0 0-.865-5.287.077.077 0 0 1-.007-.128 10.2 10.2 0 0 1 .473-.537.074.074 0 0 1 .106-.006c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .106.006 10.5 10.5 0 0 1 .472.537.077.077 0 0 1-.006.127 13.2 13.2 0 0 0-.864 5.287.077.077 0 0 0 .04.106 14.3 14.3 0 0 0 1.227.214.077.077 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.41-4.569-.364-9.034-3.554-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333 1.056-2.419 2.256-2.419 1.212 0 2.176 1.096 2.157 2.42 0 1.333-1.056 2.418-2.256 2.418zm7.975 0c-1.2 0-2.157-1.085-2.157-2.419 0-1.333 1.057-2.419 2.256-2.419 1.2 0 2.176 1.096 2.157 2.42 0 1.333-1.046 2.418-2.256 2.418z" /></svg>
                                            )
                                        }
                                    ].map((social) => (
                                        <motion.a
                                            key={social.name}
                                            href={social.href}
                                            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 group"
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={social.name}
                                        >
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="lg:col-span-2"
                        >
                            <motion.div className="glass-card p-6 md:p-8">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                    className="text-2xl font-display font-bold text-white mb-2"
                                >
                                    Send us a Message
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                    className="text-slate-400 mb-8"
                                >
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </motion.p>

                                {submitStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-emerald-400">Message Sent Successfully!</p>
                                            <p className="text-sm text-slate-400 mt-0.5">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                        </div>
                                    </motion.div>
                                )}

                                {submitStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-rose-400">Something went wrong</p>
                                            <p className="text-sm text-slate-400 mt-0.5">Please try again later or email us directly at support@gatepyq.com</p>
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.4 }}
                                            className="space-y-2"
                                        >
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                                                Full Name <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="input-dark"
                                                placeholder="John Doe"
                                                autoComplete="name"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.65, duration: 0.4 }}
                                            className="space-y-2"
                                        >
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                                Email Address <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="input-dark"
                                                placeholder="john@example.com"
                                                autoComplete="email"
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.4 }}
                                        className="space-y-2"
                                    >
                                        <label htmlFor="subject" className="block text-sm font-medium text-slate-300">
                                            Subject <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="input-dark"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="content">Content Correction</option>
                                            <option value="feature">Feature Request</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.75, duration: 0.4 }}
                                        className="space-y-2"
                                    >
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                                            Message <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            rows={5}
                                            className="input-dark resize-y min-h-[140px]"
                                            placeholder="Describe your question or feedback in detail..."
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.4 }}
                                    >
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Sending...
                                                </span>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* FAQ Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                                Frequently Asked <span className="text-gradient">Questions</span>
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Quick answers to common questions. Can't find what you're looking for?
                                <a href="mailto:support@gatepyq.com" className="text-neon-cyan hover:text-neon-blue underline">Contact us directly</a>
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {faqItems.map((faq, index) => (
                                <motion.div
                                    key={faq.question}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                                    className="glass-card p-6 hover:glass-card-hover"
                                >
                                    <h3 className="font-semibold text-white text-lg mb-3 leading-snug">{faq.question}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
};

export default Contact;
