import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center section-padding bg-gradient-hero relative overflow-hidden bg-center bg-cover pt-24 lg:pt-28"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-40 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-0">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pr-8 text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 font-medium mb-4"
              style={{
                fontSize: "clamp(1rem, 3vw, 1.25rem)",
              }}
            >
              Hello, I'm
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-bold text-white mb-6 leading-tight whitespace-nowrap"
              style={{
                fontSize: "clamp(1.75rem, 7vw, 3.5rem)",
              }}
            >
              Vasanthakumar
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="block font-normal text-white/90 mt-2"
                style={{
                  fontSize: "clamp(1.25rem, 5vw, 2.5rem)",
                }}
              >
                Front-End Developer
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/80 mb-8 leading-relaxed max-w-lg text-left"
              style={{
                fontSize: "clamp(1rem, 3vw, 1.25rem)",
              }}
            >
              I create responsive and modern web interfaces using React and
              Material UI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button
                onClick={() => scrollToSection("#contact")}
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-lg shadow-glow transition-all duration-300 hover:scale-105"
              >
                Get In Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => scrollToSection("#about")}
                className="btn-outline-hero border-white/30 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-6"
            >
              <span className="text-white/60 text-sm">Follow me:</span>
              <div className="flex gap-4">
                {[
                  {
                    icon: Github,
                    href: "https://github.com/vasanthakumar-jpg",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/vasanthakumar-rajendran-83993422b/",
                  },
                  { icon: Mail, href: "mailto:vasanthakumar141099@gmail.com" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative overflow-hidden"
          >
            <div className="relative z-20">
              <img
                src={import.meta.env.BASE_URL + "assets/profile-hero.jpg"}
                alt="Vasantha Kumar - Front-End Developer"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-white/20 rounded-3xl -z-10 blur-sm"></div>
            </div>

            {/* Floating elements - hidden on mobile */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex absolute top-2 -left-4 md:-left-0 w-16 h-16 md:w-20 md:h-20 bg-accent/30 rounded-full items-center justify-center backdrop-blur-sm z-50"
            >
              <span className="text-white font-bold text-sm">1+</span>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="flex absolute bottom-2 -right-2 md:-right-0 w-16 h-16 md:w-20 md:h-20 bg-secondary/30 rounded-full items-center justify-center backdrop-blur-sm z-50"
            >
              <span className="text-white font-bold text-xs text-center ">
                10+
                <br />
                Projects
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full p-1"
          >
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
