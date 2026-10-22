import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import {
    budgetOptions,
    industryOptions,
    surveyCopy,
    surveyServices,
    timelineOptions,
} from '../landing/offer';
import './Survey.css';

const EMPTY_FORM = {
    projectType: [],
    timeline: '',
    budget: '',
    description: '',
    industry: '',
    name: '',
    email: '',
    phone: '',
    company: '',
};

const SurveyWizard = () => {
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const stepTitles = ['Scope and timing', 'The bottleneck', 'Book your audit'];

    const handleTypeSelect = (type) => {
        const updatedTypes = formData.projectType.includes(type)
            ? formData.projectType.filter((item) => item !== type)
            : [...formData.projectType, type];
        setFormData({ ...formData, projectType: updatedTypes });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateContact = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (formData.phone && !/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const canLeaveStep = () => {
        if (step === 0) {
            return formData.projectType.length > 0 && formData.timeline && formData.budget;
        }
        if (step === 1) {
            return formData.description.trim().length > 0;
        }
        return validateContact();
    };

    const nextStep = () => {
        if (step === 2) {
            if (validateContact()) setStep(step + 1);
            return;
        }
        if (canLeaveStep()) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateContact()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            company: formData.company || '',
            projectType: formData.projectType,
            timeline: formData.timeline,
            budget: formData.budget,
            description: formData.description,
            industry: formData.industry || '',
        };

        try {
            const response = await fetch('https://sendwizardemail-bgljpyzcqa-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to submit your request';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.details || errorMessage;
                } catch {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            await response.json();
            setStep(3);
        } catch (error) {
            setSubmitError(error.message || 'Failed to submit your request. Please try again or contact us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const variants = {
        enter: { x: 40, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -40, opacity: 0 },
    };

    const timelineLabel = timelineOptions.find((item) => item.value === formData.timeline)?.label;
    const budgetLabel = budgetOptions.find((item) => item.value === formData.budget)?.label;
    const progressPercentage = step >= 3 ? 100 : (step / 3) * 100;
    const contactReady = formData.name.trim() && formData.email.trim() && !errors.email && !errors.phone;

    return (
        <section id="survey" className="survey-section">
            <div className="survey-container">
                <div className="survey-header">
                    <h2>{surveyCopy.title}</h2>
                    <p>{surveyCopy.subtitle}</p>
                </div>

                <div className="survey-card">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>

                    {step < 3 && (
                        <div className="step-label">
                            {stepTitles[step]}
                        </div>
                    )}

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
                                <h3>What do you want solved?</h3>
                                <p className="step-subtitle">Select every offer that fits. Then pick a timeline and budget.</p>
                                <div className="options-grid">
                                    {surveyServices.map((service) => (
                                        <button
                                            type="button"
                                            key={service.value}
                                            className={`option-card ${formData.projectType.includes(service.value) ? 'selected' : ''}`}
                                            aria-pressed={formData.projectType.includes(service.value)}
                                            onClick={() => handleTypeSelect(service.value)}
                                        >
                                            <div className="option-label">{service.label}</div>
                                            <div className="option-desc">{service.desc}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="choice-groups">
                                    <fieldset className="choice-group">
                                        <legend>Timeline</legend>
                                        <div className="choice-pills">
                                            {timelineOptions.map((time) => (
                                                <button
                                                    type="button"
                                                    key={time.value}
                                                    className={`choice-pill ${formData.timeline === time.value ? 'selected' : ''}`}
                                                    aria-pressed={formData.timeline === time.value}
                                                    onClick={() => setFormData({ ...formData, timeline: time.value })}
                                                >
                                                    {time.label}
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>
                                    <fieldset className="choice-group">
                                        <legend>Budget</legend>
                                        <div className="choice-pills">
                                            {budgetOptions.map((budget) => (
                                                <button
                                                    type="button"
                                                    key={budget.value}
                                                    className={`choice-pill ${formData.budget === budget.value ? 'selected' : ''}`}
                                                    aria-pressed={formData.budget === budget.value}
                                                    onClick={() => setFormData({ ...formData, budget: budget.value })}
                                                >
                                                    {budget.label}
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>

                                <div className="step-actions">
                                    <div></div>
                                    <button className="btn-next" type="button" onClick={nextStep} disabled={!canLeaveStep()}>
                                        Next <FaArrowRight />
                                    </button>
                                </div>
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
                                <h3>What is stuck today?</h3>
                                <div className="input-group">
                                    <div className="field-wrapper">
                                        <label htmlFor="audit-description">The bottleneck</label>
                                        <textarea
                                            id="audit-description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Example: quotes are retyped from WhatsApp into Xero every morning."
                                            rows="5"
                                        ></textarea>
                                        <span className="char-count">{formData.description.length} characters</span>
                                    </div>
                                    <div className="field-wrapper">
                                        <label htmlFor="audit-industry">Industry <span className="optional">(optional)</span></label>
                                        <select
                                            id="audit-industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your industry</option>
                                            {industryOptions.map((industry) => (
                                                <option key={industry} value={industry}>{industry}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="step-actions">
                                    <button className="btn-prev" type="button" onClick={prevStep}>Back</button>
                                    <button className="btn-next" type="button" onClick={nextStep} disabled={!formData.description.trim()}>
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
                                <h3>Where should we send the audit?</h3>
                                <div className="summary-chips" aria-label="Your selections">
                                    {formData.projectType.map((item) => (
                                        <span key={item}>{item}</span>
                                    ))}
                                    {timelineLabel && <span>{timelineLabel}</span>}
                                    {budgetLabel && <span>{budgetLabel}</span>}
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <div className="field-wrapper">
                                            <label htmlFor="audit-name">Your name</label>
                                            <input
                                                id="audit-name"
                                                type="text"
                                                name="name"
                                                placeholder="Thabo Nkosi"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={errors.name ? 'error' : ''}
                                                autoComplete="name"
                                            />
                                            {errors.name && <span className="error-message">{errors.name}</span>}
                                        </div>
                                        <div className="field-wrapper">
                                            <label htmlFor="audit-email">Work email</label>
                                            <input
                                                id="audit-email"
                                                type="email"
                                                name="email"
                                                placeholder="thabo@company.co.za"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={errors.email ? 'error' : ''}
                                                autoComplete="email"
                                            />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                        <div className="field-wrapper">
                                            <label htmlFor="audit-company">Company <span className="optional">(optional)</span></label>
                                            <input
                                                id="audit-company"
                                                type="text"
                                                name="company"
                                                placeholder="Company name"
                                                value={formData.company}
                                                onChange={handleChange}
                                                autoComplete="organization"
                                            />
                                        </div>
                                        <div className="field-wrapper">
                                            <label htmlFor="audit-phone">Phone <span className="optional">(optional)</span></label>
                                            <input
                                                id="audit-phone"
                                                type="tel"
                                                name="phone"
                                                placeholder="+27 82 555 0142"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={errors.phone ? 'error' : ''}
                                                autoComplete="tel"
                                            />
                                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                                        </div>
                                    </div>

                                    {submitError && <div className="form-banner form-banner-error">{submitError}</div>}

                                    <div className="step-actions">
                                        <button className="btn-prev" type="button" onClick={prevStep} disabled={isSubmitting}>
                                            Back
                                        </button>
                                        <button className="btn-submit" type="submit" disabled={isSubmitting || !contactReady}>
                                            {isSubmitting ? 'Sending...' : surveyCopy.submit} <FaCheck />
                                        </button>
                                    </div>
                                </form>
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
                                className="survey-step success-step"
                            >
                                <div className="success-icon">
                                    <FaCheck />
                                </div>
                                <h3>Received</h3>
                                <p>We will reply within one business day to book the audit, or to tell you if we are the wrong fit.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default SurveyWizard;
