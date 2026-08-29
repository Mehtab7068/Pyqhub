import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-white/5 last:border-0">
        <span className="text-sm text-slate-400 sm:w-40 shrink-0">{label}</span>
        <span className="text-sm text-slate-100 font-medium mt-0.5 sm:mt-0">
            {value || <span className="text-slate-500 italic">Not set</span>}
        </span>
    </div>
);

const Account = () => {
    const { user } = useSelector((state) => state.auth);

    const initial = user?.name?.[0]?.toUpperCase() || 'U';
    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
                {/* Profile header card */}
                <div className="glass-card p-6 sm:p-8 animate-fade-up">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-blue-500 flex items-center justify-center text-3xl font-extrabold text-gray-900 shadow-lg shadow-neon-cyan/30 shrink-0">
                            {initial}
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-2xl font-extrabold text-slate-100">{user?.name || 'User'}</h1>
                            <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                {user?.role === 'admin' && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
                                        Admin
                                    </span>
                                )}
                                {user?.targetExam && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan text-xs font-semibold border border-neon-cyan/30">
                                        {user.targetExam} {user.targetYear && `• ${user.targetYear}`}
                                    </span>
                                )}
                                {joinedDate && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 text-xs border border-white/10">
                                        Joined {joinedDate}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Link to="/account/edit" className="btn-primary text-sm px-5 py-2 shrink-0">
                            Edit Profile
                        </Link>
                    </div>
                    {user?.bio && (
                        <p className="text-sm text-slate-300 mt-5 pt-5 border-t border-white/10">{user.bio}</p>
                    )}
                </div>

                {/* Exam preparation details */}
                <div className="glass-card p-6 sm:p-8 mt-6 animate-fade-up">
                    <h2 className="text-lg font-bold text-slate-100 mb-2">Exam Preparation</h2>
                    <InfoRow label="Target Exam" value={user?.targetExam} />
                    <InfoRow label="Target Year" value={user?.targetYear} />
                    <InfoRow label="Branch / Stream" value={user?.branch} />
                </div>

                {/* Personal details */}
                <div className="glass-card p-6 sm:p-8 mt-6 animate-fade-up">
                    <h2 className="text-lg font-bold text-slate-100 mb-2">Personal Details</h2>
                    <InfoRow label="Full Name" value={user?.name} />
                    <InfoRow label="Email" value={user?.email} />
                    <InfoRow label="Phone" value={user?.phone} />
                    <InfoRow label="College / Institute" value={user?.college} />
                </div>

                {/* Security */}
                <div className="glass-card p-6 sm:p-8 mt-6 animate-fade-up">
                    <h2 className="text-lg font-bold text-slate-100 mb-2">Security</h2>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm text-slate-100 font-medium">Password</p>
                            <p className="text-xs text-slate-400 mt-0.5">Keep your account secure with a strong password</p>
                        </div>
                        <Link
                            to="/account/edit#password"
                            className="text-sm text-neon-cyan hover:underline font-medium shrink-0"
                        >
                            Change Password
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
