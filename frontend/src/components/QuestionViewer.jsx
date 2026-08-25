import React from 'react';
import LatexRenderer from './LatexRenderer';

// Backend origin for serving uploaded images (strip the /api/v1 suffix)
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');

const QuestionViewer = ({ question, answer, onAnswerChange, showCorrectAnswer = false }) => {
    if (!question) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                Select a question to view
            </div>
        );
    }

    const { questionType, options, correctAnswer, marks, explanation } = question;

    const handleOptionSelect = (optionId) => {
        if (questionType === 'MSQ') {
            // MSQ allows multiple selections
            const current = Array.isArray(answer) ? answer : [];
            if (current.includes(optionId)) {
                onAnswerChange(current.filter((id) => id !== optionId));
            } else {
                onAnswerChange([...current, optionId]);
            }
        } else {
            // MCQ and NAT: single selection
            onAnswerChange(optionId);
        }
    };

    const isCorrect = (optionId) => {
        if (!showCorrectAnswer) return false;
        if (questionType === 'MSQ') {
            // An option is "correct" if it should be selected
            const correct = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
            return correct.includes(optionId);
        }
        return optionId === correctAnswer;
    };

    const isWrong = (optionId) => {
        if (!showCorrectAnswer) return false;
        if (questionType === 'MSQ') {
            // Wrong only if user selected an option that isn't correct
            const selected = Array.isArray(answer) ? answer : [];
            const correct = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
            return selected.includes(optionId) && !correct.includes(optionId);
        }
        return answer === optionId && String(optionId) !== String(correctAnswer);
    };

    const isSelected = (optionId) => {
        if (questionType === 'MSQ') {
            return Array.isArray(answer) && answer.includes(optionId);
        }
        return answer === optionId;
    };

    return (
        <div className="glass-card p-6">
            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm font-medium border border-neon-blue/30">
                        {questionType}
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30">
                        {marks} Mark{marks !== 1 ? 's' : ''}
                    </span>
                </div>
                <span className="text-sm text-slate-500">Q{question._id?.slice(-6) || ''}</span>
            </div>

            {/* Question text */}
            <div className="mb-6">
                <LatexRenderer content={question.questionText} className="text-lg leading-relaxed" />
            </div>

            {/* Question images */}
            {question.imageUrls && question.imageUrls.length > 0 && (
                <div className="mb-6 flex flex-col gap-3">
                    {question.imageUrls.map((url, i) => (
                        <img
                            key={i}
                            src={url.startsWith('http') ? url : `${API_ORIGIN}${url}`}
                            alt={`Question figure ${i + 1}`}
                            className="max-w-full rounded-lg border border-white/10"
                        />
                    ))}
                </div>
            )}

            {/* Options */}
            {options && options.length > 0 && (
                <div className="space-y-3 mb-6">
                    {options.map((option, idx) => {
                        const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D
                        let optionClass = 'border-2 border-white/10 hover:border-neon-cyan/50 hover:bg-white/5 text-slate-200';

                        if (isSelected(option.id)) {
                            optionClass = 'border-2 border-neon-cyan bg-neon-cyan/10 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]';
                        }
                        if (isCorrect(option.id)) {
                            optionClass = 'border-2 border-emerald-500 bg-emerald-500/10 text-emerald-300';
                        }
                        if (isWrong(option.id)) {
                            optionClass = 'border-2 border-rose-500 bg-rose-500/10 text-rose-300';
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                disabled={showCorrectAnswer}
                                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${optionClass}`}
                            >
                                <span className="font-semibold mr-3">{optionLabel}.</span>
                                <LatexRenderer content={option.text} />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* NAT input */}
            {questionType === 'NAT' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Your Answer:
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={answer || ''}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        disabled={showCorrectAnswer}
                        className="input-dark max-w-xs"
                        placeholder="Enter numerical value"
                    />
                </div>
            )}

            {/* Explanation */}
            {showCorrectAnswer && explanation && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h4 className="font-semibold text-amber-400 mb-2">Explanation</h4>
                    <LatexRenderer content={explanation} className="text-slate-300" />
                </div>
            )}
        </div>
    );
};

export default QuestionViewer;