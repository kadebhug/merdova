import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Code, FileJson, FileDown, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './Resume.css';

const initialCvData = {
  name: "Shikaal Kade Bhugwathideen",
  title: "Software Developer",
  avatar: "/avatar.png",
  contact: {
    email: "kadeshikaal@gmail.com",
    phone: "+27 65 988 1690",
    location: "Durban, South Africa"
  },
  profile: "Full-Stack Developer with 5+ years building production mobile and web applications. Specialise in Flutter mobile development, Python APIs (FastAPI), and AWS serverless architectures. Currently focused on IoT/security systems, building mobile apps for alarm panel control and designing public APIs for third-party integrations.",
  skills: {
    "Mobile": ["Android", "Flutter", "React Native"],
    "Frontend": ["Angular", "React", "Svelte", "Next.js"],
    "Backend": ["Node.js", "Python (FastAPI)", "Serverless", "C#", "Java"],
    "Cloud & Data": ["AWS", "DynamoDB", "MongoDB", "Kafka", "Metabase"]
  },
  experience: [
    {
      role: "Software Developer",
      company: "Finmon Newco",
      period: "Oct 2024 – Present",
      bullets: [
        "Rearchitected Flutter mobile application and internal business logic package for alarm monitoring platform",
        "App enables users to control alarm panels (arm/disarm, panic triggers) with advanced features",
        "Built Node.js socket service to relay alarm metadata between systems",
        "Developing public API using Python/FastAPI for third-party integrations",
        "Maintained Python web connector and debugged Bluetooth programming app",
        "Implementing Metabase analytics dashboard for sales and app adoption metrics",
        "Building push notification service consuming Kafka topics to notify users when weekly reports are ready"
      ]
    },
    {
      role: "Cloud Solutions Developer",
      company: "Exonic (formerly Assemble)",
      period: "May 2022 – Oct 2024",
      bullets: [
        "Architected political ad management platform using Svelte and Serverless with DynamoDB",
        "Developed offline-first Flutter app for mining workplace hazard tracking",
        "Built Flutter app for banking employee wellness assessment with personalised content",
        "Created MVP mobile app using Flutter and AWS Amplify for biokinetics company",
        "Conducted security and architecture review for major motor company"
      ]
    },
    {
      role: "Junior Software Developer",
      company: "Assemble",
      period: "Jun 2020 – Apr 2022",
      bullets: [
        "Built internal system for pharmaceutical company using Angular, React Native, Node, EC2, RDS, Docker",
        "Created cross-platform Flutter app for misinformation reporting",
        "Developed e-commerce Flutter app for food distribution company"
      ]
    }
  ],
  education: { degree: "Diploma in Software Development", school: "Varsity College, Durban", period: "2016 – 2018" },
  certifications: ["AWS Certified Solutions Architect – Associate", "AWS Certified Cloud Practitioner"]
};

