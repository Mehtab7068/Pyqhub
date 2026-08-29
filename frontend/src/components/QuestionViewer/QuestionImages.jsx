import React, { useState } from 'react';
import { motion } from 'framer-motion';

const QuestionImages = ({ imageUrls, apiOrigin, imageErrors, onImageError }) => {
    const [expandedImage, setExpandedImage] = useState(null);

    const handleImageClick = (url, index) => {
        if (!imageErrors.has(index)) {
            setExpandedImage({ url, index });
        }
    };

    const handleCloseExpanded = () => {
        setExpandedImage(null);
    };

    const validImages = imageUrls.filter((_, index) => !imageErrors.has(index));
    const errorCount = imageErrors.size;

    if (validImages.length === 0 && errorCount > 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl"
            >
                <div className="flex items-center gap-3 text-rose-400">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm">
                        {errorCount} image{errorCount !== 1 ? 's' : ''} failed to load
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="space-y-3"
            >
                {imageUrls.map((url, index) => {
                    const isError = imageErrors.has(index);
                    const fullUrl = url.startsWith('http') ? url : `${apiOrigin}${url}`;

                    if (isError) return null;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                            className="relative group"
                        >
                            <div className="relative aspect-video max-h-[400px] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                                <img
                                    src={fullUrl}
                                    alt={`Question figure ${index + 1}`}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                                    loading="lazy"
                                    onError={() => onImageError(index)}
                                    onClick={() => handleImageClick(fullUrl, index)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-sm text-white/80 font-medium">
                                        Click to enlarge
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageClick(fullUrl, index);
                                        }}
                                        className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                                        aria-label={`Enlarge image ${index + 1}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 text-center">
                                Figure {index + 1}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Expanded Image Modal */}
            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={handleCloseExpanded}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Enlarged question figure"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative max-w-[90vw] max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={expandedImage.url}
                                alt={`Question figure ${expandedImage.index + 1} enlarged`}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            />
                            <button
                                onClick={handleCloseExpanded}
                                className="absolute -top-12 right-0 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                                aria-label="Close enlarged image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default QuestionImages;