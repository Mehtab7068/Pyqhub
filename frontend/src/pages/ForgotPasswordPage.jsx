import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError } from '../app/slices/authSlice';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(forgotPassword(email)).unwrap();
            setEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (err) {
            toast.error(err || 'Failed to send reset email');
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card p-8 w-full max-w-md animate-fade-up text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-gradient mb-2">Check Your Email</h1>
                        <p className="text-slate-400">
                            We've sent a password reset link to <span className="text-neon-cyan font-medium">{email}</span>
                        </p>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                        Click the link in the email to reset your password. The link will expire in 1 hour.
                    </p>
                    <Link to="/login" className="btn-primary w-full inline-block">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-up">
                <h1 className="text-2xl font-extrabold text-center mb-6 text-gradient">Forgot Password</h1>

                <p className="text-sm text-slate-400 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-dark min-h-11"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full min-h-11"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
