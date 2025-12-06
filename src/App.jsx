import React, { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import SurveyWizard from './components/Survey/SurveyWizard';
import Contact from './components/Contact/Contact';
import ScrollManager from './components/Layout/ScrollManager';
import DayNightCycle from './components/DayNightCycle/DayNightCycle';

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sanaflower from './components/Sanaflower/Sanaflower';
import PinModal from './components/Sanaflower/PinModal';
import { AnimatePresence } from 'framer-motion';

const Home = () => (
  <div className="app">
    <Navbar />
    <Hero />
    <Services />
    <SurveyWizard />
    <Contact />
  </div>
);

const SanaflowerWithDayNight = () => {
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(true);
  const [currentUserPin, setCurrentUserPin] = useState(null);
  const navigate = useNavigate();

  const handlePinSuccess = (pin) => {
    setIsPinVerified(true);
    setCurrentUserPin(pin);
    setIsPinModalOpen(false);
  };

  const handlePinCancel = () => {
    navigate('/');
  };

  // Show PIN modal if not verified
  if (!isPinVerified) {
    return (
      <AnimatePresence>
        {isPinModalOpen && (
          <PinModal
            isOpen={isPinModalOpen}
            onClose={handlePinCancel}
            onSuccess={handlePinSuccess}
            message="Please enter the 4-digit PIN to access the Sanaflower page."
            isPageLevel={true}
          />
        )}
      </AnimatePresence>
    );
  }

  // Render content only after PIN verification
  return (
    <DayNightCycle>
      <Sanaflower currentUserPin={currentUserPin} />
    </DayNightCycle>
  );
};

function App() {
  return (
    <Router basename="/merdova">
      <ScrollManager>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sanaflower" element={<SanaflowerWithDayNight />} />
        </Routes>
      </ScrollManager>
    </Router>
  );
}

export default App;

