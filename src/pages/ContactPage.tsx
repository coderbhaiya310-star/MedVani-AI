import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  User,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <div id="contact-page-container" className="min-h-[calc(100vh-80px)] w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── HEADER ── */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Have questions regarding hospital deployment, integration with your existing EHR, or regional language support? Reach out to our technical and clinical team.
        </p>
      </div>

      {/* ── 2-COLUMN LAYOUT (Form + Contact Info) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
        {/* LEFT COLUMN: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md text-left">
          {isSubmitted ? (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Sent Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting Swasthya AI. Our medical and technical team has received your message and will respond to <strong>{formData.email}</strong> within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Send us a Message</h3>

              {/* Name input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Rajesh Gupta / Anjali Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Email input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Subject input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <input
                    id="contact-subject-input"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="OPD Pilot Trial / Regional Languages / Integration"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Message textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Message</label>
                <textarea
                  id="contact-message-textarea"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your clinic requirements, hospital bed capacity, or query..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Send Message button */}
              <button
                id="contact-send-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Basic Contact Information */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Basic Contact Information
            </h3>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Inquiries</span>
                <a href="mailto:contact@swasthya-ai.org" className="text-sm font-bold text-slate-900 hover:text-blue-600">
                  contact@swasthya-ai.org
                </a>
                <span className="text-xs text-slate-500 block">support@swasthya-ai.org</span>
              </div>
            </div>

            {/* Phone / Toll-free */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Helpline Number</span>
                <span className="text-sm font-bold text-slate-900 block">+91 11 2658 8500</span>
                <span className="text-xs text-slate-500">Toll-free: 1800-123-SWASTHYA</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Innovation Hub</span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Swasthya AI Healthcare Labs, Tech Park 4, New Delhi - 110029, India
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Operating Hours</span>
                <span className="text-sm font-bold text-slate-900 block">24/7 Digital Voice Intake</span>
                <span className="text-xs text-slate-500">Clinical Support: Mon - Sat (9:00 AM - 8:00 PM IST)</span>
              </div>
            </div>
          </div>

          {/* ABDM Compliance Note */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-teal-900 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <span>Encrypted under National Digital Health Mission (ABDM) standards and FHIR R4 clinical data schemas.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
