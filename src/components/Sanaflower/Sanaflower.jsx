import React, { useRef, useEffect, useState } from 'react';
import './Sanaflower.css';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import EntryModal from './EntryModal';
import PinModal from './PinModal';
import ImageLightbox from './ImageLightbox';

const Sanaflower = ({ currentUserPin }) => {
    const canvasRef = useRef(null);
    const [selectedSunflower, setSelectedSunflower] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [entryToEdit, setEntryToEdit] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSendingCompliment, setIsSendingCompliment] = useState(false);
    const [isSendingApology, setIsSendingApology] = useState(false);
    const [isApologyModalOpen, setIsApologyModalOpen] = useState(false);
    const [apologyMessage, setApologyMessage] = useState('');
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

    // Compliment messages
    const complimentMessages = [
        'You brighten my day!',
        'You are amazing!',
        'You bring so much joy!',
        'You are wonderful!',
        'You make everything better!',
        'You are beautiful inside and out!',
        'You inspire me!',
        'You are a ray of sunshine!',
        'You are so special!',
        'You make the world brighter!'
    ];

    // Apology messages
    const apologyMessages = [
        'I am deeply sorry for my actions.',
        'I apologize from the bottom of my heart.',
        'I regret what happened and I am truly sorry.',
        'Please forgive me. I made a mistake.',
        'I am sorry for hurting you. I hope you can forgive me.',
        'I apologize sincerely and hope we can move forward.',
        'I am truly sorry for my behavior.',
        'Please accept my heartfelt apology.',
        'I regret my actions and I am deeply sorry.',
        'I apologize and hope you can find it in your heart to forgive me.'
    ];

    // Vibrant color palette for compliments
    const complimentColors = [
        '#ff6b9d', '#c44569', '#f8b500', '#ff9ff3', '#54a0ff',
        '#5f27cd', '#00d2d3', '#ff6348', '#ffa502', '#ff3838',
        '#ff9ff3', '#feca57', '#48dbfb', '#ff6b81', '#a55eea'
    ];

    // Rose colors for apology bouquets
    const roseColors = [
        '#dc2626', '#ef4444', '#f87171', '#e11d48', '#be123c',
        '#b91c1c', '#991b1b', '#f43f5e', '#ec4899', '#db2777'
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
            this.isCompliment = data.is_compliment || false;
            this.isApology = data.is_apology || false;
        }

        draw(ctx, time, isHovered = false) {
            // Calculate sway
            const sway = Math.sin(time * this.swaySpeed + this.phase) * this.swayAmplitude;
            const headX = this.baseX + sway;
            const headY = this.y - this.height;

            // If it's an apology bouquet, draw roses instead
            if (this.isApology) {
                this.drawRoseBouquet(ctx, headX, headY, isHovered);
                return;
            }

            // Adjust sizes for compliment flowers
            const stemWidth = this.isCompliment ? 2 : 4;
            const leafSize = this.isCompliment ? 5 : 10;
            const leafHeight = this.isCompliment ? 4 : 6;
            const petalSize = this.isCompliment ? 12 : 20;
            const centerSize = this.isCompliment ? 5 : 8;

            // Draw Stem
            ctx.beginPath();
            ctx.moveTo(this.baseX, this.y);
            ctx.quadraticCurveTo(this.baseX + sway / 2, this.y - this.height / 2, headX, headY);
            ctx.strokeStyle = '#4ade80'; // Green stem
            ctx.lineWidth = stemWidth;
            ctx.stroke();

            // Draw Leaves (Simplified as rects/pixels)
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(this.baseX + sway * 0.3 - leafSize, this.y - this.height * 0.4, leafSize, leafHeight);
            ctx.fillRect(this.baseX + sway * 0.3 + 4, this.y - this.height * 0.6, leafSize, leafHeight);
            
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
            ctx.fillRect(headX - centerSize, headY - centerSize, centerSize * 2, centerSize * 2);

            // Store current head position for click detection
            this.currentHeadX = headX;
            this.currentHeadY = headY;
        }

        drawRoseBouquet(ctx, centerX, centerY, isHovered) {
            // Draw stem for bouquet
            ctx.beginPath();
            ctx.moveTo(this.baseX, this.y);
            ctx.quadraticCurveTo(this.baseX + (centerX - this.baseX) / 2, this.y - this.height / 2, centerX, centerY);
            ctx.strokeStyle = '#166534'; // Dark green stem
            ctx.lineWidth = 5;
            ctx.stroke();

            // Draw leaves on stem
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(this.baseX - 8, this.y - this.height * 0.4, 6, 8);
            ctx.fillRect(this.baseX + 2, this.y - this.height * 0.5, 6, 8);

            // Draw multiple roses in a bouquet arrangement
            const roseCount = 5;
            const roseSize = 18;
            const bouquetRadius = 25;

            // Draw glow effect if hovered
            if (isHovered) {
                ctx.save();
                ctx.shadowBlur = 40;
                ctx.shadowColor = this.petalColor;
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = this.petalColor;
                const glowSize = bouquetRadius + roseSize + 20;
                ctx.beginPath();
                ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Draw each rose in the bouquet
            for (let i = 0; i < roseCount; i++) {
                const angle = (Math.PI * 2 * i) / roseCount;
                const offsetX = Math.cos(angle) * bouquetRadius;
                const offsetY = Math.sin(angle) * bouquetRadius;
                const roseX = centerX + offsetX;
                const roseY = centerY + offsetY;

                this.drawSingleRose(ctx, roseX, roseY, roseSize, this.petalColor);
            }

            // Draw center rose
            this.drawSingleRose(ctx, centerX, centerY, roseSize * 1.2, this.petalColor);

            // Store current head position for click detection
            this.currentHeadX = centerX;
            this.currentHeadY = centerY;
        }

        drawSingleRose(ctx, x, y, size, color) {
            ctx.save();
            ctx.translate(x, y);

            // Draw rose petals in layers (circular arrangement)
            ctx.fillStyle = color;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // Outer petals (8 petals)
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                const petalX = Math.cos(angle) * (size * 0.7);
                const petalY = Math.sin(angle) * (size * 0.7);
                ctx.fillRect(petalX - size * 0.3, petalY - size * 0.3, size * 0.6, size * 0.6);
            }

            // Middle petals (6 petals, slightly smaller)
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 * i) / 6;
                const petalX = Math.cos(angle) * (size * 0.4);
                const petalY = Math.sin(angle) * (size * 0.4);
                ctx.fillRect(petalX - size * 0.25, petalY - size * 0.25, size * 0.5, size * 0.5);
            }

            // Center (darker)
            ctx.fillStyle = '#7f1d1d'; // Dark red center
            ctx.fillRect(-size * 0.15, -size * 0.15, size * 0.3, size * 0.3);

            ctx.restore();
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

    const handleSendCompliment = async () => {
        if (!currentUserPin) {
            alert('Please enter your PIN first');
            return;
        }

        setIsSendingCompliment(true);
        try {
            // Determine recipient PIN (0203 -> 1809, 1809 -> 0203)
            const recipientPin = currentUserPin === '0203' ? '1809' : '0203';
            
            // Get random compliment message
            const randomCompliment = complimentMessages[Math.floor(Math.random() * complimentMessages.length)];
            
            // Get random color from vibrant palette
            const randomColor = complimentColors[Math.floor(Math.random() * complimentColors.length)];
            
            // Generate smaller height for compliment flowers (80-140px)
            const randomHeight = 80 + Math.random() * 60;

            // Create compliment entry
            const { error } = await supabase
                .from('flower_entries')
                .insert([
                    {
                        title: randomCompliment,
                        content_items: [
                            {
                                type: 'text',
                                content: randomCompliment,
                                order: 0
                            }
                        ],
                        flower_color: randomColor,
                        height: randomHeight,
                        entry_date: new Date().toISOString().split('T')[0],
                        is_compliment: true,
                        recipient_pin: recipientPin
                    }
                ]);

            if (error) throw error;

            // Refresh entries to show the new compliment
            fetchEntries();
        } catch (err) {
            console.error('Error sending compliment:', err);
            alert('Failed to send compliment: ' + err.message);
        } finally {
            setIsSendingCompliment(false);
        }
    };

    const handleOpenApologyModal = () => {
        if (!currentUserPin) {
            alert('Please enter your PIN first');
            return;
        }
        setIsApologyModalOpen(true);
    };

    const handleSendApology = async () => {
        if (!apologyMessage.trim()) {
            alert('Please enter an apology message');
            return;
        }

        setIsSendingApology(true);
        try {
            // Determine recipient PIN (0203 -> 1809, 1809 -> 0203)
            const recipientPin = currentUserPin === '0203' ? '1809' : '0203';
            
            // Use the entered apology message
            const apologyText = apologyMessage.trim();
            
            // Get random rose color
            const randomRoseColor = roseColors[Math.floor(Math.random() * roseColors.length)];
            
            // Generate height for apology bouquet (180-250px)
            const randomHeight = 180 + Math.random() * 70;

            // Create apology bouquet entry
            const { error } = await supabase
                .from('flower_entries')
                .insert([
                    {
                        title: 'Apology Bouquet',
                        content_items: [
                            {
                                type: 'text',
                                content: apologyText,
                                order: 0
                            }
                        ],
                        flower_color: randomRoseColor,
                        height: randomHeight,
                        entry_date: new Date().toISOString().split('T')[0],
                        is_apology: true,
                        recipient_pin: recipientPin
                    }
                ]);

            if (error) throw error;

            // Reset form and close modal
            setApologyMessage('');
            setIsApologyModalOpen(false);
            
            // Refresh entries to show the new apology bouquet
            fetchEntries();
        } catch (err) {
            console.error('Error sending apology bouquet:', err);
            alert('Failed to send apology bouquet: ' + err.message);
        } finally {
            setIsSendingApology(false);
        }
    };

    const handleEditClick = () => {
        setIsPinModalOpen(true);
    };

    const handlePinSuccess = () => {
        // Prevent editing compliments and apologies
        if (selectedSunflower.data.is_compliment) {
            alert('Compliments cannot be edited.');
            setIsPinModalOpen(false);
            return;
        }
        if (selectedSunflower.data.is_apology) {
            alert('Apology bouquets cannot be edited.');
            setIsPinModalOpen(false);
            return;
        }
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
                // Compliment flowers already have smaller heights set
                const height = flowerData.height || (150 + Math.random() * 200);

                // If using entries, combine with random mock data for visual variety
                // But don't add type/description for compliment or apology flowers
                const visualData = entries.length > 0
                    ? {
                        ...(flowerData.is_compliment || flowerData.is_apology ? {} : mockFlowerData[index % mockFlowerData.length]),
                        ...flowerData,
                        color: flowerData.flower_color || (flowerData.is_compliment || flowerData.is_apology ? flowerData.flower_color : mockFlowerData[index % mockFlowerData.length].color)
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
                <>
                    <button
                        className="add-entry-btn"
                        onClick={() => setIsEntryModalOpen(true)}
                    >
                        + Add Entry
                    </button>
                    {/* Compliment Button */}
                    <button
                        className="compliment-btn"
                        onClick={handleSendCompliment}
                        disabled={isSendingCompliment}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '180px',
                            background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            border: 'none',
                            cursor: isSendingCompliment ? 'not-allowed' : 'pointer',
                            zIndex: 100,
                            boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)',
                            transition: 'all 0.3s ease',
                            fontFamily: "'League Spartan', sans-serif",
                            opacity: isSendingCompliment ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!isSendingCompliment) {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 157, 0.6)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 157, 0.4)';
                        }}
                    >
                        {isSendingCompliment ? 'Sending...' : '💝 Send Compliment'}
                    </button>
                    {/* Apology Bouquet Button - Icon Only */}
                    <button
                        className="apology-btn"
                        onClick={handleOpenApologyModal}
                        disabled={isSendingApology}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '340px',
                            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: isSendingApology ? 'not-allowed' : 'pointer',
                            zIndex: 100,
                            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
                            transition: 'all 0.3s ease',
                            fontFamily: "'League Spartan', sans-serif",
                            opacity: isSendingApology ? 0.6 : 1,
                            fontSize: '20px'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSendingApology) {
                                e.target.style.transform = 'translateY(-3px) scale(1.1)';
                                e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.6)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.4)';
                        }}
                        title="Send Apology Bouquet"
                    >
                        🌹
                    </button>
                </>
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

            {/* Apology Modal */}
            <AnimatePresence>
                {isApologyModalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsApologyModalOpen(false)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                            style={{ maxWidth: '500px' }}
                        >
                            <button
                                className="modal-close-x"
                                onClick={() => {
                                    setIsApologyModalOpen(false);
                                    setApologyMessage('');
                                }}
                                aria-label="Close"
                            >
                                ✕
                            </button>

                            <h2>🌹 Send Apology Bouquet</h2>
                            <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                                Write your apology message below
                            </p>

                            <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                                <textarea
                                    value={apologyMessage}
                                    onChange={(e) => setApologyMessage(e.target.value)}
                                    placeholder="I am deeply sorry for..."
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '2px solid rgba(220, 38, 38, 0.3)',
                                        fontSize: '1rem',
                                        fontFamily: "'Outfit', sans-serif",
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                    autoFocus
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    onClick={() => {
                                        setIsApologyModalOpen(false);
                                        setApologyMessage('');
                                    }}
                                    className="cancel-btn"
                                    disabled={isSendingApology}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendApology}
                                    className="submit-btn"
                                    disabled={isSendingApology || !apologyMessage.trim()}
                                    style={{
                                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                                        opacity: (!apologyMessage.trim() || isSendingApology) ? 0.6 : 1
                                    }}
                                >
                                    {isSendingApology ? 'Sending...' : 'Send Apology'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
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

                            {/* Always display type and description if available (but not for compliments or apologies) */}
                            {!selectedSunflower.data.is_compliment && !selectedSunflower.data.is_apology && (selectedSunflower.data.type || selectedSunflower.data.description) && (
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

                            {/* Edit Button for most recent entry (not for compliments or apologies) */}
                            {entries.length > 0 && 
                             selectedSunflower.data.id === entries[entries.length - 1].id && 
                             !selectedSunflower.data.is_compliment && 
                             !selectedSunflower.data.is_apology && (
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
