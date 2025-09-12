import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "@/components/ui/form-field";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form fields and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with your EmailJS service ID, template ID, and public key
      await emailjs.send(
        "service_mgre1dp", // Service ID
        "template_20ayj9l", // Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          to_name: "Vasantha Kumar",
        },
        "GKZm7xj6m5yOXE1FG" // Public key
      );

      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setFormErrors({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: "Tiruppur, Tamil Nadu, India",
      subtitle: "Available for remote work globally",
      color: "text-primary",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91 7339232817",
      subtitle: "Mon-SAT 10AM-7PM IST",
      color: "text-secondary",
    },
    {
      icon: Mail,
      title: "Email",
      details: "vasanthakumar141099@gmail.com",
      subtitle: "Best way to reach me",
      color: "text-accent",
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "Within 24 hours",
      subtitle: "Usually much faster",
      color: "text-primary",
    },
  ];

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container-custom px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="h2-responsive font-bold mb-6 text-gradient">
            Get In Touch
          </h2>
          <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from
            you. Let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Personal Details - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-responsive-xl font-bold mb-6 flex items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-primary flex-shrink-0" />
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-card transition-all duration-300 hover:shadow-soft">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-soft`}
                      >
                        <info.icon
                          className={`w-5 h-5 sm:w-6 sm:h-6  ${info.color}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1 text-responsive-sm">
                          {info.title}
                        </h4>
                        <p className="text-foreground font-medium text-responsive-sm break-words">
                          {info.details}
                        </p>
                        <p className="text-muted-foreground text-responsive-xs">
                          {info.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="card-portfolio"
            >
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-responsive-sm">
                  Available for Work
                </h4>
                <p className="text-muted-foreground text-responsive-xs mb-4">
                  Open to new opportunities and exciting projects. Let's discuss
                  how we can work together.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Google Map - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-full"
          >
            <h3 className="text-responsive-xl font-bold mb-6 flex items-center">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-secondary flex-shrink-0" />
              Find Me Here
            </h3>
            <div className="w-full h-72 sm:h-80 lg:h-[92%] min-h-80 lg:min-h-72 rounded-xl overflow-hidden shadow-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62608.96634830034!2d77.2955866!3d11.1074732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907b0424d7835%3A0x3c35e8014f5c6a9f!2sTiruppur%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sin!4v1647890123456!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tiruppur Location Map - Vasantha Kumar's Location"
                className="rounded-xl"
                aria-label="Google Map showing Tiruppur, Tamil Nadu, India location"
              />
            </div>
          </motion.div>
        </div>

        {/* Contact Form - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="card-portfolio max-w-7xl mx-auto lg:mt-32">
            <div className="text-center mb-8">
              <h3 className="h3-responsive font-bold mb-4">
                Send Me a Message
              </h3>
              <p className="text-muted-foreground text-responsive-sm">
                Fill out the form below and I'll get back to you as soon as
                possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  <FormField
                    id="name"
                    name="name"
                    label="Full Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    error={formErrors.name}
                    autoComplete="name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9 }}
                >
                  <FormField
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    error={formErrors.email}
                    autoComplete="email"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 }}
              >
                <FormField
                  id="phone"
                  name="phone"
                  label="Phone Number (Optional)"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  autoComplete="tel"
                />
              </motion.div>

              <div className="grid md:grid-cols-1 gap-6"></div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 }}
              >
                <FormField
                  id="subject"
                  name="subject"
                  label="Subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  error={formErrors.subject}
                  autoComplete="off"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 }}
              >
                <FormField
                  id="message"
                  name="message"
                  label="Message"
                  type="textarea"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project or just say hello..."
                  error={formErrors.message}
                  autoComplete="off"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.3 }}
                className="text-center"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-hero px-12 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto"
                  aria-describedby={
                    isSubmitting ? "form-submitting" : undefined
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      <span id="form-submitting">Sending...</span>
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
