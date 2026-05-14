import BenefitsSection from '../components/BenefitsSection'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'

function LandingPage() {
  return (
    <div className="min-h-screen bg-purple-100">
      <div className="bg-purple-50">
      <Header />
      <HeroSection />
      </div>
      <BenefitsSection />
    </div>
  )
}

export default LandingPage
