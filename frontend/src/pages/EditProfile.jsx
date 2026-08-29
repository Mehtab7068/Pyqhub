import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword, clearError } from '../app/slices/authSlice';
import { EXAM_DATA, YEAR_LIST, getBranchesForExam } from '../data/gateData';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        targetExam: '',
        targetYear: '',
        branch: '',
        college: '',
        bio: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                targetExam: user.targetExam || '',
                targetYear: user.targetYear || '',
                branch: user.branch || '',
                college: user.college || '',
                bio: user.bio || '',
            });
        }
    }, [user]);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const next = { ...prev, [name]: value };
            // Reset branch when exam changes
            if (name === 'targetExam') next.branch = '';
            return next;
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateProfile(formData)).unwrap();
            toast.success('Profile updated successfully!');
            navigate('/account');
        } catch (err) {
            toast.error(err || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setPasswordLoading(true);
        try {
            await dispatch(changePassword(passwordData)).unwrap();
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const examBranches = formData.targetExam ? getBranchesForExam(formData.targetExam) : [];

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-extrabold text-gradient">Edit Profile</h1>
                    <Link to="/account" className="text-sm text-neon-cyan hover:underline">
                        ← Back to Profile
                    </Link>
                </div>

                {/* Profile form */}
                <form onSubmit={handleProfileSubmit} className="glass-card p-6 sm:p-8 space-y-5 animate-fade-up">
                    <h2 className="text-lg font-bold text-slate-100">Profile Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={50}
                            className="input-dark"
                            placeholder="Your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={15}
                            className="input-dark"
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Target Exam</label>
                            <select
                                name="targetExam"
                                value={formData.targetExam}
                                onChange={handleChange}
                                className="input-dark min-h-11"
                            >
                                <option value="">Select Exam</option>
                                {Object.entries(EXAM_DATA).map(([key, data]) => (
                                    <option className="text-black" key={key} value={key}>
                                        {data.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Target Year</label>
                            <select
                                name="targetYear"
                                value={formData.targetYear}
                                onChange={handleChange}
                                className="input-dark min-h-11"
                            >
                                <option value="">Select Year</option>
                                {YEAR_LIST.slice(0, 5).map((y) => (
                                    <option className="text-black" key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Branch / Stream</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            disabled={!formData.targetExam}
                            className="input-dark min-h-11"
                        >
                            <option value="">
                                {formData.targetExam ? 'Select Branch' : 'Select an exam first'}
                            </option>
                            {examBranches.map((b) => (
                                <option className="text-black" key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">College / Institute</label>
                        <input
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleChange}
                            maxLength={100}
                            className="input-dark"
                            placeholder="e.g. IIT Delhi, NIT Trichy"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={300}
                            rows={3}
                            className="input-dark resize-none"
                            placeholder="A short intro about your preparation journey..."
                        />
                        <p className="text-xs text-slate-500 mt-1 text-right">{formData.bio.length}/300</p>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full min-h-11">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>

                {/* Change password */}
                <form
                    id="password"
                    onSubmit={handlePasswordSubmit}
                    className="glass-card p-6 sm:p-8 space-y-5 mt-6 animate-fade-up"
                >
                    <h2 className="text-lg font-bold text-slate-100">Change Password</h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="input-dark"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                className="input-dark"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                className="input-dark"
                                placeholder="Re-enter new password"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={passwordLoading} className="btn-primary w-full min-h-11">
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
