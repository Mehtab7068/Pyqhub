import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders text containing LaTeX delimiters.
 * Supports:
 *   - Inline: \( ... \) or $ ... $
 *   - Block: $$ ... $$ or \[ ... \]
 *
 * Falls back to plain text if KaTeX fails to render a specific formula.
 */
const LatexRenderer = ({ content, className = '' }) => {
    if (!content) return null;

    // Split content by block-level delimiters first ($$ and \[)
    const blockRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
    const parts = content.split(blockRegex);

    const rendered = parts.map((part, index) => {
        if (!part) return null;

        // Block math
        if (part.startsWith('$$') || part.startsWith('\\[')) {
            const latex = part.replace(/^\$\$|^\s*\\\[|\$\$$|\\\]\s*$/g, '');
            try {
                return (
                    <div key={index} className="my-4 flex justify-center">
                        <BlockMath math={latex} errorColor={'#cc0000'} renderError={(err) => <span className="text-red-500">{err}</span>} />
                    </div>
                );
            } catch (e) {
                return <div key={index} className="text-red-500 my-2">[Invalid LaTeX: {part}]</div>;
            }
        }

        // Inline math or plain text
        const inlineRegex = /(\\\([\s\S]*?\\\)|\$[^$\n]+?\$)/g;
        const inlineParts = part.split(inlineRegex);

        return (
            <span key={index}>
                {inlineParts.map((inlinePart, i) => {
                    if (!inlinePart) return null;

                    if (inlinePart.startsWith('\\(') || (inlinePart.startsWith('$') && !inlinePart.startsWith('$$'))) {
                        const latex = inlinePart.replace(/^\s*\\\(|\\\)\s*$|^\s*\$|\$\s*$/g, '');
                        try {
                            return <InlineMath key={i} math={latex} />;
                        } catch (e) {
                            return <span key={i} className="text-red-500">[Invalid LaTeX]</span>;
                        }
                    }

                    return <span key={i}>{inlinePart}</span>;
                })}
            </span>
        );
    });

    return <div className={`latex-content ${className}`}>{rendered}</div>;
};

export default LatexRenderer;