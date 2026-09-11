import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, FileText, ArrowRight, ShieldAlert } from 'lucide-react';
import { ConflictFlag } from '../types';

interface ConflictFlagsBannerProps {
  conflicts: ConflictFlag[];
  onUpdateConflictStatus: (
    conflictId: string,
    status: 'pending' | 'patient_correct' | 'document_correct' | 'reconciled' | 'followup_needed',
    doctorNote?: string
  ) => void;
}

export const ConflictFlagsBanner: React.FC<ConflictFlagsBannerProps> = ({
  conflicts,
  onUpdateConflictStatus,
}) => {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <h4 className="font-bold text-xs text-emerald-900">Clinical Consistency Verified</h4>
          <p className="text-[11px] text-emerald-700">
            No clinical contradictions or medication discrepancies detected between the patient interview and uploaded medical records.
          </p>
        </div>
      </div>
    );
  }

  const highSeverityCount = conflicts.filter((c) => c.severity === 'high').length;

  return (
    <div className="space-y-4">
      {/* Banner Title */}
      <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-rose-950">
                Clinical Conflict Detection Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-200/70 text-rose-900 text-xs font-bold">
                {conflicts.length} Discrepanc{conflicts.length > 1 ? 'ies' : 'y'} Flagged
              </span>
            </div>
            <p className="text-xs text-rose-800">
              The AI auditor cross-verified the verbal conversation against uploaded prescriptions and hospital reports.
            </p>
          </div>
        </div>

        {highSeverityCount > 0 && (
          <span className="text-xs font-extrabold text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-300 shadow-2xs animate-pulse">
            ⚠️ {highSeverityCount} High Clinical Risk Discrepanc{highSeverityCount > 1 ? 'ies' : 'y'}
          </span>
        )}
      </div>

      {/* Individual Conflict Cards */}
      <div className="space-y-3">
        {conflicts.map((conflict) => {
          const isHigh = conflict.severity === 'high';
          const isMedium = conflict.severity === 'medium';

          return (
            <div
              key={conflict.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
                isHigh
                  ? 'bg-white border-rose-300 ring-1 ring-rose-200'
                  : isMedium
                  ? 'bg-white border-amber-300'
                  : 'bg-white border-blue-200'
              }`}
            >
              {/* Top: Title & Severity */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800'
                        : isMedium
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {conflict.severity} Risk: {conflict.category}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{conflict.title}</h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Doctor Status:</span>
                  <select
                    value={conflict.doctorResolution || 'pending'}
                    onChange={(e) => onUpdateConflictStatus(conflict.id, e.target.value as any)}
                    className="text-xs font-bold rounded-lg border border-slate-200 px-2 py-1 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="pending">⚠️ Pending Review</option>
                    <option value="reconciled">✅ Reconciled with Patient</option>
                    <option value="patient_correct">👤 Patient Statement Verified</option>
                    <option value="document_correct">📄 Document Record Enforced</option>
                    <option value="followup_needed">🔍 Follow-up Investigation Required</option>
                  </select>
                </div>
              </div>

              {/* Side-by-Side Comparison: Verbal Claim vs Medical Record */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                {/* Left: Patient Spoken Claim */}
                <div className="bg-rose-50/50 rounded-xl p-3.5 border border-rose-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Patient Verbal Statement:
                  </span>
                  <p className="text-xs text-rose-950 font-medium italic leading-relaxed">
                    "{conflict.patientClaim}"
                  </p>
                </div>

                {/* Right: Document Evidence */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    Medical Record Evidence:
                  </span>
                  <p className="text-xs text-slate-800 font-mono font-medium leading-relaxed">
                    {conflict.documentEvidence}
                  </p>
                </div>
              </div>

              {/* Clinical Impact & Rationale */}
              <div className="mt-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Clinical Impact: </strong>
                  <span>{conflict.clinicalImpact}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
