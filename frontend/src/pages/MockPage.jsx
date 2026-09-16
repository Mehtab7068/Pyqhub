import React from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSelection from '../components/FilterSelection';
import { useDispatch, useSelector } from 'react-redux';
import { setBranch, setSubject, setExam, setMode, setChapter } from '../app/slices/filterSlice';
import { setMockTestType, fetchSubjects, fetchChapters } from '../app/slices/filterSlice';
import { fetchMockTestQuestions, resetTest } from '../app/slices/testSlice';
import { getChaptersForSubject } from '../data/gateData';

const MockPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exam, branch, subject, mode, chapter, branches, subjects, chapters: storedChapters } = useSelector((state) => state.filter);
    const { loading: testLoading, error } = useSelector((state) => state.test);
    const mockTestLoading = testLoading;
    const mockTestError = error;
    const mockTestType = useSelector((state) => state.filter.mockTestType);

    // Compute chapters locally from static data (like ExamInterface does)
    const chapters = [...new Set([...(subject ? getChaptersForSubject(subject) : []), ...(storedChapters || [])])];

    React.useEffect(() => {
        if (exam && branch && subject) dispatch(fetchChapters({ exam, branch, subject }));
    }, [exam, branch, subject, dispatch]);

    const handleExamChange = (e) => {
        const selectedExam = e.target.value;
        dispatch(setExam(selectedExam));
        dispatch(setBranch(''));
        dispatch(setSubject(''));
        dispatch(setChapter(''));
    };

    const handleBranchChange = (e) => {
        const selectedBranch = e.target.value;
        dispatch(setBranch(selectedBranch));
        dispatch(setSubject(''));
        dispatch(setChapter(''));
        // Load subjects for the selected branch
        dispatch(fetchSubjects({ branch: selectedBranch, exam }));
    };

    const handleSubjectChange = (e) => {
        const selectedSubject = e.target.value;
        dispatch(setSubject(selectedSubject));
        dispatch(setChapter(''));
    };

    const handleChapterChange = (e) => {
        const selectedChapter = e.target.value;
        dispatch(setChapter(selectedChapter));
    };

    const handleModeChange = (e) => {
        const selectedMode = e.target.value;
        dispatch(setMode(selectedMode));
    };

    const handleStartTest = async () => {
        // For mock page, start test is same as start mock test
        dispatch(fetchMockTestQuestions({ exam, branch, subject, mockTestType, chapter: mockTestType === 'chapter' ? chapter : undefined }));
        // Navigate to exam page where MockTestScreen will be shown
        navigate('/exam');
    };

    const handleMockTestTypeChange = (e) => {
        const selectedMockTestType = e.target.value;
        dispatch(setMockTestType(selectedMockTestType));
    };

    const handleStartMockTest = async () => {
        // Dispatch async thunk to fetch mock test questions based on selected filters and type
        dispatch(fetchMockTestQuestions({ exam, branch, subject, mockTestType }));
        // Navigate to exam page where MockTestScreen will be shown
        navigate('/exam');
    };

    const handleBackToExam = () => {
        // Reset test state to clear questions and go back to filter selection
        dispatch(resetTest());
        // Navigate to exam selection route
        navigate('/exam');
    };

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
            onExamChange={handleExamChange}
            onBranchChange={handleBranchChange}
            onSubjectChange={handleSubjectChange}
            onChapterChange={handleChapterChange}
            onModeChange={handleModeChange}
            onStartTest={handleStartTest}
            testLoading={testLoading}
            error={error}
            mockTestType={mockTestType}
            onMockTestTypeChange={handleMockTestTypeChange}
            onStartMockTest={handleStartMockTest}
            mockTestLoading={mockTestLoading}
            mockTestError={mockTestError}
            forcedMode="mock"
            hideModeSelection={true}
            onBackToExam={handleBackToExam}
        />
    );
};

export default MockPage;
