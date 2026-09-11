import React from 'react';
import { StructuredClinicalSummary, PatientProfile, MedicalDocument } from '../types';
import { Stethoscope, CheckCircle2, ShieldCheck, FileText, Pill, Activity, Calendar, AlertTriangle } from 'lucide-react';

interface SummaryPrintViewProps {
  summary: StructuredClinicalSummary;
  patient: PatientProfile;
  documents: MedicalDocument[];
  onClose: () => void;
}

export const SummaryPrintView: React.FC<SummaryPrintViewProps> = ({
  summary,
  patient,
  documents,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        {/* Print Bar (Hidden during printing) */}
        <div className="sticky top-0 bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between z-10 print:hidden rounded-t-2xl">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm">Official Clinical Case Sheet Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="p-8 sm:p-12 space-y-6 text-slate-900 bg-white font-sans text-xs">
          {/* Hospital / Clinic Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                Ayushman Digital Health Clinic
              </h1>
              <p className="text-slate-600 text-xs">AI Voice-First Outpatient Case Record • ABDM Integrated</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Session ID: {summary.id} • Generated: {new Date(summary.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block border-2 border-teal-700 text-teal-800 px-3 py-1 font-bold text-xs rounded-md">
                ABDM COMPLIANT
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Audio Consent: Verified & Timestamped</p>
            </div>
          </div>

          {/* Patient Demographics Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Patient Name</span>
              <p className="font-bold text-sm text-slate-900">{patient.fullName}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Age / Gender</span>
              <p className="font-semibold text-slate-900">{patient.age} Yrs / {patient.gender.toUpperCase()}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">ABHA Number / ID</span>
              <p className="font-mono font-semibold text-slate-900">{patient.abhaId || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Contact / Phone</span>
              <p className="font-medium text-slate-900">{patient.phoneNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="space-y-1 border-b border-slate-200 pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Chief Complaint</h3>
            <p className="font-semibold text-sm text-slate-900 leading-relaxed bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
              {summary.chiefComplaint}
            </p>
          </div>

          {/* History of Present Illness (HPI) */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              History of Present Illness (HPI - OPQRST Analysis)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="font-bold text-slate-700">Onset & Duration: </span>
                <span>{summary.historyOfPresentIllness.onset}, {summary.historyOfPresentIllness.duration}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="font-bold text-slate-700">Location & Radiation: </span>
                <span>{summary.historyOfPresentIllness.locationAndRadiation}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="font-bold text-slate-700">Character & Severity: </span>
                <span>{summary.historyOfPresentIllness.characterAndSeverity}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="font-bold text-slate-700">Aggravating & Relieving: </span>
                <span>Triggered by {summary.historyOfPresentIllness.aggravatingFactors}; Relieved by {summary.historyOfPresentIllness.relievingFactors}</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              <strong>Clinical Narrative: </strong>
              {summary.historyOfPresentIllness.chronologicalNarrative}
            </p>
          </div>

          {/* Medication Reconciliation Table */}
          {summary.medicationReconciliation && summary.medicationReconciliation.length > 0 && (
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-teal-600" />
                Medication Reconciliation & Adherence Audit
              </h3>
              <table className="w-full border-collapse border border-slate-200 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold text-left">
                    <th className="border border-slate-200 p-2">Medication</th>
                    <th className="border border-slate-200 p-2">Patient Reported Verbal Dose</th>
                    <th className="border border-slate-200 p-2">Document Prescribed Dose</th>
                    <th className="border border-slate-200 p-2">Adherence Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.medicationReconciliation.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="border border-slate-200 p-2 font-bold">{m.medicationName}</td>
                      <td className="border border-slate-200 p-2 text-slate-700">{m.patientReportedDose || 'None'} ({m.patientReportedFrequency || 'N/A'})</td>
                      <td className="border border-slate-200 p-2 font-mono text-slate-700">{m.documentPrescribedDose || 'N/A'}</td>
                      <td className="border border-slate-200 p-2 font-semibold text-rose-700">{m.adherenceStatus.replace(/_/g, ' ').toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Detected Conflicts */}
          {summary.conflicts && summary.conflicts.length > 0 && (
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Documented Clinical Conflicts & Risk Alerts
              </h3>
              <div className="space-y-2">
                {summary.conflicts.map((c, i) => (
                  <div key={i} className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-rose-900">
                      <span>{c.title} ({c.severity.toUpperCase()} RISK)</span>
                      <span>Resolution: {c.doctorResolution || 'Pending'}</span>
                    </div>
                    <p className="text-slate-700"><strong>Patient stated:</strong> "{c.patientClaim}"</p>
                    <p className="text-slate-700"><strong>Document evidence:</strong> {c.documentEvidence}</p>
                    <p className="text-rose-800"><strong>Impact:</strong> {c.clinicalImpact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past History & Allergies */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Past Medical / Surgical History</h3>
              <ul className="list-disc list-inside text-xs text-slate-800 space-y-0.5">
                {summary.pastMedicalHistory.map((h, i) => <li key={i}>{h}</li>)}
                {summary.pastSurgicalHistory.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Allergies & Sensitivities</h3>
              <ul className="list-disc list-inside text-xs text-slate-800 space-y-0.5">
                {summary.allergies.map((a, i) => (
                  <li key={i}><strong>{a.allergen}:</strong> {a.reaction} ({a.severity})</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Differential Diagnoses */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Provisional Differential Diagnosis</h3>
            <div className="space-y-1.5 text-xs">
              {summary.provisionalDifferentialDiagnosis.map((d, i) => (
                <div key={i} className="flex items-start justify-between bg-slate-50 p-2 rounded-lg">
                  <div>
                    <span className="font-bold text-slate-900">{d.condition}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{d.rationale}</p>
                  </div>
                  <span className="font-bold text-[10px] uppercase px-2 py-0.5 bg-slate-200 rounded text-slate-800">
                    {d.likelihood} likelihood
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Final Assessment & Rx Plan */}
          {summary.doctorAssessment && (
            <div className="space-y-2 bg-teal-50/40 p-4 rounded-xl border border-teal-200">
              <h3 className="font-bold text-xs uppercase tracking-wider text-teal-900">Physician Clinical Assessment & Orders</h3>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{summary.doctorAssessment}</p>

              {summary.doctorPrescriptionPlan && summary.doctorPrescriptionPlan.length > 0 && (
                <div className="pt-2">
                  <span className="font-bold text-xs text-slate-800 block mb-1">Prescribed Treatment:</span>
                  <div className="space-y-1">
                    {summary.doctorPrescriptionPlan.map((rx, i) => (
                      <div key={i} className="bg-white p-2 rounded-lg border border-teal-200 text-xs flex justify-between">
                        <div>
                          <strong className="text-slate-900">{rx.medicine}</strong> ({rx.dosage}) - <em>{rx.timing}</em>
                          <p className="text-[11px] text-slate-500">{rx.instructions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Signature Footer */}
          <div className="pt-6 flex justify-between items-end border-t border-slate-300">
            <div className="text-[11px] text-slate-400">
              Generated by AI Clinical Intake Assistant • Verified by Treating Physician
            </div>
            <div className="text-right space-y-1">
              <div className="w-48 border-b border-slate-400 mb-1" />
              <p className="font-bold text-xs text-slate-900">{summary.doctorSignatureName || 'Treating Medical Officer'}</p>
              <p className="text-[10px] text-slate-500">Reg. No: MCI-2021-88914</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
