import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { useLenis } from './ScrollManager';
import { NAV_AUDIT_CTA } from '../landing/offer';

const links = [
    { href: '#outcomes', label: 'Outcomes' },
    { href: '#sprint', label: 'Sprint' },
    { href: '#usecases', label: 'Use cases' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' }
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const lenis = useLenis();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        if (isOpen) setIsOpen(false);

        if (lenis) {
            if (targetId === '#hero') {
                lenis.scrollTo(0, { immediate: true });
            } else {
                lenis.scrollTo(targetId, { offset: -80 });
            }
        } else {
            const element = document.querySelector(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <Motion.nav
                className={`navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="navbar-container">
                    <a href="#hero" className="logo" onClick={(e) => handleNavClick(e, '#hero')} aria-label="Merdova - Go to homepage">
                        <img src={logo} alt="Merdova Logo" />
                    </a>

                    <button
                        className="menu-icon"
                        onClick={toggleMenu}
                        aria-expanded={isOpen}
                        aria-controls="nav-menu"
                        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    >
                        {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                    </button>

                    <ul id="nav-menu" className={`nav-menu ${isOpen ? 'active' : ''}`} role="menubar">
                        {links.map((link) => (
                            <li className="nav-item" role="none" key={link.href}>
                                <a
                                    href={link.href}
                                    className="nav-links"
                                    role="menuitem"
                                    onClick={(e) => handleNavClick(e, link.href)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="nav-item" role="none">
                            <a
                                href="#survey"
                                className="nav-links nav-cta"
                                role="menuitem"
                                onClick={(e) => handleNavClick(e, '#survey')}
                            >
                                {NAV_AUDIT_CTA}
                            </a>
                        </li>
                    </ul>
                </div>
            </Motion.nav>

            <a
                href="#survey"
                className="sticky-audit"
                onClick={(e) => handleNavClick(e, '#survey')}
            >
                {NAV_AUDIT_CTA}
            </a>
        </>
    );
};

export default Navbar;
