import React from 'react';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import SurveyWizard from './components/Survey/SurveyWizard';
import Contact from './components/Contact/Contact';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Services />
      <SurveyWizard />
      <Contact />
    </div>
  );
}

export default App;

