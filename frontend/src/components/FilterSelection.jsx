import React from 'react';
import Navbar from './Navbar';

const FilterSelection = ({
    exam,
    branch,
    subject,
    year,
    branches,
    subjects,
    years,
    onBranchChange,
    onSubjectChange,
    onYearChange,
    onStartTest,
    testLoading,
    error,
}) => (
    <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-20">
            <div className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-md animate-fade-up">
                <h1 className="text-xl sm:text-2xl font-extrabold text-center mb-4 sm:mb-6 text-gradient">{exam} PYQ Platform</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Branch</label>
                        <select
                            value={branch}
                            onChange={onBranchChange}
                            className="input-dark min-h-11"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                                <option className='text-black' key={b} value={b}>
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
                                <option className='text-black' key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Year</label>
                        <select
                            value={year}
                            onChange={onYearChange}
                            disabled={!subject}
                            className="input-dark min-h-11"
                        >
                            <option value="">{subject ? 'Select Year' : 'Select a subject first'}</option>
                            {years.map((y) => (
                                <option className='text-black' key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={onStartTest}
                        disabled={!branch || !subject || !year || testLoading}
                        className="btn-primary w-full mt-6 min-h-11"
                    >
                        {testLoading ? 'Loading Practice...' : 'Start Practice'}
                    </button>
                    {error && <p className="text-rose-400 text-sm text-center mt-2">{error}</p>}
                </div>
            </div>
        </div>
    </div>
);

export default FilterSelection;
