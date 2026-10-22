import React from 'react';
import { useLenis } from '../Layout/ScrollManager';
import { AUDIT_CTA } from './offer';

const AuditLink = ({ className, children = AUDIT_CTA }) => {
    const lenis = useLenis();

    const handleClick = (e) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo('#survey', { offset: -90 });
            return;
        }
        document.getElementById('survey')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <a href="#survey" className={className} onClick={handleClick}>
            {children}
        </a>
    );
};

export default AuditLink;
