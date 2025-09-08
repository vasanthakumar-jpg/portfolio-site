import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';
import SocialIcons from './SocialIcons';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background relative">
      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow hover:scale-110 transition-transform duration-300"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </motion.button>

      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gradient mb-4">Vasantha Kumar</h3>
          <p className="text-background/70 mb-6 max-w-md mx-auto">
            Frontend Developer passionate about creating exceptional user experiences. 
            Always eager to learn and grow in the tech industry.
          </p>
          
          <SocialIcons 
            delay={0.2} 
            className="justify-center mb-6" 
            iconSize={22}
            showAll={true}
          />
          
          <div className="flex items-center justify-center text-sm text-background/60 mb-4">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-1 text-red-400 fill-current" />
            <span>using React & Tailwind CSS</span>
          </div>
          
          <div className="pt-4 border-t border-background/10">
            <p className="text-background/60 text-sm">
              © {currentYear} VasanthaKumar. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;