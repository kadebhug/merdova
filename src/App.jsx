import React from 'react';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import SurveyWizard from './components/Survey/SurveyWizard';
import Contact from './components/Contact/Contact';
import ScrollManager from './components/Layout/ScrollManager';

function App() {
  return (
    <ScrollManager>
      <div className="app">
        <Navbar />
        <Hero />
        <Services />
        <SurveyWizard />
        <Contact />
      </div>
    </ScrollManager>
  );
}

export default App;

