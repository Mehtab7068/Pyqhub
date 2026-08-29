import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, adminRegisterUser, clearError } from '../app/slices/authSlice';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isAdminRegister, setIsAdminRegister] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isAdminRegister) {
                await dispatch(adminRegisterUser({ ...formData, apiKey })).unwrap();
                toast.success('Admin account created successfully!');
            } else {
                await dispatch(registerUser(formData)).unwrap();
                toast.success('Account created successfully!');
            }
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-up">
                <h1 className="text-2xl font-extrabold text-center mb-6 text-gradient">Create Account</h1>

                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                        <p className="text-sm text-rose-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-dark"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-dark"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="input-dark"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="input-dark"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Admin Registration Toggle */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="adminRegister"
                            checked={isAdminRegister}
                            onChange={(e) => setIsAdminRegister(e.target.checked)}
                            className="w-4 h-4 accent-cyan-400"
                        />
                        <label htmlFor="adminRegister" className="text-sm font-medium text-slate-300 cursor-pointer">
                            Register as Admin
                        </label>
                    </div>

                    {/* API Key Input - shown only when admin registration is selected */}
                    {isAdminRegister && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Admin API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                required={isAdminRegister}
                                className="input-dark"
                                placeholder="Enter admin API key"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Contact the site administrator for the API key.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Creating Account...' : isAdminRegister ? 'Register as Admin' : 'Register'}
                    </button>
                </form>

                <p className="text-sm text-slate-400 text-center mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-neon-cyan hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;