import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaEdit } from 'react-icons/fa';
import './Survey.css';

const SurveyWizard = () => {
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        projectType: [],
        timeline: '',
        budget: '',
        description: '',
        industry: '',
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    // Service options with descriptions
    const serviceOptions = [
        { value: 'Web Development', label: 'Web Development', desc: 'Modern websites & web apps' },
        { value: 'Mobile Apps', label: 'Mobile Apps', desc: 'iOS & Android applications' },
        { value: 'Custom Software', label: 'Custom Software', desc: 'Tailored business solutions' },
        { value: 'Digital Marketing', label: 'Digital Marketing', desc: 'SEO, ads, content strategy' },
        { value: 'Cloud Solutions', label: 'Cloud Solutions', desc: 'Infrastructure & migration' },
        { value: 'Consultation', label: 'Consultation', desc: 'Strategy & planning' }
    ];

    const timelineOptions = [
        { value: 'asap', label: 'ASAP', desc: 'Within 2 weeks' },
        { value: '1-2months', label: '1-2 Months', desc: '' },
        { value: '3-6months', label: '3-6 Months', desc: '' },
        { value: '6plus', label: '6+ Months', desc: '' },
        { value: 'exploring', label: 'Just Exploring', desc: 'No immediate timeline' }
    ];

    const budgetOptions = [
        { value: 'under50k', label: 'Under R50,000' },
        { value: '50-150k', label: 'R50,000 - R150,000' },
        { value: '150-300k', label: 'R150,000 - R300,000' },
        { value: '300plus', label: 'R300,000+' },
        { value: 'notsure', label: 'Not sure yet' }
    ];

    const industryOptions = [
        'Technology',
        'Finance & Banking',
        'Healthcare',
        'Retail & E-commerce',
        'Education',
        'Manufacturing',
        'Real Estate',
        'Hospitality',
        'Non-profit',
        'Other'
    ];

    const stepTitles = [
        'Choose Your Service',
        'Project Timeline',
        'Budget Range',
        'Project Details',
        'Contact Information',
        'Review Your Information',
        'Success'
    ];

    const handleTypeSelect = (type) => {
        const updatedTypes = formData.projectType.includes(type)
            ? formData.projectType.filter(t => t !== type)
            : [...formData.projectType, type];
        setFormData({ ...formData, projectType: updatedTypes });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for this field when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }

        // Real-time validation
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let error = '';

        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Please enter a valid email address';
            }
        }

        if (name === 'phone' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                error = 'Please enter a valid phone number';
            }
        }

        if (error) {
            setErrors({ ...errors, [name]: error });
        }

        return !error;
    };

    const validateStep = () => {
        const newErrors = {};

        if (step === 4) {
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.email) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email';
            }
            // Phone is optional, but validate format if provided
            if (formData.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const goToStep = (targetStep) => {
        setStep(targetStep);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep()) {
            console.log('Form Submitted:', formData);
            nextStep();
        }
    };

    const variants = {
        enter: { x: 100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
    };

    const totalSteps = 6;
    const progressPercentage = (step / totalSteps) * 100;

    return (
        <section id="survey" className="survey-section">
            <div className="survey-container">
                <div className="survey-header">
                    <h2>Start Your Journey</h2>
                    <p>Tell us about your vision, and we'll help you build it.</p>
                </div>

                <div className="survey-card">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>

                    {step < totalSteps && (
                        <div className="step-label">
                            Step {step + 1} of {totalSteps}: {stepTitles[step]}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* Step 0: Service Selection */}
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
                                <p className="step-subtitle">Select all that apply</p>
                                <div className="options-grid">
                                    {serviceOptions.map(service => (
                                        <div
                                            key={service.value}
                                            className={`option-card ${formData.projectType.includes(service.value) ? 'selected' : ''}`}
                                            onClick={() => handleTypeSelect(service.value)}
                                        >
                                            <div className="option-label">{service.label}</div>
                                            <div className="option-desc">{service.desc}</div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-next" onClick={nextStep} disabled={formData.projectType.length === 0}>
                                    Next <FaArrowRight />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 1: Timeline */}
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
                                    {timelineOptions.map(time => (
                                        <div
                                            key={time.value}
                                            className={`option-list-item ${formData.timeline === time.value ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, timeline: time.value })}
                                        >
                                            <span className="option-main">{time.label}</span>
                                            {time.desc && <span className="option-sub">{time.desc}</span>}
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

                        {/* Step 2: Budget Range */}
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
                                <h3>What's your budget range?</h3>
                                <p className="step-subtitle">This helps us tailor our proposal to your needs</p>
                                <div className="options-list">
                                    {budgetOptions.map(budget => (
                                        <div
                                            key={budget.value}
                                            className={`option-list-item ${formData.budget === budget.value ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, budget: budget.value })}
                                        >
                                            {budget.label}
                                        </div>
                                    ))}
                                </div>
                                <div className="step-actions">
                                    <button className="btn-prev" onClick={prevStep}>Back</button>
                                    <button className="btn-next" onClick={nextStep} disabled={!formData.budget}>
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Project Details + Industry */}
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
                                <h3>Tell us about your project</h3>
                                <div className="input-group">
                                    <div className="field-wrapper">
                                        <label>Project Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Describe your goals, target audience, and key features..."
                                            rows="5"
                                        ></textarea>
                                        <span className="char-count">{formData.description.length} characters</span>
                                    </div>
                                    <div className="field-wrapper">
                                        <label>Industry/Sector <span className="optional">(optional)</span></label>
                                        <select
                                            className="dropdwn"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your industry</option>
                                            {industryOptions.map(ind => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="step-actions">
                                    <button className="btn-prev" onClick={prevStep}>Back</button>
                                    <button className="btn-next" onClick={nextStep} disabled={!formData.description}>
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Contact Information */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="survey-step"
                            >
                                <h3>How can we reach you?</h3>
                                <div className="input-group">
                                    <div className="field-wrapper">
                                        <label>Your Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={errors.name ? 'error' : ''}
                                        />
                                        {errors.name && <span className="error-message">{errors.name}</span>}
                                    </div>
                                    <div className="field-wrapper">
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? 'error' : ''}
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>
                                    <div className="field-wrapper">
                                        <label>Company Name <span className="optional">(optional)</span></label>
                                        <input
                                            type="text"
                                            name="company"
                                            placeholder="Your Company"
                                            value={formData.company}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="field-wrapper">
                                        <label>Phone Number <span className="optional">(optional)</span></label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+27 12 345 6789"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={errors.phone ? 'error' : ''}
                                        />
                                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                                    </div>
                                </div>
                                <div className="step-actions">
                                    <button className="btn-prev" onClick={prevStep}>Back</button>
                                    <button
                                        className="btn-next"
                                        onClick={nextStep}
                                        disabled={!formData.name || !formData.email || errors.email || errors.phone}
                                    >
                                        Review <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Review/Summary */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="survey-step review-step"
                            >
                                <h3>Review Your Information</h3>
                                <p className="step-subtitle">Please review your details before submitting</p>

                                <div className="review-section">
                                    <div className="review-item">
                                        <div className="review-header">
                                            <span className="review-title">Services</span>
                                            <button className="btn-edit" onClick={() => goToStep(0)}>
                                                <FaEdit /> Edit
                                            </button>
                                        </div>
                                        <div className="review-content">
                                            {formData.projectType.join(', ')}
                                        </div>
                                    </div>

                                    <div className="review-item">
                                        <div className="review-header">
                                            <span className="review-title">Timeline</span>
                                            <button className="btn-edit" onClick={() => goToStep(1)}>
                                                <FaEdit /> Edit
                                            </button>
                                        </div>
                                        <div className="review-content">
                                            {timelineOptions.find(t => t.value === formData.timeline)?.label}
                                        </div>
                                    </div>

                                    <div className="review-item">
                                        <div className="review-header">
                                            <span className="review-title">Budget</span>
                                            <button className="btn-edit" onClick={() => goToStep(2)}>
                                                <FaEdit /> Edit
                                            </button>
                                        </div>
                                        <div className="review-content">
                                            {budgetOptions.find(b => b.value === formData.budget)?.label}
                                        </div>
                                    </div>

                                    <div className="review-item">
                                        <div className="review-header">
                                            <span className="review-title">Project Details</span>
                                            <button className="btn-edit" onClick={() => goToStep(3)}>
                                                <FaEdit /> Edit
                                            </button>
                                        </div>
                                        <div className="review-content">
                                            <p>{formData.description}</p>
                                            {formData.industry && <p className="review-meta">Industry: {formData.industry}</p>}
                                        </div>
                                    </div>

                                    <div className="review-item">
                                        <div className="review-header">
                                            <span className="review-title">Contact Information</span>
                                            <button className="btn-edit" onClick={() => goToStep(4)}>
                                                <FaEdit /> Edit
                                            </button>
                                        </div>
                                        <div className="review-content">
                                            <p><strong>{formData.name}</strong></p>
                                            {formData.company && <p>{formData.company}</p>}
                                            <p>{formData.email}</p>
                                            {formData.phone && <p>{formData.phone}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="step-actions">
                                    <button className="btn-prev" onClick={prevStep}>Back</button>
                                    <button className="btn-submit" onClick={handleSubmit}>
                                        Submit Request <FaCheck />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 6: Success */}
                        {step === 6 && (
                            <motion.div
                                key="step6"
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
                                <p className="success-sub">We typically respond within 24 hours.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default SurveyWizard;
