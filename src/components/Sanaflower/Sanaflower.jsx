'use client';

import React, { useRef, useEffect, useState } from 'react';
import './Sanaflower.css';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/src/config/supabaseClient';
import EntryModal from './EntryModal';
import PinModal from './PinModal';
import ImageLightbox from './ImageLightbox';

const Sanaflower = () => {
    const canvasRef = useRef(null);
    const [selectedSunflower, setSelectedSunflower] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [entryToEdit, setEntryToEdit] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const sunflowersRef = useRef([]);
    const animationFrameRef = useRef(null);
    const hoveredFlowerRef = useRef(null);

    // Mock data source - in the future, this can be replaced with an API call
    const mockFlowerData = [
        { id: 1, name: 'Sunny', type: 'Classic Sunflower', color: '#eab308', description: 'A bright and cheerful sunflower' },
        { id: 2, name: 'Golden', type: 'Golden Sunflower', color: '#f59e0b', description: 'Radiates warmth and joy' },
        { id: 3, name: 'Amber', type: 'Amber Sunflower', color: '#d97706', description: 'Deep golden hues' },
        { id: 4, name: 'Honey', type: 'Honey Sunflower', color: '#fbbf24', description: 'Sweet as honey' },
        { id: 5, name: 'Sunset', type: 'Sunset Sunflower', color: '#f97316', description: 'Captures the beauty of sunset' },
        { id: 6, name: 'Citrus', type: 'Citrus Sunflower', color: '#fb923c', description: 'Bright and zesty' },
        { id: 7, name: 'Marigold', type: 'Marigold Sunflower', color: '#fde047', description: 'Vibrant and lively' },
        { id: 8, name: 'Buttercup', type: 'Buttercup Sunflower', color: '#facc15', description: 'Soft and delicate' },
        { id: 9, name: 'Tangerine', type: 'Tangerine Sunflower', color: '#fb923c', description: 'Fresh and energetic' },
        { id: 10, name: 'Saffron', type: 'Saffron Sunflower', color: '#f59e0b', description: 'Rich and precious' },
        { id: 11, name: 'Dandelion', type: 'Dandelion Sunflower', color: '#fde68a', description: 'Light and airy' },
        { id: 12, name: 'Topaz', type: 'Topaz Sunflower', color: '#fbbf24', description: 'Gemstone beauty' },
    ];

    // Sunflower Class/Structure
    class Sunflower {
        constructor(x, y, height, data) {
            this.x = x;
            this.y = y;
            this.height = height;
            this.baseX = x;
            this.phase = Math.random() * Math.PI * 2;
            this.swaySpeed = 0.0005 + Math.random() * 0.0005;
            this.swayAmplitude = 10 + Math.random() * 10;
            // Store data from the data source
            this.data = data;
            this.petalColor = data.color;
        }

        draw(ctx, time, isHovered = false) {
            // Calculate sway
            const sway = Math.sin(time * this.swaySpeed + this.phase) * this.swayAmplitude;
            const headX = this.baseX + sway;
            const headY = this.y - this.height;

            // Draw Stem
            ctx.beginPath();
            ctx.moveTo(this.baseX, this.y);
            ctx.quadraticCurveTo(this.baseX + sway / 2, this.y - this.height / 2, headX, headY);
            ctx.strokeStyle = '#4ade80'; // Green stem
            ctx.lineWidth = 4;
            ctx.stroke();

            // Draw Leaves (Simplified as rects/pixels)
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(this.baseX + sway * 0.3 - 10, this.y - this.height * 0.4, 10, 6);
            ctx.fillRect(this.baseX + sway * 0.3 + 4, this.y - this.height * 0.6, 10, 6);

            const petalSize = 20;
            
            // Draw glow effect if hovered (draw before petals for better visibility)
            if (isHovered) {
                ctx.save();
                ctx.shadowBlur = 35;
                ctx.shadowColor = this.petalColor;
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = this.petalColor;
                // Draw a single glow layer
                const glowSize = petalSize + 30;
                ctx.fillRect(headX - glowSize, headY - glowSize, glowSize * 2, glowSize * 2);
                ctx.restore();
            }

            // Draw Petals (Pixel Art Style) - use color from data
            ctx.fillStyle = this.petalColor;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0; // Reset shadow for petals
            ctx.fillRect(headX - petalSize, headY - petalSize, petalSize * 2, petalSize * 2);

            // Draw Center
            ctx.fillStyle = '#78350f'; // Brown
            const centerSize = 8;
            ctx.fillRect(headX - centerSize, headY - centerSize, centerSize * 2, centerSize * 2);

            // Store current head position for click detection
            this.currentHeadX = headX;
            this.currentHeadY = headY;
        }
    }

    // Fetch entries from Supabase
    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('flower_entries')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error('Error fetching entries:', error);
            // Fallback to mockFlowerData if Supabase fails
        } finally {
            // Add a small delay to ensure smooth transition
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    };

    const handleEntryCreated = () => {
        fetchEntries();
        setEntryToEdit(null);
    };

    const handleEditClick = () => {
        setIsPinModalOpen(true);
    };

    const handlePinSuccess = () => {
        setEntryToEdit(selectedSunflower.data);
        setIsEntryModalOpen(true);
        setSelectedSunflower(null); // Close details modal
    };

    useEffect(() => {
        if (isLoading || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initSunflowers();
        };

        const initSunflowers = () => {
            sunflowersRef.current = [];
            // Use entries if available, otherwise use mockFlowerData
            const dataSource = entries.length > 0 ? entries : mockFlowerData;
            const numberOfFlowers = dataSource.length;
            const spacing = window.innerWidth / (numberOfFlowers + 1);

            // Create a sunflower for each item in the data source
            dataSource.forEach((flowerData, index) => {
                // Distribute flowers evenly across the screen with some randomness
                const x = spacing * (index + 1) + (Math.random() - 0.5) * 40;
                const y = window.innerHeight; // Bottom of screen
                // Use saved height if available, otherwise generate random
                const height = flowerData.height || (150 + Math.random() * 200);

                // If using entries, combine with random mock data for visual variety
                const visualData = entries.length > 0
                    ? {
                        ...mockFlowerData[index % mockFlowerData.length],
                        ...flowerData,
                        color: flowerData.flower_color || mockFlowerData[index % mockFlowerData.length].color
                    }
                    : flowerData;

                sunflowersRef.current.push(new Sunflower(x, y, height, visualData));
            });
        };

        let time = 0;
        const animate = () => {
            time += 16; // Approx 60fps ms
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background/sky if needed, or rely on CSS

            sunflowersRef.current.forEach(flower => {
                const isHovered = hoveredFlowerRef.current === flower;
                flower.draw(ctx, time, isHovered);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [entries, isLoading]);

    const checkCollision = (x, y) => {
        // Improved collision detection for better mobile experience
        const hitRadius = 50; // Increased hit area (approx 13mm on mobile)
        let closestFlower = null;
        let minDistance = Infinity;

        // Iterate through all flowers to find the closest one within range
        // We don't need to reverse iterate if we find the closest one, 
        // but checking all ensures we get the best match.
        sunflowersRef.current.forEach(flower => {
            // Calculate distance between click/touch and flower head center
            const dx = x - flower.currentHeadX;
            const dy = y - flower.currentHeadY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if within hit radius
            if (distance <= hitRadius) {
                // If this flower is closer than the previous best match, keep it
                if (distance < minDistance) {
                    minDistance = distance;
                    closestFlower = flower;
                }
            }
        });

        if (closestFlower) {
            setSelectedSunflower(closestFlower);
        }
    };

    const checkHover = (x, y) => {
        // Check which flower is being hovered
        const hitRadius = 50; // Same hit area as click detection
        let closestFlower = null;
        let minDistance = Infinity;

        sunflowersRef.current.forEach(flower => {
            // Calculate distance between mouse and flower head center
            const dx = x - flower.currentHeadX;
            const dy = y - flower.currentHeadY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if within hit radius
            if (distance <= hitRadius) {
                // If this flower is closer than the previous best match, keep it
                if (distance < minDistance) {
                    minDistance = distance;
                    closestFlower = flower;
                }
            }
        });

        // Only update if the hovered flower actually changed
        if (hoveredFlowerRef.current !== closestFlower) {
            hoveredFlowerRef.current = closestFlower;
        }
    };

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;
        checkCollision(clickX, clickY);
    };

    const handleCanvasMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        checkHover(mouseX, mouseY);
    };

    const handleCanvasMouseLeave = () => {
        hoveredFlowerRef.current = null;
    };

    const handleCanvasTouch = (e) => {
        e.preventDefault(); // Prevent default touch actions
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const touch = e.changedTouches[0];
        const touchX = (touch.clientX - rect.left) * scaleX;
        const touchY = (touch.clientY - rect.top) * scaleY;
        checkCollision(touchX, touchY);
    };

    // Add non-passive touch listener to allow preventDefault
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('touchstart', handleCanvasTouch, { passive: false });
        }
        return () => {
            if (canvas) {
                canvas.removeEventListener('touchstart', handleCanvasTouch);
            }
        };
    }, []);

    return (
        <div className="sanaflower-container">
            {/* Wind Loader */}
            {isLoading && (
                <div className="wind-loader">
                    <div className="wind-line wind-line-1"></div>
                    <div className="wind-line wind-line-2"></div>
                    <div className="wind-line wind-line-3"></div>
                    <div className="wind-line wind-line-4"></div>
                    <div className="wind-line wind-line-5"></div>
                </div>
            )}

            {/* Add Entry Button */}
            {!isLoading && (
                <button
                    className="add-entry-btn"
                    onClick={() => setIsEntryModalOpen(true)}
                >
                    + Add Entry
                </button>
            )}

            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
                className="sanaflower-canvas"
                style={{ display: isLoading ? 'none' : 'block' }}
            />

            {/* Entry Creation Modal */}
            <AnimatePresence>
                {isEntryModalOpen && (
                    <EntryModal
                        isOpen={isEntryModalOpen}
                        onClose={() => {
                            setIsEntryModalOpen(false);
                            setEntryToEdit(null);
                        }}
                        onEntryCreated={handleEntryCreated}
                        entryToEdit={entryToEdit}
                    />
                )}
            </AnimatePresence>

            {/* PIN Modal */}
            <AnimatePresence>
                {isPinModalOpen && (
                    <PinModal
                        isOpen={isPinModalOpen}
                        onClose={() => setIsPinModalOpen(false)}
                        onSuccess={handlePinSuccess}
                    />
                )}
            </AnimatePresence>

            {/* Flower Details Modal */}
            <AnimatePresence>
                {selectedSunflower && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSunflower(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close-x"
                                onClick={() => setSelectedSunflower(null)}
                                aria-label="Close"
                            >
                                ✕
                            </button>

                            <h2>{selectedSunflower.data.title || selectedSunflower.data.name || 'My Entry'}</h2>

                            {/* Display entry date if available */}
                            {selectedSunflower.data.entry_date && (
                                <p className="entry-date">
                                    <strong>Date:</strong> {new Date(selectedSunflower.data.entry_date).toLocaleDateString()}
                                </p>
                            )}

                            {/* Always display type and description if available */}
                            {(selectedSunflower.data.type || selectedSunflower.data.description) && (
                                <div className="flower-details" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    {selectedSunflower.data.type && <p><strong>Type:</strong> {selectedSunflower.data.type}</p>}
                                    {selectedSunflower.data.description && <p><strong>Description:</strong> {selectedSunflower.data.description}</p>}
                                </div>
                            )}

                            {/* Display content items if available */}
                            {selectedSunflower.data.content_items && selectedSunflower.data.content_items.length > 0 ? (
                                <div className="entry-content">
                                    {selectedSunflower.data.content_items
                                        .sort((a, b) => a.order - b.order)
                                        .map((item, index) => (
                                            <div key={index} className="content-item">
                                                {item.type === 'text' && (
                                                    <p className="content-text">{item.content}</p>
                                                )}
                                                {item.type === 'image' && (
                                                    <div className="image-link-container">
                                                        <button
                                                            className="image-link"
                                                            onClick={() => setLightboxImage(item.url)}
                                                        >
                                                            📷 View Image {index + 1}
                                                        </button>
                                                    </div>
                                                )}
                                                {item.type === 'audio' && (
                                                    <audio
                                                        src={item.url}
                                                        controls
                                                        className="content-audio"
                                                    />
                                                )}
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : (
                                <p className="no-content-message">No additional content for this flower.</p>
                            )}

                            {/* Edit Button for most recent entry */}
                            {entries.length > 0 && selectedSunflower.data.id === entries[entries.length - 1].id && (
                                <button
                                    className="edit-btn"
                                    onClick={handleEditClick}
                                    style={{
                                        marginTop: '1rem',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        color: '#1a1a2e',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.3)';
                                    }}
                                >
                                    ✏️ Edit Entry
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Lightbox */}
            <ImageLightbox
                imageUrl={lightboxImage}
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
        </div>
    );
};

export default Sanaflower;
