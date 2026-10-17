import { useEffect, useRef, useState } from "react";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import { profile } from "@/data/portfolio";
import { toast } from "sonner";
import { Reveal, SectionHeading, TiltCard } from "./motion/primitives";
import {
  CONTACT_EMAIL,
  CONTACT_LIMITS,
  COMPOSE_COOLDOWN_MS,
  createComposeLinks,
  validateContactDraft,
  type ContactDraft,
  type ContactErrors,
} from "@/lib/contact";

const ContactSection = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const openingRef = useRef(false);
  const cooldownRef = useRef<ReturnType<typeof setTimeout>>();

  const [formData, setFormData] = useState<ContactDraft>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [hasOpeningError, setHasOpeningError] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactDraft, boolean>>>({});
  const [composeReady, setComposeReady] = useState(false);

  useEffect(() => () => clearTimeout(cooldownRef.current), []);

  const openCompose = (client: "gmail" | "mailto") => {
    if (openingRef.current) return;
    const errors = validateContactDraft(formData);
    setTouched({ name: true, email: true, subject: true, message: true });
    setFormErrors(errors);
    setHasOpeningError(false);
    setComposeReady(false);

    const firstInvalidField = Object.keys(errors)[0];
    if (firstInvalidField) {
      setStatus("Please fix the highlighted fields before opening your email draft.");
      const field = formRef.current?.elements.namedItem(firstInvalidField);
      if (field instanceof HTMLElement) {
        field.focus({ preventScroll: true });
        // Wait for the error messages to lay out, then keep the field and label
        // visible below the fixed header, including after a long form scroll.
        requestAnimationFrame(() => field.scrollIntoView({ block: "center", behavior: "instant" }));
      }
      return;
    }

    openingRef.current = true;
    setIsSubmitting(true);

    try {
      const links = createComposeLinks(formData);
      if (client === "gmail") {
        // Open synchronously from the click. Remove access to this page before
        // navigating the new tab, while retaining popup-block detection.
        const composeWindow = window.open("about:blank", "_blank");
        if (composeWindow) {
          composeWindow.opener = null;
          composeWindow.location.replace(links.gmail);
          setStatus("Gmail compose has been opened. Please review and send the message.");
          setComposeReady(true);
          toast("Message ready!", { description: "Please review and send your draft in Gmail." });
          return;
        }
      }

      window.location.href = links.mailto;
      setStatus("Your email app has been requested. Please review and send the message. If nothing opened, choose Open Gmail below.");
      setComposeReady(true);
      toast("Message ready!", { description: "Please review and send your draft in your email app." });
    } catch {
      setHasOpeningError(true);
      setStatus("Unable to open your email draft. Your message is still here. Try Open Gmail or Use email app, or contact me directly.");
    } finally {
      // A synchronous guard also prevents repeated Enter/click events before
      // React paints the disabled state. This controls compose launches only.
      cooldownRef.current = setTimeout(() => {
        openingRef.current = false;
        setIsSubmitting(false);
      }, COMPOSE_COOLDOWN_MS);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    openCompose("gmail");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setStatus("");
    setHasOpeningError(false);
    setComposeReady(false);

    if (touched[name as keyof ContactDraft]) {
      const errors = validateContactDraft({ ...formData, [name]: value });
      setFormErrors(previous => ({ ...previous, [name]: errors[name as keyof ContactDraft] }));
    }
  };

  const handleFieldBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.target.name as keyof ContactDraft;
    setTouched(previous => ({ ...previous, [name]: true }));
    setFormErrors(previous => ({ ...previous, [name]: validateContactDraft(formData)[name] }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: profile.location,
      subtitle: "Current professional location",
      color: "text-primary",
    },
    {
      icon: Phone,
      title: "Phone",
      details: profile.phone,
      href: "tel:+917339232817",
      subtitle: "Call to get in touch",
      color: "text-secondary",
    },
    {
      icon: Mail,
      title: "Email",
      details: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
      subtitle: "Best way to reach me",
      color: "text-accent",
    },
  ];

  return (
    <section id="contact" tabIndex={-1} className="section-padding bg-muted/30 ambient-section">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <SectionHeading className="mb-6">
            Get In Touch
          </SectionHeading>
          <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from
            you. Let's create something amazing together.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Personal Details - Left Side */}
          <Reveal direction="left" className="min-w-0 space-y-8">
            <div>
              <h3 className="contact-subheading text-responsive-xl font-bold mb-6 flex items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-primary flex-shrink-0" />
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Reveal
                    key={index}
                    delay={index * 0.1}
                    className="group"
                  >
                    <div className="contact-row flex items-start space-x-4 p-4 rounded-xl">
                      <div
                        className="contact-icon w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-soft"
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
                          {info.href ? (
                            <a href={info.href} className="hover:underline">{info.details}</a>
                          ) : info.details}
                        </p>
                        <p className="text-muted-foreground text-responsive-xs">
                          {info.subtitle}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <TiltCard maxTilt={2} className="card-portfolio">
              <div className="text-center">
                <MessageCircle aria-hidden="true" className="chat-float w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-responsive-sm">
                  Let's Talk Development
                </h4>
                <p className="text-muted-foreground text-responsive-xs mb-4">
                  React interfaces, Shopify storefronts, and e-commerce workflows.
                  Get in touch to discuss your project.
                </p>
              </div>
            </TiltCard>
          </Reveal>

          {/* Google Map - Right Side */}
          <Reveal direction="right" className="contact-map-column">
            <h3 className="contact-subheading text-responsive-xl font-bold mb-6 flex items-center">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-secondary flex-shrink-0" />
              Find Me Here
            </h3>
            <div className="contact-map-frame w-full">
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
          </Reveal>
        </div>

        {/* Contact Form - Bottom */}
        <Reveal>
          <div className="contact-form-card card-portfolio max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="contact-subheading h3-responsive font-bold mb-4">
                Send Me a Message
              </h3>
              <p className="text-muted-foreground text-responsive-sm">
                Fill out the form to open a pre-filled email draft. Review it
                and press Send in Gmail or your email app.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate aria-busy={isSubmitting}>
              <div className="grid md:grid-cols-2 gap-6">
                <Reveal>
                  <FormField
                    id="name"
                    name="name"
                    label="Full Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    valid={touched.name && !formErrors.name && !!formData.name.trim()}
                    placeholder="Your full name"
                    error={formErrors.name}
                    autoComplete="name"
                    maxLength={CONTACT_LIMITS.name}
                  />
                </Reveal>

                <Reveal delay={0.08}>
                  <FormField
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    valid={touched.email && !formErrors.email && !!formData.email.trim()}
                    placeholder="your.email@example.com"
                    error={formErrors.email}
                    autoComplete="email"
                    maxLength={CONTACT_LIMITS.email}
                  />
                </Reveal>
              </div>

              <Reveal>
                <FormField
                  id="subject"
                  name="subject"
                  label="Subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  valid={touched.subject && !formErrors.subject && !!formData.subject.trim()}
                  placeholder="What's this about?"
                  error={formErrors.subject}
                  autoComplete="off"
                  maxLength={CONTACT_LIMITS.subject}
                />
              </Reveal>

              <Reveal>
                <FormField
                  id="message"
                  name="message"
                  label="Message"
                  type="textarea"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  valid={touched.message && !formErrors.message && !!formData.message.trim()}
                  placeholder="Tell me about your project or just say hello..."
                  error={formErrors.message}
                  autoComplete="off"
                  maxLength={CONTACT_LIMITS.message}
                />
              </Reveal>

              <Reveal className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-hero shimmer-button px-12 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto"
                  aria-describedby="compose-help"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>Opening email...</span>
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send aria-hidden="true" className={`w-4 h-4 ml-2 ${composeReady ? "compose-plane" : ""}`} />
                    </>
                  )}
                </Button>
                <p id="compose-help" className="text-sm text-muted-foreground mt-4">
                  You send the email yourself. Need another option?
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  <Button type="button" variant="outline" className="compose-fallback" disabled={isSubmitting} onClick={() => openCompose("gmail")}>
                    Open Gmail
                  </Button>
                  <Button type="button" variant="outline" className="compose-fallback" disabled={isSubmitting} onClick={() => openCompose("mailto")}>
                    Use email app
                  </Button>
                </div>
                <p role="status" aria-live="polite" aria-atomic="true" className={`mt-4 text-sm ${hasOpeningError ? "text-destructive" : "text-foreground"}`}>
                  {status}
                </p>
              </Reveal>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactSection;
