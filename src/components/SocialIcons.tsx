import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { useAnimationPreferences } from "./motion/preferences";
import WhatsAppIcon from "./WhatsAppIcon";

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
  const { reducedMotion, finePointer } = useAnimationPreferences();
  const allSocialLinks = [
    {
      name: "LinkedIn",
      href: profile.linkedin,
      icon: Linkedin,
      className: "social-linkedin",
    },
    {
      name: "GitHub",
      href: profile.github,
      icon: Github,
      className: "social-github",
    },
    {
      name: "Email",
      href: `mailto:${profile.email}`,
      icon: Mail,
      className: "social-mail",
    },
    { name: "WhatsApp", href: profile.whatsapp, icon: WhatsAppIcon, className: "social-whatsapp" },
  ];

  const limitedSocialLinks = [
    allSocialLinks[0], // LinkedIn
    allSocialLinks[1], // GitHub
    allSocialLinks[2], // Email
  ];

  const socialLinks = showAll ? allSocialLinks : limitedSocialLinks;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.href}
          target={social.href.startsWith("https://") ? "_blank" : undefined}
          rel={social.href.startsWith("https://") ? "noopener noreferrer" : undefined}
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            delay: reducedMotion ? 0 : delay + index * 0.06,
            duration: reducedMotion ? 0 : 0.45,
          }}
          className={`social-icon ${social.className}`}
          aria-label={social.name === "WhatsApp" ? "Chat on WhatsApp" : social.name === "Email" ? "Email Vasanthakumar" : `Visit ${social.name} profile`}
          whileHover={finePointer && !reducedMotion ? { y: -1 } : undefined}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        >
          <social.icon aria-hidden="true" size={iconSize} />
          {showLabels && (
            <span className="ml-2 text-sm font-medium">{social.name}</span>
          )}
        </motion.a>
      ))}
    </div>
  );
};

export default SocialIcons;
