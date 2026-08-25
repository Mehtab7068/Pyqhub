import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import QuestionViewer from './QuestionViewer';
import QuestionPalette from './QuestionPalette';
import { setCurrentIndex, setAnswer, submitAnswer, incrementQuestionTime, submitTest } from '../app/slices/testSlice';
import toast from 'react-hot-toast';

const TestScreen = () => {
    const dispatch = useDispatch();
    const { questions, currentIndex, answers, submittedAnswers, questionTimes, timeRemaining, isSubmitted, testLoading } = useSelector((state) => state.test);
    const { branch, subject, year } = useSelector((state) => state.filter);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);
    const isTestInProgress = questions.length > 0 && !isSubmitted;

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

    const formatShortTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Per-question timer: ticks every second until that question is submitted
    useEffect(() => {
        if (!currentQuestion || isCurrentSubmitted || isSubmitted) return;
        const timer = setInterval(() => {
            dispatch(incrementQuestionTime(currentQuestion._id));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentQuestion?._id, isCurrentSubmitted, isSubmitted, dispatch]);

    // Auto-submit test when all questions are submitted (practice mode)
    useEffect(() => {
        if (questions.length > 0 && !isSubmitted) {
            const allSubmitted = questions.every(q => submittedAnswers[q._id]);
            if (allSubmitted) {
                dispatch(submitTest());
                toast.success('All questions submitted! Viewing results.');
            }
        }
    }, [submittedAnswers, questions, isSubmitted, dispatch]);

    const checkCorrect = (q, ans) => {
        if (q.questionType === 'MSQ') {
            const sel = Array.isArray(ans) ? ans : [ans];
            const cor = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
            return JSON.stringify([...sel].sort()) === JSON.stringify([...cor].sort());
        }
        if (q.questionType === 'NAT') {
            return Math.abs(Number(ans) - Number(q.correctAnswer)) < 1e-6;
        }
        return String(ans) === String(q.correctAnswer);
    };

    const handleAnswerChange = (answer) => {
        if (currentQuestion && !isCurrentSubmitted) {
            dispatch(setAnswer({ questionId: currentQuestion._id, answer }));
        }
    };

    const hasAnswer = currentAnswer !== undefined && currentAnswer !== '' &&
        !(Array.isArray(currentAnswer) && currentAnswer.length === 0);

    const handleSubmitAnswer = () => {
        if (!currentQuestion || !hasAnswer || isCurrentSubmitted) return;
        dispatch(submitAnswer(currentQuestion._id));
        if (checkCorrect(currentQuestion, currentAnswer)) {
            toast.success('Correct answer! Well done.');
        } else {
            toast.error('Incorrect. Check the explanation below.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isTestInProgress={isTestInProgress} />
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden fixed bottom-6 left-6 z-50 btn-primary rounded-full shadow-lg"
                    aria-label="Toggle question palette"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-80 glass-panel p-4 overflow-y-auto
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    pt-20 lg:pt-4
                `}>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-white">{branch} - {subject}</h2>
                        <p className="text-sm text-slate-400">Year: {year}</p>
                    </div>

                    <QuestionPalette
                        questions={questions}
                        currentIndex={currentIndex}
                        onSelectQuestion={(idx) => {
                            dispatch(setCurrentIndex(idx));
                            setSidebarOpen(false);
                        }}
                    />

                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-300">Time Remaining</span>
                            <span className={`text-lg font-mono font-bold ${timeRemaining < 300 ? 'text-rose-400' : 'text-white'}`}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-300">Time on Question</span>
                            <span className="text-lg font-mono font-bold text-neon-cyan">
                                {formatShortTime(currentQuestionTime)}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                            {Object.keys(submittedAnswers).length} of {questions.length} submitted — click "Finish Test" when you're ready to see results.
                        </p>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">
                                Question {currentIndex + 1} of {questions.length}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-400 hidden sm:inline">
                                    {Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length} answered
                                </span>
                                {isTestInProgress && (
                                    <button
                                        onClick={() => setShowFinishConfirm(true)}
                                        className="px-4 py-2 bg-rose-500/80 text-white font-semibold rounded-lg hover:bg-rose-500 transition-all duration-200 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-sm"
                                    >
                                        Finish Test
                                    </button>
                                )}
                            </div>
                        </div>

                        {testLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
                            </div>
                        ) : currentQuestion ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-slate-300">
                                        Question {currentIndex + 1} of {questions.length}
                                    </span>
                                    <span className="text-sm font-medium text-neon-cyan">
                                        Time: {formatShortTime(currentQuestionTime)}
                                    </span>
                                </div>

                                <QuestionViewer
                                    question={currentQuestion}
                                    answer={answers[currentQuestion._id]}
                                    onAnswerChange={handleAnswerChange}
                                    showCorrectAnswer={isCurrentSubmitted}
                                />

                                {/* Submit answer button (practice mode) */}
                                {!isCurrentSubmitted && (
                                    <div className="mt-6">
                                        <button
                                            onClick={handleSubmitAnswer}
                                            disabled={!hasAnswer}
                                            className="w-full px-6 py-3 bg-emerald-500/80 text-white font-semibold rounded-lg hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        >
                                            Submit Answer
                                        </button>
                                        <p className="text-xs text-slate-500 text-center mt-2">
                                            Submit to see whether your answer is correct and view the explanation.
                                        </p>
                                    </div>
                                )}

                                {isCurrentSubmitted && (
                                    <div className="mt-6 p-4 glass-card">
                                        <p className="text-sm text-slate-300">
                                            This question has been submitted. You can still navigate to other questions.
                                        </p>
                                    </div>
                                )}

                                {/* Prev / Next navigation */}
                                <div className="flex items-center justify-between mt-6">
                                    <button
                                        onClick={() => dispatch(setCurrentIndex(currentIndex - 1))}
                                        disabled={currentIndex === 0}
                                        className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        ← Previous
                                    </button>
                                    <span className="text-sm text-slate-400">
                                        {currentIndex + 1} / {questions.length}
                                    </span>
                                    <button
                                        onClick={() => dispatch(setCurrentIndex(currentIndex + 1))}
                                        disabled={currentIndex >= questions.length - 1}
                                        className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-slate-400 py-20">No question selected</div>
                        )}
                    </div>
                </main>
            </div>

            {/* Finish Test Confirmation Modal */}
            {showFinishConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowFinishConfirm(false)} />
                    <div className="glass-card p-6 w-full max-w-md relative z-10 animate-fade-up">
                        <h3 className="text-xl font-bold text-white mb-2">Finish Practice Test?</h3>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to finish? Your progress will be saved and you'll see your results.
                            {Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length < questions.length && (
                                <span className="block mt-2 text-amber-400">
                                    You have only answered {Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length} of {questions.length} questions.
                                </span>
                            )}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFinishConfirm(false)}
                                className="btn-ghost flex-1"
                            >
                                Continue Practice
                            </button>
                            <button
                                onClick={() => {
                                    dispatch(submitTest());
                                    setShowFinishConfirm(false);
                                    toast.success('Practice submitted! Viewing results.');
                                }}
                                className="flex-1 px-6 py-3 bg-rose-500/80 text-white font-semibold rounded-lg hover:bg-rose-500 transition-all duration-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                            >
                                Finish Test
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestScreen;