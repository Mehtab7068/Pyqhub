import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterSelection from './FilterSelection';
import ResultsScreen from './ResultsScreen';
import TestScreen from './TestScreen';
import NoQuestionsPage from './NoQuestionsPage';
import { setCurrentIndex, setAnswer, toggleMarkForReview, setTimeRemaining, submitTest, resetTest } from '../app/slices/testSlice';
import { setBranch, setSubject, setMode, setChapter, setExam } from '../app/slices/filterSlice';
import { fetchQuestions } from '../app/slices/testSlice';
import { getBranchesForExam, getSubjectsForBranch, getChaptersForSubject } from '../data/gateData';
import toast from 'react-hot-toast';

const ExamInterface = () => {
    const dispatch = useDispatch();
    const { exam, branch, subject, mode, chapter } = useSelector((state) => state.filter);
    const { questions, currentIndex, answers, markedForReview, timeRemaining, isSubmitted, score, testConfig, loading: testLoading, error, noQuestionsFound } = useSelector((state) => state.test);

    // Static cascading data (exam-aware)
    const branches = getBranchesForExam(exam);
    const subjects = branch ? getSubjectsForBranch(exam, branch) : [];
    const chapters = subject ? getChaptersForSubject(subject) : [];

    // Cascading handlers: changing a parent resets its children
    const handleBranchChange = (e) => {
        dispatch(setBranch(e.target.value));
        dispatch(setSubject(''));
    };

    const handleExamChange = (e) => {
        dispatch(setExam(e.target.value));
        // Reset dependent selections
        dispatch(setBranch(''));
        dispatch(setSubject(''));
    };

    const handleSubjectChange = (e) => {
        const newSubject = e.target.value;
        dispatch(setSubject(newSubject));
        dispatch(setChapter(''));
        if (newSubject) {
            const chapters = getChaptersForSubject(newSubject);
            // Optionally dispatch to Redux if needed elsewhere
        }
    };

    const handleModeChange = (e) => {
        dispatch(setMode(e.target.value));
    };

    const handleChapterChange = (e) => {
        dispatch(setChapter(e.target.value));
    };

    // Timer effect — runs while practice is active (not submitted) and time remains
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
        }
    }, [timeRemaining, isSubmitted, questions.length, dispatch]);

    const handleStartTest = useCallback(() => {
        if (!branch || !subject) return;
        if (mode === 'chapter' && !chapter) return;
        dispatch(fetchQuestions({ exam, branch, subject, chapter: mode === 'chapter' ? chapter : undefined }));
        dispatch(setTimeRemaining(testConfig.durationMinutes * 60));
    }, [exam, branch, subject, mode, chapter, dispatch, testConfig.durationMinutes]);

    const handleAnswerChange = useCallback((answer) => {
        const currentQuestion = questions[currentIndex];
        if (currentQuestion) {
            dispatch(setAnswer({ questionId: currentQuestion._id, answer }));
        }
    }, [currentIndex, questions, dispatch]);

    const handleSubmit = useCallback(() => {
        if (window.confirm('Are you sure you want to submit the practice? This action cannot be undone.')) {
            dispatch(submitTest());
            toast.success('Practice submitted successfully!');
        }
    }, [dispatch]);

    const handleReset = useCallback(() => {
        if (window.confirm('Are you sure you want to reset the practice? All progress will be lost.')) {
            dispatch(resetTest());
            dispatch(setBranch(''));
            dispatch(setSubject(''));
        }
    }, [dispatch]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // No questions found screen - show when backend indicates no questions available for this subject/chapter
    if (noQuestionsFound && questions.length === 0 && !isSubmitted) {
        return (
            <NoQuestionsPage
                exam={exam}
                branch={branch}
                subject={subject}
                chapter={chapter}
                onReset={handleReset}
            />
        );
    }

    // Filter selection screen
    if (questions.length === 0 && !isSubmitted) {
        return (
            <FilterSelection
                exam={exam}
                branch={branch}
                subject={subject}
                mode={mode}
                chapter={chapter}
                branches={branches}
                subjects={subjects}
                chapters={chapters}
                onBranchChange={handleBranchChange}
                onSubjectChange={handleSubjectChange}
                onModeChange={handleModeChange}
                onChapterChange={handleChapterChange}
                onExamChange={handleExamChange}
                onStartTest={handleStartTest}
                testLoading={testLoading}
                error={error}
            />
        );
    }

    // Results screen
    if (isSubmitted) {
        return <ResultsScreen />;
    }

    // Active test screen
    return <TestScreen />;
};

export default ExamInterface;