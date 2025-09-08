import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import CourseSection from '@/components/CourseSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <>
      <SEOHead />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <CourseSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
