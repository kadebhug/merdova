import Navbar from '@/src/components/Layout/Navbar'
import Hero from '@/src/components/Hero/Hero'
import Services from '@/src/components/Services/Services'
import SurveyWizard from '@/src/components/Survey/SurveyWizard'
import Contact from '@/src/components/Contact/Contact'

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Services />
      <SurveyWizard />
      <Contact />
    </div>
  )
}

