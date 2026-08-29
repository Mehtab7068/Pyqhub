import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetTest } from '../app/slices/testSlice';
import { logoutUser } from '../app/slices/authSlice';

const Navbar = ({ isTestInProgress = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const exam = useSelector((state) => state.filter.exam);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
    };

    const isAdmin = user?.role === 'admin';

    const navLinkClass = (path) =>
        `text-sm font-medium transition-colors duration-200 ${location.pathname === path || location.pathname.startsWith(path + '/') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`;

    return (
        <nav className="glass-panel sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Brand */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <span className="text-2xl font-extrabold text-gradient tracking-tight">PYQ Platform</span>
                        {isTestInProgress && (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                Test in Progress
                            </span>
                        )}
                    </Link>

                    {/* Center: Nav links - desktop */}
                    {!isTestInProgress && (
                        <div className="hidden lg:flex items-center gap-6">
                            <Link to="/" className={navLinkClass('/')}>Home</Link>
                            <Link to="/about" className={navLinkClass('/about')}>About Us</Link>
                            <Link to="/contact" className={navLinkClass('/contact')}>Contact Us</Link>
                            {isAdmin && (
                                <Link to="/admin" className={navLinkClass('/admin')}>Admin Portal</Link>
                            )}
                        </div>
                    )}

                    {/* Right: Auth buttons or Profile dropdown */}
                    <div className="flex items-center gap-3 ml-4 lg:ml-0">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-1 text-sm text-slate-300 hover:text-neon-cyan focus:outline-none"
                                >
                                    <span className="inline-block w-6 h-6 rounded-full bg-neon-cyan text-gray-900 flex items-center justify-center font-medium">
                                        {user?.name?.[0] || 'U'}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="block px-4 py-2 text-sm text-neon-cyan hover:bg-white/10"
                                            >
                                                Admin Portal
                                            </Link>
                                        )}
                                        <Link
                                            to="/account"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                            Account
                                        </Link>
                                        <Link
                                            to="/account/edit"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                            Edit Profile
                                        </Link>
                                        <button
                                            onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                                            className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-white/10"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-neon-cyan transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary px-4 py-2 text-sm min-h-0">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

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
                </div>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden pb-4 border-t border-white/10 mt-2 pt-4 animate-fade-up">
                        {!isTestInProgress && (
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-medium py-2 ${location.pathname === '/' ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-medium py-2 ${location.pathname === '/about' ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                >
                                    About Us
                                </Link>
                                <Link
                                    to="/contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-medium py-2 ${location.pathname === '/contact' ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                >
                                    Contact Us
                                </Link>
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
