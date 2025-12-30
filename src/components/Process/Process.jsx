import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { 
    FaSearch, 
    FaLightbulb, 
    FaCode, 
    FaRocket
} from 'react-icons/fa';
import './Process.css';

const processSteps = [
    {
        icon: FaSearch,
        title: 'Discovery & Analysis',
        description: 'We dive deep into your business needs, goals, and target audience to understand the full scope of your project.',
        color: '#3B82F6'
    },
    {
        icon: FaLightbulb,
        title: 'Strategy & Planning',
        description: 'Our team crafts a comprehensive strategy tailored to your objectives, outlining the roadmap for success.',
        color: '#EAB308'
    },
    {
        icon: FaCode,
        title: 'Development & Design',
        description: 'We bring your vision to life with cutting-edge design and robust development, ensuring quality at every step.',
        color: '#10B981'
    },
    {
        icon: FaRocket,
        title: 'Launch & Optimization',
        description: 'We launch your project with confidence and provide ongoing support to ensure optimal performance and growth.',
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
                        A proven methodology that transforms ideas into exceptional digital experiences
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

