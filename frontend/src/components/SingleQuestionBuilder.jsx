import React from 'react';
import LatexRenderer from './LatexRenderer';

const SingleQuestionBuilder = ({ current, onUpdate, onOptionUpdate, onToggleMsq, onTypeChange, onImageSelect, onRemoveImage, onAddToQueue, validateError }) => {
    return (
        <div className="glass-card p-4 sm:p-5 space-y-4">
            <h2 className="font-semibold text-slate-100">2. Build Question</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Question Type</label>
                    <select
                        value={current.questionType}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="input-dark min-h-11"
                    >
                        <option value="MCQ">MCQ (Single Correct)</option>
                        <option value="MSQ">MSQ (Multiple Correct)</option>
                        <option value="NAT">NAT (Numerical)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Marks</label>
                    <select
                        value={current.marks}
                        onChange={(e) => onUpdate('marks', Number(e.target.value))}
                        className="input-dark min-h-11"
                    >
                        <option value={1}>1 Mark</option>
                        <option value={2}>2 Marks</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Question Text (LaTeX supported: $...$, $$...$$)</label>
                <textarea
                    value={current.questionText}
                    onChange={(e) => onUpdate('questionText', e.target.value)}
                    rows={3}
                    className="input-dark"
                    placeholder="e.g. The value of $\int_0^1 x^2 dx$ is..."
                />
                {current.questionText && (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-slate-400 mb-1">Preview:</p>
                        <LatexRenderer content={current.questionText} />
                    </div>
                )}
            </div>

            {/* Options for MCQ / MSQ */}
            {current.questionType !== 'NAT' && (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                        Options — {current.questionType === 'MCQ' ? 'click radio for correct answer' : 'tick all correct answers'}
                    </label>
                    {current.options.map((opt, i) => (
                        <div key={opt.id} className="flex items-center gap-3">
                            {current.questionType === 'MCQ' ? (
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={current.correctAnswer === opt.id}
                                    onChange={() => onUpdate('correctAnswer', opt.id)}
                                    className="w-4 h-4 text-neon-cyan"
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(current.correctAnswer) && current.correctAnswer.includes(opt.id)}
                                    onChange={() => onToggleMsq(opt.id)}
                                    className="w-4 h-4 text-neon-cyan rounded"
                                />
                            )}
                            <span className="font-semibold text-slate-300 w-6">{opt.id}.</span>
                            <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => onOptionUpdate(i, e.target.value)}
                                placeholder={`Option ${opt.id} (LaTeX supported)`}
                                className="input-dark"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* NAT answer */}
            {current.questionType === 'NAT' && (
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Correct Answer (number)</label>
                    <input
                        type="text"
                        value={current.correctAnswer}
                        onChange={(e) => onUpdate('correctAnswer', e.target.value)}
                        placeholder="e.g. 42 or 3.14"
                        className="input-dark"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Explanation (optional, LaTeX supported)</label>
                <textarea
                    value={current.explanation}
                    onChange={(e) => onUpdate('explanation', e.target.value)}
                    rows={2}
                    className="input-dark"
                />
            </div>

            {/* Image upload */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Images (optional, max 5MB each)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageSelect}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-neon-cyan hover:file:bg-white/20"
                />
                {current.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                        {current.images.map((file, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="h-20 w-20 object-cover rounded-lg border border-white/10"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(i)}
                                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-8 h-8 text-sm leading-none flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {validateError && (
                <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg">{validateError}</p>
            )}

            <button
                onClick={onAddToQueue}
                className="btn-primary w-full min-h-11"
            >
                Add to Queue
            </button>
        </div>
    );
};

export default SingleQuestionBuilder;