'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/src/config/supabaseClient';
import './EntryModal.css';

const EntryModal = ({ isOpen, onClose, onEntryCreated, entryToEdit = null }) => {
    const [contentItems, setContentItems] = useState(entryToEdit ? entryToEdit.content_items : []);
    const [currentText, setCurrentText] = useState('');
    const [title, setTitle] = useState(entryToEdit ? entryToEdit.title : '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const addTextContent = () => {
        if (currentText.trim()) {
            setContentItems([...contentItems, {
                type: 'text',
                content: currentText,
                order: contentItems.length
            }]);
            setCurrentText('');
        }
    };

    const addImageContent = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('flower-images')
                .upload(fileName, file);

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('flower-images')
                .getPublicUrl(fileName);

            setContentItems([...contentItems, {
                type: 'image',
                url: publicUrl,
                order: contentItems.length
            }]);
        } catch (err) {
            setError('Failed to upload image: ' + err.message);
        }
    };

    const addAudioContent = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('flower-audio')
                .upload(fileName, file);

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('flower-audio')
                .getPublicUrl(fileName);

            setContentItems([...contentItems, {
                type: 'audio',
                url: publicUrl,
                order: contentItems.length
            }]);
        } catch (err) {
            setError('Failed to upload audio: ' + err.message);
        }
    };

    const removeContentItem = (index) => {
        const newItems = contentItems.filter((_, i) => i !== index);
        // Reorder remaining items
        const reorderedItems = newItems.map((item, i) => ({ ...item, order: i }));
        setContentItems(reorderedItems);
    };

    const moveContentItem = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === contentItems.length - 1) return;

        const newItems = [...contentItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap items
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        
        // Update order values
        const reorderedItems = newItems.map((item, i) => ({ ...item, order: i }));
        setContentItems(reorderedItems);
    };

    const handleSubmit = async () => {
        if (contentItems.length === 0) {
            setError('Please add at least one content item');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            let error;

            if (entryToEdit) {
                // Update existing entry
                const { error: updateError } = await supabase
                    .from('flower_entries')
                    .update({
                        title: title,
                        content_items: contentItems,
                    })
                    .eq('id', entryToEdit.id);
                error = updateError;
            } else {
                // Create new entry
                // Get a random color from the mock data
                const colors = ['#eab308', '#f59e0b', '#d97706', '#fbbf24', '#f97316', '#fb923c', '#fde047', '#facc15'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomHeight = 150 + Math.random() * 200; // Random height between 150 and 350

                const { error: insertError } = await supabase
                    .from('flower_entries')
                    .insert([
                        {
                            title: title,
                            content_items: contentItems,
                            flower_color: randomColor,
                            height: randomHeight,
                            entry_date: new Date().toISOString().split('T')[0]
                        }
                    ]);
                error = insertError;
            }

            if (error) throw error;

            // Reset form
            setContentItems([]);
            setCurrentText('');
            setTitle('');
            onEntryCreated();
            onClose();
        } catch (err) {
            setError('Failed to save entry: ' + err.message);
        } finally {
            setIsSubmitting(false);
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
        >
            <motion.div
                className="entry-modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
            >
                <h2>{entryToEdit ? 'Edit Entry' : 'Create New Entry'}</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="entry-form">
                    {/* Title Input */}
                    <div className="form-section">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your entry a title..."
                            className="title-input"
                        />
                    </div>

                    {/* Text Input */}
                    <div className="form-section">
                        <label>Add Text</label>
                        <textarea
                            value={currentText}
                            onChange={(e) => setCurrentText(e.target.value)}
                            placeholder="Write your thoughts..."
                            rows={4}
                        />
                        <button onClick={addTextContent} className="add-content-btn">
                            Add Text
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div className="form-section">
                        <label>Add Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={addImageContent}
                            className="file-input"
                        />
                    </div>

                    {/* Audio Upload */}
                    <div className="form-section">
                        <label>Add Audio</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={addAudioContent}
                            className="file-input"
                        />
                    </div>

                    {/* Content Preview */}
                    {contentItems.length > 0 && (
                        <div className="content-preview">
                            <h3>Content Preview ({contentItems.length} items)</h3>
                            {contentItems.map((item, index) => (
                                <div key={index} className="preview-item">
                                    <span className="item-order">#{index + 1}</span>
                                    <div className="preview-item-controls">
                                        <button
                                            onClick={() => moveContentItem(index, 'up')}
                                            className="move-btn"
                                            disabled={index === 0}
                                            title="Move up"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveContentItem(index, 'down')}
                                            className="move-btn"
                                            disabled={index === contentItems.length - 1}
                                            title="Move down"
                                        >
                                            ↓
                                        </button>
                                    </div>
                                    {item.type === 'text' && (
                                        <p className="preview-text">{item.content}</p>
                                    )}
                                    {item.type === 'image' && (
                                        <img src={item.url} alt="Preview" className="preview-image" />
                                    )}
                                    {item.type === 'audio' && (
                                        <audio src={item.url} controls className="preview-audio" />
                                    )}
                                    <button
                                        onClick={() => removeContentItem(index)}
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn" disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="submit-btn"
                        disabled={isSubmitting || contentItems.length === 0}
                    >
                        {isSubmitting ? 'Saving...' : (entryToEdit ? 'Save Changes' : 'Create Entry')}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EntryModal;
