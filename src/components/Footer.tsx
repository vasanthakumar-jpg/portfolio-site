import { Heart } from 'lucide-react';
import SocialIcons from './SocialIcons';
import { profile } from '@/data/portfolio';
import { Reveal } from './motion/primitives';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background relative">
      <div className="footer-uncover container-custom py-12">
        <Reveal className="text-center">
          <h3 className="text-2xl font-bold text-gradient mb-4">{profile.name}</h3>
          <p className="text-background/70 mb-6 max-w-md mx-auto">
            React interfaces, Shopify storefronts, and responsive e-commerce experiences.
          </p>
          
          <SocialIcons 
            delay={0.2} 
            className="justify-center mb-6" 
            iconSize={22}
            showAll={true}
          />
          <nav aria-label="Portfolio sections" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm mb-8">
            <a href="#projects" className="footer-link">Projects</a>
            <a href="#skills" className="footer-link">Skills</a>
            <a href="#course" className="footer-link">Certifications</a>
            <a href="#education" className="footer-link">Education</a>
            <a href={import.meta.env.BASE_URL + profile.resumePath} download={profile.resumePath} className="footer-link">Download Resume</a>
          </nav>
          
          <div className="flex items-center justify-center text-sm text-background/60 mb-4">
            <span>Made with</span>
            <Heart aria-hidden="true" className="footer-heart w-4 h-4 mx-1 text-red-400 fill-current" />
            <span>using React & Tailwind CSS</span>
          </div>
          
          <div className="pt-4 border-t border-background/10">
            <p className="text-background/60 text-sm">
              © {currentYear} {profile.name}. All rights reserved.
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};

export default Footer;
