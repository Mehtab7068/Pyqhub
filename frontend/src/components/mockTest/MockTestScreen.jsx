import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionViewer from '../QuestionViewer/QuestionViewer';
import QuestionPalette from '../QuestionPalette';
import Navbar from '../Navbar';
import { setCurrentIndex, setAnswer, setConfidence, submitAnswer, incrementQuestionTime, submitTest, setMockTestConfig, resetTest } from '../../app/slices/testSlice';
import { setBranch, setSubject, setMockTestType } from '../../app/slices/filterSlice';
import { fetchMockTestQuestions } from '../../app/slices/testSlice';
import toast from 'react-hot-toast';
import useLeaveTestGuard from '../../hooks/useLeaveTestGuard';
import { getExamConfig } from '../../data/examConfig';

const MockTestScreen = () => {
    const dispatch = useDispatch();
    const { questions, currentIndex, answers, confidence, submittedAnswers, questionTimes, timeRemaining, isSubmitted, testLoading, mockTestConfig } = useSelector((state) => state.test);
    const { exam, branch, subject, mockTestType } = useSelector((state) => state.filter);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [showFinishConfirm, setShowFinishConfirm] = React.useState(false);
    const [showPauseModal, setShowPauseModal] = React.useState(false);
    const isTestInProgress = questions.length > 0 && !isSubmitted;

    const leaveTest = useCallback(() => {
        dispatch(resetTest());
    }, [dispatch]);

    useLeaveTestGuard(isTestInProgress, leaveTest);

    const currentQuestion = questions[currentIndex];
    const isCurrentSubmitted = currentQuestion ? !!submittedAnswers[currentQuestion._id] : false;
    const currentAnswer = currentQuestion ? answers[currentQuestion._id] : undefined;
    const currentQuestionTime = currentQuestion ? (questionTimes[currentQuestion._id] || 0) : 0;

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Per-question timer
    useEffect(() => {
        if (!currentQuestion || isCurrentSubmitted || isSubmitted) return;
        const timer = setInterval(() => {
            dispatch(incrementQuestionTime(currentQuestion._id));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentQuestion?._id, isCurrentSubmitted, isSubmitted, dispatch]);

    // Overall test timer
    useEffect(() => {
        if (isSubmitted || questions.length === 0 || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            dispatch(setTimeRemaining(timeRemaining - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, isSubmitted, questions.length, dispatch]);

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeRemaining === 0 && !isSubmitted && questions.length > 0) {
            dispatch(submitTest());
            toast.success('Time\'s up! Test auto-submitted.');
        }
    }, [timeRemaining, isSubmitted, questions.length, dispatch]);

    const handleStartTest = useCallback(() => {
        if (!branch || !subject || !mockTestType) return;
        dispatch(fetchMockTestQuestions({ exam, branch, subject, mockTestType }));
        // Set timer based on mock test type
        const durations = getExamConfig(exam).durations;
        dispatch(setMockTestConfig({ durationMinutes: durations[mockTestType] || 180 }));
        dispatch(setTimeRemaining((durations[mockTestType] || 180) * 60));
    }, [exam, branch, subject, mockTestType, dispatch]);

    const handleAnswerChange = useCallback((answer) => {
        const currentQuestion = questions[currentIndex];
        if (currentQuestion) {
            dispatch(setAnswer({ questionId: currentQuestion._id, answer }));
        }
    }, [currentIndex, questions, dispatch]);

    const handleSubmit = useCallback(() => {
        if (window.confirm('Are you sure you want to submit the mock test? This action cannot be undone.')) {
            dispatch(submitTest());
            toast.success('Mock test submitted successfully!');
        }
    }, [dispatch]);

    const handlePause = useCallback(() => {
        setShowPauseModal(true);
    }, []);

    const handleResume = useCallback(() => {
        setShowPauseModal(false);
    }, []);

    const handleFinishConfirm = useCallback(() => {
        setShowFinishConfirm(true);
    }, []);

    // No questions found screen
    if (mockTestConfig.noQuestionsFound && questions.length === 0 && !isSubmitted) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center p-4 pt-20">
                    <div className="glass-card p-8 w-full max-w-md text-center animate-fade-up">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No Questions Available</h2>
                        <p className="text-slate-400 mb-6">
                            No questions found for this mock test configuration. Please try a different subject or mock test type.
                        </p>
                        <button
                            onClick={() => {
                                dispatch(setBranch(''));
                                dispatch(setSubject(''));
                                dispatch(setMockTestType(''));
                            }}
                            className="btn-primary"
                        >
                            Back to Selection
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Selection screen
    if (questions.length === 0 && !isSubmitted) {
        return (
            <div className="min-h-screen">
                <MockTestSelection
                    exam="GATE"
                    branch={branch}
                    subject={subject}
                    subjects={subjects}
                    onExamChange={() => { }}
                    onBranchChange={(e) => dispatch(setBranch(e.target.value))}
                    onSubjectChange={(e) => dispatch(setSubject(e.target.value))}
                    onMockTestTypeChange={(e) => dispatch(setMockTestType(e.target.value))}
                    onStartMockTest={handleStartTest}
                    testLoading={testLoading}
                    error={mockTestConfig.error}
                    selectedMockTestType={mockTestType}
                />
            </div>
        );
    }

    // Results screen
    if (isSubmitted) {
        return <ResultsScreen />;
    }

    // Active test screen
    return (
        <div className="min-h-screen flex">
            <Navbar />

            {/* Sidebar / Question Palette */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed top-0 left-0 z-50 h-full w-72 lg:w-80 bg-night-800 border-r border-white/10 lg:static lg:z-auto lg:h-auto lg:border-r lg:border-white/10"
                    >
                        <QuestionPalette
                            questions={questions}
                            currentIndex={currentIndex}
                            answers={answers}
                            markedForReview={useSelector((state) => state.test.markedForReview)}
                            onQuestionClick={(index) => dispatch(setCurrentIndex(index))}
                            onClose={() => setSidebarOpen(false)}
                        />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:pl-0 overflow-auto">
                {/* Top Bar */}
                <div className="sticky top-0 z-30 bg-night-900/80 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-full mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            {/* Left: Menu + Test Info */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
                                    aria-label="Open question palette"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-xs text-slate-500">Mock Test</span>
                                    <span className="font-semibold text-white text-sm">
                                        {mockTestConfig.type ? mockTestConfig.type.charAt(0).toUpperCase() + mockTestConfig.type.slice(1) : 'Mock Test'}
                                    </span>
                                </div>
                            </div>

                            {/* Center: Timer */}
                            <div className="flex items-center justify-center">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border ${timeRemaining < 300 ? 'border-rose-500/50 text-rose-400 animate-pulse' : 'border-white/10 text-white'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-mono text-lg tabular-nums">{formatTime(timeRemaining)}</span>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePause}
                                    disabled={isSubmitted}
                                    className="btn-ghost px-4 py-2 text-sm hidden sm:flex"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Pause
                                </button>
                                <button
                                    onClick={handleFinishConfirm}
                                    disabled={isSubmitted}
                                    className="btn-primary px-4 py-2 text-sm"
                                >
                                    Finish Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-violet"
                    />
                </div>

                {/* Test Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Question Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between mb-6"
                        >
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm font-medium border border-neon-blue/30">
                                    Q{currentIndex + 1} / {questions.length}
                                </span>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30">
                                    {mockTestConfig.type?.charAt(0).toUpperCase() + mockTestConfig.type.slice(1) || 'Mock'}
                                </span>
                                {currentQuestion?.marks && (
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium border border-amber-500/30">
                                        {currentQuestion.marks} Mark{currentQuestion.marks !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => dispatch(toggleMarkForReview(currentQuestion._id))}
                                    className={`p-2 rounded-lg transition-colors ${useSelector((state) => state.test.markedForReview.includes(currentQuestion._id)) ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                    title="Mark for Review"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>

                        {/* Question Viewer */}
                        <QuestionViewer
                            question={currentQuestion}
                            answer={currentAnswer}
                            onAnswerChange={handleAnswerChange}
                            showCorrectAnswer={false}
                        />

                        <div className="mt-5 p-4 rounded-xl border border-white/10 bg-white/5">
                            <p className="text-sm text-slate-300 mb-3">How confident are you?</p>
                            <div className="grid grid-cols-3 gap-2 max-w-md">
                                {['low', 'medium', 'high'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => dispatch(setConfidence({ questionId: currentQuestion._id, confidence: level }))}
                                        className={`px-3 py-2 rounded-lg text-sm capitalize border ${confidence[currentQuestion._id] === level ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan' : 'border-white/10 text-slate-400 hover:bg-white/10'}`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between mt-8 pt-6 border-t border-white/10"
                        >
                            <button
                                onClick={() => dispatch(setCurrentIndex(currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="btn-ghost px-6 py-2 disabled:opacity-40"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>

                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span>Time on this question:</span>
                                <span className="font-mono text-neon-cyan">{formatTime(currentQuestionTime)}</span>
                            </div>

                            <button
                                onClick={() => {
                                    if (currentIndex === questions.length - 1) {
                                        handleFinishConfirm();
                                    } else {
                                        dispatch(setCurrentIndex(currentIndex + 1));
                                    }
                                }}
                                className={`btn-primary px-6 py-2 ${currentIndex === questions.length - 1 ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                            >
                                {currentIndex === questions.length - 1 ? 'Finish Test' : 'Next'}
                                <svg className={`w-4 h-4 ml-1 ${currentIndex === questions.length - 1 ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Pause Modal */}
                <AnimatePresence>
                    {showPauseModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setShowPauseModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-card p-8 w-full max-w-md text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neon-blue/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Test Paused</h3>
                                <p className="text-slate-400 mb-6">Your time is paused. Resume when ready.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleResume}
                                        className="btn-primary flex-1"
                                    >
                                        Resume Test
                                    </button>
                                    <button
                                        onClick={handleFinishConfirm}
                                        className="btn-ghost flex-1"
                                    >
                                        Finish Test
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Finish Confirmation Modal */}
                <AnimatePresence>
                    {showFinishConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setShowFinishConfirm(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-card p-8 w-full max-w-md text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Finish Mock Test?</h3>
                                <p className="text-slate-400 mb-6">Are you sure you want to submit? This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        className="btn-primary flex-1"
                                    >
                                        Yes, Submit
                                    </button>
                                    <button
                                        onClick={() => setShowFinishConfirm(false)}
                                        className="btn-ghost flex-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MockTestScreen;