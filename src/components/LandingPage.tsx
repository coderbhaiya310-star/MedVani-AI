import React from 'react';
import {
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mic,
  FileText,
  Activity,
  Globe,
  Sparkles,
  Lock,
  Cloud,
  ChevronRight,
  Zap,
  Play,
  HeartPulse,
} from 'lucide-react';
import { ThreeDHoloDoctorHero } from './ThreeDHoloDoctorHero';
import { ThreeDGlassLoginCard } from './ThreeDGlassLoginCard';
import { VoiceExperienceDemoSection } from './VoiceExperienceDemoSection';
import { DashboardPreviewSection } from './DashboardPreviewSection';
import { LanguageCode } from '../types';

interface LandingPageProps {
  onStartConsultation: () => void;
  onLogin: () => void;
  onSelectRole: () => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onNavigateHowItWorks?: () => void;
  onNavigateForPatients?: () => void;
  onNavigateForDoctors?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartConsultation,
  onLogin,
  onSelectRole,
  onSelectLanguage,
  onNavigateHowItWorks,
  onNavigateForPatients,
  onNavigateForDoctors,
}) => {
  const languages = [
    { code: 'hi', native: 'हिंदी', english: 'Hindi' },
    { code: 'en', native: 'English', english: 'English' },
    { code: 'hinglish', native: 'Hinglish', english: 'Hinglish' },
    { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
    { code: 'mr', native: 'मराठी', english: 'Marathi' },
    { code: 'bn', native: 'বাংলা', english: 'Bengali' },
    { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
    { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  ];

  return (
    <div className="w-full flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-900">
      {/* 1. HERO SECTION (Split 3-Column: Left Info & 4 Cards | Center 3D Doctor & Dais | Right 3D Login) */}
      <section className="relative overflow-hidden pt-4 pb-14 lg:pt-6 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Subtle Ambient Light Gradients */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-teal-200/35 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* LEFT COLUMN: Headings, Subtitle, CTAs & Quick Metrics */}
          <div className="lg:col-span-4 text-left space-y-4 xl:space-y-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>ABDM FHIR R4 Compliant • Multilingual</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
              Intelligent Voice Intake{' '}
              <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                for Modern Healthcare
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Eliminate documentation fatigue. Swasthya AI conducts conversational, hands-free medical history intakes in 8+ Indian regional languages, reconciles prior prescriptions, and drafts physician-ready summaries in real time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartConsultation}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Start Voice Flow</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/80 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore Engine</span>
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 text-slate-700">
                <CheckCircle2 className="w-3 h-3 text-teal-600" /> 8+ Indian Languages
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 text-slate-700">
                <CheckCircle2 className="w-3 h-3 text-blue-600" /> Real-time OPQRST
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 text-slate-700">
                <CheckCircle2 className="w-3 h-3 text-purple-600" /> 1-Click EHR Sync
              </span>
            </div>
          </div>

          {/* CENTER COLUMN: 3D Holographic Doctor & Pedestal */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <ThreeDHoloDoctorHero onMicClick={onStartConsultation} />
          </div>

          {/* RIGHT COLUMN: 3D Glass Login Card (Full 4-Column Breathing Room) */}
          <div className="lg:col-span-4 flex items-center justify-center w-full">
            <ThreeDGlassLoginCard
              initialRole="patient"
              onLoginSuccess={onLogin}
              onOpenRegistration={onSelectRole}
            />
          </div>
        </div>

        {/* 4 CLINICAL CAPABILITIES CARDS (Full Width 4-Col Bento Grid) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Hands-Free Voice Flow */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Mic className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Hands-Free Voice Flow</h4>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Continuous auto turn-taking tuned for elderly and rural patients in native dialects.
            </p>
          </div>

          {/* Card 2: Drug Conflict Flagging */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all group cursor-pointer text-left">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Drug Conflict Flagging</h4>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Cross-checks verbal symptom claims against past OCR prescriptions and clinical records.
            </p>
          </div>

          {/* Card 3: Role-Based Security */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all group cursor-pointer text-left">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Role-Based Security</h4>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Strict privacy isolation between patients, physicians, and administrative audit logs.
            </p>
          </div>

          {/* Card 4: Physician Dashboard */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all group cursor-pointer text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Physician Dashboard</h4>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Structured SOAP summaries, OPQRST exploration, and 1-click clinical EHR drafting.
            </p>
          </div>
        </div>

        {/* 2. FLOATING BOTTOM HIGHLIGHTS BAR (5 Badges) */}
        <div className="mt-10 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-3 sm:p-4 flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <span>Multilingual Support (8+ Indian Languages)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>ABDM Compliant (FHIR R4 Standards)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>AI-Powered Insights (Smart Summaries)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <span>HIPAA Grade Security (E2E Encryption)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
              <Cloud className="w-3.5 h-3.5" />
            </div>
            <span>Cloud Ready (Scalable & Reliable)</span>
          </div>
        </div>
      </section>

      {/* 3. VOICE EXPERIENCE DEMO SECTION */}
      <div id="features-section">
        <VoiceExperienceDemoSection />
      </div>

      {/* 4. DASHBOARD & CLINICAL INTELLIGENCE SECTION */}
      <DashboardPreviewSection />

      {/* 5. 3-STEP INTUITIVE CLINICAL WALKTHROUGH */}
      <section id="how-it-works-section" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step-by-Step Patient Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              From Spoken Voice to Certified Medical Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Patients speak naturally in their dialect; doctors receive verified, structured OPQRST clinical notes in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-600/30">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Natural Dialect Speaking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patient speaks freely in Hindi, Tamil, Telugu, Punjabi, Gujarati, etc. The AI handles colloquial medical terms, hesitation pauses, and regional idioms.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hands-free & elderly friendly</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-teal-600/30">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Real-Time Clinical Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As the patient speaks, the engine extracts structured symptoms, onset, provoking factors, radiation, severity, and correlates with past uploaded prescriptions.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-teal-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Autonomous OPQRST vectors</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-purple-600/30">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Physician-Ready SOAP & Alerts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The doctor reviews an organized SOAP note, flagged drug interactions, and past OCR timeline, approving or modifying the note with 1 click.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-purple-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>FHIR R4 JSON & PDF export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REGIONAL LANGUAGES GRID */}
      <section id="languages-section" className="py-14 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Bharat Linguistic Inclusivity</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Tuned for 13+ Indian Regional Languages
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              High accuracy phonetic models trained on regional healthcare idioms and accent variations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang.code as any);
                  onStartConsultation();
                }}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all text-center group cursor-pointer"
              >
                <span className="block font-bold text-sm text-slate-900 group-hover:text-blue-600">
                  {lang.native}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{lang.english}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLEAN FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
              +
            </div>
            <span className="font-bold text-slate-700">Swasthya AI</span>
            <span>• Multilingual Clinical Intelligence for India</span>
          </div>

          <div className="flex items-center gap-6">
            <span>ABDM FHIR R4 Ready</span>
            <span>HIPAA End-to-End Encrypted</span>
            <span>Doctor in the Loop</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
