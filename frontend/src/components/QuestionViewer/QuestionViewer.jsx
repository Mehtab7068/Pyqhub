import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LatexRenderer from '../LatexRenderer';
import QuestionHeader from './QuestionHeader';
import QuestionContent from './QuestionContent';
import QuestionImages from './QuestionImages';
import OptionsList from './OptionsList';
import NATInput from './NATInput';
import ExplanationPanel from './ExplanationPanel';
import QuestionSkeleton from './QuestionSkeleton';

// Backend origin for serving uploaded images (strip the /api/v1 suffix)
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');

const QuestionViewer = ({
    question,
    answer,
    onAnswerChange,
    showCorrectAnswer = false,
    isLoading = false,
    onImageError = () => { }
}) => {
    const [mounted, setMounted] = useState(false);
    const [imageErrors, setImageErrors] = useState(new Set());

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle image loading errors
    const handleImageError = useCallback((index) => {
        setImageErrors(prev => new Set([...prev, index]));
        onImageError?.(index);
    }, [onImageError]);

    // Memoize computed values for performance
    const questionData = useMemo(() => {
        if (!question) return null;

        return {
            questionType: question.questionType,
            options: question.options || [],
            correctAnswer: question.correctAnswer,
            marks: question.marks,
            explanation: question.explanation,
            questionText: question.questionText,
            imageUrls: question.imageUrls || [],
            yearTag: question.yearTag,
            questionNumber: question.questionNumber,
            _id: question._id,
        };
    }, [question]);

    // Show skeleton while loading
    if (isLoading || !mounted) {
        return <QuestionSkeleton />;
    }

    // Empty state
    if (!questionData) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 md:p-12 flex items-center justify-center min-h-[300px]"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-violet/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-neon-cyan/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200">Select a Question</h3>
                    <p className="text-slate-500">Choose a question from the palette to start solving</p>
                </div>
            </motion.div>
        );
    }

    const {
        questionType,
        options,
        correctAnswer,
        marks,
        explanation,
        questionText,
        imageUrls,
        yearTag,
        questionNumber,
        _id
    } = questionData;

    // Determine if question has options (MCQ/MSQ) or is NAT
    const hasOptions = options.length > 0;
    const isNAT = questionType === 'NAT';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card overflow-hidden"
            role="region"
            aria-label={`Question ${questionNumber || _id?.slice(-6)}`}
        >
            {/* Animated border top accent */}
            <motion.div
                className="h-1 w-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-violet"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: 'left center' }}
            />

            <div className="p-6 md:p-8 space-y-6">
                {/* Question Header */}
                <QuestionHeader
                    questionType={questionType}
                    marks={marks}
                    yearTag={yearTag}
                    questionNumber={questionNumber}
                    _id={_id}
                    showCorrectAnswer={showCorrectAnswer}
                />

                {/* Question Content */}
                <QuestionContent questionText={questionText} />

                {/* Question Images */}
                {imageUrls.length > 0 && (
                    <QuestionImages
                        imageUrls={imageUrls}
                        apiOrigin={API_ORIGIN}
                        imageErrors={imageErrors}
                        onImageError={handleImageError}
                    />
                )}

                {/* Options or NAT Input */}
                <AnimatePresence mode="wait">
                    {hasOptions ? (
                        <OptionsList
                            key="options"
                            options={options}
                            questionType={questionType}
                            answer={answer}
                            correctAnswer={correctAnswer}
                            showCorrectAnswer={showCorrectAnswer}
                            onAnswerChange={onAnswerChange}
                        />
                    ) : isNAT ? (
                        <NATInput
                            key="nat"
                            answer={answer}
                            showCorrectAnswer={showCorrectAnswer}
                            correctAnswer={correctAnswer}
                            onAnswerChange={onAnswerChange}
                        />
                    ) : null}
                </AnimatePresence>

                {/* Explanation Panel */}
                {showCorrectAnswer && explanation && (
                    <ExplanationPanel explanation={explanation} />
                )}

                {/* Answer Status Indicator */}
                {showCorrectAnswer && (
                    <AnswerStatusIndicator
                        questionType={questionType}
                        answer={answer}
                        correctAnswer={correctAnswer}
                        hasOptions={hasOptions}
                    />
                )}
            </div>
        </motion.div>
    );
};

const AnswerStatusIndicator = ({ questionType, answer, correctAnswer, hasOptions }) => {
    const isCorrect = useMemo(() => {
        if (!hasOptions) return false;

        if (questionType === 'MSQ') {
            const selected = Array.isArray(answer) ? answer.sort() : [];
            const correct = Array.isArray(correctAnswer) ? correctAnswer.sort() : [correctAnswer].sort();
            return JSON.stringify(selected) === JSON.stringify(correct);
        }
        return String(answer) === String(correctAnswer);
    }, [questionType, answer, correctAnswer, hasOptions]);

    const isAnswered = useMemo(() => {
        if (questionType === 'MSQ') {
            return Array.isArray(answer) && answer.length > 0;
        }
        return answer !== undefined && answer !== null && answer !== '';
    }, [questionType, answer]);

    if (!isAnswered) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-xl border ${isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                {isCorrect ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </div>
            <div>
                <p className={`font-medium ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                    {isCorrect
                        ? 'Well done! You selected the right option(s).'
                        : 'Review the explanation above to understand the correct approach.'}
                </p>
            </div>
        </motion.div>
    );
};

export default QuestionViewer;