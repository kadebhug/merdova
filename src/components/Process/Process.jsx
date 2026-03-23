import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { 
    FaSearch, 
    FaDraftingCompass, 
    FaCogs, 
    FaRocket
} from 'react-icons/fa';
import './Process.css';

const processSteps = [
    {
        icon: FaSearch,
        title: 'AI Readiness Assessment',
        description: 'We evaluate your data, systems, and business processes to identify high-impact AI opportunities.',
        color: '#3B82F6'
    },
    {
        icon: FaDraftingCompass,
        title: 'Solution Design & Roadmap',
        description: 'We architect a tailored AI solution with clear milestones, SLAs, and measurable KPIs.',
        color: '#EAB308'
    },
    {
        icon: FaCogs,
        title: 'Build & Integrate',
        description: 'Our team develops, trains, and integrates AI models into your platforms — web, mobile, or cloud.',
        color: '#10B981'
    },
    {
        icon: FaRocket,
        title: 'Deploy, Monitor & Optimize',
        description: 'We deploy your AI solution with ongoing monitoring, SLA-backed support, and continuous model optimization.',
        color: '#C0A062'
    }
];

const Process = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

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
                        Our <span className="highlight">Process</span>
                    </h2>
                    <p className="process-subtitle">
                        A proven methodology that transforms your business with intelligent, AI-driven solutions
                    </p>
                </motion.div>

                <div className="process-steps-wrapper">
                    <div className="process-steps">
                        {processSteps.map((step, index) => {
                            const IconComponent = step.icon;
                            const stepProgress = useTransform(
                                scrollYProgress,
                                [
                                    (index * 0.25),
                                    ((index + 1) * 0.25)
                                ],
                                [0, 100]
                            );
                            const connectorHeight = useMotionTemplate`${stepProgress}%`;

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
                                            style={{ '--step-color': step.color }}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="step-icon">
                                                <IconComponent />
                                            </div>
                                            <div className="step-number">0{index + 1}</div>
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
                                                style={{ '--step-color': step.color }}
                                            >
                                                <motion.div 
                                                    className="step-connector-progress"
                                                    style={{ 
                                                        height: connectorHeight,
                                                        backgroundColor: step.color
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
            </div>
        </section>
    );
};

export default Process;

