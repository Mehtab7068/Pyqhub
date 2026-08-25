import React from 'react';

const HierarchySelector = ({ exam, branch, subject, year, branches, subjects, years, onBranchChange, onSubjectChange, onYearChange }) => {
    return (
        <div className="glass-card p-4 sm:p-5">
            <h2 className="font-semibold text-slate-100 mb-4">1. Select Hierarchy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Branch</label>
                    <select
                        value={branch}
                        onChange={(e) => { onBranchChange(e.target.value); onSubjectChange(''); onYearChange(''); }}
                        className="input-dark min-h-11"
                    >
                        <option value="">Select Branch</option>
                        {branches.map((b) => <option className='text-black' key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                    <select
                        value={subject}
                        onChange={(e) => { onSubjectChange(e.target.value); onYearChange(''); }}
                        disabled={!branch}
                        className="input-dark min-h-11 disabled:bg-white/5 disabled:cursor-not-allowed"
                    >
                        <option value="">{branch ? 'Select Subject' : 'Select branch first'}</option>
                        {subjects.map((s) => <option className='text-black' key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Year</label>
                    <select
                        value={year}
                        onChange={(e) => onYearChange(e.target.value)}
                        disabled={!subject}
                        className="input-dark min-h-11 disabled:bg-white/5 disabled:cursor-not-allowed"
                    >
                        <option value="">{subject ? 'Select Year' : 'Select subject first'}</option>
                        {years.map((y) => <option className='text-black' key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default HierarchySelector;