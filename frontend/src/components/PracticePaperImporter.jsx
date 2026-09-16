import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const PracticePaperImporter = ({ subject, chapter, onImported }) => {
    const [url, setUrl] = useState('https://practicepaper.in/gate-cse/general-aptitude?page_no=1');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const importPage = async () => {
        setLoading(true);
        setResult(null);
        try {
            const { data } = await api.post('/admin/import-practicepaper', { url, subject, chapter });
            setResult(data);
            onImported(data.questions);
            toast.success(`${data.count} question(s) imported into the JSON uploader`);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Import failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-4 sm:p-5 space-y-4">
            <div>
                <h2 className="font-semibold text-slate-100">Temporary PracticePaper Importer</h2>
                <p className="text-xs text-slate-400 mt-1">
                    Imports questions into the JSON editor for review. Remove this tool after migration is complete.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    className="input-dark flex-1"
                    placeholder="https://practicepaper.in/..."
                />
                <button onClick={importPage} disabled={loading || !url.trim() || !subject} className="btn-primary min-h-11">
                    {loading ? 'Importing...' : 'Import Page'}
                </button>
            </div>
            {!subject && <p className="text-xs text-amber-300">Select a subject above before importing.</p>}
            {subject && !chapter && <p className="text-xs text-slate-400">No chapter selected. Questions will be mapped automatically.</p>}
            {subject && chapter && <p className="text-xs text-emerald-300">Selected chapter `{chapter}` will be used for every imported question.</p>}
            {result && (
                <p className={`text-sm p-3 rounded-lg border ${result.warning
                    ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'}`}>
                    {result.warning || `${result.count} question(s) ready in the JSON uploader.`}
                </p>
            )}
        </div>
    );
};

export default PracticePaperImporter;
