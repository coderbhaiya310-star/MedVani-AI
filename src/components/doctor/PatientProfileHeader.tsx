import React from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Globe,
  ShieldCheck,
  FileText,
  Printer,
  Copy,
  Plus,
  Stethoscope,
  Activity,
  AlertCircle,
  FilePlus2,
} from 'lucide-react';
import { PatientProfile, StructuredClinicalSummary } from '../../types';

interface PatientProfileHeaderProps {
  patient: PatientProfile;
  summary: StructuredClinicalSummary;
  priority?: 'critical' | 'urgent' | 'routine';
  onBackToQueue: () => void;
  onOpenTodaysConsultation: () => void;
  onOpenAddReport: () => void;
  onPrintRecord: () => void;
  onCopyClinicalNote: () => void;
  copySuccess?: boolean;
}

export const PatientProfileHeader: React.FC<PatientProfileHeaderProps> = ({
  patient,
  summary,
  priority = 'routine',
  onBackToQueue,
  onOpenTodaysConsultation,
  onOpenAddReport,
  onPrintRecord,
  onCopyClinicalNote,
  copySuccess = false,
}) => {
  // Approximate DOB calculation from age
  const birthYear = new Date().getFullYear() - patient.age;
  const approximateDOB = `~${birthYear} (Age ${patient.age} yrs)`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Bar: Back Action & Fast Buttons */}
      <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            id="back-to-queue-btn"
            onClick={onBackToQueue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Patient Queue</span>
          </button>

          <span className="text-slate-400 text-xs hidden sm:inline">|</span>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            EHR Electronic Health Record • ABHA Connected
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="header-start-consult-btn"
            onClick={onOpenTodaysConsultation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Today's Consultation</span>
          </button>

          <button
            id="header-add-report-btn"
            onClick={onOpenAddReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>+ Add Today's Report</span>
          </button>

          <button
            id="header-copy-btn"
            onClick={onCopyClinicalNote}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="Copy formatted clinical summary for Hospital EMR"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Copied!' : 'Copy EMR'}</span>
          </button>

          <button
            id="header-print-btn"
            onClick={onPrintRecord}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="Print Official Clinical Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Patient Profile Demographics Grid */}
      <div className="p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main Identity */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-black text-xl shrink-0">
              {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : 'P'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {patient.fullName || 'Patient Record'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {patient.gender} • {patient.age} Yrs
                </span>
                {priority === 'critical' && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                    CRITICAL
                  </span>
                )}
                {priority === 'urgent' && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                    URGENT
                  </span>
                )}
              </div>

              {/* Demographics row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  ID: <strong className="font-mono text-slate-800">{patient.id}</strong>
                </span>
                {patient.hospitalMrn && (
                  <span>
                    MRN: <strong className="font-mono text-slate-800">{patient.hospitalMrn}</strong>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.phoneNumber || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Language: <strong className="text-slate-800 capitalize">{patient.preferredLanguage}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Reg: <strong>{new Date(patient.registrationDate || Date.now()).toLocaleDateString()}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* ABHA Badge & Consent Status */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0 bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl">
            {patient.abhaId ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ABHA ID: {patient.abhaId}</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                ABHA: Not linked
              </div>
            )}
            <span className="text-[11px] text-slate-500">
              Audio Consent: <strong className="text-emerald-700">Verified & Recorded</strong>
            </span>
          </div>
        </div>

        {/* CHIEF COMPLAINT SECTION */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Activity className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
              Chief Complaint
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
              {summary.chiefComplaint || 'Pending clinical assessment'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
