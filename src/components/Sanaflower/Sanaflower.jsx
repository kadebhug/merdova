import React, { useRef, useEffect, useState } from 'react';
import './Sanaflower.css';
import { motion, AnimatePresence } from 'framer-motion';

const Sanaflower = () => {
    const canvasRef = useRef(null);
    const [selectedSunflower, setSelectedSunflower] = useState(null);
    const sunflowersRef = useRef([]);
    const animationFrameRef = useRef(null);

    // Sunflower Class/Structure
    class Sunflower {
        constructor(x, y, height) {
            this.x = x;
            this.y = y;
            this.height = height;
            this.baseX = x;
            this.phase = Math.random() * Math.PI * 2;
            this.swaySpeed = 0.0005 + Math.random() * 0.0005;
            this.swayAmplitude = 10 + Math.random() * 10;
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

            // Draw Petals (Pixel Art Style)
            ctx.fillStyle = '#eab308'; // Yellow
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
            const numberOfFlowers = Math.floor(window.innerWidth / 60); // Density

            for (let i = 0; i < numberOfFlowers; i++) {
                const x = Math.random() * window.innerWidth;
                const y = window.innerHeight; // Bottom of screen
                const height = 150 + Math.random() * 200; // Random height
                sunflowersRef.current.push(new Sunflower(x, y, height));
            }
            // Sort by y (though all are at bottom, height effectively determines layer order if we varied y)
            // For now, simple draw order is fine.
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
    }, []);

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
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="sanaflower-canvas"
            />

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
                        >
                            <h2>Sunflower Details</h2>
                            <p>You clicked a beautiful sunflower!</p>
                            <p>Height: {Math.round(selectedSunflower.height)}px</p>
                            <button className="close-btn" onClick={() => setSelectedSunflower(null)}>Close</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sanaflower;
