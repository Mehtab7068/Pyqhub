import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import api from '../services/api';

const percent = (value) => `${Math.round(value || 0)}%`;

const Progress = () => {
    const { user } = useSelector((state) => state.auth);
    const [attempts, setAttempts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        let active = true;
        api.get('/attempts?limit=100')
            .then(({ data }) => {
                if (active) setAttempts(Array.isArray(data.data) ? data.data : []);
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || 'Unable to load progress');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

    const responses = attempts.flatMap((attempt) => attempt.responses || []);
    const answered = responses.filter((response) => response.answer !== undefined && response.answer !== null && response.answer !== '');
    const correct = answered.filter((response) => response.correct);
    const accuracy = answered.length ? (correct.length / answered.length) * 100 : 0;
    const averageScore = attempts.length
        ? attempts.reduce((sum, attempt) => sum + (attempt.totalMarks ? (attempt.score / attempt.totalMarks) * 100 : 0), 0) / attempts.length
        : 0;
    const bestScore = attempts.length
        ? Math.max(...attempts.map((attempt) => attempt.totalMarks ? (attempt.score / attempt.totalMarks) * 100 : 0))
        : 0;

    const topicMap = responses.reduce((map, response) => {
        const label = response.topic || response.chapter || response.subject || 'Unclassified';
        const current = map.get(label) || { label, total: 0, correct: 0, time: 0 };
        current.total += 1;
        current.correct += response.correct ? 1 : 0;
        current.time += Number(response.timeSpent) || 0;
        map.set(label, current);
        return map;
    }, new Map());
    const topics = [...topicMap.values()]
        .map((topic) => ({ ...topic, accuracy: topic.total ? (topic.correct / topic.total) * 100 : 0 }))
        .sort((a, b) => a.accuracy - b.accuracy);

    const mistakes = responses.reduce((summary, response) => {
        if (response.correct) return summary;
        const hasAnswer = response.answer !== undefined && response.answer !== null && response.answer !== '';
        const type = !hasAnswer
            ? 'Skipped questions'
            : response.timeSpent >= 90
                ? 'Time-pressure mistakes'
                : response.marksAwarded < 0
                    ? 'Negative-marking mistakes'
                    : 'Concept mistakes';
        summary[type] = (summary[type] || 0) + 1;
        return summary;
    }, {});
    const mistakeRows = Object.entries(mistakes).sort(([, a], [, b]) => b - a);
    const falseConfidence = responses.filter((response) => response.confidence === 'high' && !response.correct).length;

    if (loading) {
        return <div className="min-h-screen"><Navbar /><div className="flex justify-center py-24 text-slate-400">Loading your progress...</div></div>;
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm text-neon-cyan font-semibold uppercase tracking-widest">Performance lab</p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">{user?.name || 'Your'} progress</h1>
                        <p className="text-slate-400 mt-2">Find the topics costing you marks and turn them into your next practice mission.</p>
                    </div>
                    <Link to="/replay" className="btn-primary px-5 py-3 text-sm">Replay mistakes</Link>
                </div>

                {error && <div className="glass-card border border-rose-500/30 text-rose-300 p-4 mb-6">{error}</div>}

                {attempts.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                        <h2 className="text-xl font-bold text-white">Your dashboard starts with one attempt</h2>
                        <p className="text-slate-400 mt-2 mb-6">Complete a PYQ practice or mock test to see your weakness map.</p>
                        <Link to="/exam" className="btn-primary px-5 py-3">Start a test</Link>
                    </div>
                ) : (
                    <>
                        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                ['Attempts', attempts.length, 'text-neon-cyan'],
                                ['Answer accuracy', percent(accuracy), 'text-emerald-400'],
                                ['Average score', percent(averageScore), 'text-amber-400'],
                                ['Best score', percent(bestScore), 'text-violet-400'],
                            ].map(([label, value, color]) => (
                                <div className="glass-card p-5" key={label}>
                                    <p className="text-sm text-slate-400">{label}</p>
                                    <p className={`text-3xl font-extrabold mt-2 ${color}`}>{value}</p>
                                </div>
                            ))}
                        </section>

                        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6">
                            <div className="glass-card p-5 sm:p-6">
                                <div className="flex items-center justify-between gap-3 mb-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Weakness map</h2>
                                        <p className="text-sm text-slate-400 mt-1">Lowest accuracy first, based on saved responses.</p>
                                    </div>
                                    <span className="text-xs text-slate-500">{topics.length} areas</span>
                                </div>
                                <div className="space-y-4">
                                    {topics.slice(0, 10).map((topic) => (
                                        <div key={topic.label}>
                                            <div className="flex items-center justify-between text-sm mb-1.5">
                                                <span className="text-slate-200 truncate pr-3">{topic.label}</span>
                                                <span className={topic.accuracy < 50 ? 'text-rose-300' : 'text-slate-400'}>{percent(topic.accuracy)} · {topic.total} Q</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                                <div className={`h-full rounded-full ${topic.accuracy < 50 ? 'bg-rose-400' : topic.accuracy < 75 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${Math.max(4, topic.accuracy)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-5 sm:p-6">
                                <h2 className="text-xl font-bold text-white">Mistake fingerprint</h2>
                                <p className="text-sm text-slate-400 mt-1 mb-5">What is currently reducing your score.</p>
                                <div className="space-y-3">
                                    {mistakeRows.length ? mistakeRows.map(([label, count]) => (
                                        <div className="flex items-center justify-between border-b border-white/5 pb-3" key={label}>
                                            <span className="text-sm text-slate-300">{label}</span>
                                            <span className="text-sm font-bold text-rose-300">{count}</span>
                                        </div>
                                    )) : <p className="text-sm text-emerald-300">No mistakes recorded yet. Keep the streak going.</p>}
                                    {falseConfidence > 0 && <p className="text-sm text-amber-300 pt-2">{falseConfidence} high-confidence answer{falseConfidence === 1 ? '' : 's'} were incorrect. Review these first.</p>}
                                </div>
                            </div>
                        </section>

                        <section className="glass-card p-5 sm:p-6 mt-6">
                            <h2 className="text-xl font-bold text-white mb-4">Recent attempts</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-slate-500 border-b border-white/10">
                                        <tr><th className="py-3 pr-4">Date</th><th className="py-3 pr-4">Mode</th><th className="py-3 pr-4">Area</th><th className="py-3">Score</th></tr>
                                    </thead>
                                    <tbody>
                                        {attempts.slice(0, 10).map((attempt) => (
                                            <tr className="border-b border-white/5 last:border-0" key={attempt._id}>
                                                <td className="py-3 pr-4 text-slate-400">{new Date(attempt.submittedAt).toLocaleDateString()}</td>
                                                <td className="py-3 pr-4 text-slate-200">{attempt.mode === 'mock' ? 'Mock test' : 'Practice'}</td>
                                                <td className="py-3 pr-4 text-slate-300">{attempt.subject || 'Mixed'}{attempt.chapter ? ` / ${attempt.chapter}` : ''}</td>
                                                <td className="py-3 text-neon-cyan font-semibold">{attempt.score} / {attempt.totalMarks}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default Progress;