import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-55%"]);

    return (
        <section ref={targetRef} id="services" className="services-section">
            <div className="sticky-container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Our <span className="highlight">Services</span>
                </motion.h2>
                <div className="services-overflow">
                    <motion.div style={{ x }} className="services-track">
                        {servicesData.map((service, index) => (
                            <div className="service-card" key={index}>
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Services;
