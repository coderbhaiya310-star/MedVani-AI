import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Languages,
  CheckCircle2,
  FileCheck2,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { DoctorIllustrationHero } from '../components/DoctorIllustrationHero';

interface HomePageProps {
  onStartVoiceFlow?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartVoiceFlow }) => {
  const navigate = useNavigate();

  const handleStartFlow = () => {
    if (onStartVoiceFlow) {
      onStartVoiceFlow();
    } else {
      navigate('/login');
    }
  };

  return (
    <div id="home-page-container" className="min-h-[calc(100vh-80px)] w-full flex flex-col justify-between text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── HERO SECTION ── */}
      <section id="hero-section" className="relative pt-6 pb-14 sm:pt-10 sm:pb-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex items-center">
        {/* Soft Ambient Healthcare Gradients in background */}
        <div className="absolute top-10 left-1/4 w-[420px] h-[420px] bg-sky-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          {/* LEFT: Text Content & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen Healthcare AI • ABDM FHIR R4 Ready</span>
            </div>

            {/* Main Heading requested by user */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
              Intelligent Voice Intake{' '}
              <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                for Modern Healthcare
              </span>
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              Eliminate OPD documentation fatigue. Swasthya AI conducts conversational, hands-free medical history intakes in 13+ regional languages, automatically organizes symptom timelines, and prepares physician-ready clinical summaries in real time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-start-voice-flow-btn"
                type="button"
                onClick={handleStartFlow}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <Mic className="w-5 h-5 text-white" />
                <span>Start Voice Flow</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-features-btn"
                type="button"
                onClick={() => navigate('/features')}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-200 font-bold text-sm sm:text-base shadow-xs hover:border-blue-300 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Small Feature Highlights */}
            <div className="pt-4 border-t border-slate-200/70">
              <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3">
                Key Platform Capabilities
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs">
                  <Languages className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">13+ Languages</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs">
                  <Mic className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Hands-free Voice</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs">
                  <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">OPQRST Mapping</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">ABDM & HIPAA</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Healthcare / AI Doctor Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-lg bg-gradient-to-b from-blue-50/60 via-teal-50/40 to-white p-6 sm:p-8 rounded-3xl border border-blue-100/80 shadow-xl shadow-blue-900/5 relative overflow-hidden">
              {/* Doctor illustration */}
              <DoctorIllustrationHero className="w-full max-w-sm mx-auto" />

              {/* Interactive Audio Badge */}
              <div className="mt-4 p-3 rounded-2xl bg-white/95 border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-xs">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Conversational Intake Mode</span>
                    <span className="text-[11px] text-teal-700 font-medium">Auto-translating to Medical English</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER BAR ── */}
      <footer className="border-t border-slate-200/80 bg-white/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <span>Swasthya AI Platform</span>
            <span>•</span>
            <span>Clinical Intelligence for Better Care</span>
          </div>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <button type="button" onClick={() => navigate('/features')} className="hover:text-blue-600 cursor-pointer">Features</button>
            <button type="button" onClick={() => navigate('/about')} className="hover:text-blue-600 cursor-pointer">About</button>
            <button type="button" onClick={() => navigate('/contact')} className="hover:text-blue-600 cursor-pointer">Contact</button>
            <button type="button" onClick={() => navigate('/login')} className="hover:text-blue-600 cursor-pointer">Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
