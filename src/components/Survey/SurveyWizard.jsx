import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaWhatsapp } from 'react-icons/fa';
import { SPRINT_FROM, WHATSAPP_URL } from '../landing/offer';
import './Survey.css';

const painOptions = [
    { value: 'retyping', label: 'Re-typing data between systems', desc: 'WhatsApp, CRM, Sage, or Xero' },
    { value: 'approvals', label: 'Approvals stuck in email or WhatsApp', desc: 'Quotes, purchases, sign-off' },
    { value: 'invoicing', label: 'Invoicing and chasing payment', desc: 'Quotes that never become invoices' },
    { value: 'reporting', label: 'Reports built by hand every month', desc: 'Branch, job, or cash numbers' },
    { value: 'enquiries', label: 'Customer enquiries lost in WhatsApp', desc: 'Nobody owns the thread' },
    { value: 'documents', label: 'Documents processed by hand', desc: 'Invoices and delivery notes' }
];

const sizeOptions = [
    { value: 'under-20', label: 'Under 20 people' },
    { value: '20-50', label: '20–50 people' },
    { value: '51-200', label: '51–200 people' },
    { value: '200-plus', label: 'More than 200' }
];

const systemOptions = [
    'Xero',
    'Sage',
    'Excel or Google Sheets',
    'WhatsApp',
    'A CRM',
    'An ERP',
    'Email only',
    'Something else'
];