export default function Resume() {
  const [cvData, setCvData] = useState(initialCvData);
  const [modalOpen, setModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState(null);
  const pdfRef = useRef(null);

  function openEditModal() {
    setJsonText(JSON.stringify(cvData, null, 2));
    setJsonError(null);
    setModalOpen(true);
  }

  function closeEditModal() {
    setModalOpen(false);
    setJsonError(null);
  }

  function applyJson() {
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonText);
      setCvData(parsed);
      closeEditModal();
    } catch (e) {
      setJsonError(e.message || 'Invalid JSON');
    }
  }

  async function downloadPdf() {
    const el = pdfRef.current;
    if (!el) return;
    el.classList.add('resume--for-pdf');
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const opt = {
      margin: [8, 10],
      filename: `resume-${(cvData?.name ?? 'resume').replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      await html2pdf().set(opt).from(el).save();
    } finally {
      el.classList.remove('resume--for-pdf');
    }
  }

  return (
    <div className="resume">
      <div className="resume__toolbar">
        <button type="button" className="resume__toolbar-btn resume__toolbar-btn--edit" onClick={openEditModal} aria-label="Edit resume JSON">
          <FileJson size={18} /> Edit JSON
        </button>
        <button type="button" className="resume__toolbar-btn resume__toolbar-btn--pdf" onClick={downloadPdf} aria-label="Download PDF">
          <FileDown size={18} /> Download PDF
        </button>
      </div>
      <div ref={pdfRef} className="resume__container">
        <header>
          <div className="resume__header-content">
            <div
              className={`resume__avatar-wrapper${cvData?.avatar ? ' resume__avatar-wrapper--img' : ''}`}
              style={cvData?.avatar ? { backgroundImage: `url(${cvData.avatar})` } : undefined}
              role={cvData?.avatar ? 'img' : undefined}
              aria-label={cvData?.avatar ? `${cvData?.name ?? ''} avatar` : undefined}
            >
              {!cvData?.avatar && (
                <div className="resume__avatar resume__avatar--placeholder">
                  {cvData?.name ? cvData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '—'}
                </div>
              )}
            </div>
            <div className="resume__header-text">
              <h1 className="resume__name">{cvData?.name ?? '—'}</h1>
              <p className="resume__title">{cvData?.title ?? '—'}</p>
              <div className="resume__contact">
                <span><Mail size={12} /> {cvData?.contact?.email ?? '—'}</span>
                <span><Phone size={12} /> {cvData?.contact?.phone ?? '—'}</span>
                <span><MapPin size={12} /> {cvData?.contact?.location ?? '—'}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="resume__section">
          <div className="resume__profile">
            <p>{cvData?.profile ?? ''}</p>
          </div>
        </section>

        <section className="resume__section">
          <h2 className="resume__section-title">
            <Code size={14} /> Skills
          </h2>
          <div className="resume__skills-grid">
            {Object.entries(cvData?.skills ?? {}).map(([category, items]) => (
              <div key={category} className="resume__skill-category">
                <p className="resume__skill-label">{category}</p>
                <div className="resume__skill-tags">
                  {(Array.isArray(items) ? items : []).map(skill => (
                    <span key={skill} className="resume__skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="resume__section">
          <h2 className="resume__section-title">
            <Briefcase size={14} /> Experience
          </h2>
          <div className="resume__experience-list">
            {(cvData?.experience ?? []).map((job, i) => (
              <article key={i} className="resume__job">
                <div className="resume__job-header">
                  <h3 className="resume__job-role">{job.role}</h3>
                  <span className="resume__job-period">{job.period}</span>
                </div>
                <p className="resume__job-company">{job.company}</p>
                <ul className="resume__job-bullets">
                  {(Array.isArray(job.bullets) ? job.bullets : []).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="resume__two-col">
          <section className="resume__section resume__card">
            <h2 className="resume__card-title">
              <GraduationCap size={14} /> Education
            </h2>
            <p className="resume__edu-degree">{cvData?.education?.degree ?? '—'}</p>
            <p className="resume__edu-meta">{cvData?.education?.school ?? ''} | {cvData?.education?.period ?? ''}</p>
          </section>
          <section className="resume__section resume__card">
            <h2 className="resume__card-title">
              <Award size={14} /> Certifications
            </h2>
            <div className="resume__cert-list">
              {(cvData?.certifications ?? []).map((cert, i) => (
                <p key={i}>• {cert}</p>
              ))}
            </div>
          </section>
        </div>
      </div>

      {modalOpen && (
        <div className="resume__modal-backdrop" onClick={closeEditModal} role="dialog" aria-modal="true" aria-labelledby="resume-modal-title">
          <div className="resume__modal" onClick={e => e.stopPropagation()}>
            <div className="resume__modal-header">
              <h2 id="resume-modal-title" className="resume__modal-title">Edit resume JSON</h2>
              <button type="button" className="resume__modal-close" onClick={closeEditModal} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="resume__modal-body">
              <textarea
                className="resume__modal-textarea"
                value={jsonText}
                onChange={e => { setJsonText(e.target.value); setJsonError(null); }}
                spellCheck={false}
                aria-describedby={jsonError ? 'resume-json-error' : undefined}
              />
              {jsonError && <p id="resume-json-error" className="resume__modal-error">{jsonError}</p>}
            </div>
            <div className="resume__modal-footer">
              <button type="button" className="resume__modal-btn resume__modal-btn--cancel" onClick={closeEditModal}>Cancel</button>
              <button type="button" className="resume__modal-btn resume__modal-btn--apply" onClick={applyJson}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
