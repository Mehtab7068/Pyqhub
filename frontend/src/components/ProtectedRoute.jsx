import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen bg-night-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-night-900 flex items-center justify-center">
                <div className="glass-card p-8 w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">Access Denied</h2>
                    <p className="text-slate-300 mb-6">You need admin privileges to access this page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;