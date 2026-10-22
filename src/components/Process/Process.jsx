import React from 'react';
import { motion as Motion } from 'framer-motion';
import './Process.css';

const steps = [
    {
        when: 'Days 1–3',
        title: 'Audit',
        text: 'We map one workflow with the people who run it, then estimate the hours and rand it costs you each month.'
    },
    {
        when: 'Day 5',
        title: 'Fixed quote',
        text: 'Scope, price, and milestones are locked in writing. There is no hourly billing and no open-ended discovery.'
    },
    {
        when: 'Days 6–18',
        title: 'Build and integrate',
        text: 'We connect the workflow to your existing tools. You see a working demo on your own process in week two.'
    },
    {
        when: 'Days 19–21',
        title: 'Handover',
        text: 'Training, documentation, and credentials come with the build, plus 30 days of support.'
    }
];

const comparisons = [
    {
        title: 'Hiring a developer',
        text: 'Recruiting takes months. You pay a salary, tools, and management for one person, and the knowledge can leave with them.'
    },
    {
        title: 'A generalist agency',
        text: 'Discovery stays open and is billed by the hour. The first invoice often pays for a strategy document before any workflow runs.'
    },
    {
        title: 'Off-the-shelf software',
        text: 'You add another login. It still has to be forced to talk to Sage, WhatsApp, and the spreadsheet the branch actually uses.'
    }
];

const Process = () => {
    return (
        <section id="process" className="process-section">
            <div className="landing-wrap">
                <div className="process-header">
                    <p className="section-kicker">How it works</p>
                    <h2 className="process-title">
                        A sprint with dates, not a <span className="gold-text">phase called discovery</span>
                    </h2>
                    <p className="process-subtitle">
                        Twenty-one days from kickoff to handover. You know the price before the build starts.
                    </p>
                </div>

                <div className="process-steps">
                    {steps.map((step, index) => (
                        <Motion.article
                            key={step.title}
                            className="process-step"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.45, delay: index * 0.08 }}
                        >
                            <p className="step-when">{step.when}</p>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </Motion.article>
                    ))}
                </div>

                <div className="compare-block">
                    <h3>What you are comparing it with</h3>
                    <div className="compare-grid">
                        {comparisons.map((item) => (
                            <article key={item.title}>
                                <h4>{item.title}</h4>
                                <p>{item.text}</p>
                            </article>
                        ))}
                        <article className="compare-ours">
                            <h4>The Merdova sprint</h4>
                            <p>Fixed price. 21 days. Built around the tools you already pay for. You own the result.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
