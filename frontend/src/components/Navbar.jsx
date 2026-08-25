import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setExam } from '../app/slices/filterSlice';
import { resetTest } from '../app/slices/testSlice';
import { logoutUser } from '../app/slices/authSlice';
import { EXAM_LIST, EXAM_DATA } from '../data/gateData';

const Navbar = ({ isTestInProgress = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const exam = useSelector((state) => state.filter.exam);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleExamChange = (newExam) => {
        if (newExam === exam) return;
        dispatch(setExam(newExam));
        dispatch(resetTest());
        setMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
        setMobileMenuOpen(false);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <nav className="glass-panel sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <span className="text-2xl font-extrabold text-gradient tracking-tight">GATEQuest</span>
                        {isTestInProgress && (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                Test in Progress
                            </span>
                        )}
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* Exam switcher - hidden on mobile, shown on desktop */}
                    {!isTestInProgress && (
                        <div className="hidden md:flex items-center gap-1 overflow-x-auto">
                            {EXAM_LIST.map((e) => (
                                <button
                                    key={e}
                                    onClick={() => handleExamChange(e)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${exam === e
                                        ? 'bg-white/15 text-white shadow-[0_0_18px_rgba(79,124,255,0.35)]'
                                        : 'text-slate-300 hover:bg-white/10'
                                        }`}
                                >
                                    {EXAM_DATA[e].label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Nav links - desktop */}
                    {!isTestInProgress && (
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            {isAuthenticated && (
                                <Link
                                    to="/"
                                    className="text-sm font-medium text-neon-cyan"
                                >
                                    Practice
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className={`text-sm font-medium ${location.pathname.startsWith('/admin') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <span className="text-sm text-slate-300 hidden xl:inline">
                                        Hi, {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-rose-400 hover:text-rose-300"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium text-slate-300 hover:text-neon-cyan"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-sm font-medium px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/15 border border-white/10"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden pb-4 border-t border-white/10 mt-2 pt-4 animate-fade-up">
                        {/* Mobile exam switcher */}
                        {!isTestInProgress && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {EXAM_LIST.map((e) => (
                                    <button
                                        key={e}
                                        onClick={() => handleExamChange(e)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${exam === e
                                            ? 'bg-white/15 text-white shadow-[0_0_18px_rgba(79,124,255,0.35)]'
                                            : 'text-slate-300 hover:bg-white/10'
                                            }`}
                                    >
                                        {EXAM_DATA[e].label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Mobile nav links */}
                        {!isTestInProgress && (
                            <div className="flex flex-col gap-2">
                                {isAuthenticated && (
                                    <Link
                                        to="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-sm font-medium text-neon-cyan py-2"
                                    >
                                        Practice
                                    </Link>
                                )}
                                {isAuthenticated ? (
                                    <>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`text-sm font-medium py-2 ${location.pathname.startsWith('/admin') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                            >
                                                Admin
                                            </Link>
                                        )}
                                        <span className="text-sm text-slate-300 py-2">
                                            Hi, {user?.name?.split(' ')[0] || 'User'}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm font-medium text-rose-400 hover:text-rose-300 py-2 text-left"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-sm font-medium text-slate-300 hover:text-neon-cyan py-2"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-sm font-medium px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 border border-white/10 inline-block w-fit"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
