import { useRef, useState } from 'react';
import { ArrowRight, Send, Mail } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: ctaBlockRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: footerRef, isVisible: footerVisible } = useScrollAnimation({ threshold: 0.1 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    property: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', property: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = [
    { label: 'Product', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Security', href: '#security' },
    { label: 'Privacy', href: '#' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-charcoal py-24 lg:py-32"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* CTA Block */}
        <div
          ref={ctaBlockRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2
            className="font-sora font-bold text-offwhite leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            Ready to upgrade your room service?
          </h2>
          <p className="mt-6 text-offwhite-muted text-lg max-w-xl mx-auto">
            Tell us a little about your property. We'll reply within one
            business day.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <button
              onClick={() => scrollToSection('#contact-form')}
              className="btn-primary flex items-center gap-2"
            >
              Book a demo
              <ArrowRight size={18} />
            </button>
            <a
              href="mailto:hello@roomservice.ai"
              className="text-offwhite-muted hover:text-copper font-medium inline-flex items-center gap-2 transition-colors duration-300"
            >
              <Mail size={18} />
              Or email hello@roomservice.ai
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef as React.RefObject<HTMLFormElement>}
          id="contact-form"
          onSubmit={handleSubmit}
          className={`p-8 lg:p-10 rounded-2xl bg-charcoal-soft/30 border border-offwhite-muted/10 transition-all duration-700 ${
            formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-copper/20 flex items-center justify-center mx-auto mb-6">
                <Send size={28} className="text-copper" />
              </div>
              <h3 className="font-sora font-semibold text-offwhite text-2xl mb-2">
                Message sent!
              </h3>
              <p className="text-offwhite-muted">
                We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-offwhite text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-offwhite text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="you@hotel.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-offwhite text-sm font-medium mb-2">
                  Property
                </label>
                <input
                  type="text"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Hotel name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-offwhite text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                >
                  Send message
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <footer
        ref={footerRef as React.RefObject<HTMLElement>}
        className={`mt-24 pt-12 border-t border-offwhite-muted/10 transition-all duration-700 ${
          footerVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <a
              href="#"
              className="font-sora text-lg font-bold text-offwhite tracking-tight"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              RoomService<span className="text-copper"> AI</span>
            </a>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {footerLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-offwhite-muted hover:text-offwhite text-sm transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-offwhite-muted/50 text-sm">
              © RoomService AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;
