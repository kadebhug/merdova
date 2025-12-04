'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './EntryModal.css'; // Reusing existing modal styles for consistency

const PinModal = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === '0203' || pin === '1809') {
            onSuccess();
            onClose();
            setPin('');
            setError('');
        } else {
            setError('Incorrect PIN');
            setPin('');
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="entry-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ zIndex: 1100 }}
        >
            <motion.div
                className="entry-modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '400px' }}
            >
                <h2>Enter PIN</h2>
                <p style={{ marginBottom: '1rem', color: '#ccc' }}>
                    Please enter the 4-digit PIN to edit this sunflower.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="••••"
                            className="pin-input"
                            maxLength={4}
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message" style={{ textAlign: 'center' }}>{error}</div>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Submit
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default PinModal;
