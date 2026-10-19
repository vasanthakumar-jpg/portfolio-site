import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import CourseSection from '@/components/CourseSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import PortfolioEffects from '@/components/motion/PortfolioEffects';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import CinematicScenes from '@/components/motion/CinematicScenes';

const Index = () => {
  return (
    <SmoothScroll>
      <CinematicScenes />
      <SEOHead />
      <PortfolioEffects />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ExperienceSection />
        <CourseSection />
        <ContactSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
};

export default Index;
