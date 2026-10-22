import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../landing/offer';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <h2>Talk to the Durban team</h2>
                <p>The audit form above is the fastest way in. These details are here if you already know who to call.</p>
                <div className="contact-info">
                    <a className="info-item" href={`mailto:${EMAIL}`}>
                        <FaEnvelope className="icon" aria-hidden="true" />
                        <span>{EMAIL}</span>
                    </a>
                    <a className="info-item" href={`tel:${PHONE_TEL}`}>
                        <FaPhone className="icon" aria-hidden="true" />
                        <span>{PHONE_DISPLAY}</span>
                    </a>
                    <a className="info-item" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp className="icon" aria-hidden="true" />
                        <span>WhatsApp</span>
                    </a>
                    <div className="info-item">
                        <FaMapMarkerAlt className="icon" aria-hidden="true" />
                        <span>{ADDRESS}</span>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <div className="footer-content">
                    <p className="footer-tag">Automation sprints for South African operations teams.</p>
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} Merdova. All rights reserved.</p>
                </div>
            </footer>
        </section>
    );
};

export default Contact;
