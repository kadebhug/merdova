import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { 
    FaSearch, 
    FaDraftingCompass, 
    FaCogs, 
    FaRocket
} from 'react-icons/fa';
import { processCopy, processSteps } from '../landing/offer';
import { useLenis } from '../Layout/ScrollManager';
import './Process.css';

const stepIcons = [FaSearch, FaDraftingCompass, FaCogs, FaRocket];
const stepColors = ['#3B82F6', '#EAB308', '#10B981', '#C0A062'];

const Process = () => {
    const sectionRef = useRef(null);
    const lenis = useLenis();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const connectorProgress = [
        useTransform(scrollYProgress, [0, 0.25], [0, 100]),
        useTransform(scrollYProgress, [0.25, 0.5], [0, 100]),
        useTransform(scrollYProgress, [0.5, 0.75], [0, 100]),
        useTransform(scrollYProgress, [0.75, 1], [0, 100]),
    ];
    const connectorHeights = [
        useMotionTemplate`${connectorProgress[0]}%`,
        useMotionTemplate`${connectorProgress[1]}%`,
        useMotionTemplate`${connectorProgress[2]}%`,
        useMotionTemplate`${connectorProgress[3]}%`,
    ];

    const handleAuditClick = (event) => {
        event.preventDefault();
        const surveyElement = document.getElementById('survey');
        if (surveyElement && lenis) {
            lenis.scrollTo(surveyElement, { offset: -88 });
        }
    };

    return (
        <section ref={sectionRef} id="process" className="process-section">
            <div className="process-container">
                <motion.div
                    className="process-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="process-title">
                        {processCopy.titleBefore}<span className="highlight">{processCopy.titleEmphasis}</span>
                    </h2>
                    <p className="process-subtitle">
                        {processCopy.subtitle}
                    </p>
                </motion.div>

                <div className="process-steps-wrapper">
                    <div className="process-steps">
                        {processSteps.map((step, index) => {
                            const IconComponent = stepIcons[index];

                            return (
                                <motion.div
                                    key={index}
                                    className="process-step"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ 
                                        duration: 0.6, 
                                        delay: index * 0.15,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                >
                                    <motion.div 
                                        className="step-content"
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div 
                                            className="step-icon-wrapper"
                                            style={{ '--step-color': stepColors[index] }}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="step-icon">
                                                <IconComponent />
                                            </div>
                                        </motion.div>

                                        <div className="step-text">
                                            <h3 className="step-title">{step.title}</h3>
                                            <p className="step-description">{step.description}</p>
                                        </div>
                                    </motion.div>

                                    {index < processSteps.length - 1 && (
                                        <div className="step-connector-wrapper">
                                            <div 
                                                className="step-connector"
                                                style={{ '--step-color': stepColors[index] }}
                                            >
                                                <motion.div 
                                                    className="step-connector-progress"
                                                    style={{ 
                                                        height: connectorHeights[index],
                                                        backgroundColor: stepColors[index]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="process-cta">
                    <a href="#survey" className="process-audit-btn" onClick={handleAuditClick}>
                        {processCopy.cta}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Process;

