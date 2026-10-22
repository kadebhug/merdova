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
        title: 'Find the manual job',
        description: 'We sit with the work as it happens today: who does it, where it lives, and what it costs in hours.',
        color: '#3B82F6'
    },
    {
        icon: FaDraftingCompass,
        title: 'Scope a first version',
        description: 'You get one workflow, a rand range, and a date. Support is written into that scope.',
        color: '#EAB308'
    },
    {
        icon: FaCogs,
        title: 'Build it with the people who do the work',
        description: 'The first version is a web system, a phone client, or a link to tools you already run, shaped with the people who will use it.',
        color: '#10B981'
    },
    {
        icon: FaRocket,
        title: 'Hand it over and stay',
        description: 'We train the team, fix what launch turns up, and take the next workflow only if the first one paid for itself.',
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
                        One workflow at a time, in rands, with a date.
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

                <div className="process-scope">
                    <h3>A typical first version</h3>
                    <p className="process-scope-note">A typical scope, not a case study.</p>
                    <ul>
                        <li>One workflow: jobs, bookings, stock, customers, or the admin between them.</li>
                        <li>A few weeks to a first version the team can use.</li>
                        <li>Priced in the same rand bands as the form below. Under R50,000 is one workflow, not a platform and not a mobile app.</li>
                        <li>Automation only when it removes a named task, such as filing, chasing, or a first reply.</li>
                        <li>Customer data stays where we agree in writing. We will tell you if any of it is stored outside South Africa.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Process;

