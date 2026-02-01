import React, { useState, Suspense, lazy } from 'react';
import ScrollManager from './components/Layout/ScrollManager';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Lazy load components for code splitting
const Navbar = lazy(() => import('./components/Layout/Navbar'));
const Hero = lazy(() => import('./components/Hero/Hero'));
const Services = lazy(() => import('./components/Services/Services'));
const Process = lazy(() => import('./components/Process/Process'));
const SurveyWizard = lazy(() => import('./components/Survey/SurveyWizard'));
const Contact = lazy(() => import('./components/Contact/Contact'));
const DayNightCycle = lazy(() => import('./components/DayNightCycle/DayNightCycle'));
const Sanaflower = lazy(() => import('./components/Sanaflower/Sanaflower'));
const PinModal = lazy(() => import('./components/Sanaflower/PinModal'));
const Jolene = lazy(() => import('./components/Jolene/Jolene'));
const Resume = lazy(() => import('./components/Resume/Resume'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

const Home = () => (
  <Suspense fallback={<LoadingFallback />}>
    <div className="app">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <SurveyWizard />
      <Contact />
    </div>
  </Suspense>
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
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    );
  }

  // Render content only after PIN verification
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DayNightCycle>
        <Sanaflower currentUserPin={currentUserPin} />
      </DayNightCycle>
    </Suspense>
  );
};

function App() {
  return (
    <Router basename="/">
      <ScrollManager>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sanaflower" element={<SanaflowerWithDayNight />} />
          <Route path="/jolene" element={
            <Suspense fallback={<LoadingFallback />}>
              <DayNightCycle>
                <Jolene />
              </DayNightCycle>
            </Suspense>
          } />
          <Route path="/resume" element={
            <Suspense fallback={<LoadingFallback />}>
              <Resume />
            </Suspense>
          } />
        </Routes>
      </ScrollManager>
    </Router>
  );
}

export default App;

