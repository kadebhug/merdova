import React from 'react';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import SurveyWizard from './components/Survey/SurveyWizard';
import Contact from './components/Contact/Contact';
import ScrollManager from './components/Layout/ScrollManager';
import DayNightCycle from './components/DayNightCycle/DayNightCycle';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sanaflower from './components/Sanaflower/Sanaflower';

const Home = () => (
  <div className="app">
    <Navbar />
    <Hero />
    <Services />
    <SurveyWizard />
    <Contact />
  </div>
);

const SanaflowerWithDayNight = () => (
  <DayNightCycle>
    <Sanaflower />
  </DayNightCycle>
);

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

