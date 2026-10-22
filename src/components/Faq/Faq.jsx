import { faqs } from '../landing/offer';
import './Faq.css';

const Faq = () => (
    <section id="faq" className="faq-section">
        <div className="faq-container">
            <h2>Before you book the audit</h2>
            <div className="faq-list">
                {faqs.map((item) => (
                    <article className="faq-item" key={item.question}>
                        <h3>{item.question}</h3>
                        <p>{item.answer}</p>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

export default Faq;
