const EXAM_CONFIG = {
    GATE: { mockLimits: { full: 65, subject: 35, chapter: 15, previous: 65 }, questionTypes: ['MCQ', 'MSQ', 'NAT'], marks: [1, 2] },
    JEE_MAINS: { mockLimits: { full: 75, subject: 30, chapter: 20, previous: 75 }, questionTypes: ['MCQ', 'NAT'], marks: [4] },
    NEET: { mockLimits: { full: 180, subject: 45, chapter: 30, previous: 180 }, questionTypes: ['MCQ'], marks: [4] },
    SSC_CGL: { mockLimits: { full: 100, subject: 25, chapter: 20, previous: 100 }, questionTypes: ['MCQ'], marks: [2] },
    NDA: { mockLimits: { full: 150, subject: 50, chapter: 25, previous: 150 }, questionTypes: ['MCQ'], marks: [2.5] },
    UPSC: { mockLimits: { full: 100, subject: 50, chapter: 25, previous: 100 }, questionTypes: ['MCQ'], marks: [2] },
};

export const getExamConfig = (exam) => EXAM_CONFIG[exam] || EXAM_CONFIG.GATE;
export default EXAM_CONFIG;
