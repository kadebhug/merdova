export const heroCopy = {
    eyebrow: 'AI workflow automation and custom operations software',
    headlineBefore: 'Stop Running Your Business on ',
    headlineEmphasis: 'Manual Admin',
    headlineAfter: ' and Disconnected Tools.',
    subtext:
        'We build AI workflow automations, WhatsApp-to-ERP integrations, and custom web and mobile operations software for South African businesses, backed by guaranteed SLAs.',
    primaryCta: 'Book Free Audit',
    secondaryCta: 'See What We Build',
};

export const trustItems = [
    'AWS Certified Architecture',
    'POPIA-Aligned Data Handling',
    '2-Week Automation Sprints',
    'SLA-Backed Support',
];

export const services = [
    {
        icon: 'bolt',
        title: '2-Week AI Workflow Automation Sprint',
        description:
            'Eliminate repetitive data entry, manual quoting, and document processing in 14 days by connecting AI agents to your existing tools.',
        bestFor: 'Teams retyping the same lead, quote, or invoice across WhatsApp, email, and spreadsheets.',
        outcome: 'One live workflow, a handover, and a before-and-after on hours spent.',
        wizardDesc: 'One workflow live in 14 days',
    },
    {
        icon: 'whatsapp',
        title: 'WhatsApp Business, CRM & ERP Integration',
        description:
            'Turn WhatsApp into an automated sales, support, and operations channel synced directly with Xero, Sage, HubSpot, or your custom database.',
        bestFor: 'Sales and support teams whose customers already message the business on WhatsApp.',
        outcome: 'Consent capture, conversation history, and two-way sync into the system you already run.',
        wizardDesc: 'WhatsApp synced to Xero, Sage, or your CRM',
    },
    {
        icon: 'portal',
        title: 'Custom Internal Portals & Dashboards',
        description:
            'Replace fragile spreadsheets with secure web portals, role-based staff workflows, and live Metabase or BI executive reporting.',
        bestFor: 'Operations managers reconciling the same numbers in five different files.',
        outcome: 'A role-based portal, live reporting, and staff logins your team actually uses.',
        wizardDesc: 'Replace the spreadsheet with a staff portal',
    },
    {
        icon: 'mobile',
        title: 'Offline-First Mobile & Field Apps',
        description:
            'Production iOS and Android apps built for field teams, security operations, logistics, and hazard tracking that keep working when the signal drops.',
        bestFor: 'Mining, security, logistics, and construction crews outside reliable coverage.',
        outcome: 'A Flutter app that saves work on the device and syncs to your live dashboard.',
        wizardDesc: 'Field apps that save work offline',
    },
    {
        icon: 'cloud',
        title: 'Cloud Architecture, APIs & SLA Retainers',
        description:
            'AWS serverless infrastructure, Python and FastAPI partner integrations, real-time socket services, and engineering support with a written response-time SLA.',
        bestFor: 'Companies that already have a system and need it to stay up, integrate, and stay supportable.',
        outcome: 'Architecture, a partner API, monitoring, and a named SLA.',
        wizardDesc: 'AWS, APIs, and a written support SLA',
    },
];

export const surveyServices = services.map((service) => ({
    value: service.title,
    label: service.title,
    desc: service.wizardDesc,
}));

export const timelineOptions = [
    { value: 'asap', label: 'ASAP', desc: 'Within 2 weeks' },
    { value: '1-2months', label: '1-2 months', desc: '' },
    { value: '3-6months', label: '3-6 months', desc: '' },
    { value: '6plus', label: '6+ months', desc: '' },
    { value: 'exploring', label: 'Just exploring', desc: 'No immediate timeline' },
];

export const budgetOptions = [
    { value: 'under50k', label: 'Under R50,000' },
    { value: '50-150k', label: 'R50,000 to R150,000' },
    { value: '150-300k', label: 'R150,000 to R300,000' },
    { value: '300plus', label: 'R300,000+' },
    { value: 'notsure', label: 'Not sure yet' },
];

export const industryOptions = [
    'Logistics & supply chain',
    'Mining & construction',
    'Security & IoT',
    'Finance & banking',
    'Retail & e-commerce',
    'Healthcare',
    'Manufacturing',
    'Professional services',
    'Hospitality',
    'Education',
    'Other',
];

