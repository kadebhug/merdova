import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import './Survey.css';

const SurveyWizard = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        projectType: [],
        budget: '',
        timeline: '',
        description: '',
        name: '',
        email: '',
        phone: ''
    });

    const handleTypeSelect = (type) => {
        const updatedTypes = formData.projectType.includes(type)
            ? formData.projectType.filter(t => t !== type)
            : [...formData.projectType, type];
        setFormData({ ...formData, projectType: updatedTypes });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        nextStep();
    };

    const variants = {
        enter: { x: 100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
    };

    return (
        <section id="survey" className="survey-section">
            <div className="survey-container">
                <div className="survey-header">
                    <h2>Start Your Journey</h2>
                    <p>Tell us about your vision, and we'll help you build it.</p>
                </div>

                <div className="survey-card">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="survey-step"
                            >
                                <h3>What are you looking to build?</h3>
                                <div className="options-grid">
                                    {['Website', 'Mobile App', 'Custom System', 'Marketing', 'Cloud Services', 'Other'].map(type => (
                                        <div
                                            key={type}
                                            className={`option-card ${formData.projectType.includes(type) ? 'selected' : ''}`}
                                            onClick={() => handleTypeSelect(type)}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-next" onClick={nextStep} disabled={formData.projectType.length === 0}>
                                    Next <FaArrowRight />
                                </button>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="survey-step"
                            >
                                <h3>When do you need this completed?</h3>
                                <div className="options-list">
                                    {['ASAP', '1 Month', '3 Months', '6 Months', 'Flexible'].map(time => (
                                        <div
                                            key={time}
                                            className={`option-list-item ${formData.timeline === time ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, timeline: time })}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                </div>
                                <div className="step-actions">
                                    <button className="btn-prev" onClick={prevStep}>Back</button>
                                    <button className="btn-next" onClick={nextStep} disabled={!formData.timeline}>
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}



                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="survey-step"
                            >
                                <h3>Tell us a bit more about the project</h3>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your goals, target audience, and key features..."
                                    rows="6"
                                ></textarea>
                                <div className="step-actions">
                                    <button className="btn-prev" onClick={prevStep}>Back</button>
                                    <button className="btn-next" onClick={nextStep} disabled={!formData.description}>
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="survey-step"
                            >
                                <h3>How can we reach you?</h3>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Contact Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="step-actions">
                                    <button className="btn-prev" onClick={prevStep}>Back</button>
                                    <button
                                        className="btn-submit"
                                        onClick={handleSubmit}
                                        disabled={!formData.name || !formData.email || !formData.phone || !/\S+@\S+\.\S+/.test(formData.email)}
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="survey-step success-step"
                            >
                                <div className="success-icon">
                                    <FaCheck />
                                </div>
                                <h3>Thank You!</h3>
                                <p>We've received your details. A Merdova specialist will contact you shortly.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default SurveyWizard;
