import React from 'react';
import { motion as Motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import AuditLink from '../landing/AuditLink';
import { WHATSAPP_URL } from '../landing/offer';
import './Hero.css';

const boardRows = [
    { label: 'WhatsApp enquiry', state: 'Captured' },
    { label: 'Manager approval', state: 'Sent' },
    { label: 'Xero invoice', state: 'Created' },
    { label: 'Monday report', state: 'Ready' }
];

const trustItems = ['Durban-based', 'Fixed price', 'POPIA-conscious', 'You own the IP'];

const Hero = () => {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-background" aria-hidden="true">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="hero-layout">
                <div className="hero-copy">
                    <Motion.p
                        className="section-kicker"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Operations automation · South Africa
                    </Motion.p>
                    <Motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                    >
                        We automate the manual work slowing your operations down.
                    </Motion.h1>
                    <Motion.p
                        className="hero-sub"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        Built for South African companies with 20 to 200 staff. One workflow, finished in 21 days, at a fixed price. Spreadsheets, approvals, invoicing, reporting, and WhatsApp enquiries, connected to the systems you already run.
                    </Motion.p>
                    <Motion.div
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                    >
                        <AuditLink className="btn btn-primary" />
                        <a
                            href={WHATSAPP_URL}
                            className="btn btn-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaWhatsapp aria-hidden="true" /> WhatsApp us
                        </a>
                    </Motion.div>
                    <ul className="hero-trust">
                        {trustItems.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                <Motion.div
                    className="ops-board"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    aria-hidden="true"
                >
                    <div className="ops-board-top">
                        <span>One workflow</span>
                        <span className="ops-example">Example</span>
                    </div>
                    <ul>
                        {boardRows.map((row) => (
                            <li key={row.label}>
                                <span>{row.label}</span>
                                <em>{row.state}</em>
                            </li>
                        ))}
                    </ul>
                    <div className="ops-stat">
                        <strong>6 hrs</strong>
                        <span>back each week on this example. Illustrative, not a client result.</span>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
};

export default Hero;
