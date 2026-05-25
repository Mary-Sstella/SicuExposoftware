import BenefitsSection from '../components/BenefitsSection'
import Footer from '../components/Footer'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import PasosSection from '../components/PasosSection'
import SoporteModal from '../../soporte/components/SoporteModal'


function LandingPage() {
  return (
    <div className="min-h-screen bg-violet-100">
      <div className="bg-violet-50">
      <Header />
      <HeroSection />
      </div>
      <BenefitsSection />
      <PasosSection />
      <Footer />
      <SoporteModal />
    </div>
  )
}

export default LandingPage
