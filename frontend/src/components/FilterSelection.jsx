import React from 'react';
import Navbar from './Navbar';
import { EXAM_DATA } from '../data/gateData';

const EXAM_ICONS = {
    GATE: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    ),
    NEET: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M12 2a5 5 0 100 10 5 5 0 000-10z" />
            <path d="M12 12v8" />
            <path d="M8 20h8" />
            <path d="M4 4l2 2M18 4l-2 2" />
        </svg>
    ),
    NDA: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" />
            <path d="M12 8v4l3 2" />
        </svg>
    ),
    UPSC: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
            <path d="M4 20h16" />
            <path d="M6 20V10l6-6 6 6v10" />
            <path d="M9 20v-6h6v6" />
            <path d="M9 14h6" />
        </svg>
    ),
};

const FilterSelection = ({
    exam,
    branch,
    subject,
    mode,
    chapter,
    branches,
    subjects,
    chapters,
    onBranchChange,
    onSubjectChange,
    onModeChange,
    onChapterChange,
    onStartTest,
    onExamChange,
    testLoading,
    error,
}) => {
    const [selectedExam, setSelectedExam] = React.useState(exam || '');

    const handleExamClick = (examKey) => {
        setSelectedExam(examKey);
        if (onExamChange) {
            onExamChange({ target: { value: examKey } });
        }
    };

    const exams = Object.entries(EXAM_DATA);

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-20">
                <div className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-3xl animate-fade-up">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-center mb-6 sm:mb-8 text-gradient">
                        {selectedExam ? `${EXAM_DATA[selectedExam]?.label || selectedExam} PYQ Platform` : 'Choose Your Exam'}
                    </h1>

                    {!selectedExam ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                            {exams.map(([key, data]) => (
                                <button
                                    key={key}
                                    onClick={() => handleExamClick(key)}
                                    className="group flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/20"
                                >
                                    <div className="text-neon-cyan group-hover:scale-110 transition-transform duration-300">
                                        {EXAM_ICONS[key] || (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <path d="M9 9h6M9 13h4" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm sm:text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
                                        {data.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-up">
                            <button
                                onClick={() => {
                                    setSelectedExam('');
                                    if (onExamChange) {
                                        onExamChange({ target: { value: '' } });
                                    }
                                }}
                                className="text-sm text-neon-cyan hover:underline mb-2"
                            >
                                ← Back to exams
                            </button>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Branch / Stream</label>
                                <select
                                    value={branch}
                                    onChange={onBranchChange}
                                    className="input-dark min-h-11"
                                >
                                    <option value="">Select Branch</option>
                                    {Object.keys(EXAM_DATA[selectedExam]?.branches || {}).map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                                <select
                                    value={subject}
                                    onChange={onSubjectChange}
                                    disabled={!branch}
                                    className="input-dark min-h-11"
                                >
                                    <option value="">{branch ? 'Select Subject' : 'Select a branch first'}</option>
                                    {subjects.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Practice mode: whole subject or chapterwise */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Practice Mode</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onModeChange && onModeChange({ target: { value: 'subject' } })}
                                        disabled={!subject}
                                        className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all min-h-11 disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'subject'
                                            ? 'bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                            : 'bg-white/5 text-slate-300 border-2 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        Whole Subject
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onModeChange && onModeChange({ target: { value: 'chapter' } })}
                                        disabled={!subject}
                                        className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all min-h-11 disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'chapter'
                                            ? 'bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                            : 'bg-white/5 text-slate-300 border-2 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        Chapterwise
                                    </button>
                                </div>
                            </div>
                            {mode === 'chapter' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Chapter / Topic</label>
                                    <select
                                        value={chapter}
                                        onChange={onChapterChange}
                                        disabled={!subject}
                                        className="input-dark min-h-11"
                                    >
                                        <option value="">{subject ? 'Select Chapter' : 'Select a subject first'}</option>
                                        {(chapters || []).map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    {subject && (chapters || []).length === 0 && (
                                        <p className="text-xs text-amber-400 mt-1">No chapters tagged yet for this subject — ask admin to add chapter names when uploading questions.</p>
                                    )}
                                </div>
                            )}
                            {/* Year selection removed per unified format */}
                            <button
                                onClick={onStartTest}
                                disabled={!branch || !subject || (mode === 'chapter' && !chapter) || testLoading}
                                className="btn-primary w-full mt-6 min-h-11"
                            >
                                {testLoading ? 'Loading Practice...' : 'Start Practice'}
                            </button>
                            {error && <p className="text-rose-400 text-sm text-center mt-2">{error}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterSelection;
