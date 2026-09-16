import React from 'react';
import { motion } from 'framer-motion';
import { EXAM_DATA } from '../../data/gateData';
import { getExamConfig } from '../../data/examConfig';

const MOCK_TEST_TYPES = [
    {
        id: 'full',
        label: 'Full Length Mock Test',
        description: 'Complete exam simulation with all sections',
        duration: '3 hours',
        questions: '65',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        color: 'from-neon-blue to-neon-violet',
        borderColor: 'border-neon-blue/50',
        bgColor: 'bg-neon-blue/10',
    },
    {
        id: 'subject',
        label: 'Subject-wise Mock Test',
        description: 'Focus on specific subjects for targeted practice',
        duration: '1-2 hours',
        questions: '25-35',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253v-13z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'from-neon-violet to-neon-pink',
        borderColor: 'border-neon-violet/50',
        bgColor: 'bg-neon-violet/10',
    },
];

const MockTestSelection = ({
    exam,
    branch,
    subject,
    subjects,
    onExamChange,
    onBranchChange,
    onSubjectChange,
    onMockTestTypeChange,
    onStartMockTest,
    testLoading,
    error,
    selectedMockTestType,
}) => {
    const [selectedExam, setSelectedExam] = React.useState(exam || '');

    const handleExamClick = (examKey) => {
        setSelectedExam(examKey);
        if (onExamChange) {
            onExamChange({ target: { value: examKey } });
        }
    };

    const exams = Object.entries(EXAM_DATA);
    const examConfig = getExamConfig(selectedExam);

    return (
        <div className="min-h-screen">
            <div className="flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-20">
                <div className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-4xl animate-fade-up">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-xl sm:text-2xl font-extrabold text-gradient mb-2">
                            {selectedExam ? `${EXAM_DATA[selectedExam]?.label || selectedExam} Mock Tests` : 'Choose Your Exam'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Select a mock test type to begin your practice
                        </p>
                    </motion.div>

                    {!selectedExam ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                {exams.map(([key, data]) => (
                                    <motion.button
                                        key={key}
                                        onClick={() => handleExamClick(key)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/20"
                                    >
                                        <div className="text-neon-cyan group-hover:scale-110 transition-transform duration-300">
                                            {EXAM_ICONS[key] || (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <path d="M9 9h6M9 13h4" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
                                            {data.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="space-y-4 animate-fade-up"
                        >
                            <motion.button
                                onClick={() => {
                                    setSelectedExam('');
                                    if (onExamChange) {
                                        onExamChange({ target: { value: '' } });
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="text-sm text-neon-cyan hover:underline mb-2 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                ← Back to exams
                            </motion.button>

                            {/* Branch & Subject Selection */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="grid sm:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Branch / Stream</label>
                                    <select
                                        value={branch}
                                        onChange={onBranchChange}
                                        className="input-dark min-h-11"
                                    >
                                        <option value="">Select Branch</option>
                                        {Object.keys(EXAM_DATA[selectedExam]?.branches || {}).map((b) => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                                    <select
                                        value={subject}
                                        onChange={onSubjectChange}
                                        disabled={!branch}
                                        className="input-dark min-h-11 disabled:bg-white/5 disabled:cursor-not-allowed"
                                    >
                                        <option value="">{branch ? 'Select Subject' : 'Select a branch first'}</option>
                                        {subjects?.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>

                            {/* Mock Test Type Selection */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-slate-300 mb-3">Select Mock Test Type</label>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {MOCK_TEST_TYPES.map((type) => (
                                        <motion.button
                                            key={type.id}
                                            onClick={() => onMockTestTypeChange?.({ target: { value: type.id } })}
                                            disabled={!branch || !subject}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-start gap-3 min-h-[180px] ${selectedMockTestType === type.id
                                                ? `${type.borderColor} bg-gradient-to-br ${type.bgColor} shadow-lg shadow-${type.color.split(' ')[0].replace('from-', '')}/20`
                                                : 'bg-white/5 border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
                                                } ${!branch || !subject ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.color.replace('from-', 'bg-gradient-to-br from-').replace('to-', ' to-')} text-night-900`}>
                                                {type.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white text-base">{type.label}</h3>
                                                <p className="text-xs text-slate-400 mt-1">{type.description}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 text-right">
                                                <span className="text-xs text-slate-400">Duration: {examConfig.durations[type.id]} minutes</span>
                                                <span className="text-xs text-slate-400">Questions: {examConfig.mockLimits[type.id]}</span>
                                            </div>
                                            {selectedMockTestType === type.id && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-cyan flex items-center justify-center"
                                                >
                                                    <svg className="w-4 h-4 text-night-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                                {!branch && !subject && (
                                    <p className="text-xs text-amber-400 mt-2 text-center">
                                        Select Branch and Subject to enable mock test types
                                    </p>
                                )}
                            </motion.div>

                            {/* Start Mock Test Button */}
                            <motion.button
                                onClick={onStartMockTest}
                                disabled={!branch || !subject || !selectedMockTestType || testLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`btn-primary w-full mt-6 min-h-11 ${!branch || !subject || !selectedMockTestType ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {testLoading ? 'Loading Mock Test...' : `Start ${MOCK_TEST_TYPES.find(t => t.id === selectedMockTestType)?.label || 'Mock Test'}`}
                            </motion.button>
                            {error && <motion.p className="text-rose-400 text-sm text-center mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EXAM_ICONS = {
    GATE: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    ),
    NEET: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M12 2a5 5 0 100 10 5 5 0 000-10z" />
            <path d="M12 12v8" />
            <path d="M8 20h8" />
            <path d="M4 4l2 2M18 4l-2 2" />
        </svg>
    ),
    NDA: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" />
            <path d="M12 8v4l3 2" />
        </svg>
    ),
    UPSC: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M4 20h16" />
            <path d="M6 20V10l6-6 6 6v10" />
            <path d="M9 20v-6h6v6" />
            <path d="M9 14h6" />
        </svg>
    ),
};

export default MockTestSelection;