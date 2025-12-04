'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageLightbox.css';

const ImageLightbox = ({ imageUrl, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="lightbox-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="lightbox-content"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img src={imageUrl} alt="Expanded view" className="lightbox-image" />
                    <button className="lightbox-close" onClick={onClose}>×</button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageLightbox;
