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
                    <h3>Send a short note</h3>
                    <p>If you would rather not use the audit form, write here. We reply within one business day.</p>
                    
                    <form onSubmit={handleContactSubmit} className="footer-contact-form">
                        <div className="footer-form-row">
                            <div className="footer-field-wrapper">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Thabo Nkosi"
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
                                    placeholder="thabo@company.co.za"
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
                                placeholder="+27 82 555 0142"
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
                                placeholder="What is stuck today, and which systems does it touch?"
                                value={contactForm.message}
                                onChange={handleContactChange}
                                rows="4"
                                className={contactErrors.message ? 'error' : ''}
                            ></textarea>
                            {contactErrors.message && <span className="error-message">{contactErrors.message}</span>}
                        </div>
                        
                        {contactErrors.submit && (
                            <div className="form-banner form-banner-error">
                                {contactErrors.submit}
                            </div>
                        )}
                        
                        {contactSuccess && (
                            <div className="form-banner form-banner-success">
                                Message sent. We will reply within one business day.
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
                    <h2>Talk to us directly</h2>
                    <p>The audit form is the fastest way to get a fixed-scope answer. You can also email or call the Durban studio.</p>

                    <div className="contact-info">
                        <div className="info-item">
                            <FaEnvelope className="icon" />
                            <a href="mailto:hello@merdova.com">hello@merdova.com</a>
                        </div>
                        <div className="info-item">
                            <FaPhone className="icon" />
                            <a href="tel:+27834653896">+27 83 465 3896</a>
                        </div>
                        <div className="info-item">
                            <FaMapMarkerAlt className="icon" />
                            <span>61 Berriedale Road, Durban</span>
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
