import React from 'react';
import LatexRenderer from './LatexRenderer';

const UploadQueue = ({ queue, onRemove, onUpload, uploading }) => {
    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-100">3. Upload Queue ({queue.length})</h2>
                <button
                    onClick={onUpload}
                    disabled={queue.length === 0 || uploading}
                    className="btn-primary"
                >
                    {uploading ? 'Uploading...' : `Upload ${queue.length} Question(s)`}
                </button>
            </div>

            {queue.length === 0 ? (
                <p className="text-sm text-slate-400">No questions queued yet.</p>
            ) : (
                <ul className="divide-y divide-white/10">
                    {queue.map((q, i) => (
                        <li key={i} className="py-3 flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs text-slate-400 mb-1">
                                    {q.branch} → {q.subject} → {q.yearTag || 'N/A'} · {q.questionType} · {q.marks} mark(s)
                                    {q.images?.length > 0 && ` · ${q.images.length} image(s)`}
                                </p>
                                <div className="text-sm text-slate-200 truncate">
                                    <LatexRenderer content={q.questionText} />
                                </div>
                            </div>
                            <button
                                onClick={() => onRemove(i)}
                                className="text-rose-400 hover:text-rose-300 text-sm shrink-0"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UploadQueue;