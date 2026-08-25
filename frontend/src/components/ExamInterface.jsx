import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterSelection from './FilterSelection';
import ResultsScreen from './ResultsScreen';
import TestScreen from './TestScreen';
import { setCurrentIndex, setAnswer, toggleMarkForReview, setTimeRemaining, submitTest, resetTest } from '../app/slices/testSlice';
import { setBranch, setSubject, setYear } from '../app/slices/filterSlice';
import { fetchQuestions } from '../app/slices/testSlice';
import { YEAR_LIST, getBranchesForExam, getSubjectsForBranch } from '../data/gateData';
import toast from 'react-hot-toast';

const ExamInterface = () => {
    const dispatch = useDispatch();
    const { exam, branch, subject, year } = useSelector((state) => state.filter);
    const { questions, currentIndex, answers, markedForReview, timeRemaining, isSubmitted, score, testConfig, loading: testLoading, error } = useSelector((state) => state.test);

    // Static cascading data (exam-aware)
    const branches = getBranchesForExam(exam);
    const subjects = branch ? getSubjectsForBranch(exam, branch) : [];
    const years = subject ? YEAR_LIST : [];

    // Cascading handlers: changing a parent resets its children
    const handleBranchChange = (e) => {
        dispatch(setBranch(e.target.value));
        dispatch(setSubject(''));
        dispatch(setYear(''));
    };

    const handleSubjectChange = (e) => {
        dispatch(setSubject(e.target.value));
        dispatch(setYear(''));
    };

    const handleYearChange = (e) => {
        dispatch(setYear(e.target.value));
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
        if (!branch || !subject || !year) return;
        dispatch(fetchQuestions({ exam, branch, subject, year }));
        dispatch(setTimeRemaining(testConfig.durationMinutes * 60));
    }, [exam, branch, subject, year, dispatch, testConfig.durationMinutes]);

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
            dispatch(setYear(''));
        }
    }, [dispatch]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Filter selection screen
    if (questions.length === 0 && !isSubmitted) {
        return (
            <FilterSelection
                exam={exam}
                branch={branch}
                subject={subject}
                year={year}
                branches={branches}
                subjects={subjects}
                years={years}
                onBranchChange={handleBranchChange}
                onSubjectChange={handleSubjectChange}
                onYearChange={handleYearChange}
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