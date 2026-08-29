import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../app/slices/authSlice';
import toast from 'react-hot-toast';
const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { user } = useSelector((state) => state.auth);
    const from = location.state?.from?.pathname || (user?.role === 'admin' ? '/admin' : '/');

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
            const result = await dispatch(loginUser(formData)).unwrap();
            toast.success('Login successful! Welcome back.');
            const role = result?.data?.user?.role;
            navigate(role === 'admin' ? '/admin' : '/', { replace: true });
        } catch (err) {
            toast.error(err || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-up">
                <h1 className="text-2xl font-extrabold text-center mb-6 text-gradient">Welcome Back</h1>

                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                        <p className="text-sm text-rose-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="input-dark"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full min-h-11"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/forgot-password" className="text-sm text-neon-cyan hover:underline">
                        Forgot your password?
                    </Link>
                </div>

                <p className="text-sm text-slate-400 text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-neon-cyan hover:underline font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;