import React, { useState } from 'react';
import {
  Mic,
  FileText,
  Clock,
  ShieldCheck,
  User,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Upload,
  HeartPulse,
  Volume2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Hospital,
  Activity,
  FileCheck,
  Stethoscope,
} from 'lucide-react';
import { AuthUser, CaseTakingSession, LanguageCode, PatientProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { useLanguage } from '../contexts/LanguageContext';
import { speakTextAloud, stopSpeaking } from '../utils/speechUtils';

interface PatientPortalDashboardProps {
  user: AuthUser;
  session: CaseTakingSession;
  onStartVoiceIntake: () => void;
  onOpenDocuments: () => void;
  onOpenTimeline: () => void;
  onOpenProfile: () => void;
  onUpdateConsent: (granted: boolean) => void;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const PatientPortalDashboard: React.FC<PatientPortalDashboardProps> = ({
  user,
  session,
  onStartVoiceIntake,
  onOpenDocuments,
  onOpenTimeline,
  onOpenProfile,
  onUpdateConsent,
  onSelectLanguage,
}) => {
  const [isSpeakingConsent, setIsSpeakingConsent] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'cases' | 'documents' | 'timeline' | 'profile'>('home');
  const { openLanguageSelector, language, setLanguage } = useLanguage();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === (session.activeLanguage || language)) || SUPPORTED_LANGUAGES[0];

  const consentNoticeText =
    session.activeLanguage === 'hi'
      ? 'मैं अपनी स्वास्थ्य जानकारी और पिछले मेडिकल रिकॉर्ड स्वस्थ्य एआई और मेरे डॉक्टर के साथ साझा करने की सहमति देता हूँ।'
      : 'I voluntarily consent to share my health difficulties, symptoms, and medical records with Swasthya AI and my consulting physician for clinical intake and diagnosis.';

  const handleListenToConsent = () => {
    if (isSpeakingConsent) {
      stopSpeaking();
      setIsSpeakingConsent(false);
    } else {
      setIsSpeakingConsent(true);
      speakTextAloud(
        consentNoticeText,
        session.activeLanguage,
        0.84,
        () => setIsSpeakingConsent(true),
        () => setIsSpeakingConsent(false)
      );
    }
  };

  const hasRedFlags = session.summary?.redFlagsOrUrgentAlerts && session.summary.redFlagsOrUrgentAlerts.length > 0;
  const isCaseCompleted = session.conversationPhase === 'completed' || session.conversationPhase === 'wrap_up';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 text-left">
      {/* Patient Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Patient Health Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {session.patient.fullName || user.fullName}
            </h1>

            <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl font-medium">
              Start your voice case-taking interview before meeting your doctor. Your answers are automatically organized into structured clinical notes and cross-checked with your medical records.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 px-3 py-1 rounded-lg font-semibold">
                Age: {session.patient.age || user.age || '—'} yrs • {session.patient.gender || user.gender || 'Not specified'}
              </span>
              {session.patient.abhaId && (
                <span className="bg-teal-400/20 text-teal-200 px-3 py-1 rounded-lg font-mono font-medium border border-teal-400/30">
                  ABHA: {session.patient.abhaId}
                </span>
              )}
              <button
                type="button"
                onClick={openLanguageSelector}
                className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Change language"
              >
                <span>Language: <strong className="text-teal-200">{currentLang.nativeName}</strong></span>
                <span className="text-[11px] text-teal-300">({currentLang.englishName})</span>
                <span className="text-[10px] bg-white/20 px-1 rounded text-white ml-1">Change</span>
              </button>
            </div>
          </div>

          {/* Big Voice Action CTA */}
          <div className="flex flex-col items-center sm:items-end justify-center">
            <button
              id="patient-start-intake-btn"
              onClick={onStartVoiceIntake}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-slate-950 animate-pulse" />
              </div>
              <span>
                {session.messages.length > 1 ? 'Resume Voice Interview' : 'Start New Voice Case'}
              </span>
            </button>
            <span className="text-[11px] text-teal-200/80 mt-1.5 font-medium">
              100% Hands-Free • Spoken in {currentLang.name}
            </span>
          </div>
        </div>
      </div>

      {/* Informed Consent Status Banner */}
      {!session.patient.consentGiven ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>Step 1: Patient Informed Consent Required</span>
            </div>
            <button
              onClick={handleListenToConsent}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                isSpeakingConsent
                  ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeakingConsent ? 'Reading Aloud...' : 'Listen to Consent'}</span>
            </button>
          </div>

          <p className="text-xs text-amber-950 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-amber-200">
            "{consentNoticeText}"
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <p className="text-xs text-amber-800">
              Please grant consent before conducting the AI voice clinical interview.
            </p>
            <button
              id="patient-grant-consent-btn"
              onClick={() => onUpdateConsent(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Understand and Consent (सहमत हूँ)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Digital Consent Verified for AI Voice Case Taking (ABDM Compliant)</span>
          </div>
          <button
            onClick={() => onUpdateConsent(false)}
            className="text-slate-500 hover:text-slate-700 underline text-[11px] cursor-pointer"
          >
            Manage Consent
          </button>
        </div>
      )}

      {/* Red Flag Emergency Warning if active */}
      {hasRedFlags && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-rose-950">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h2 className="font-bold text-xs text-rose-900">Urgent Symptoms Noticed in Intake</h2>
            <p className="text-xs text-rose-800">
              Your reported symptoms include potential high-priority items. Please proceed to the emergency department or alert hospital triage staff.
            </p>
          </div>
        </div>
      )}

      {/* Primary Patient Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Voice Interview */}
        <div
          onClick={onStartVoiceIntake}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mic className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
              Voice Case Intake
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Speak naturally in {currentLang.name}. AI explores symptoms, pain character, and medication history hands-free.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>{session.messages.length} Spoken Dialogues</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Medical Documents */}
        <div
          onClick={onOpenDocuments}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 group-hover:text-indigo-700 transition-colors">
              My Medical Records ({session.documents.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload past prescriptions, lab tests, and discharge summaries for instant OCR and drug reconciliation.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
            <span>Upload or View Records</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Health Timeline */}
        <div
          onClick={onOpenTimeline}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              Longitudinal Timeline
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              View your multi-year medical history chronologically across hospitals, diagnoses, and surgeries.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>View Timeline</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Active Case Summary & Doctor Submission Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Current Health Difficulties & Case Status</h2>
              <p className="text-xs text-slate-500">Structured patient recap ready for your doctor's OPD visit</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Phase: {session.conversationPhase.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Chief Complaint & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Chief Complaint (मुख्य समस्या):
            </span>
            <p className="text-sm font-semibold text-slate-900">
              {session.summary?.chiefComplaint || session.patient.chiefComplaint || 'No symptoms recorded yet. Click above to begin your intake.'}
            </p>
            {session.summary?.historyOfPresentIllness?.characterAndSeverity && (
              <p className="text-xs text-slate-600">
                <strong>Severity & Character:</strong> {session.summary.historyOfPresentIllness.characterAndSeverity}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Doctor Review & OPD Status:
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Prepared for Dr. Priya Nair (General Internal Medicine & Cardiology)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Your doctor will review your AI intake notes, reconciled medications, and document conflicts during your consultation.
            </p>
          </div>
        </div>

        {/* Medication Reconciliation Highlights */}
        {session.summary?.medicationReconciliation && session.summary.medicationReconciliation.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Active Medications Mentioned in Case:
            </span>
            <div className="flex flex-wrap gap-2">
              {session.summary.medicationReconciliation.map((med, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2"
                >
                  <span className="font-bold">{med.medicationName}</span>
                  <span className="text-[10px] text-slate-500">{med.adherenceStatus}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
