import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterSelection from './FilterSelection';
import ResultsScreen from './ResultsScreen';
import TestScreen from './TestScreen';
import MockTestScreen from './mockTest/MockTestScreen';
import NoQuestionsPage from './NoQuestionsPage';
import { setCurrentIndex, setAnswer, toggleMarkForReview, setTimeRemaining, setTestExam, submitTest, resetTest, setMockTestConfig } from '../app/slices/testSlice';
import { setBranch, setSubject, setMode, setChapter, setExam, setMockTestType, fetchChapters } from '../app/slices/filterSlice';
import { fetchQuestions, fetchMockTestQuestions } from '../app/slices/testSlice';
import { getBranchesForExam, getSubjectsForBranch, getChaptersForSubject } from '../data/gateData';
import toast from 'react-hot-toast';
import { getExamConfig } from '../data/examConfig';

const ExamInterface = () => {
    const dispatch = useDispatch();
    const { exam, branch, subject, mode, chapter, mockTestType, chapters: storedChapters } = useSelector((state) => state.filter);
    const { questions, currentIndex, answers, markedForReview, timeRemaining, isSubmitted, testLoading, mockTestConfig } = useSelector((state) => state.test);

    // Static cascading data (exam-aware)
    const branches = getBranchesForExam(exam);
    const subjects = branch ? getSubjectsForBranch(exam, branch) : [];
    const chapters = [...new Set([...(subject ? getChaptersForSubject(subject) : []), ...(storedChapters || [])])];

    useEffect(() => {
        if (exam && branch && subject) dispatch(fetchChapters({ exam, branch, subject }));
    }, [exam, branch, subject, dispatch]);

    useEffect(() => {
        dispatch(setTestExam(exam));
    }, [exam, dispatch]);

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

    const handleMockTestTypeChange = (e) => {
        dispatch(setMockTestType(e.target.value));
    };

    const handleStartTest = useCallback(() => {
        if (!branch || !subject) return;
        if (mode === 'chapter' && !chapter) return;
        dispatch(fetchQuestions({ exam, branch, subject, chapter: mode === 'chapter' ? chapter : undefined }));
        dispatch(setTimeRemaining(getExamConfig(exam).durations.subject * 60));
    }, [exam, branch, subject, mode, chapter, dispatch]);

    const handleStartMockTest = useCallback(() => {
        if (!branch || !subject || !mockTestType) return;
        dispatch(fetchMockTestQuestions({ exam, branch, subject, mockTestType, chapter: mockTestType === 'chapter' ? chapter : undefined }));
        // Set timer based on mock test type
        const durations = getExamConfig(exam).durations;
        dispatch(setMockTestConfig({ durationMinutes: durations[mockTestType] || 180 }));
        dispatch(setTimeRemaining((durations[mockTestType] || 180) * 60));
    }, [exam, branch, subject, mockTestType, chapter, dispatch]);

    // Back button handler to reset test state when returning to filter selection
    const handleBackToExam = () => {
        dispatch(resetTest());
    };

    // No questions found screen - show when backend indicates no questions available for this subject/chapter
    if (mockTestConfig.noQuestionsFound && questions.length === 0 && !isSubmitted) {
        return (
            <NoQuestionsPage
                exam={exam}
                branch={branch}
                subject={subject}
                chapter={chapter}
                onReset={() => {
                    dispatch(setBranch(''));
                    dispatch(setSubject(''));
                    dispatch(setMockTestType(''));
                }}
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
                onStartTest={handleStartTest}
                onExamChange={handleExamChange}
                testLoading={testLoading}
                error={mockTestConfig.error}
                // Mock test props
                mockTestType={mockTestType}
                onMockTestTypeChange={handleMockTestTypeChange}
                onStartMockTest={handleStartMockTest}
                mockTestLoading={testLoading}
                mockTestError={mockTestConfig.error}
                onBackToExam={handleBackToExam}
            />
        );
    }

    // Results screen
    if (isSubmitted) {
        return <ResultsScreen />;
    }

    // Active test screen - determine if it's mock test or regular practice
    const isMockTest = mockTestType && mockTestType !== '';
    return isMockTest ? <MockTestScreen /> : <TestScreen />;
};

export default ExamInterface;