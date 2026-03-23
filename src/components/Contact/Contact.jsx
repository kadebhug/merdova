import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    // Contact form state
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [contactErrors, setContactErrors] = useState({});
    const [isContactSubmitting, setIsContactSubmitting] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactForm({ ...contactForm, [name]: value });
        
        // Clear error for this field when user types
        if (contactErrors[name]) {
            setContactErrors({ ...contactErrors, [name]: '' });
        }
    };

    const validateContactForm = () => {
        const newErrors = {};
        
        if (!contactForm.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!contactForm.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!contactForm.message.trim()) {
            newErrors.message = 'Message is required';
        }
        if (contactForm.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(contactForm.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        setContactErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        if (!validateContactForm()) {
            return;
        }

        setIsContactSubmitting(true);
        setContactSuccess(false);
        setContactErrors({});

        try {
            // Prepare form data for the wizard email endpoint
            const contactFormData = {
                name: contactForm.name,
                email: contactForm.email,
                phone: contactForm.phone || '',
                company: '',
                projectType: ['Quick Contact'],
                timeline: 'exploring',
                budget: 'notsure',
                description: contactForm.message,
                industry: ''
            };

            const response = await fetch('https://sendwizardemail-bgljpyzcqa-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactFormData)
            });

            if (!response.ok) {
                let errorMessage = 'Failed to send your message';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.details || errorMessage;
                } catch {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Success
            setContactSuccess(true);
            setContactForm({ name: '', email: '', phone: '', message: '' });
            
            // Reset success message after 5 seconds
            setTimeout(() => {
                setContactSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setContactErrors({ submit: error.message || 'Failed to send your message. Please try again.' });
        } finally {
            setIsContactSubmitting(false);
        }
    };

    return (
        <section id="contact" className="contact-section">
            {/* Contact Form Section - Above Get in Touch */}
            <div className="contact-form-section">
                <motion.div
                    className="contact-form-wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h3>Short on Time?</h3>
                    <p>Send us a quick message and we'll get back to you.</p>
                    
                    <form onSubmit={handleContactSubmit} className="footer-contact-form">
                        <div className="footer-form-row">
                            <div className="footer-field-wrapper">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={contactForm.name}
                                    onChange={handleContactChange}
                                    className={contactErrors.name ? 'error' : ''}
                                />
                                {contactErrors.name && <span className="error-message">{contactErrors.name}</span>}
                            </div>
                            <div className="footer-field-wrapper">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={contactForm.email}
                                    onChange={handleContactChange}
                                    className={contactErrors.email ? 'error' : ''}
                                />
                                {contactErrors.email && <span className="error-message">{contactErrors.email}</span>}
                            </div>
                        </div>
                        <div className="footer-field-wrapper">
                            <label>Phone Number <span className="optional">(optional)</span></label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+27 12 345 6789"
                                value={contactForm.phone}
                                onChange={handleContactChange}
                                className={contactErrors.phone ? 'error' : ''}
                            />
                            {contactErrors.phone && <span className="error-message">{contactErrors.phone}</span>}
                        </div>
                        <div className="footer-field-wrapper">
                            <label>Message *</label>
                            <textarea
                                name="message"
                                placeholder="Tell us about your project or question..."
                                value={contactForm.message}
                                onChange={handleContactChange}
                                rows="4"
                                className={contactErrors.message ? 'error' : ''}
                            ></textarea>
                            {contactErrors.message && <span className="error-message">{contactErrors.message}</span>}
                        </div>
                        
                        {contactErrors.submit && (
                            <div className="error-message" style={{ 
                                background: '#fee', 
                                color: '#c33', 
                                padding: '15px', 
                                borderRadius: '5px', 
                                marginBottom: '15px',
                                border: '1px solid #fcc'
                            }}>
                                {contactErrors.submit}
                            </div>
                        )}
                        
                        {contactSuccess && (
                            <div className="success-message" style={{ 
                                background: '#efe', 
                                color: '#3c3', 
                                padding: '15px', 
                                borderRadius: '5px', 
                                marginBottom: '15px',
                                border: '1px solid #cfc'
                            }}>
                                Message sent successfully! We'll get back to you soon.
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="footer-submit-btn"
                            disabled={isContactSubmitting}
                        >
                            {isContactSubmitting ? 'Sending...' : 'Send Message'} <FaArrowRight />
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Get in Touch Section */}
            <div className="contact-container">
                <motion.div
                    className="contact-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Get in Touch</h2>
                    <p>Ready to explore what AI can do for your business? Contact us directly or use our solutions wizard above.</p>

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
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-copyright">
                        <p>&copy; {new Date().getFullYear()} Merdova. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Contact;
