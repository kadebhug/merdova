import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { useLenis } from './ScrollManager';

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
    if (isOpen) toggleMenu();

    if (lenis) {
      if (targetId === '#hero') {
        lenis.scrollTo(0, { immediate: true });
      } else {
        lenis.scrollTo(targetId);
      }
    } else {
      // Fallback if lenis isn't ready
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
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
          <li className="nav-item" role="none">
            <a href="#hero" className="nav-links" role="menuitem" onClick={(e) => handleNavClick(e, '#hero')}>Home</a>
          </li>
          <li className="nav-item" role="none">
            <a href="#services" className="nav-links" role="menuitem" onClick={(e) => handleNavClick(e, '#services')}>Solutions</a>
          </li>
          <li className="nav-item" role="none">
            <a href="#process" className="nav-links" role="menuitem" onClick={(e) => handleNavClick(e, '#process')}>Process</a>
          </li>
          <li className="nav-item" role="none">
            <a href="#survey" className="nav-links nav-cta" role="menuitem" onClick={(e) => handleNavClick(e, '#survey')}>Get Started</a>
          </li>
          <li className="nav-item" role="none">
            <a href="#contact" className="nav-links" role="menuitem" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
