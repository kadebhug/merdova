import React from 'react';
import './Faq.css';

const faqs = [
    {
        question: 'What does an automation sprint cost?',
        answer: 'A sprint starts at R45,000 for one workflow, fixed before we build. The free audit produces that quote. There is no hourly billing.'
    },
    {
        question: 'How long does it take?',
        answer: 'Twenty-one days from kickoff. Days 1 to 3 are the workflow map and a rand estimate. You get a fixed quote by day 5. A working demo lands in week two. Handover, training, and documentation are done by day 21, with 30 days of support after that.'
    },
    {
        question: 'What happens to our data under POPIA?',
        answer: 'Your records stay in the systems you already control. We do not use your customer or staff data to train models. Who can access the data, how long we keep it, and what is handed over are written down before the build starts.'
    },
    {
        question: 'Which systems can you connect?',
        answer: 'Xero, Sage, CRMs, ERPs, WhatsApp, email, and spreadsheets, plus anything that has an API or a reliable export. If a system can only give us a file, we start there.'
    },
    {
        question: 'Who owns the software when the sprint ends?',
        answer: 'You do. Code, credentials, and documentation are handed to you. You are not locked into a Merdova subscription to keep the workflow running.'
    },
    {
        question: 'What support is included?',
        answer: 'Thirty days of support is included after handover. A care retainer after that covers monitoring, small changes, and the next workflow, quoted once the first sprint is live.'
    },
    {
        question: 'Do we have to replace our current software?',
        answer: 'No. The sprint connects the tools you already pay for. A new portal or internal tool is only built when the current stack cannot do the job.'
    },
    {
        question: 'What happens on the free audit?',
        answer: 'Forty-five minutes. We pick the one workflow costing you the most time, estimate the hours and rand, and send a fixed-price sprint quote. If it is not worth automating, we say so. There is no obligation to continue.'
    }
];

const Faq = () => {
    return (
        <section id="faq" className="faq-section">
            <div className="landing-wrap">
                <p className="section-kicker">FAQ</p>
                <h2>Before you book the audit</h2>
                <div className="faq-list">
                    {faqs.map((item) => (
                        <article key={item.question}>
                            <h3>{item.question}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
