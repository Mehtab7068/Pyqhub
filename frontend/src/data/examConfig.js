const baseConfig = {
    durations: { full: 180, subject: 90, chapter: 45, previous: 180 },
    mockLimits: { full: 65, subject: 35, chapter: 15, previous: 65 },
    questionTypes: ['MCQ', 'MSQ', 'NAT'],
    marks: [1, 2],
};

export const EXAM_CONFIG = {
    GATE: {
        ...baseConfig,
        label: 'GATE',
        scoring: { mcqNegative: (marks) => (marks === 2 ? -2 / 3 : -1 / 3) },
    },
    JEE_MAINS: {
        ...baseConfig,
        label: 'JEE Main',
        durations: { full: 180, subject: 60, chapter: 30, previous: 180 },
        mockLimits: { full: 75, subject: 30, chapter: 20, previous: 75 },
        questionTypes: ['MCQ', 'NAT'],
        marks: [4],
        scoring: { mcqNegative: () => -1 },
    },
    NEET: {
        ...baseConfig,
        label: 'NEET',
        durations: { full: 200, subject: 50, chapter: 30, previous: 200 },
        mockLimits: { full: 180, subject: 45, chapter: 30, previous: 180 },
        questionTypes: ['MCQ'],
        marks: [4],
        scoring: { mcqNegative: () => -1 },
    },
    SSC_CGL: {
        ...baseConfig,
        label: 'SSC CGL',
        durations: { full: 60, subject: 20, chapter: 15, previous: 60 },
        mockLimits: { full: 100, subject: 25, chapter: 20, previous: 100 },
        questionTypes: ['MCQ'],
        marks: [2],
        scoring: { mcqNegative: () => -0.5 },
    },
    NDA: {
        ...baseConfig,
        label: 'NDA',
        durations: { full: 150, subject: 75, chapter: 45, previous: 150 },
        mockLimits: { full: 150, subject: 50, chapter: 25, previous: 150 },
        questionTypes: ['MCQ'],
        marks: [2.5],
        scoring: { mcqNegative: () => -0.83 },
    },
    UPSC: {
        ...baseConfig,
        label: 'UPSC CSE',
        durations: { full: 120, subject: 60, chapter: 45, previous: 120 },
        mockLimits: { full: 100, subject: 50, chapter: 25, previous: 100 },
        questionTypes: ['MCQ'],
        marks: [2],
        scoring: { mcqNegative: () => -0.66 },
    },
};

export const getExamConfig = (exam) => EXAM_CONFIG[exam] || EXAM_CONFIG.GATE;
