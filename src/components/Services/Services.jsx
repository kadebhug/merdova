import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
    FaTasks,
    FaLink,
    FaWhatsapp,
    FaChartBar,
    FaFileInvoiceDollar,
    FaThLarge,
    FaCheck
} from 'react-icons/fa';
import AuditLink from '../landing/AuditLink';
import { SPRINT_FROM, WHATSAPP_URL } from '../landing/offer';
import './Services.css';

const pains = [
    {
        title: 'The spreadsheet is the system',
        text: 'Orders, stock, and schedules live in a file one person understands. When they are out, the operation waits.'
    },
    {
        title: 'The same job, typed three times',
        text: 'A sale lands on WhatsApp, then again in the CRM, then again in Sage or Xero. The hours disappear in the re-typing.'
    },
    {
        title: 'Enquiries die in the chat',
        text: 'A customer messages after hours. Nobody owns the thread. The job goes to the company that replied first.'
    },
    {
        title: 'Month-end is a project',
        text: 'Managers wait days for numbers that should be a dashboard on Monday morning.'
    }
];

const useCases = [
    {
        icon: <FaTasks />,
        title: 'Workflow and approvals',
        text: 'Quotes, purchase orders, and sign-offs stop sitting in inboxes. The next person is nudged on email or WhatsApp, and you can see what is stuck.'
    },
    {
        icon: <FaLink />,
        title: 'Systems integration',
        text: 'Xero, Sage, your CRM, and your ERP share one customer and one invoice. Month-end stops being a reconciliation exercise.'
    },
    {
        icon: <FaWhatsapp />,
        title: 'WhatsApp operations',
        text: 'Enquiries, confirmations, quote follow-ups, and payment links happen in the chat your customers already use. The thread is logged.'
    },
    {
        icon: <FaChartBar />,
        title: 'Dashboards and reporting',
        text: 'Branch, job, and cash numbers update themselves. The Monday meeting starts with the report, not a request for it.'
    },
    {
        icon: <FaFileInvoiceDollar />,
        title: 'Documents and invoices',
        text: 'Supplier invoices and delivery notes are read, checked, and posted. Your team handles the exceptions.'
    },
    {
        icon: <FaThLarge />,
        title: 'Internal tools and client portals',
        text: 'A job tracker your team will actually open, or a portal where a client approves work, built around how you operate.'
    }
];

const sprintIncludes = [
    'One costly workflow automated end to end',
    'Connected to the tools you already pay for',
    'A dashboard your managers can read',
    'Code, credentials, and IP in your name',
    '30 days of support after handover'
];

const Services = () => {
    return (
        <>
            <section id="outcomes" className="outcomes-section">
                <div className="landing-wrap">
                    <p className="section-kicker">Outcomes</p>
                    <h2>Where the hours actually go</h2>
                    <p className="section-lead">
                        Mid-market operations teams in South Africa are not short of software. They are short of a single path from enquiry to invoice to report.
                    </p>
                    <div className="pain-grid">
                        {pains.map((pain, index) => (
                            <Motion.article
                                key={pain.title}
                                className="pain-card"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.45, delay: index * 0.06 }}
                            >
                                <span>0{index + 1}</span>
                                <h3>{pain.title}</h3>
                                <p>{pain.text}</p>
                            </Motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="usecases" className="usecases-section">
                <div className="landing-wrap">
                    <p className="section-kicker">Use cases</p>
                    <h2>The work we take off your team</h2>
                    <div className="usecase-grid">
                        {useCases.map((item) => (
                            <article key={item.title} className="usecase-card">
                                <div className="usecase-icon" aria-hidden="true">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </article>
                        ))}
                    </div>
                    <p className="also-line">
                        When a workflow needs a public front door, we still build the website or mobile app. The engagement starts with the operational job, not a brochure site.
                    </p>
                </div>
            </section>

            <section id="sprint" className="sprint-section">
                <div className="landing-wrap sprint-layout">
                    <div>
                        <p className="section-kicker">The sprint</p>
                        <h2>One workflow. 21 days. A price you can approve.</h2>
                        <p className="section-lead">
                            The Automation Sprint is a fixed-scope build for companies of 20 to 200 people. We pick the workflow that costs the most time, connect it to the systems you already run, and hand it over with the documentation.
                        </p>
                        <ul className="include-list">
                            {sprintIncludes.map((item) => (
                                <li key={item}>
                                    <FaCheck aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="retainer-note">
                            After handover, a care retainer covers monitoring, small changes, and the next workflow. It is quoted once the first sprint is live.
                        </p>
                    </div>

                    <div id="pricing" className="price-card">
                        <p className="price-kicker">Automation Sprint</p>
                        <p className="price-from">From</p>
                        <p className="price-amount">{SPRINT_FROM}</p>
                        <p className="price-meta">One workflow · 21 days · fixed before we build</p>
                        <p className="price-guarantee">
                            A portion to start. The balance after you have seen it running on your own workflow.
                        </p>
                        <AuditLink className="btn btn-primary price-cta" />
                        <a className="price-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                            Or WhatsApp the audit request
                        </a>
                        <p className="price-audit">
                            The audit is free: 45 minutes, one workflow, a rand estimate, and a fixed quote. If it is not worth automating, we say so.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Services;
