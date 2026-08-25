import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../app/slices/authSlice';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [resetSuccess, setResetSuccess] = useState(false);

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

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await dispatch(resetPassword({
                token,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            })).unwrap();
            setResetSuccess(true);
            toast.success('Password reset successful!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            toast.error(err || 'Failed to reset password');
        }
    };

    if (resetSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card p-8 w-full max-w-md animate-fade-up text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-gradient mb-2">Password Reset Successful!</h1>
                        <p className="text-slate-400">
                            Your password has been successfully reset. Redirecting to login...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-up">
                <h1 className="text-2xl font-extrabold text-center mb-6 text-gradient">Reset Password</h1>

                <p className="text-sm text-slate-400 text-center mb-6">
                    Enter your new password below.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                        <p className="text-sm text-rose-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="input-dark min-h-11"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="input-dark min-h-11"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full min-h-11"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className="text-sm text-slate-400 text-center mt-6">
                    Remember your password?{' '}
                    <Link to="/login" className="text-neon-cyan hover:underline font-medium">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
