import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowLeft,
  AlertTriangle,
  FileText,
  Edit3,
  CheckCircle2,
  Sparkles,
  Pill,
  Activity,
  Calendar,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';
import { CaseTakingSession } from '../types';

interface DoctorPatientCaseScreenProps {
  patientId?: string;
  onBack: () => void;
  onViewConversation: () => void;
  onAddNotes: () => void;
  onMarkReviewed?: () => void;
}

export const DoctorPatientCaseScreen: React.FC<DoctorPatientCaseScreenProps> = ({
  patientId,
  onBack,
  onViewConversation,
  onAddNotes,
  onMarkReviewed,
}) => {
  const [isReviewed, setIsReviewed] = useState(false);

  const handleMarkReviewed = () => {
    setIsReviewed(true);
    if (onMarkReviewed) onMarkReviewed();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900">Swasthya AI</span>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Queue</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6 flex-1 text-left">
        {/* Patient Header Card with Action Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">Priya Sharma</h1>
                {isReviewed ? (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reviewed</span>
                  </span>
                ) : (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Awaiting Doctor Review
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                28 years • Female • Primary Language: Hindi • Registered ID: PAT-1029
              </p>
            </div>

            {/* 3 Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onViewConversation}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>View Conversation</span>
              </button>

              <button
                onClick={onAddNotes}
                className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                <span>Add Notes</span>
              </button>

              <button
                onClick={handleMarkReviewed}
                disabled={isReviewed}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  isReviewed
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isReviewed ? 'Case Verified' : 'Mark as Reviewed'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Important Alerts Card */}
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 shadow-xs flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-800 uppercase tracking-wide">
              Important Clinical Alert
            </div>
            <p className="text-sm font-bold text-rose-950 mt-0.5">
              Severe pain reported (Doctor attention recommended)
            </p>
            <p className="text-xs text-rose-700 mt-1">
              Patient notes sudden aggravation when bending forward; acute abdomen red flags should be excluded.
            </p>
          </div>
        </div>

        {/* 2. AI Clinical Summary Card */}
        <div className="bg-[#F0F7FF] rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Structured Clinical Case Summary</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            Patient reports acute abdominal pain localized to the umbilical region for approximately 24 hours.
            Associated with intermittent nausea and mild weakness. Denies vomiting, diarrhea, hematochezia, or high fever.
            Patient self-administered Paracetamol 650mg with transient relief. Hemodynamically stable upon home self-check.
          </p>
        </div>

        {/* 3. Main Complaint & Symptoms Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Main Complaint */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Main Complaint</span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              Pain in center of abdomen since yesterday morning
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>Onset: Sudden, after breakfast</div>
              <div>Character: Cramping, progressive</div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Pill className="w-4 h-4 text-sky-600" />
              <span>Current & Prior Medications</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-800">Paracetamol 650mg</span>
                <span className="text-slate-500 text-[11px] block">Self-medicated yesterday evening (1 dose)</span>
              </div>
              <div className="text-xs text-slate-400">No known chronic daily prescriptions</div>
            </div>
          </div>
        </div>

        {/* Relevant Symptoms Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Relevant Symptoms Verified By Voice Case Taking
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <div className="text-[11px] text-teal-800 font-semibold">Nausea</div>
              <div className="font-bold text-teal-950 mt-0.5">Present (Mild)</div>
            </div>
            <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <div className="text-[11px] text-teal-800 font-semibold">Weakness</div>
              <div className="font-bold text-teal-950 mt-0.5">Reported</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-semibold">Vomiting</div>
              <div className="font-bold text-slate-800 mt-0.5">Absent (No)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-semibold">Fever</div>
              <div className="font-bold text-slate-800 mt-0.5">Absent (No)</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
