import React, { useState } from 'react';
import {
  Pill,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CaseTakingSession, MedicationReconciliationItem, PrescriptionItem } from '../../types';

interface MedicationsTabProps {
  session: CaseTakingSession;
  onUpdateMedications?: (reconciliationList: MedicationReconciliationItem[]) => void;
}

export const MedicationsTab: React.FC<MedicationsTabProps> = ({ session, onUpdateMedications }) => {
  const reconList = session.summary.medicationReconciliation || [];
  const consultations = session.consultations || [];

  // Extract all active prescriptions across consultations
  const allPrescriptions: { rx: PrescriptionItem; date: string; doctor: string }[] = [];
  consultations.forEach((c) => {
    (c.prescriptions || []).forEach((p) => {
      allPrescriptions.push({ rx: p, date: c.date, doctor: c.doctorName });
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-900">
              Medication Profile & Cross-Reconciliation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-verifying patient self-reported medication intake against uploaded prescriptions and clinical history
          </p>
        </div>
      </div>

      {/* MEDICATION RECONCILIATION TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-slate-700">
            Medication Reconciliation & Adherence Audit ({reconList.length} items)
          </span>
          <span className="text-[11px] text-slate-500">
            Cross-matched from Voice Intake vs OCR Prescriptions
          </span>
        </div>

        {reconList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No medication reconciliation items found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="p-3">Medication Name</th>
                  <th className="p-3">Patient-Reported Intake</th>
                  <th className="p-3">Prescription Document Record</th>
                  <th className="p-3">Adherence Status</th>
                  <th className="p-3">Clinical Notes & Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconList.map((item) => {
                  const isStopped = item.adherenceStatus === 'stopped_by_patient';
                  const isMismatch = item.adherenceStatus === 'dose_mismatch';
                  const isAdherent = item.adherenceStatus === 'adherent';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        {item.medicationName}
                      </td>
                      <td className="p-3 text-slate-700">
                        <span className="font-semibold block">{item.patientReportedDose || 'None'}</span>
                        <span className="text-[11px] text-slate-500">{item.patientReportedFrequency}</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        <span className="font-semibold block">{item.documentPrescribedDose || 'N/A'}</span>
                        <span className="text-[11px] text-slate-500">{item.documentPrescribedFrequency}</span>
                        {item.sourceDocumentTitle && (
                          <span className="block text-[10px] text-slate-400 italic">
                            Source: {item.sourceDocumentTitle}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {isStopped ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 inline-block">
                            ⛔ STOPPED BY PATIENT
                          </span>
                        ) : isMismatch ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 inline-block">
                            ⚠️ DOSE MISMATCH
                          </span>
                        ) : isAdherent ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                            ✓ COMPLIANT
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 inline-block">
                            {item.adherenceStatus}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 text-[11px] max-w-xs">
                        {item.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECENT PRESCRIPTION ARCHIVES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Historical Prescriptions Issued ({allPrescriptions.length} items)</span>
        </h3>

        {allPrescriptions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No prescriptions issued in previous consultations.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {allPrescriptions.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.rx.medicineName}</span>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                    {item.date}
                  </span>
                </div>
                <p className="text-slate-700">
                  Dosage: <strong>{item.rx.dosage}</strong> • {item.rx.frequency} ({item.rx.duration})
                </p>
                <p className="text-[11px] text-slate-500">
                  Instructions: {item.rx.instructions} • Prescribed by {item.doctor}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
