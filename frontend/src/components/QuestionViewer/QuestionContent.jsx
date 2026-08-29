import React from 'react';
import { motion } from 'framer-motion';
import LatexRenderer from '../LatexRenderer';

const QuestionContent = ({ questionText }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="prose prose-invert max-w-none"
        >
            <div className="text-lg md:text-xl leading-relaxed text-slate-100">
                <LatexRenderer content={questionText} className="latex-content" />
            </div>
        </motion.div>
    );
};

export default QuestionContent;