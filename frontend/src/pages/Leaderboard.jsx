import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { EXAM_DATA } from '../data/gateData';

const Leaderboard = () => {
    const [exam, setExam] = React.useState('GATE');
    const [mode, setMode] = React.useState('mock');
    const [period, setPeriod] = React.useState('all');
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        let active = true;
        setLoading(true);
        api.get('/attempts/leaderboard', { params: { exam, mode, period } })
            .then(({ data }) => {
                if (active) setRows(data.data || []);
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || 'Unable to load leaderboard');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [exam, mode, period]);

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm text-amber-300 font-semibold uppercase tracking-widest">Community board</p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Leaderboard</h1>
                        <p className="text-slate-400 mt-2">Compare your best verified attempt with other learners.</p>
                    </div>
                    <Link to="/exam/mock" className="btn-primary px-5 py-3 text-sm">Take a mock test</Link>
                </div>

                <div className="glass-card p-4 sm:p-5 mb-6 grid sm:grid-cols-3 gap-3">
                    <select value={exam} onChange={(event) => setExam(event.target.value)} className="input-dark min-h-11">
                        {Object.entries(EXAM_DATA).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                    </select>
                    <select value={mode} onChange={(event) => setMode(event.target.value)} className="input-dark min-h-11">
                        <option value="mock">Mock tests</option>
                        <option value="practice">Practice</option>
                    </select>
                    <select value={period} onChange={(event) => setPeriod(event.target.value)} className="input-dark min-h-11">
                        <option value="all">All time</option>
                        <option value="month">This month</option>
                        <option value="week">This week</option>
                    </select>
                </div>

                <div className="glass-card overflow-hidden">
                    {error && <p className="p-5 text-rose-300">{error}</p>}
                    {loading ? <p className="p-10 text-center text-slate-400">Loading rankings...</p> : !rows.length ? (
                        <div className="p-10 text-center">
                            <h2 className="text-xl font-bold text-white">No rankings yet</h2>
                            <p className="text-slate-400 mt-2">Complete a mock test to claim the first spot.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-slate-500 border-b border-white/10 bg-white/[0.02]">
                                    <tr><th className="p-4">Rank</th><th className="p-4">Student</th><th className="p-4">Branch</th><th className="p-4">Best score</th><th className="p-4">Attempts</th></tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={`${row.rank}-${row.name}`} className={`border-b border-white/5 last:border-0 ${row.rank <= 3 ? 'bg-amber-400/[0.04]' : ''}`}>
                                            <td className="p-4 font-bold text-amber-300">#{row.rank}</td>
                                            <td className="p-4 text-slate-100 font-medium">{row.name}</td>
                                            <td className="p-4 text-slate-400">{row.branch || 'All branches'}</td>
                                            <td className="p-4 text-neon-cyan font-bold">{Math.round(row.percentage)}% <span className="text-xs text-slate-500 font-normal">({row.score}/{row.totalMarks})</span></td>
                                            <td className="p-4 text-slate-400">{row.attempts}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;