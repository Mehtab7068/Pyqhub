import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const QuestionHeader = ({
    questionType,
    marks,
    yearTag,
    questionNumber,
    _id,
    showCorrectAnswer,
    onReport
}) => {
    const typeColors = {
        MCQ: { bg: 'bg-neon-blue/20', text: 'text-neon-blue', border: 'border-neon-blue/30' },
        MSQ: { bg: 'bg-neon-violet/20', text: 'text-neon-violet', border: 'border-neon-violet/30' },
        NAT: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    };

    const typeConfig = typeColors[questionType] || typeColors.MCQ;
    const [reporting, setReporting] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');

    const reportReasons = [
        { value: 'incorrect_answer', label: 'Incorrect Answer' },
        { value: 'typo', label: 'Typo in Question' },
        { value: 'ambiguous_question', label: 'Ambiguous Question' },
        { value: 'broken_image', label: 'Broken Image' },
        { value: 'wrong_explanation', label: 'Wrong Explanation' },
        { value: 'incorrect_marks', label: 'Incorrect Marks' },
        { value: 'incorrect_question_type', label: 'Incorrect Question Type' },
        { value: 'duplicate_question', label: 'Duplicate Question' },
        { value: 'other', label: 'Other' },
    ];

    const handleReport = async () => {
        if (!reportReason) {
            toast.error('Please select a reason');
            return;
        }

        setReporting(true);
        try {
            await api.post('/questions/report', {
                questionId: _id,
                reason: reportReason,
                description: reportDescription
            });
            toast.success('Question reported successfully');
            setShowReportModal(false);
            setReportReason('');
            setReportDescription('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to report question');
        } finally {
            setReporting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2"
        >
            <div className="flex flex-wrap items-center gap-2">
                <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}
                >
                    {questionType}
                </motion.span>

                <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30"
                >
                    {marks} Mark{marks !== 1 ? 's' : ''}
                </motion.span>

                {yearTag && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, duration: 0.2 }}
                        className="px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium border border-violet-500/30"
                    >
                        Year: {yearTag}
                    </motion.span>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex items-center gap-3"
            >
                <span className="text-sm text-slate-500 font-mono">
                    Q{questionNumber || _id?.slice(-6) || ''}
                </span>

                {showCorrectAnswer && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium border border-amber-500/30"
                    >
                        Review Mode
                    </motion.span>
                )}

                {/* Report Button */}
                <button
                    onClick={() => setShowReportModal(true)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Report Question"
                    aria-label="Report Question"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </button>
            </motion.div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Report Question</h3>
                            <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Reason</label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="input-dark w-full min-h-11"
                                >
                                    <option value="">Select a reason</option>
                                    {reportReasons.map((reason) => (
                                        <option key={reason.value} value={reason.value}>
                                            {reason.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
                                <textarea
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    rows={3}
                                    className="input-dark w-full resize-none"
                                    placeholder="Additional details about the issue..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="btn-ghost flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReport}
                                    disabled={reporting}
                                    className="btn-primary flex-1"
                                >
                                    {reporting ? 'Reporting...' : 'Submit Report'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default QuestionHeader;