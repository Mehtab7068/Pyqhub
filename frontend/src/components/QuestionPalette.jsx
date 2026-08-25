import React from 'react';
import { useSelector } from 'react-redux';

const QuestionPalette = ({ questions, currentIndex, onSelectQuestion }) => {
    const { answers, submittedAnswers } = useSelector((state) => state.test);

    if (!questions || questions.length === 0) {
        return (
            <div className="glass-card p-4">
                <p className="text-slate-400 text-sm">No questions available</p>
            </div>
        );
    }

    const getQuestionStatus = (q) => {
        const isSubmitted = !!submittedAnswers[q._id];
        const hasAnswer = answers[q._id] !== undefined && answers[q._id] !== '' &&
            !(Array.isArray(answers[q._id]) && answers[q._id].length === 0);

        if (isSubmitted) return 'submitted';
        if (hasAnswer) return 'answered';
        return 'not-answered';
    };

    const getStatusStyles = (status, isCurrent) => {
        const baseStyles = 'w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200';

        if (isCurrent) {
            return `${baseStyles} bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.3)]`;
        }

        switch (status) {
            case 'submitted':
                return `${baseStyles} bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30`;
            case 'answered':
                return `${baseStyles} bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30`;
            case 'not-answered':
            default:
                return `${baseStyles} bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20`;
        }
    };

    return (
        <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                    const status = getQuestionStatus(q);
                    const isCurrent = idx === currentIndex;
                    return (
                        <button
                            key={q._id}
                            onClick={() => onSelectQuestion(idx)}
                            className={getStatusStyles(status, isCurrent)}
                            title={status === 'submitted' ? 'Submitted' : status === 'answered' ? 'Answered (not submitted)' : 'Not answered'}
                        >
                            {idx + 1}
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
                    <span className="text-slate-400">Submitted</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></div>
                    <span className="text-slate-400">Answered (not submitted)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10"></div>
                    <span className="text-slate-400">Not answered</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionPalette;