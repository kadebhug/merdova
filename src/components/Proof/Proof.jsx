import React from 'react';
import './Proof.css';

const demos = [
    {
        title: 'Quote to invoice',
        text: 'A WhatsApp enquiry becomes a quote, an approval, and a Xero invoice. Nobody re-types it.',
        load: 'Illustrative load: about 40 quotes a week.'
    },
    {
        title: 'Branch reorder',
        text: 'Stock at one branch crosses a threshold. The buyer gets a WhatsApp alert and the reorder is logged.',
        load: 'Illustrative load: a daily stock check across three branches, done by hand today.'
    },
    {
        title: 'Approval chase',
        text: 'Purchase approvals that sit unread get a reminder and a status board. The requester can see where the request is.',
        load: 'Illustrative load: approvals still open after two days.'
    }
];

const stack = ['Xero', 'Sage', 'WhatsApp Business', 'Microsoft 365', 'Google Workspace', 'CRM and ERP APIs'];

const Proof = () => {
    return (
        <section id="proof" className="proof-section">
            <div className="landing-wrap">
                <p className="section-kicker">What a sprint looks like</p>
                <h2>Sample automations</h2>
                <p className="section-lead">
                    These are worked examples of the kind of workflow a sprint covers. The figures describe a typical load. They are not Merdova client results.
                </p>

                <div className="demo-grid">
                    {demos.map((demo) => (
                        <article key={demo.title} className="demo-card">
                            <p className="demo-label">Sample</p>
                            <h3>{demo.title}</h3>
                            <p>{demo.text}</p>
                            <p className="demo-load">{demo.load}</p>
                        </article>
                    ))}
                </div>

                <div className="proof-lower">
                    <article className="result-slot">
                        <p className="demo-label">Client result</p>
                        <h3>The first published result will go here.</h3>
                        <p>
                            Logos and numbers land on this page when a client has agreed to them. Until then, this space stays empty on purpose.
                        </p>
                    </article>

                    <article className="popia-card">
                        <h3>Your data stays in your systems</h3>
                        <p>
                            Records remain in the tools you already control. We do not use customer or staff data to train models. Access, retention, and handover are written down before the build starts. The team is in Durban and works South African business hours.
                        </p>
                    </article>
                </div>

                <ul className="stack-list" aria-label="Systems we connect">
                    {stack.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Proof;
