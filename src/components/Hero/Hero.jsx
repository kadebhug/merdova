import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-background">
                {/* Abstract shapes or particles can go here */}
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="hero-content">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    We Build <span className="highlight">Digital Realities</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Merdova provides cutting-edge software, marketing, and cloud solutions to elevate your business.
                </motion.p>

                <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <a href="#survey" className="btn btn-primary">Start Your Project</a>
                    <a href="#services" className="btn btn-secondary">Explore Services</a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
