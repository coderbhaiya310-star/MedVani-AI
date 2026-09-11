import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Languages,
  Sparkles,
  History,
  FileText,
  Activity,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'voice-intake',
      icon: Mic,
      title: 'Voice-based Patient Intake',
      description:
        'Conversational, hands-free intake dialog allowing patients to speak naturally about symptoms, duration, and severity in their mother tongue without tedious paperwork.',
      badge: 'Real-Time Voice',
      color: 'from-blue-500 to-sky-500',
      bgColor: 'bg-blue-50/80',
      iconColor: 'text-blue-600',
    },
    {
      id: 'multilingual',
      icon: Languages,
      title: 'Multilingual Support',
      description:
        'Native support for 13+ Indian regional languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and Hinglish with automated clinical translation.',
      badge: '13+ Languages',
      color: 'from-teal-500 to-emerald-500',
      bgColor: 'bg-teal-50/80',
      iconColor: 'text-teal-600',
    },
    {
      id: 'clinical-assistance',
      icon: Sparkles,
      title: 'AI Clinical Assistance',
      description:
        'Intelligent OPQRST symptom structuring, provisional differential diagnosis suggestions, and relevant clarifying inquiries prepared for attending doctors.',
      badge: 'Decision Support',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50/80',
      iconColor: 'text-purple-600',
    },
    {
      id: 'patient-history',
      icon: History,
      title: 'Patient History',
      description:
        'Chronological longitudinal timelines organizing past conditions, prior surgeries, chronic illnesses, and family medical histories in unified view.',
      badge: 'Longitudinal Records',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50/80',
      iconColor: 'text-amber-600',
    },
    {
      id: 'prescription-history',
      icon: FileText,
      title: 'Prescription History',
      description:
        'Optical Character Recognition (OCR) and multimodal analysis of physical prescriptions, lab slips, and discharge summaries with automatic drug conflict flags.',
      badge: 'OCR & Drug Safety',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50/80',
      iconColor: 'text-cyan-600',
    },
    {
      id: 'realtime-info',
      icon: Activity,
      title: 'Real-time Information',
      description:
        'Dynamic live extraction that highlights red flags, urgent vital warnings, and high-priority patient escalations before the physician consultation begins.',
      badge: 'Instant Triage',
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50/80',
      iconColor: 'text-rose-600',
    },
    {
      id: 'secure-data',
      icon: ShieldCheck,
      title: 'Secure Patient Data',
      description:
        'Built ground-up with ABDM FHIR R4 compliance, end-to-end data encryption, granular consent logs, and zero unauthorized third-party record exposure.',
      badge: 'ABDM & HIPAA Ready',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50/80',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'doctor-dashboard',
      icon: LayoutDashboard,
      title: 'Doctor Dashboard',
      description:
        'Comprehensive physician OPD console displaying prioritized queues, 30-second pre-consultation briefings, and instant 1-click EHR export capabilities.',
      badge: 'Physician Console',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-indigo-50/80',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div id="features-page-container" className="min-h-[calc(100vh-80px)] w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── HEADER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Swasthya AI Platform Features</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Modern Clinical Intelligence{' '}
          <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
            Engineered for Fast OPDs
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Explore the 8 foundational capabilities designed to eliminate doctor burnout, bridge linguistic barriers, and give patients dignified, instant medical consultations.
        </p>
      </div>

      {/* ── 8 FEATURE CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {features.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              id={`feature-card-${item.id}`}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.06)] hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                {/* Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform shadow-xs`}
                  >
                    <IconComp className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <CheckCircle2 className="w-4 h-4 text-teal-600 opacity-60 group-hover:opacity-100" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CALL TO ACTION SECTION ── */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to experience Swasthya AI in action?</h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Test the hands-free multilingual clinical conversation or preview physician OPD queues immediately.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-6 py-3.5 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Open Clinical Portal</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all cursor-pointer"
          >
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
