import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LatexRenderer from '../LatexRenderer';
import OptionItem from './OptionItem';

const OptionsList = ({
    options,
    questionType,
    answer,
    correctAnswer,
    showCorrectAnswer,
    onAnswerChange
}) => {
    // Memoize computed values
    const optionStates = useMemo(() => {
        return options.map((option, idx) => {
            const optionLabel = String.fromCharCode(65 + idx);
            const isSelected = questionType === 'MSQ'
                ? Array.isArray(answer) && answer.includes(option.id)
                : answer === option.id;

            const isCorrect = showCorrectAnswer && (
                questionType === 'MSQ'
                    ? Array.isArray(correctAnswer) ? correctAnswer.includes(option.id) : correctAnswer === option.id
                    : option.id === correctAnswer
            );

            const isWrong = showCorrectAnswer && (
                questionType === 'MSQ'
                    ? Array.isArray(answer) && answer.includes(option.id) &&
                    !(Array.isArray(correctAnswer) ? correctAnswer.includes(option.id) : correctAnswer === option.id)
                    : answer === option.id && String(option.id) !== String(correctAnswer)
            );

            return {
                ...option,
                optionLabel,
                isSelected,
                isCorrect,
                isWrong,
                isDisabled: showCorrectAnswer,
            };
        });
    }, [options, questionType, answer, correctAnswer, showCorrectAnswer]);

    const handleOptionSelect = useCallback((optionId) => {
        if (showCorrectAnswer) return;

        if (questionType === 'MSQ') {
            const current = Array.isArray(answer) ? answer : [];
            if (current.includes(optionId)) {
                onAnswerChange(current.filter((id) => id !== optionId));
            } else {
                onAnswerChange([...current, optionId]);
            }
        } else {
            onAnswerChange(optionId);
        }
    }, [questionType, answer, showCorrectAnswer, onAnswerChange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="space-y-3"
            role="radiogroup"
            aria-label={`${questionType} options`}
        >
            <AnimatePresence>
                {optionStates.map((option, index) => (
                    <OptionItem
                        key={option.id}
                        option={option}
                        index={index}
                        onSelect={handleOptionSelect}
                        questionType={questionType}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default OptionsList;