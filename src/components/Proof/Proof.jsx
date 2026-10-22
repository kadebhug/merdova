import { motion } from 'framer-motion';
import { proofCases, proofIntro } from '../landing/offer';
import './Proof.css';

const ProofCase = ({ item, featured = false }) => (
    <article className={featured ? 'proof-featured' : 'proof-case'}>
        <p className="proof-sector">{item.sector}</p>
        <div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <p className="proof-stack">{item.stack.join(', ')}</p>
        </div>
    </article>
);

const Proof = () => {
    const [featured, ...supporting] = proofCases;

    return (
        <section id="proof" className="proof-section">
            <div className="proof-container">
                <motion.header
                    className="proof-header"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.55 }}
                >
                    <h2>{proofIntro.title}</h2>
                    <p>{proofIntro.subtitle}</p>
                </motion.header>

                <ProofCase item={featured} featured />

                <div className="proof-supporting">
                    {supporting.map((item) => (
                        <ProofCase key={item.title} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Proof;
