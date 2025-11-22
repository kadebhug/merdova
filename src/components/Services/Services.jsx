import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaMobileAlt, FaCloud, FaBullhorn, FaNetworkWired, FaHandshake } from 'react-icons/fa';
import './Services.css';

const servicesData = [
    {
        icon: <FaLaptopCode />,
        title: 'Web Development',
        description: 'Stunning, responsive websites tailored to your brand identity and business goals.'
    },
    {
        icon: <FaMobileAlt />,
        title: 'Mobile Apps',
        description: 'Native and cross-platform mobile applications that deliver seamless user experiences.'
    },
    {
        icon: <FaCloud />,
        title: 'Cloud Solutions',
        description: 'Scalable cloud infrastructure, migration, and management services for modern businesses.'
    },
    {
        icon: <FaBullhorn />,
        title: 'Digital Marketing',
        description: 'Data-driven marketing strategies to grow your audience and increase conversion.'
    },
    {
        icon: <FaNetworkWired />,
        title: 'System Architecture',
        description: 'Robust and scalable system designs to support your enterprise operations.'
    },
    {
        icon: <FaHandshake />,
        title: 'Consulting',
        description: 'Expert advice to help you navigate the digital landscape and make informed decisions.'
    }
];

const Services = () => {
    return (
        <section id="services" className="services-section">
            <div className="services-container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Our <span className="highlight">Services</span>
                </motion.h2>

                <div className="services-grid">
                    {servicesData.map((service, index) => (
                        <motion.div
                            className="service-card"
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="service-icon">{service.icon}</div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