export const proofIntro = {
    title: 'Shipped in production',
    subtitle:
        'These are real systems our engineering lead has shipped in South Africa. Client names stay off this page.',
};

export const proofCases = [
    {
        sector: 'Security and IoT',
        title: 'Alarm monitoring, from the panel to the weekly report',
        summary:
            'A production mobile app for arm, disarm, and panic control, a Node.js socket service relaying alarm metadata, a Python FastAPI API for third-party integrations, and Kafka notifications when weekly reports are ready.',
        stack: ['Flutter', 'Node.js', 'Python FastAPI', 'Kafka', 'Metabase'],
    },
    {
        sector: 'Mining and field work',
        title: 'Hazard logging that still works when the signal drops',
        summary:
            'An offline-first Flutter app for workplace hazard tracking. Crews log on site with no coverage, and the records sync once the device is back online.',
        stack: ['Flutter', 'Offline sync', 'AWS'],
    },
    {
        sector: 'Operations and distribution',
        title: 'Internal ops for pharma, commerce for food distribution',
        summary:
            'An internal pharmaceutical operations system on Angular, React Native, Node, AWS (EC2, RDS, Docker), and a separate Flutter commerce app for a food distribution company.',
        stack: ['Angular', 'React Native', 'Node.js', 'AWS', 'Flutter'],
    },
];

export const processCopy = {
    titleBefore: 'From audit to ',
    titleEmphasis: 'handover',
    subtitle:
        'A fixed sequence from a free audit to a system your team can run without us in the room.',
    cta: 'Book Free Audit',
};

export const processSteps = [
    {
        title: '30-Minute Workflow & Architecture Audit',
        description:
            'We map your current manual bottlenecks, software stack, and highest-ROI automation opportunities for free.',
    },
    {
        title: 'Fixed-Scope Blueprint & SLA Proposal',
        description:
            'Within 48 hours, you receive a clear technical architecture, fixed milestone pricing in ZAR, and a delivery SLA.',
    },
    {
        title: '2-Week Sprint or Phased System Build',
        description:
            'We build, test, and integrate directly with your live systems with weekly working demos and zero black-box surprises.',
    },
    {
        title: 'Handover, Team Training & SLA Support',
        description:
            'Full code and IP ownership, staff onboarding, POPIA-conscious security controls, and ongoing SLA monitoring.',
    },
];

export const surveyCopy = {
    title: 'Book a free workflow audit',
    subtitle: 'Three short steps. We reply within one business day with a fit check and, if it is a fit, a fixed-scope proposal.',
    submit: 'Request Free Audit',
};

export const faqs = [
    {
        question: 'How does the 2-Week Automation Sprint work, and what does it cost?',
        answer:
            'The sprint covers one workflow, delivered in 14 days. On the audit call you name the bottleneck. Within 48 hours you get a written scope, a fixed price in rand, and a list of what is out of scope. Most first sprints fall in the ranges on the audit form, from under R50,000 for a single integration to more when the workflow touches several systems. Work starts only after you approve that number.',
    },
    {
        question: 'Can you integrate with our accounting, ERP, or WhatsApp systems?',
        answer:
            'Yes, when the system has an API or a supported export. We connect WhatsApp Business API, Xero, Sage, HubSpot, and custom databases. If you run Pastel or an older ERP, the audit is where we check a direct integration, a file import, or a small middleware service. We will say no if the system cannot be connected safely.',
    },
    {
        question: 'How do you handle POPIA, data security, and code ownership?',
        answer:
            'You keep the code and the IP. Staff see only the records their role needs. WhatsApp and CRM sync store a person\'s details only after consent is recorded. Message history sits in your systems, not in a shared inbox. Before we build the integration, we write down what data is stored, for how long, and how a deletion request is handled.',
    },
    {
        question: 'Can the mobile apps work offline on remote sites?',
        answer:
            'Yes. Field apps save the job on the device when there is no signal, then sync when the device is back online. Our engineering lead has shipped this pattern for workplace hazard logging on mining sites. The management dashboard updates from the synced records, not from a live connection the crew may not have.',
    },
    {
        question: 'What is included in your post-launch SLAs?',
        answer:
            'A written SLA names the response time, how incidents are handled after go-live, and what monitoring is included. The proposal states the hours and the channel. A retainer after handover is optional. You do not have to keep paying us to keep the system you already paid for.',
    },
];
