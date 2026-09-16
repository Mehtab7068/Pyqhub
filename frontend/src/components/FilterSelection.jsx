import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { EXAM_DATA } from '../data/gateData';

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

const PRACTICE_MODES = [
    {
        id: 'pyq',
        label: 'PYQ Practice',
        description: 'Practice previous year questions by subject or chapter',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: 'from-neon-blue to-neon-cyan',
        borderColor: 'border-neon-blue/50',
        bgColor: 'bg-neon-blue/10',
        features: ['Subject-wise', 'Chapter-wise', 'Year-wise', 'Instant feedback'],
    },
    {
        id: 'mock',
        label: 'Mock Test',
        description: 'Full-length timed mock tests simulating real exam',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'from-neon-violet to-neon-pink',
        borderColor: 'border-neon-violet/50',
        bgColor: 'bg-neon-violet/10',
        features: ['Full-length tests', 'Timed simulation', 'Performance analytics', 'Rank prediction'],
    },
];

const FilterSelection = ({
    exam,
    branch,
    subject,
    mode,
    chapter,
    branches,
    subjects,
    chapters,
    onBranchChange,
    onSubjectChange,
    onModeChange,
    onChapterChange,
    onStartTest,
    onExamChange,
    testLoading,
    error,
    // Mock test props
    mockTestType,
    onMockTestTypeChange,
    onStartMockTest,
    mockTestLoading,
    mockTestError,
    // New props for routing flow
    forcedMode, // "pyq" or "mock" to pre‑select mode and hide selector
    hideModeSelection, // boolean to hide the mode selection UI
    onBackToExam, // callback to handle back to exam selection (can reset test state)
}) => {
    const [selectedExam, setSelectedExam] = React.useState(exam || '');
    const [selectedMode, setSelectedMode] = React.useState(forcedMode || 'pyq'); // 'pyq' or 'mock'
    const navigate = useNavigate();

    // Combine backend subjects with static EXAM_DATA as fallback for PYQ practice
    const staticSubjects = EXAM_DATA[selectedExam]?.branches?.[branch] || [];
    const combinedSubjects = [...new Set([...(subjects || []), ...staticSubjects])];

    const handleExamClick = (examKey) => {
        setSelectedExam(examKey);
        if (onExamChange) {
            onExamChange({ target: { value: examKey } });
        }
    };

    const exams = Object.entries(EXAM_DATA);

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-20">
                <div className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-4xl animate-fade-up">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-xl sm:text-2xl font-extrabold text-center mb-2 text-gradient">
                            {selectedExam ? `${EXAM_DATA[selectedExam]?.label || selectedExam} Practice Platform` : 'Choose Your Exam'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Select your practice mode to begin
                        </p>
                    </motion.div>

                    {/* Exam Selection */}
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
                            className="space-y-6 animate-fade-up"
                        >
                            {/* Back to exams button removed to avoid duplicate rendering */}

                            {/* Practice Mode Selection */}
                            {hideModeSelection ? null : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                >
                                    <h2 className="text-lg font-semibold text-white mb-4 text-center">Select Practice Mode</h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {PRACTICE_MODES.map((practiceMode) => (
                                            <motion.button
                                                key={practiceMode.id}
                                                onClick={() => {
                                                    setSelectedMode(practiceMode.id);
                                                    if (onModeChange) {
                                                        onModeChange({ target: { value: practiceMode.id } });
                                                    }
                                                    const route = practiceMode.id === 'pyq' ? '/exam/practice' : '/exam/mock';
                                                    navigate(route);
                                                }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 min-h-[200px] ${selectedMode === practiceMode.id
                                                    ? `${practiceMode.borderColor} bg-gradient-to-br ${practiceMode.bgColor} shadow-lg shadow-${practiceMode.color.split(' ')[0].replace('from-', '')}/20`
                                                    : 'bg-white/5 border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
                                                    }`}
                                            >
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${practiceMode.color.replace('from-', 'bg-gradient-to-br from-').replace('to-', ' to-')} text-night-900`}>
                                                    {practiceMode.icon}
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="font-semibold text-white text-lg">{practiceMode.label}</h3>
                                                    <p className="text-sm text-slate-400 mt-1">{practiceMode.description}</p>
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                                    {practiceMode.features.map((feature, i) => (
                                                        <span key={i} className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-slate-300">{feature}</span>
                                                    ))}
                                                </div>
                                                {selectedMode === practiceMode.id && (
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
                                </motion.div>
                            )}

                            {/* PYQ Practice Section */}
                            {selectedMode === 'pyq' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                    className="space-y-4 animate-fade-up"
                                >
                                    <motion.button
                                        onClick={() => {
                                            // Call the back to exam callback if provided (can reset test state)
                                            if (onBackToExam) {
                                                onBackToExam();
                                            } else {
                                                // Fallback: Reset exam selection via parent handler
                                                if (onExamChange) {
                                                    onExamChange({ target: { value: '' } });
                                                }
                                                // Navigate back to the main exam selection route
                                                navigate('/exam');
                                            }
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="text-sm text-neon-cyan hover:underline mb-2 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        ← Back to Exam Selection
                                    </motion.button>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.3 }}
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
                                                {combinedSubjects.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </motion.div>

                                    {/* Practice mode: whole subject or chapterwise */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Practice Mode</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <motion.button
                                                type="button"
                                                onClick={() => onModeChange && onModeChange({ target: { value: 'subject' } })}
                                                disabled={!subject}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all min-h-11 disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'subject'
                                                    ? 'bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                                    : 'bg-white/5 text-slate-300 border-2 border-white/10 hover:border-white/20'
                                                    }`}>
                                                Whole Subject
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                onClick={() => onModeChange && onModeChange({ target: { value: 'chapter' } })}
                                                disabled={!subject}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all min-h-11 disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'chapter'
                                                    ? 'bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                                    : 'bg-white/5 text-slate-300 border-2 border-white/10 hover:border-white/20'
                                                    }`}>
                                                Chapterwise
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {mode === 'chapter' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25, duration: 0.3 }}
                                        >
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Chapter / Topic</label>
                                            <select
                                                value={chapter}
                                                onChange={onChapterChange}
                                                disabled={!subject}
                                                className="input-dark min-h-11"
                                            >
                                                <option value="">{subject ? 'Select Chapter' : 'Select a subject first'}</option>
                                                {(chapters || []).map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            {subject && (chapters || []).length === 0 && (
                                                <p className="text-xs text-amber-400 mt-1">No chapters tagged yet for this subject — ask admin to add chapter names when uploading questions.</p>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Year selection removed per unified format */}
                                    <motion.button
                                        onClick={onStartTest}
                                        disabled={!branch || !subject || (mode === 'chapter' && !chapter) || testLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary w-full mt-6 min-h-11"
                                    >
                                        {testLoading ? 'Loading Practice...' : 'Start Practice'}
                                    </motion.button>
                                    {error && <motion.p className="text-rose-400 text-sm text-center mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
                                </motion.div>
                            )}

                            {/* Mock Test Section */}
                            {selectedMode === 'mock' && (
                                <MockTestSection
                                    exam={exam}
                                    branch={branch}
                                    subject={subject}
                                    subjects={subjects}
                                    selectedExam={selectedExam}
                                    onExamChange={onExamChange}
                                    onBranchChange={onBranchChange}
                                    onSubjectChange={onSubjectChange}
                                    onMockTestTypeChange={onMockTestTypeChange}
                                    onStartMockTest={onStartMockTest}
                                    testLoading={mockTestLoading}
                                    error={mockTestError}
                                    selectedMockTestType={mockTestType}
                                />
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Mock Test Section Component
const MockTestSection = ({
    exam,
    branch,
    subject,
    subjects,
    selectedExam,
    onExamChange,
    onBranchChange,
    onSubjectChange,
    onMockTestTypeChange,
    onStartMockTest,
    testLoading,
    error,
    selectedMockTestType,
}) => {
    // Local state mirrors the prop to provide instant UI feedback on click
    const [localMockTestType, setLocalMockTestType] = React.useState(selectedMockTestType || '');

    // Keep local state in sync with prop changes (e.g., when Redux updates)
    React.useEffect(() => {
        if (selectedMockTestType && selectedMockTestType !== localMockTestType) {
            setLocalMockTestType(selectedMockTestType);
        }
    }, [selectedMockTestType]);

    const navigate = useNavigate();

    // Combine backend subjects with static EXAM_DATA as fallback
    const staticSubjects = EXAM_DATA[exam]?.branches?.[branch] || [];
    const combinedSubjects = [...new Set([...(subjects || []), ...staticSubjects])];

    const MOCK_TEST_TYPES = [
        {
            id: 'full',
            label: 'Full Length Mock Test',
            description: 'Complete exam simulation with all sections for selected branch',
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
            description: 'Focus on a specific subject for targeted practice',
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

    // For Full Length test, we don't need a specific subject
    // For Subject-wise test, we need a subject selected
    const isSubjectWise = localMockTestType === 'subject';
    const isFullLength = localMockTestType === 'full';
    const canStartTest = branch && (isFullLength || (isSubjectWise && subject));

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="space-y-6 animate-fade-up"
        >
            <motion.button
                onClick={() => {
                    // Reset exam selection via parent handler
                    if (onExamChange) {
                        onExamChange({ target: { value: '' } });
                    }
                    // Navigate back to the main exam selection route
                    navigate('/exam');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-sm text-neon-cyan hover:underline mb-2 flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ← Back to Exam Selection
            </motion.button>

            {/* Step 1: Branch Selection */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <label className="block text-sm font-medium text-slate-300 mb-1">Branch / Stream</label>
                <select
                    value={branch}
                    onChange={onBranchChange}
                    className="input-dark min-h-11 w-full"
                >
                    <option value="">Select Branch / Stream</option>
                    {Object.keys(EXAM_DATA[selectedExam]?.branches || {}).map((b) => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>
            </motion.div>

            {/* Step 2: Mock Test Type Selection (only after branch is selected) */}
            {branch && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    <label className="block text-sm font-medium text-slate-300 mb-3">Select Mock Test Type</label>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {MOCK_TEST_TYPES.map((type) => (
                            <motion.button
                                key={type.id}
                                onClick={() => {
                                    setLocalMockTestType(type.id);
                                    onMockTestTypeChange?.({ target: { value: type.id } });
                                }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 min-h-[200px] ${selectedMockTestType === type.id
                                    ? `${type.borderColor} bg-gradient-to-br ${type.bgColor} shadow-lg shadow-${type.color.split(' ')[0].replace('from-', '')}/20`
                                    : 'bg-white/5 border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'}`}
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${type.color.replace('from-', 'bg-gradient-to-br from-').replace('to-', ' to-')} text-night-900`}>
                                    {type.icon}
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-white text-lg">{type.label}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{type.description}</p>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <span className="text-xs text-slate-400">Duration: {type.duration}</span>
                                    <span className="text-xs text-slate-400">Questions: {type.questions}</span>
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
                    {!selectedMockTestType && (
                        <p className="text-xs text-amber-400 mt-2 text-center">
                            Select a mock test type to continue
                        </p>
                    )}
                </motion.div>
            )}

            {/* Subject selection for Subject‑wise mock test */}
            {isSubjectWise && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                >
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                    <select
                        value={subject}
                        onChange={onSubjectChange}
                        disabled={!branch}
                        className="input-dark min-h-11 w-full"
                    >
                        <option value="">{branch ? 'Select Subject' : 'Select a branch first'}</option>
                        {combinedSubjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </motion.div>
            )}

            {/* Start Mock Test Button */}
            <motion.button
                onClick={onStartMockTest}
                disabled={!canStartTest || testLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`btn-primary w-full mt-6 min-h-11 ${!canStartTest ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {testLoading ? 'Loading Mock Test...' : `Start ${MOCK_TEST_TYPES.find(t => t.id === selectedMockTestType)?.label || 'Mock Test'}`}
            </motion.button>
            {error && <motion.p className="text-rose-400 text-sm text-center mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
        </motion.div>
    );
};

const handleExamClick = (examKey) => {
    setSelectedExam(examKey);
    if (onExamChange) {
        onExamChange({ target: { value: examKey } });
    }
};

export default FilterSelection;
