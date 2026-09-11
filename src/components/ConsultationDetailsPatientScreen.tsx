import React from 'react';
import {
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  AlertCircle,
  Activity,
  User,
} from 'lucide-react';
import { CaseTakingSession } from '../types';

interface ConsultationDetailsPatientScreenProps {
  session: CaseTakingSession;
  onBack: () => void;
  onViewConversation: () => void;
}

export const ConsultationDetailsPatientScreen: React.FC<ConsultationDetailsPatientScreenProps> = ({
  session,
  onBack,
  onViewConversation,
}) => {
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
          <span>Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6 flex-1 text-left">
        {/* Main Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Abdominal Pain
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reviewed by Doctor</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              5 Sep 2025
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              11:30 AM
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-700">Dr. Rajesh Sharma</span>
          </div>
        </div>

        {/* AI Clinical Summary Card */}
        <div className="bg-[#F0F7FF] rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Clinical Summary</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            Patient reports abdominal pain for 1 day, located in center of abdomen.
            Associated symptom: nausea. No fever or vomiting. Non-urgent presentation.
          </p>
        </div>

        {/* Relevant Symptoms List */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide text-xs text-slate-500">
            Relevant Symptoms & Observations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Chief Complaint</div>
              <div className="text-xs font-bold text-slate-800">Mid-abdominal pain (cramping)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Duration & Onset</div>
              <div className="text-xs font-bold text-slate-800">1 day (Started yesterday morning)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Associated Symptoms</div>
              <div className="text-xs font-bold text-slate-800">Mild nausea, decreased appetite</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Negative Symptoms</div>
              <div className="text-xs font-bold text-slate-800">No vomiting, no high fever</div>
            </div>
          </div>
        </div>

        {/* View Full Conversation Link */}
        <div className="text-center pt-2">
          <button
            onClick={onViewConversation}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 transition cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
          >
            <FileText className="w-4 h-4" />
            <span>View Full Conversation Transcript</span>
          </button>
        </div>
      </main>
    </div>
  );
};
