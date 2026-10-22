import React from 'react';
import { motion } from 'framer-motion';
import { FaClipboardList, FaComments, FaLink } from 'react-icons/fa';
import './Services.css';

const servicesData = [
    {
        icon: <FaClipboardList />,
        title: 'Business systems',
        description: 'Jobs, bookings, stock, clients, and invoicing, built around the way your team already works.'
    },
    {
        icon: <FaComments />,
        title: 'Customer workflows',
        description: 'Leads, replies, and follow-up, including WhatsApp, in a pipeline your team will actually open.'
    },
    {
        icon: <FaLink />,
        title: 'Automation on your tools',
        description: 'Connect Sage, Xero, Pastel, email, or spreadsheets. Take one repetitive task off the week.'
    }
];

const Services = () => {
    return (
        <section id="services" className="services-section">
            <div className="sticky-container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    What we <span className="highlight">build</span>
                </motion.h2>
                <p className="services-note">
                    Built as a web system, a phone client, or a connection to the software you already use.
                </p>
                <div className="services-overflow">
                    <div className="services-track">
                        {servicesData.map((service, index) => (
                            <div className="service-card" key={index}>
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
