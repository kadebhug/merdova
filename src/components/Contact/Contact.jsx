import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <motion.div
                    className="contact-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Get in Touch</h2>
                    <p>Ready to start your next project? Contact us directly or use the survey wizard.</p>

                    <div className="contact-info">
                        <div className="info-item">
                            <FaEnvelope className="icon" />
                            <span>hello@merdova.com</span>
                        </div>
                        <div className="info-item">
                            <FaPhone className="icon" />
                            <span>+27834653896</span>
                        </div>
                        <div className="info-item">
                            <FaMapMarkerAlt className="icon" />
                            <span>61 Berriedale road, Durban</span>
                        </div>
                    </div>

                    <div className="social-links">
                        <a href="#" className="social-icon"><FaLinkedin /></a>
                        <a href="#" className="social-icon"><FaTwitter /></a>
                        <a href="#" className="social-icon"><FaInstagram /></a>
                    </div>
                </motion.div>
            </div>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Merdova. All rights reserved.</p>
            </footer>
        </section>
    );
};

export default Contact;
