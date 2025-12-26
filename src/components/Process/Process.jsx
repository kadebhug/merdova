import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FaSearch, 
    FaLightbulb, 
    FaCode, 
    FaRocket, 
    FaCheckCircle
} from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
    {
        icon: <FaSearch />,
        title: 'Discovery & Analysis',
        description: 'We dive deep into your business needs, goals, and target audience to understand the full scope of your project.',
        details: [
            'Business requirements gathering',
            'Market research & competitor analysis',
            'User persona development',
            'Technical feasibility assessment'
        ],
        color: '#3B82F6'
    },
    {
        icon: <FaLightbulb />,
        title: 'Strategy & Planning',
        description: 'Our team crafts a comprehensive strategy tailored to your objectives, outlining the roadmap for success.',
        details: [
            'Project roadmap creation',
            'Technology stack selection',
            'Resource allocation planning',
            'Timeline & milestone definition'
        ],
        color: '#EAB308'
    },
    {
        icon: <FaCode />,
        title: 'Development & Design',
        description: 'We bring your vision to life with cutting-edge design and robust development, ensuring quality at every step.',
        details: [
            'UI/UX design & prototyping',
            'Agile development sprints',
            'Quality assurance testing',
            'Continuous integration & deployment'
        ],
        color: '#10B981'
    },
    {
        icon: <FaRocket />,
        title: 'Launch & Optimization',
        description: 'We launch your project with confidence and provide ongoing support to ensure optimal performance and growth.',
        details: [
            'Production deployment',
            'Performance monitoring',
            'User feedback integration',
            'Continuous optimization'
        ],
        color: '#C0A062'
    }
];

const Process = () => {
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);
    const [activeStep, setActiveStep] = useState(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const steps = gsap.utils.toArray('.process-step');
            const timelineLine = timelineRef.current;
            const timelineProgress = timelineLine?.querySelector('.timeline-progress');

            // Animate main timeline progress line
            if (timelineProgress) {
                gsap.to(timelineProgress, {
                    height: '100%',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1
                    }
                });
            }

            steps.forEach((step, index) => {
                const stepElement = step;
                const icon = stepElement.querySelector('.step-icon');
                const content = stepElement.querySelector('.step-content');
                const progressBar = stepElement.querySelector('.step-progress-bar');

                // Animate step entrance
                gsap.fromTo(stepElement,
                    {
                        opacity: 0,
                        y: 50,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: stepElement,
                            start: 'top 80%',
                            end: 'top 50%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );

                // Animate icon
                gsap.fromTo(icon,
                    {
                        scale: 0,
                        rotation: -180
                    },
                    {
                        scale: 1,
                        rotation: 0,
                        duration: 0.6,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: stepElement,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );

                // Animate content
                gsap.fromTo(content,
                    {
                        opacity: 0,
                        x: index % 2 === 0 ? -30 : 30
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        delay: 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: stepElement,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );

                // Animate progress bar with smooth scroll
                if (progressBar) {
                    gsap.to(progressBar, {
                        height: '100%',
                        scrollTrigger: {
                            trigger: stepElement,
                            start: 'top 75%',
                            end: 'top 25%',
                            scrub: 1,
                            onUpdate: (self) => {
                                if (self.progress > 0.3) {
                                    setActiveStep(index);
                                }
                            },
                            onEnter: () => setActiveStep(index),
                            onLeave: () => {
                                if (index < steps.length - 1) {
                                    setActiveStep(index + 1);
                                }
                            },
                            onEnterBack: () => setActiveStep(index),
                            onLeaveBack: () => {
                                if (index > 0) {
                                    setActiveStep(index - 1);
                                }
                            }
                        }
                    });
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="process" className="process-section">
            <div className="process-container">
                <motion.h2
                    className="process-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Our <span className="highlight">Process</span>
                </motion.h2>

                <motion.p
                    className="process-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    A proven methodology that transforms ideas into exceptional digital experiences
                </motion.p>

                <div className="timeline-wrapper">
                    <div className="timeline-line" ref={timelineRef}>
                        <div className="timeline-progress"></div>
                    </div>

                    <div className="process-steps">
                        {processSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`process-step ${activeStep === index ? 'active' : ''} ${index % 2 === 0 ? 'left' : 'right'}`}
                            >
                                <div className="step-marker">
                                    <div className="step-icon-wrapper">
                                        <div 
                                            className="step-icon"
                                            style={{ '--step-color': step.color }}
                                        >
                                            {step.icon}
                                        </div>
                                        <div className="step-connector"></div>
                                    </div>
                                    <div className="step-progress-bar"></div>
                                </div>

                                <motion.div
                                    className="step-content"
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="step-number">0{index + 1}</div>
                                    <h3>{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                    
                                    <div className="step-details">
                                        {step.details.map((detail, detailIndex) => (
                                            <motion.div
                                                key={detailIndex}
                                                className="detail-item"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ 
                                                    duration: 0.4, 
                                                    delay: detailIndex * 0.1 
                                                }}
                                            >
                                                <FaCheckCircle className="detail-icon" />
                                                <span>{detail}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;

