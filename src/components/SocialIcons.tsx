import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface SocialIconsProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
  delay?: number;
  showAll?: boolean;
}

const SocialIcons = ({
  className = "",
  iconSize = 20,
  showLabels = false,
  delay = 0,
  showAll = true,
}: SocialIconsProps) => {
  const allSocialLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/vasanthakumar-rajendran-83993422b/",
      icon: Linkedin,
      className: "social-linkedin",
    },
    {
      name: "GitHub",
      href: "https://github.com/vasanthakumar-jpg",
      icon: Github,
      className: "social-github",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/vasanth_vasu_vv/",
      icon: Instagram,
      className: "social-instagram",
    },
    {
      name: "Email",
      href: "mailto:vasanthakumar141099@gmail.com",
      icon: Mail,
      className: "social-mail",
    },
  ];

  const limitedSocialLinks = [
    allSocialLinks[0], // LinkedIn
    allSocialLinks[2], // Instagram
    allSocialLinks[3], // Email
  ];

  const socialLinks = showAll ? allSocialLinks : limitedSocialLinks;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.href}
          target={social.href !== "#" ? "_blank" : "_self"}
          rel={social.href !== "#" ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: delay + index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className={`social-icon ${social.className}`}
          aria-label={`Visit ${social.name} profile`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <social.icon size={iconSize} />
          {showLabels && (
            <span className="ml-2 text-sm font-medium">{social.name}</span>
          )}
        </motion.a>
      ))}
    </div>
  );
};

export default SocialIcons;
