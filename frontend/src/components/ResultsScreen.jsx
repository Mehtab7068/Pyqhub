import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import { resetTest, saveAttempt, getMarksAwarded, isCorrectAnswer } from '../app/slices/testSlice';
import { setBranch as setFilterBranch, setSubject as setFilterSubject } from '../app/slices/filterSlice';
import toast from 'react-hot-toast';

const ResultsScreen = () => {
    const dispatch = useDispatch();
    const { score, testConfig, timeRemaining, answers, confidence, questionTimes, attemptSaved, attemptSaving } = useSelector((state) => state.test);
    const { questions } = useSelector((state) => state.test);
    const { exam, branch, subject, chapter, mockTestType } = useSelector((state) => state.filter);

    const percentage = testConfig.totalMarks > 0 ? Math.round((score / testConfig.totalMarks) * 100) : 0;

    React.useEffect(() => {
        if (percentage >= 80) {
            toast.success(`Excellent! You scored ${percentage}%`);
        } else if (percentage >= 50) {
            toast(`Good job! You scored ${percentage}%`, { icon: '👏' });
        } else {
            toast.error(`You scored ${percentage}%. Keep practicing!`);
        }
    }, [percentage]);

    React.useEffect(() => {
        if (attemptSaved || attemptSaving || questions.length === 0) return;
        const responses = questions.map((question) => {
            const answer = answers[question._id];
            return {
                questionId: String(question._id),
                answer,
                correct: isCorrectAnswer(question, answer),
                marksAwarded: getMarksAwarded(question, answer, exam),
                timeSpent: questionTimes[question._id] || 0,
                confidence: confidence[question._id] || 'medium',
                subject,
                chapter: question.chapter || chapter || '',
                topic: question.topic || '',
                difficulty: question.difficulty || '',
                questionType: question.questionType || '',
            };
        });

        dispatch(saveAttempt({
            mode: mockTestType ? 'mock' : 'practice',
            mockTestType: mockTestType || '',
            exam: exam || 'GATE',
            branch,
            subject,
            chapter: chapter || '',
            responses,
            score,
            totalMarks: testConfig.totalMarks,
            timeTaken: Math.max(0, testConfig.durationMinutes * 60 - timeRemaining),
        }));
    }, [attemptSaved, attemptSaving, questions, answers, questionTimes, score, testConfig, timeRemaining, exam, branch, subject, chapter, mockTestType, dispatch]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the practice? All progress will be lost.')) {
            dispatch(resetTest());
            dispatch(setFilterBranch(''));
            dispatch(setFilterSubject(''));
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center p-4 pt-10">
                <div className="glass-card p-8 w-full max-w-2xl animate-fade-up">
                    <h1 className="text-3xl font-extrabold text-center mb-6 text-gradient">Practice Submitted</h1>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="glass-card p-4 text-center">
                            <p className="text-sm text-slate-400">Score</p>
                            <p className="text-3xl font-bold text-neon-cyan">{Number(score).toFixed(2)} / {testConfig.totalMarks}</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <p className="text-sm text-slate-400">Percentage</p>
                            <p className="text-3xl font-bold text-emerald-400">
                                {testConfig.totalMarks > 0 ? Math.round((score / testConfig.totalMarks) * 100) : 0}%
                            </p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <p className="text-sm text-slate-400">Total Questions</p>
                            <p className="text-3xl font-bold text-violet-400">{questions.length}</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <p className="text-sm text-slate-400">Time Taken</p>
                            <p className="text-3xl font-bold text-amber-400">{formatTime(testConfig.durationMinutes * 60 - timeRemaining)}</p>
                        </div>
                    </div>

                    {attemptSaving && <p className="text-center text-sm text-slate-400 mb-4">Saving your attempt...</p>}
                    {attemptSaved && <p className="text-center text-sm text-emerald-400 mb-4">Attempt saved to your history.</p>}

                    <div className="flex gap-4">
                        <button
                            onClick={handleReset}
                            className="btn-ghost flex-1"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsScreen;