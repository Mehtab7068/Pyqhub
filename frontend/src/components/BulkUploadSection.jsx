import React from 'react';

const BulkUploadSection = ({
    bulkJson,
    bulkParsed,
    bulkErrors,
    onJsonChange,
    onParse,
    onUpload,
    uploading,
    onLoadTemplate,
    onFileUpload,
}) => {
    const BULK_TEMPLATE = `[
  {
    "questionType": "MCQ",
    "questionNumber": 1,
    "marks": 1,
    "questionText": "The value of $\\\\int_0^1 x^2\\\\,dx$ is",
    "chapter": "Calculus",
    "yearTag": "2024",
    "options": [
      { "id": "A", "text": "$1/3$" },
      { "id": "B", "text": "$1/2$" },
      { "id": "C", "text": "$1$" },
      { "id": "D", "text": "$2/3$" }
    ],
    "correctAnswer": "A",
    "explanation": "Power rule: $x^3/3$ from 0 to 1 $= 1/3$.",
    "imageUrls": []
  },
  {
    "questionType": "MSQ",
    "questionNumber": 2,
    "marks": 2,
    "questionText": "Which of the following are prime numbers?",
    "chapter": "Number Theory",
    "yearTag": "2023",
    "options": [
      { "id": "A", "text": "2" },
      { "id": "B", "text": "4" },
      { "id": "C", "text": "7" },
      { "id": "D", "text": "9" }
    ],
    "correctAnswer": ["A", "C"],
    "explanation": "",
    "imageUrls": []
  },
  {
    "questionType": "NAT",
    "questionNumber": 3,
    "marks": 1,
    "questionText": "How many bits are in one byte?",
    "chapter": "Computer Fundamentals",
    "yearTag": "2022",
    "options": [],
    "correctAnswer": 8,
    "explanation": "",
    "imageUrls": []
  }
]`;

    return (
        <div className="glass-card p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="font-semibold text-slate-100">2. Paste Questions JSON</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => onLoadTemplate(BULK_TEMPLATE)}
                        className="text-sm text-neon-cyan hover:underline min-h-11 sm:min-h-0"
                    >
                        Load example template
                    </button>
                    <label className="text-sm text-neon-cyan hover:underline cursor-pointer min-h-11 sm:min-h-0 flex items-center">
                        Upload .json file
                        <input type="file" accept=".json,application/json" onChange={onFileUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <p className="text-xs text-slate-400">
                Branch, subject, and chapter are taken from the dropdowns above — do not include them in the JSON.
                Each question needs: questionType (MCQ/MSQ/NAT), marks (1 or 2), questionText, chapter (optional), yearTag (optional, e.g. "2024"), options (not for NAT),
                correctAnswer ("A" for MCQ, ["A","C"] for MSQ, number for NAT), optional explanation and imageUrls.
            </p>

            <textarea
                value={bulkJson}
                onChange={(e) => onJsonChange(e.target.value)}
                rows={14}
                spellCheck={false}
                placeholder='Paste a JSON array of questions here, e.g. [{ "questionType": "MCQ", ... }]'
                className="input-dark font-mono text-sm"
            />

            {bulkErrors.length > 0 && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-sm font-semibold text-rose-400 mb-1">{bulkErrors.length} validation error(s):</p>
                    <ul className="text-xs text-rose-400 space-y-0.5 list-disc list-inside">
                        {bulkErrors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                </div>
            )}

            {bulkParsed && (
                <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg font-medium">
                    ✓ {bulkParsed.length} question(s) valid and ready
                </p>
            )}

            <div className="flex gap-3">
                <button
                    onClick={onParse}
                    disabled={!bulkJson.trim()}
                    className="btn-primary flex-1"
                >
                    Validate
                </button>
                <button
                    onClick={onUpload}
                    disabled={!bulkJson.trim() || uploading}
                    className="btn-primary flex-1"
                >
                    {uploading ? 'Uploading...' : bulkParsed ? `Upload ${bulkParsed.length} Question(s)` : 'Validate & Upload'}
                </button>
            </div>
        </div>
    );
};

export default BulkUploadSection;