const SurveyWizard = () => {
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [formData, setFormData] = useState({
        pain: '',
        companySize: '',
        systems: [],
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    const stepTitles = [
        'The manual work',
        'Your operation',
        'Book the audit'
    ];

    const handleSystemToggle = (system) => {
        setFormData((prev) => {
            const systems = prev.systems.includes(system)
                ? prev.systems.filter((item) => item !== system)
                : [...prev.systems, system];
            return { ...prev, systems };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = () => {
        const newErrors = {};

        if (step === 2) {
            if (!formData.name.trim()) newErrors.name = 'Name is required';
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email';
            }
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone is required';
            } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (step === 0 && !formData.pain) return;
        if (step === 1 && (!formData.companySize || formData.systems.length === 0)) return;
        if (validateStep()) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        const painLabel = painOptions.find((item) => item.value === formData.pain)?.label || formData.pain;
        const sizeLabel = sizeOptions.find((item) => item.value === formData.companySize)?.label || formData.companySize;

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            company: formData.company.trim(),
            projectType: ['Automation Sprint', painLabel],
            timeline: 'asap',
            budget: 'notsure',
            industry: '',
            description: [
                `Biggest manual cost: ${painLabel}`,
                `Company size: ${sizeLabel}`,
                `Systems in use: ${formData.systems.join(', ')}`,
                formData.company.trim() ? `Company: ${formData.company.trim()}` : '',
                'Request: free 45-minute automation audit for one workflow.'
            ].filter(Boolean).join('\n'),
            pain: painLabel,
            companySize: sizeLabel,
            systems: formData.systems
        };

        try {
            const response = await fetch('https://sendwizardemail-bgljpyzcqa-uc.a.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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
            setSubmitError(error.message || 'Failed to submit your request. Please try again or WhatsApp us.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const variants = {
        enter: { x: 40, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -40, opacity: 0 }
    };

    const progressPercentage = step >= 3 ? 100 : (step / 3) * 100;

    return (
        <section id="survey" className="survey-section">
            <div className="survey-container">
                <div className="survey-header">
                    <p className="section-kicker">Free audit</p>
                    <h2>Book a free automation audit</h2>
                    <p>
                        45 minutes. One workflow. A fixed quote before any build. Sprints start at {SPRINT_FROM}. We reply within one business day.
                    </p>
                    <a className="survey-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp aria-hidden="true" /> Rather talk on WhatsApp
                    </a>
                </div>

                <div className="survey-card">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>

                    {step < 3 && (
                        <div className="step-label">
                            Step {step + 1} of 3: {stepTitles[step]}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <Motion.div
                                key="step0"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="survey-step"
                            >
                                <h3>What is the most expensive manual job?</h3>
                                <p className="step-subtitle">Pick the one that costs the most time</p>
                                <div className="options-grid">
                                    {painOptions.map((pain) => (
                                        <button
                                            type="button"
                                            key={pain.value}
                                            className={`option-card ${formData.pain === pain.value ? 'selected' : ''}`}
                                            onClick={() => setFormData((prev) => ({ ...prev, pain: pain.value }))}
                                            aria-pressed={formData.pain === pain.value}
                                        >
                                            <div className="option-label">{pain.label}</div>
                                            <div className="option-desc">{pain.desc}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="step-actions">
                                    <div></div>
                                    <button className="btn-next" type="button" onClick={nextStep} disabled={!formData.pain}>
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </Motion.div>
                        )}

                        {step === 1 && (
                            <Motion.div
                                key="step1"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="survey-step"
                            >
                                <h3>How big is the team, and what do you run today?</h3>
                                <p className="step-subtitle">Company size</p>
                                <div className="options-grid size-grid">
                                    {sizeOptions.map((size) => (
                                        <button
                                            type="button"
                                            key={size.value}
                                            className={`option-card ${formData.companySize === size.value ? 'selected' : ''}`}
                                            onClick={() => setFormData((prev) => ({ ...prev, companySize: size.value }))}
                                            aria-pressed={formData.companySize === size.value}
                                        >
                                            <div className="option-label">{size.label}</div>
                                        </button>
                                    ))}
                                </div>
                                <p className="step-subtitle systems-label">Systems you already use. Select all that apply.</p>
                                <div className="options-grid">
                                    {systemOptions.map((system) => (
                                        <button
                                            type="button"
                                            key={system}
                                            className={`option-card ${formData.systems.includes(system) ? 'selected' : ''}`}
                                            onClick={() => handleSystemToggle(system)}
                                            aria-pressed={formData.systems.includes(system)}
                                        >
                                            <div className="option-label">{system}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="step-actions">
                                    <button className="btn-prev" type="button" onClick={prevStep}>Back</button>
                                    <button
                                        className="btn-next"
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.companySize || formData.systems.length === 0}
                                    >
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </Motion.div>
                        )}

                        {step === 2 && (
                            <Motion.form
                                key="step2"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="survey-step"
                                onSubmit={handleSubmit}
                            >
                                <h3>Where should we send the audit booking?</h3>
                                <p className="step-subtitle">We use this to book the 45 minutes. No proposal yet.</p>
                                <div className="input-group">
                                    <div className="field-wrapper">
                                        <label htmlFor="audit-name">Your name</label>
                                        <input
                                            id="audit-name"
                                            type="text"
                                            name="name"
                                            placeholder="Thandi Nkosi"
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
                                            placeholder="thandi@company.co.za"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? 'error' : ''}
                                            autoComplete="email"
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>
                                    <div className="field-wrapper">
                                        <label htmlFor="audit-phone">Phone or WhatsApp</label>
                                        <input
                                            id="audit-phone"
                                            type="tel"
                                            name="phone"
                                            placeholder="+27 83 465 3896"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={errors.phone ? 'error' : ''}
                                            autoComplete="tel"
                                        />
                                        {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                                </div>
                                {submitError && <p className="error-message submit-error">{submitError}</p>}
                                <div className="step-actions">
                                    <button className="btn-prev" type="button" onClick={prevStep} disabled={isSubmitting}>Back</button>
                                    <button className="btn-submit" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : 'Request my audit'} <FaCheck />
                                    </button>
                                </div>
                            </Motion.form>
                        )}

                        {step === 3 && (
                            <Motion.div
                                key="step3"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="survey-step success-step"
                            >
                                <div className="success-icon">
                                    <FaCheck />
                                </div>
                                <h3>Audit request received</h3>
                                <p>A Merdova specialist will contact you within one business day to book the 45 minutes.</p>
                                <p className="success-sub">If it is urgent, WhatsApp us and mention the workflow you selected.</p>
                                <a className="survey-whatsapp success-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp aria-hidden="true" /> Open WhatsApp
                                </a>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default SurveyWizard;
