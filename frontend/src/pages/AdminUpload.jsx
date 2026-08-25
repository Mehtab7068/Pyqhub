import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import Navbar from '../components/Navbar';
import AdminApiKeyInput from '../components/AdminApiKeyInput';
import HierarchySelector from '../components/HierarchySelector';
import BulkUploadSection from '../components/BulkUploadSection';
import SingleQuestionBuilder from '../components/SingleQuestionBuilder';
import UploadQueue from '../components/UploadQueue';
import { YEAR_LIST, getBranchesForExam, getSubjectsForBranch } from '../data/gateData';
import toast from 'react-hot-toast';

const emptyQuestion = () => ({
    questionType: 'MCQ',
    marks: 1,
    questionText: '',
    options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
    ],
    correctAnswer: '',   // MCQ: 'A' | MSQ: ['A','B'] | NAT: '42'
    explanation: '',
    images: [],          // File objects (uploaded later)
});

const AdminUpload = () => {
    // Exam from navbar (Redux)
    const exam = useSelector((state) => state.filter.exam);

    // Hierarchy selection
    const [branch, setBranch] = useState('');
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('');

    // Admin key
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('admin_api_key') || '');

    // Current question being built
    const [current, setCurrent] = useState(emptyQuestion());

    // Queue of questions ready to upload
    const [queue, setQueue] = useState([]);

    // Mode: 'single' (one-by-one builder) | 'bulk' (JSON paste/file)
    const [mode, setMode] = useState('bulk');

    // Bulk JSON state
    const [bulkJson, setBulkJson] = useState('');
    const [bulkParsed, setBulkParsed] = useState(null);  // parsed+validated array or null
    const [bulkErrors, setBulkErrors] = useState([]);

    const [uploading, setUploading] = useState(false);

    const branches = getBranchesForExam(exam);
    const subjects = branch ? getSubjectsForBranch(exam, branch) : [];
    const years = subject ? YEAR_LIST : [];

    const saveApiKey = (value) => {
        setApiKey(value);
        localStorage.setItem('admin_api_key', value);
    };

    const updateCurrent = (field, value) => {
        setCurrent((prev) => ({ ...prev, [field]: value }));
    };

    const updateOption = (index, text) => {
        setCurrent((prev) => {
            const options = prev.options.map((opt, i) => (i === index ? { ...opt, text } : opt));
            return { ...prev, options };
        });
    };

    const toggleMsqAnswer = (id) => {
        setCurrent((prev) => {
            const arr = Array.isArray(prev.correctAnswer) ? [...prev.correctAnswer] : [];
            const idx = arr.indexOf(id);
            if (idx >= 0) arr.splice(idx, 1);
            else arr.push(id);
            return { ...prev, correctAnswer: arr.sort() };
        });
    };

    const handleTypeChange = (type) => {
        setCurrent((prev) => ({
            ...prev,
            questionType: type,
            correctAnswer: type === 'MSQ' ? [] : '',
        }));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files || []);
        setCurrent((prev) => ({ ...prev, images: [...prev.images, ...files] }));
        e.target.value = ''; // allow re-selecting same file
    };

    const removeImage = (index) => {
        setCurrent((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const validateCurrent = () => {
        if (!branch || !subject || !year) return 'Select branch, subject and year first';
        if (!current.questionText.trim()) return 'Question text is required';
        if (current.questionType !== 'NAT') {
            const filled = current.options.filter((o) => o.text.trim());
            if (filled.length < 2) return 'At least 2 options are required';
            if (current.questionType === 'MCQ' && !current.correctAnswer) return 'Select the correct option';
            if (current.questionType === 'MSQ' && (!Array.isArray(current.correctAnswer) || current.correctAnswer.length === 0))
                return 'Select at least one correct option';
        } else {
            if (current.correctAnswer === '' || current.correctAnswer === null) return 'Enter the NAT correct answer';
            if (isNaN(Number(current.correctAnswer))) return 'NAT answer must be a number';
        }
        return null;
    };

    const addToQueue = () => {
        const error = validateCurrent();
        if (error) {
            setValidationError(error);
            toast.error(error);
            return;
        }
        setValidationError('');
        setQueue((prev) => [...prev, { ...current, exam, branch, subject, year: Number(year) }]);
        setCurrent(emptyQuestion());
        toast.success('Question added to queue');
    };

    const removeFromQueue = (index) => {
        setQueue((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadAll = useCallback(async () => {
        if (queue.length === 0) return;
        if (!apiKey) {
            toast.error('Enter your admin API key first');
            return;
        }

        setUploading(true);

        try {
            // Step 1: upload images for each question, collect URLs
            const prepared = [];
            for (const q of queue) {
                let imageUrls = [];
                if (q.images.length > 0) {
                    const formData = new FormData();
                    q.images.forEach((file) => formData.append('images', file));
                    const { data } = await api.post('/admin/upload-images', formData);
                    imageUrls = data.data;
                }

                prepared.push({
                    exam: q.exam,
                    branch: q.branch,
                    subject: q.subject,
                    year: q.year,
                    questionType: q.questionType,
                    marks: Number(q.marks),
                    questionText: q.questionText,
                    options: q.questionType === 'NAT' ? [] : q.options.filter((o) => o.text.trim()),
                    correctAnswer: q.questionType === 'NAT' ? Number(q.correctAnswer) : q.correctAnswer,
                    explanation: q.explanation,
                    imageUrls,
                });
            }

            // Step 2: bulk upload questions
            const { data } = await api.post('/admin/bulk-upload', prepared);

            toast.success(`Successfully uploaded ${data.count} question(s)`);
            setQueue([]);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    }, [queue, apiKey]);

    // ---- Bulk JSON mode ----

    const BULK_TEMPLATE = `[
  {
    "questionType": "MCQ",
    "marks": 1,
    "questionText": "The value of $\\\\int_0^1 x^2\\\\,dx$ is",
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
    "marks": 2,
    "questionText": "Which of the following are prime numbers?",
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
    "marks": 1,
    "questionText": "How many bits are in one byte?",
    "options": [],
    "correctAnswer": 8,
    "explanation": "",
    "imageUrls": []
  }
]`;

    const validateBulkQuestion = (q, i) => {
        const errs = [];
        const n = i + 1;
        if (!q || typeof q !== 'object') return [`Q${n}: not an object`];
        if (!['MCQ', 'MSQ', 'NAT'].includes(q.questionType)) errs.push(`Q${n}: questionType must be MCQ, MSQ or NAT`);
        if (![1, 2].includes(q.marks)) errs.push(`Q${n}: marks must be 1 or 2`);
        if (!q.questionText || !String(q.questionText).trim()) errs.push(`Q${n}: questionText is required`);
        if (q.questionType === 'NAT') {
            if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === '' || isNaN(Number(q.correctAnswer)))
                errs.push(`Q${n}: NAT correctAnswer must be a number`);
        } else {
            if (!Array.isArray(q.options) || q.options.filter((o) => o && o.id && String(o.text).trim()).length < 2)
                errs.push(`Q${n}: at least 2 valid options (with id and text) are required`);
            if (q.questionType === 'MCQ' && (typeof q.correctAnswer !== 'string' || !q.correctAnswer))
                errs.push(`Q${n}: MCQ correctAnswer must be an option id like "A"`);
            if (q.questionType === 'MSQ' && (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0))
                errs.push(`Q${n}: MSQ correctAnswer must be an array like ["A","C"]`);
        }
        if (q.imageUrls !== undefined && !Array.isArray(q.imageUrls)) errs.push(`Q${n}: imageUrls must be an array`);
        return errs;
    };

    const parseBulk = () => {
        setBulkParsed(null);
        if (!branch || !subject || !year) {
            setBulkErrors(['Select branch, subject and year first']);
            return;
        }
        let parsed;
        try {
            parsed = JSON.parse(bulkJson);
        } catch (e) {
            setBulkErrors([`Invalid JSON: ${e.message}`]);
            return;
        }
        if (!Array.isArray(parsed) || parsed.length === 0) {
            setBulkErrors(['JSON must be a non-empty array of question objects']);
            return;
        }
        const errors = parsed.flatMap((q, i) => validateBulkQuestion(q, i));
        setBulkErrors(errors);
        if (errors.length === 0) {
            setBulkParsed(parsed);
            toast.success(`${parsed.length} question(s) validated and ready to upload`);
        }
    };

    const handleBulkFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setBulkJson(String(reader.result || ''));
            setBulkParsed(null);
            setBulkErrors([]);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const uploadBulk = async () => {
        if (!bulkParsed) {
            parseBulk();
            return;
        }
        if (!apiKey) {
            toast.error('Enter your admin API key first');
            return;
        }
        setUploading(true);
        try {
            const payload = bulkParsed.map((q) => ({
                exam,
                branch,
                subject,
                year: Number(year),
                questionType: q.questionType,
                marks: Number(q.marks),
                questionText: q.questionText,
                options: q.questionType === 'NAT' ? [] : q.options.filter((o) => o && o.id && String(o.text).trim()),
                correctAnswer: q.questionType === 'NAT' ? Number(q.correctAnswer) : q.correctAnswer,
                explanation: q.explanation || '',
                imageUrls: Array.isArray(q.imageUrls) ? q.imageUrls : [],
            }));
            const { data } = await api.post('/admin/bulk-upload', payload);
            toast.success(`Successfully uploaded ${data.count} question(s) to ${branch} → ${subject} → ${year}`);
            setBulkJson('');
            setBulkParsed(null);
            setBulkErrors([]);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const [validationError, setValidationError] = useState('');

    // Clear validation error when current question or hierarchy changes
    React.useEffect(() => {
        setValidationError('');
    }, [current, branch, subject, year]);

    return (
        <div className="min-h-screen bg-night-900">
            <Navbar />
            <div className="py-8 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-100">Admin — Upload {exam} PYQs</h1>
                    </div>

                    <AdminApiKeyInput apiKey={apiKey} onSave={saveApiKey} />

                    <HierarchySelector
                        exam={exam}
                        branch={branch}
                        subject={subject}
                        year={year}
                        branches={branches}
                        subjects={subjects}
                        years={years}
                        onBranchChange={setBranch}
                        onSubjectChange={setSubject}
                        onYearChange={setYear}
                    />

                    {/* Mode toggle */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => setMode('bulk')}
                            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors min-h-11 ${mode === 'bulk' ? 'btn-primary' : 'glass-card text-slate-300 hover:text-slate-100'
                                }`}
                        >
                            Bulk JSON Upload (fast)
                        </button>
                        <button
                            onClick={() => setMode('single')}
                            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors min-h-11 ${mode === 'single' ? 'btn-primary' : 'glass-card text-slate-300 hover:text-slate-100'
                                }`}
                        >
                            One-by-One Builder (with images)
                        </button>
                    </div>

                    {mode === 'bulk' && (
                        <BulkUploadSection
                            bulkJson={bulkJson}
                            bulkParsed={bulkParsed}
                            bulkErrors={bulkErrors}
                            onJsonChange={(val) => { setBulkJson(val); setBulkParsed(null); }}
                            onParse={parseBulk}
                            onUpload={uploadBulk}
                            uploading={uploading}
                            onLoadTemplate={(template) => { setBulkJson(template); setBulkParsed(null); setBulkErrors([]); }}
                            onFileUpload={handleBulkFile}
                        />
                    )}

                    {mode === 'single' && (
                        <>
                            <SingleQuestionBuilder
                                current={current}
                                onUpdate={updateCurrent}
                                onOptionUpdate={updateOption}
                                onToggleMsq={toggleMsqAnswer}
                                onTypeChange={handleTypeChange}
                                onImageSelect={handleImageSelect}
                                onRemoveImage={removeImage}
                                onAddToQueue={addToQueue}
                                validateError={validationError}
                            />

                            <UploadQueue
                                queue={queue}
                                onRemove={removeFromQueue}
                                onUpload={uploadAll}
                                uploading={uploading}
                            />
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminUpload;
