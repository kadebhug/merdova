import React, { useRef, useEffect, useState } from 'react';
import './Jolene.css';
import { motion, AnimatePresence } from 'framer-motion';

const Jolene = () => {
    const flowerRef = useRef(null);
    const [isValentineModalOpen, setIsValentineModalOpen] = useState(false);
    const [valentineResponse, setValentineResponse] = useState(null);
    const [hearts, setHearts] = useState([]);
    const [sadEmojis, setSadEmojis] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const heartRainIntervalRef = useRef(null);
    const heartCleanupIntervalRef = useRef(null);
    const sadRainIntervalRef = useRef(null);
    const sadCleanupIntervalRef = useRef(null);

    const handleValentineResponse = (response) => {
        setValentineResponse(response);
        // Start heart rain if yes is selected
        if (response === 'yes') {
            startHeartRain();
        }
        // Start sad emoji rain if no is selected
        if (response === 'no') {
            startSadRain();
        }
        // Close the modal
        setIsValentineModalOpen(false);
    };

    const startHeartRain = () => {
        // Clear any existing intervals
        if (heartRainIntervalRef.current) {
            clearInterval(heartRainIntervalRef.current);
        }
        if (heartCleanupIntervalRef.current) {
            clearInterval(heartCleanupIntervalRef.current);
        }

        // Create hearts continuously
        heartRainIntervalRef.current = setInterval(() => {
            const heartTypes = ['💖', '💕', '💗', '💝', '💞', '❤️'];
            const newHeart = {
                id: Date.now() + Math.random(),
                x: Math.random() * 100, // Percentage from left
                delay: Math.random() * 0.5, // Random delay for staggered effect
                duration: 2.5 + Math.random() * 1.5, // Random fall duration (2.5-4s)
                type: heartTypes[Math.floor(Math.random() * heartTypes.length)],
                size: 0.7 + Math.random() * 0.3, // Random size (0.7-1rem)
            };
            
            setHearts(prev => {
                // Limit to 100 hearts max to prevent performance issues
                const updated = [...prev, newHeart];
                return updated.slice(-100);
            });
        }, 100); // Create a new heart every 100ms for denser rain

        // Clean up hearts that have fallen off screen
        heartCleanupIntervalRef.current = setInterval(() => {
            setHearts(prev => prev.filter(heart => {
                // Remove hearts older than 5 seconds (they should have fallen)
                return Date.now() - heart.id < 5000;
            }));
        }, 1000);
    };

    const startSadRain = () => {
        // Clear any existing intervals
        if (sadRainIntervalRef.current) {
            clearInterval(sadRainIntervalRef.current);
        }
        if (sadCleanupIntervalRef.current) {
            clearInterval(sadCleanupIntervalRef.current);
        }

        // Create sad emojis continuously
        sadRainIntervalRef.current = setInterval(() => {
            // 10% chance for coffin, 90% for sad emojis
            const isCoffin = Math.random() < 0.1;
            const sadTypes = ['😢', '😭', '💔', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫'];
            const newSadEmoji = {
                id: Date.now() + Math.random(),
                x: Math.random() * 100, // Percentage from left
                delay: Math.random() * 0.5, // Random delay for staggered effect
                duration: 2.5 + Math.random() * 1.5, // Random fall duration (2.5-4s)
                type: isCoffin ? '⚰️' : sadTypes[Math.floor(Math.random() * sadTypes.length)],
                size: isCoffin ? 1.2 + Math.random() * 0.3 : 0.7 + Math.random() * 0.3, // Coffins are bigger
            };
            
            setSadEmojis(prev => {
                // Limit to 100 emojis max to prevent performance issues
                const updated = [...prev, newSadEmoji];
                return updated.slice(-100);
            });
        }, 150); // Create a new emoji every 150ms (slightly slower than hearts)

        // Clean up sad emojis that have fallen off screen
        sadCleanupIntervalRef.current = setInterval(() => {
            setSadEmojis(prev => prev.filter(emoji => {
                // Remove emojis older than 5 seconds (they should have fallen)
                return Date.now() - emoji.id < 5000;
            }));
        }, 1000);
    };

    // Keep heart rain running as long as yes was selected (even if modal is closed)
    useEffect(() => {
        // If yes was selected, ensure heart rain is running
        if (valentineResponse === 'yes' && !heartRainIntervalRef.current) {
            startHeartRain();
        }
        // If response changes away from yes, stop the heart rain
        else if (valentineResponse !== 'yes' && heartRainIntervalRef.current) {
            clearInterval(heartRainIntervalRef.current);
            heartRainIntervalRef.current = null;
            if (heartCleanupIntervalRef.current) {
                clearInterval(heartCleanupIntervalRef.current);
                heartCleanupIntervalRef.current = null;
            }
            // Clear hearts after a delay to let them finish falling
            const timeout = setTimeout(() => {
                setHearts([]);
            }, 6000);
            return () => clearTimeout(timeout);
        }
    }, [valentineResponse]);

    // Keep sad rain running as long as no was selected (even if modal is closed)
    useEffect(() => {
        // If no was selected, ensure sad rain is running
        if (valentineResponse === 'no' && !sadRainIntervalRef.current) {
            startSadRain();
        }
        // If response changes away from no, stop the sad rain
        else if (valentineResponse !== 'no' && sadRainIntervalRef.current) {
            clearInterval(sadRainIntervalRef.current);
            sadRainIntervalRef.current = null;
            if (sadCleanupIntervalRef.current) {
                clearInterval(sadCleanupIntervalRef.current);
                sadCleanupIntervalRef.current = null;
            }
            // Clear sad emojis after a delay to let them finish falling
            const timeout = setTimeout(() => {
                setSadEmojis([]);
            }, 6000);
            return () => clearTimeout(timeout);
        }
    }, [valentineResponse]);

    // Cleanup heart rain and sad rain only when component unmounts
    useEffect(() => {
        return () => {
            if (heartRainIntervalRef.current) {
                clearInterval(heartRainIntervalRef.current);
                heartRainIntervalRef.current = null;
            }
            if (heartCleanupIntervalRef.current) {
                clearInterval(heartCleanupIntervalRef.current);
                heartCleanupIntervalRef.current = null;
            }
            if (sadRainIntervalRef.current) {
                clearInterval(sadRainIntervalRef.current);
                sadRainIntervalRef.current = null;
            }
            if (sadCleanupIntervalRef.current) {
                clearInterval(sadCleanupIntervalRef.current);
                sadCleanupIntervalRef.current = null;
            }
        };
    }, []);

    const handleCloseModal = () => {
        setIsValentineModalOpen(false);
        // Don't clear valentineResponse or stop heart rain - let it continue!
        // The heart rain will continue as long as valentineResponse === 'yes'
    };

    return (
        <div className="jolene-container">
            {/* Heart Rain Effect */}
            {valentineResponse === 'yes' && (
                <div className="heart-rain-container">
                    {hearts.map((heart) => (
                        <div
                            key={heart.id}
                            className="falling-heart"
                            style={{
                                left: `${heart.x}%`,
                                animationDelay: `${heart.delay}s`,
                                animationDuration: `${heart.duration}s`,
                                fontSize: `${heart.size}rem`,
                            }}
                        >
                            {heart.type}
                        </div>
                    ))}
                </div>
            )}

            {/* Sad Emoji Rain Effect */}
            {valentineResponse === 'no' && (
                <div className="sad-rain-container">
                    {sadEmojis.map((emoji) => (
                        <div
                            key={emoji.id}
                            className="falling-sad-emoji"
                            style={{
                                left: `${emoji.x}%`,
                                animationDelay: `${emoji.delay}s`,
                                animationDuration: `${emoji.duration}s`,
                                fontSize: `${emoji.size}rem`,
                            }}
                        >
                            {emoji.type}
                        </div>
                    ))}
                </div>
            )}

            <div className="flower-container">
                <svg
                    ref={flowerRef}
                    width="320"
                    height="480"
                    viewBox="0 0 32 48"
                    className={`pixel-rose ${isHovered ? 'hovered' : ''}`}
                    onClick={() => setIsValentineModalOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        setIsValentineModalOpen(true);
                    }}
                    style={{ touchAction: 'manipulation' }}
                >
                    {/* Stem */}
                    <rect x="15" y="22" width="2" height="26" fill="#2d5016"/>
                    
                    {/* Left leaf */}
                    <rect x="10" y="28" width="1" height="1" fill="#3a6b1f"/>
                    <rect x="11" y="27" width="1" height="1" fill="#4a8528"/>
                    <rect x="12" y="26" width="1" height="1" fill="#5a9a35"/>
                    <rect x="13" y="25" width="1" height="1" fill="#4a8528"/>
                    <rect x="14" y="26" width="1" height="1" fill="#3a6b1f"/>
                    <rect x="11" y="28" width="1" height="1" fill="#4a8528"/>
                    <rect x="12" y="27" width="1" height="1" fill="#5a9a35"/>
                    <rect x="13" y="26" width="1" height="1" fill="#4a8528"/>
                    <rect x="12" y="28" width="1" height="1" fill="#3a6b1f"/>
                    
                    {/* Right leaf */}
                    <rect x="21" y="32" width="1" height="1" fill="#3a6b1f"/>
                    <rect x="20" y="31" width="1" height="1" fill="#4a8528"/>
                    <rect x="19" y="30" width="1" height="1" fill="#5a9a35"/>
                    <rect x="18" y="29" width="1" height="1" fill="#4a8528"/>
                    <rect x="17" y="30" width="1" height="1" fill="#3a6b1f"/>
                    <rect x="20" y="32" width="1" height="1" fill="#4a8528"/>
                    <rect x="19" y="31" width="1" height="1" fill="#5a9a35"/>
                    <rect x="18" y="30" width="1" height="1" fill="#4a8528"/>
                    <rect x="19" y="32" width="1" height="1" fill="#3a6b1f"/>
                    
                    {/* Rose bloom - solid base fill */}
                    <rect x="10" y="8" width="12" height="14" fill="#a82c2c"/>
                    
                    {/* Top curve */}
                    <rect x="12" y="6" width="8" height="2" fill="#c94c4c"/>
                    <rect x="14" y="5" width="4" height="1" fill="#d65c5c"/>
                    
                    {/* Side bulges for fullness */}
                    <rect x="8" y="10" width="2" height="8" fill="#b83c3c"/>
                    <rect x="22" y="10" width="2" height="8" fill="#b83c3c"/>
                    <rect x="7" y="12" width="1" height="4" fill="#a82c2c"/>
                    <rect x="24" y="12" width="1" height="4" fill="#a82c2c"/>
                    
                    {/* Bottom taper */}
                    <rect x="11" y="22" width="10" height="1" fill="#8b1a1a"/>
                    <rect x="13" y="23" width="6" height="1" fill="#6b1111"/>
                    
                    {/* Outer petals - top highlights */}
                    <rect x="10" y="8" width="3" height="2" fill="#d65c5c"/>
                    <rect x="19" y="8" width="3" height="2" fill="#d65c5c"/>
                    <rect x="13" y="7" width="6" height="2" fill="#e06b6b"/>
                    <rect x="14" y="6" width="4" height="1" fill="#e87a7a"/>
                    
                    {/* Outer petals - side highlights */}
                    <rect x="8" y="10" width="2" height="3" fill="#c94c4c"/>
                    <rect x="22" y="10" width="2" height="3" fill="#c94c4c"/>
                    <rect x="7" y="12" width="1" height="3" fill="#b83c3c"/>
                    <rect x="24" y="12" width="1" height="3" fill="#b83c3c"/>
                    
                    {/* Middle petal layer */}
                    <rect x="10" y="10" width="12" height="3" fill="#b83c3c"/>
                    <rect x="11" y="13" width="10" height="2" fill="#a82c2c"/>
                    
                    {/* Inner spiral petals - left curl */}
                    <rect x="10" y="11" width="3" height="4" fill="#982222"/>
                    <rect x="11" y="12" width="2" height="3" fill="#8b1a1a"/>
                    
                    {/* Inner spiral petals - right curl */}
                    <rect x="19" y="11" width="3" height="4" fill="#982222"/>
                    <rect x="19" y="12" width="2" height="3" fill="#8b1a1a"/>
                    
                    {/* Center spiral */}
                    <rect x="13" y="10" width="6" height="2" fill="#c94c4c"/>
                    <rect x="14" y="11" width="4" height="2" fill="#b83c3c"/>
                    <rect x="13" y="13" width="6" height="3" fill="#8b1a1a"/>
                    <rect x="14" y="14" width="4" height="3" fill="#7a1515"/>
                    <rect x="15" y="15" width="2" height="2" fill="#6b1111"/>
                    
                    {/* Bottom petals folding under */}
                    <rect x="9" y="17" width="3" height="3" fill="#982222"/>
                    <rect x="20" y="17" width="3" height="3" fill="#982222"/>
                    <rect x="12" y="18" width="8" height="3" fill="#8b1a1a"/>
                    <rect x="13" y="20" width="6" height="2" fill="#7a1515"/>
                    
                    {/* Petal edge highlights */}
                    <rect x="9" y="15" width="1" height="2" fill="#c94c4c"/>
                    <rect x="22" y="15" width="1" height="2" fill="#c94c4c"/>
                    <rect x="10" y="17" width="1" height="1" fill="#b83c3c"/>
                    <rect x="21" y="17" width="1" height="1" fill="#b83c3c"/>
                </svg>
            </div>

            {/* Valentine Modal */}
            <AnimatePresence>
                {isValentineModalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className="modal-content valentine-modal"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close-x"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            >
                                ✕
                            </button>

                            {!valentineResponse ? (
                                <>
                                    <div className="valentine-header">
                                        <p className="valentine-message">
                                            Dear Jolene, will you be my valentine?
                                        </p>
                                    </div>
                                    <div className="valentine-options">
                                        <button 
                                            className="valentine-option valentine-yes"
                                            onClick={() => handleValentineResponse('yes')}
                                        >
                                            <span className="option-text">
                                                <span className="option-emoji">❤️</span>
                                                <span className="option-label">Yes</span>
                                            </span>
                                        </button>
                                        <button 
                                            className="valentine-option valentine-no"
                                            onClick={() => handleValentineResponse('no')}
                                        >
                                            <span className="option-text">
                                                <span className="option-emoji">💔</span>
                                                <span className="option-label">No</span>
                                            </span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={`valentine-response-container ${valentineResponse === 'yes' ? 'response-yes-container' : 'response-no-container'}`}>
                                    <p className={`response-message ${valentineResponse === 'yes' ? 'response-yes-message' : 'response-no-message'}`}>
                                        {valentineResponse === 'yes' ? (
                                            <>
                                                <span className="response-emoji">💕</span>
                                                <span>She said yes</span>
                                                <span className="response-emoji">💕</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="response-emoji">💔</span>
                                                <span>She said no</span>
                                                <span className="response-emoji">💔</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Jolene;
