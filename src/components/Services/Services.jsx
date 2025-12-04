'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaMobileAlt, FaCloud, FaBullhorn, FaNetworkWired, FaHandshake } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

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
    const sectionRef = useRef(null);
    const trackRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const track = trackRef.current;

            // Calculate total width to scroll
            // We want to scroll the track to the left
            // Distance = track width - viewport width (or container width)

            // Note: In React, we might need to wait for render or use a function to get width
            // But with useLayoutEffect it should be fine.

            // Horizontal Scroll
            gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth + 100), // +100 for some padding
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="services" className="services-section">
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
                    <div ref={trackRef} className="services-track">
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
