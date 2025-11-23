import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <div className="logo">
          <img src={logo} alt="Merdova Logo" />
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a href="#hero" className="nav-links" onClick={toggleMenu}>Home</a>
          </li>
          <li className="nav-item">
            <a href="#services" className="nav-links" onClick={toggleMenu}>Services</a>
          </li>
          <li className="nav-item">
            <a href="#survey" className="nav-links" onClick={toggleMenu}>Get Started</a>
          </li>
          <li className="nav-item">
            <a href="#contact" className="nav-links" onClick={toggleMenu}>Contact</a>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
