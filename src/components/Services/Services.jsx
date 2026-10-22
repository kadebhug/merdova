import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBolt, FaWhatsapp, FaThLarge, FaMobileAlt, FaCloud } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../landing/offer';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const serviceIcons = {
    bolt: FaBolt,
    whatsapp: FaWhatsapp,
    portal: FaThLarge,
    mobile: FaMobileAlt,
    cloud: FaCloud,
};

const Services = () => {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
            const track = trackRef.current;

            gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth + 100),
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
        });

        return () => mm.revert();
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
                    What we <span className="highlight">build</span>
                </motion.h2>
                <p className="section-intro">Five offers. Each one replaces a specific kind of manual work.</p>
                <div className="services-overflow">
                    <div ref={trackRef} className="services-track">
                        {services.map((service) => {
                            const Icon = serviceIcons[service.icon];
                            return (
                            <div className="service-card" key={service.title}>
                                <div className="service-icon">{Icon ? <Icon aria-hidden="true" /> : null}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                                <p className="service-fit"><span>Best for</span> {service.bestFor}</p>
                                <p className="service-outcome"><span>You leave with</span> {service.outcome}</p>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
