import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Target,
  HeartPulse,
  Clock,
  CheckCircle2,
  Users,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Languages,
  FileCheck2,
  Zap,
} from 'lucide-react';
import { DoctorIllustrationHero } from '../components/DoctorIllustrationHero';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'Patient Speaks Naturally',
      desc: 'Patients articulate their health issues comfortably in their native language (Hindi, Bengali, Tamil, etc.) through conversational voice or touch intake.',
      icon: Languages,
    },
    {
      step: '02',
      title: 'Live OPQRST Extraction',
      desc: 'Swasthya AI extracts onset, provocation, quality, radiation, severity, and timing, cross-checking allergies and prior prescription OCR slips.',
      icon: HeartPulse,
    },
    {
      step: '03',
      title: 'Physician Briefing Ready',
      desc: 'The doctor receives a structured FHIR R4 clinical summary, provisional differential options, and red-flag alerts in 30 seconds before consultation.',
      icon: Stethoscope,
    },
  ];

  const patientBenefits = [
    'Zero language barriers — speak freely in your regional dialect',
    'No tedious paper form-filling in noisy hospital waiting areas',
    'Full transparency and digital ownership of your ABDM health locker',
    'Never lose prior prescriptions or past surgical discharge notes',
  ];

  const doctorBenefits = [
    'Saves 60%+ of routine documentation and typing time per consultation',
    'Pre-structured OPQRST symptom timeline available before patient sits down',
    'Automated red-flag alerts and adverse drug-to-drug interaction warnings',
    'More eye-contact and focused clinical decision-making with patients',
  ];

  return (
    <div id="about-page-container" className="min-h-[calc(100vh-80px)] w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── TOP SECTION: ABOUT SWASTHYA AI & MISSION ── */}
      <section className="mb-14 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>About Swasthya AI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
              Transforming Healthcare Communication{' '}
              <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                Through Voice & Empathy
              </span>
            </h1>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-2 text-blue-600 font-bold mb-1">
                  <Target className="w-4 h-4" />
                  <span>Project Purpose</span>
                </div>
                <p>
                  In high-volume public hospitals and busy outpatient clinics, doctors often have barely 2 to 3 minutes per consultation. Doctors are forced to divide attention between looking at the patient and typing notes into software, while patients struggle with language barriers and lost medical receipts. Swasthya AI solves this foundational bottleneck.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-2 text-teal-600 font-bold mb-1">
                  <HeartPulse className="w-4 h-4" />
                  <span>Our Mission</span>
                </div>
                <p>
                  Our mission is to democratize clinical intake across India and emerging healthcare systems by providing an intuitive, voice-first intelligent bridge that restores quality time and human empathy to the doctor-patient relationship.
                </p>
              </div>
            </div>
          </div>

          {/* Simple Healthcare AI Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-tr from-sky-50 via-teal-50 to-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-lg relative">
              <DoctorIllustrationHero className="w-full h-auto" />
              <div className="mt-4 text-center">
                <span className="text-xs font-bold text-slate-700 block">AI-Assisted Clinical Intake Prototype</span>
                <span className="text-[11px] text-slate-500">Smart India Hackathon Prototype Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW THE SYSTEM WORKS (3-Step Flow) ── */}
      <section className="mb-14 text-left">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How the System Works</h2>
          <p className="text-sm text-slate-600">
            A seamless three-step pipeline converting spontaneous speech into verified EHR documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const IconComp = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative group hover:border-blue-300 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── BENEFITS SECTION (Patients vs Doctors) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
        {/* Benefits for Patients */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Benefits for Patients</h3>
              <p className="text-xs text-slate-500">Accessible, comfortable, and dignified care</p>
            </div>
          </div>
          <ul className="space-y-3 pt-2">
            {patientBenefits.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits for Doctors */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Benefits for Doctors</h3>
              <p className="text-xs text-slate-500">High efficiency with clinical accuracy</p>
            </div>
          </div>
          <ul className="space-y-3 pt-2">
            {doctorBenefits.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FOOTER NAVIGATION ── */}
      <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <span>Swasthya AI • Better Communication. Better Healthcare.</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/features')}
            className="font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Explore All Features</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
