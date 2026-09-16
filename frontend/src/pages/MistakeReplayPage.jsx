import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { fetchQuestionsByIds, resetTest } from '../app/slices/testSlice';
import { setBranch, setChapter, setExam, setMockTestType, setSubject } from '../app/slices/filterSlice';

const MistakeReplayPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [starting, setStarting] = React.useState(false);
    const [questionIds, setQuestionIds] = React.useState([]);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        let active = true;
        api.get('/attempts?limit=100')
            .then(({ data }) => {
                const ids = [...new Set((data.data || []).flatMap((attempt) => (attempt.responses || [])
                    .filter((response) => !response.correct && response.questionId)
                    .map((response) => response.questionId)))].slice(0, 30);
                if (active) setQuestionIds(ids);
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || 'Unable to load mistakes');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

    const startReplay = async () => {
        if (!questionIds.length) return;
        setStarting(true);
        setError('');
        try {
            dispatch(resetTest());
            dispatch(setMockTestType(''));
            const { data } = await api.get('/attempts?limit=100');
            const firstAttempt = data.data?.find((attempt) => (attempt.responses || []).some((response) => questionIds.includes(response.questionId)));
            if (firstAttempt) {
                dispatch(setExam(firstAttempt.exam || 'GATE'));
                dispatch(setBranch(firstAttempt.branch || ''));
                dispatch(setSubject(firstAttempt.subject || ''));
                dispatch(setChapter(firstAttempt.chapter || ''));
            }
            await dispatch(fetchQuestionsByIds(questionIds)).unwrap();
            navigate('/exam');
        } catch (requestError) {
            setError(requestError || 'Unable to start mistake replay');
            setStarting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="glass-card p-6 sm:p-8 animate-fade-up">
                    <p className="text-sm text-neon-cyan font-semibold uppercase tracking-widest">Recovery mode</p>
                    <h1 className="text-3xl font-extrabold text-white mt-2">Mistake replay</h1>
                    <p className="text-slate-400 mt-3">Retry questions you previously missed. Your new attempt will be saved separately so you can measure recovery.</p>

                    {loading ? <p className="text-slate-400 mt-8">Finding missed questions...</p> : (
                        <>
                            <div className="mt-8 p-5 rounded-xl border border-white/10 bg-white/5">
                                <p className="text-4xl font-extrabold text-rose-300">{questionIds.length}</p>
                                <p className="text-sm text-slate-400 mt-1">unique missed questions ready to replay</p>
                            </div>
                            {error && <p className="text-sm text-rose-300 mt-5">{error}</p>}
                            <div className="flex gap-3 mt-8">
                                <button onClick={startReplay} disabled={!questionIds.length || starting} className="btn-primary flex-1">
                                    {starting ? 'Preparing replay...' : 'Start replay'}
                                </button>
                                <Link to="/progress" className="btn-ghost flex-1 text-center">Back to progress</Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MistakeReplayPage;