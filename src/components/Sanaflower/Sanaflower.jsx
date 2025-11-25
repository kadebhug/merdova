import React, { useRef, useEffect, useState } from 'react';
import './Sanaflower.css';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import EntryModal from './EntryModal';
import ImageLightbox from './ImageLightbox';

const Sanaflower = () => {
    const canvasRef = useRef(null);
    const [selectedSunflower, setSelectedSunflower] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);
    const sunflowersRef = useRef([]);
    const animationFrameRef = useRef(null);

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

        draw(ctx, time) {
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

            // Draw Petals (Pixel Art Style) - use color from data
            ctx.fillStyle = this.petalColor;
            const petalSize = 20;
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
        }
    };

    const handleEntryCreated = () => {
        fetchEntries();
    };

    useEffect(() => {
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
                const height = 150 + Math.random() * 200; // Random height

                // If using entries, combine with random mock data for visual variety
                const visualData = entries.length > 0
                    ? {
                        ...flowerData,
                        ...mockFlowerData[index % mockFlowerData.length],
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
                flower.draw(ctx, time);
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
    }, [entries]);

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Check collision with flower heads (simple box check)
        const hitFlower = sunflowersRef.current.find(flower => {
            const headSize = 25; // Approx radius including petals
            return (
                clickX >= flower.currentHeadX - headSize &&
                clickX <= flower.currentHeadX + headSize &&
                clickY >= flower.currentHeadY - headSize &&
                clickY <= flower.currentHeadY + headSize
            );
        });

        if (hitFlower) {
            setSelectedSunflower(hitFlower);
        }
    };

    return (
        <div className="sanaflower-container">
            {/* Add Entry Button */}
            <button
                className="add-entry-btn"
                onClick={() => setIsEntryModalOpen(true)}
            >
                + Add Entry
            </button>

            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="sanaflower-canvas"
            />

            {/* Entry Creation Modal */}
            <AnimatePresence>
                {isEntryModalOpen && (
                    <EntryModal
                        isOpen={isEntryModalOpen}
                        onClose={() => setIsEntryModalOpen(false)}
                        onEntryCreated={handleEntryCreated}
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
                            <h2>{selectedSunflower.data.name || 'My Entry'}</h2>

                            {/* Display entry date if available */}
                            {selectedSunflower.data.entry_date && (
                                <p className="entry-date">
                                    <strong>Date:</strong> {new Date(selectedSunflower.data.entry_date).toLocaleDateString()}
                                </p>
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
                                <>
                                    {/* Fallback to mock data display */}
                                    <p><strong>Type:</strong> {selectedSunflower.data.type}</p>
                                    <p><strong>Description:</strong> {selectedSunflower.data.description}</p>
                                </>
                            )}

                            <button className="close-btn" onClick={() => setSelectedSunflower(null)}>Close</button>
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
