import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetTest } from '../app/slices/testSlice';
import { logoutUser } from '../app/slices/authSlice';
import { EXAM_DATA } from '../data/gateData';

const Navbar = ({ isTestInProgress = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const exam = useSelector((state) => state.filter.exam);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [profileMenuTimeout, setProfileMenuTimeout] = useState(null);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
    };

    const isAdmin = user?.role === 'admin';
    const examLabel = EXAM_DATA[exam]?.label || exam;

    const handleProtectedNavigation = (event, path) => {
        if (!isTestInProgress) return;
        event.preventDefault();
        if (window.confirm('Are you sure you want to leave this practice? Your current progress will be lost.')) {
            dispatch(resetTest());
            navigate(path);
        }
    };

    const navLinkClass = (path) =>
        `text-sm font-medium transition-colors duration-200 ${location.pathname === path || location.pathname.startsWith(path + '/') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`;

    const openProfileMenu = () => {
        if (profileMenuTimeout) clearTimeout(profileMenuTimeout);
        setProfileMenuOpen(true);
    };

    const closeProfileMenu = () => {
        const timeout = setTimeout(() => setProfileMenuOpen(false), 150);
        setProfileMenuTimeout(timeout);
    };

    const keepProfileMenuOpen = () => {
        if (profileMenuTimeout) clearTimeout(profileMenuTimeout);
    };

    return (
        <nav className="glass-panel sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Brand */}
                    <Link to="/" onClick={(event) => handleProtectedNavigation(event, '/')} className="flex items-center gap-2 shrink-0">
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
                            <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>Leaderboard</Link>
                            {isAdmin && (
                                <Link to="/admin" className={navLinkClass('/admin')}>Admin Portal</Link>
                            )}
                        </div>
                    )}

                    {/* Right: Auth buttons or Profile dropdown */}
                    <div className="flex items-center gap-3 ml-4 lg:ml-0">
                        {examLabel && (
                            <span className="hidden sm:inline-flex items-center max-w-36 truncate px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-xs font-medium text-neon-cyan" title={examLabel}>
                                {examLabel}
                            </span>
                        )}
                        {isAuthenticated ? (
                            <div className="relative" onMouseEnter={openProfileMenu} onMouseLeave={closeProfileMenu}>
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-1 text-sm text-slate-300 hover:text-neon-cyan focus:outline-none"
                                    aria-expanded={profileMenuOpen}
                                    aria-haspopup="menu"
                                >
                                    <span className="inline-block w-7 h-7 rounded-full overflow-hidden bg-neon-cyan text-gray-900 flex items-center justify-center font-medium">
                                        {user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : user?.name?.[0] || 'U'}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {profileMenuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1"
                                        role="menu"
                                        onMouseEnter={keepProfileMenuOpen}
                                        onMouseLeave={closeProfileMenu}
                                    >
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={(event) => { handleProtectedNavigation(event, '/admin'); setProfileMenuOpen(false); }}
                                                className="block px-4 py-2 text-sm text-neon-cyan hover:bg-white/10"
                                            >
                                                Admin Portal
                                            </Link>
                                        )}
                                        <Link
                                            to="/leaderboard"
                                            onClick={(event) => { handleProtectedNavigation(event, '/leaderboard'); setProfileMenuOpen(false); }}
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                            Leaderboard
                                        </Link>
                                        <Link
                                            to="/progress"
                                            onClick={(event) => { handleProtectedNavigation(event, '/progress'); setProfileMenuOpen(false); }}
                                            className="block px-4 py-2 text-sm text-neon-cyan hover:bg-white/10"
                                        >
                                            My Progress
                                        </Link>
                                        <Link
                                            to="/replay"
                                            onClick={(event) => { handleProtectedNavigation(event, '/replay'); setProfileMenuOpen(false); }}
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                            Replay Mistakes
                                        </Link>
                                        <Link
                                            to="/account"
                                            onClick={(event) => { handleProtectedNavigation(event, '/account'); setProfileMenuOpen(false); }}
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                            Account
                                        </Link>
                                        <Link
                                            to="/account/edit"
                                            onClick={(event) => { handleProtectedNavigation(event, '/account/edit'); setProfileMenuOpen(false); }}
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                            Edit Profile
                                        </Link>
                                        <button
                                            onClick={(event) => {
                                                if (isTestInProgress && !window.confirm('Are you sure you want to leave this practice? Your current progress will be lost.')) return;
                                                setProfileMenuOpen(false);
                                                handleLogout();
                                            }}
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
                                    onClick={(event) => { handleProtectedNavigation(event, '/'); setMobileMenuOpen(false); }}
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
                                <Link
                                    to="/leaderboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-medium py-2 ${location.pathname.startsWith('/leaderboard') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                >
                                    Leaderboard
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
                                        <Link
                                            to="/progress"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`text-sm font-medium py-2 ${location.pathname.startsWith('/progress') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                        >
                                            My Progress
                                        </Link>
                                        <Link
                                            to="/replay"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`text-sm font-medium py-2 ${location.pathname.startsWith('/replay') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                        >
                                            Replay Mistakes
                                        </Link>
                                        <Link
                                            to="/account"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`text-sm font-medium py-2 ${location.pathname === '/account' ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                        >
                                            Account
                                        </Link>
                                        <Link
                                            to="/account/edit"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`text-sm font-medium py-2 ${location.pathname.startsWith('/account/edit') ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-cyan'}`}
                                        >
                                            Edit Profile
                                        </Link>
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
                                            onClick={(event) => {
                                                if (isTestInProgress && !window.confirm('Are you sure you want to leave this practice? Your current progress will be lost.')) return;
                                                handleLogout();
                                            }}
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
