import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  FileText,
  Pill,
  Activity,
  HeartPulse,
  Search,
  ExternalLink,
} from 'lucide-react';
import { ConsultationRecord, CaseTakingSession } from '../../types';

interface PreviousHistoryTabProps {
  session: CaseTakingSession;
  onOpenConsultation?: (consultation: ConsultationRecord) => void;
}

export const PreviousHistoryTab: React.FC<PreviousHistoryTabProps> = ({ session }) => {
  const consultations = session.consultations || [];
  const [expandedId, setExpandedId] = useState<string | null>(
    consultations.length > 0 ? consultations[0].id : null
  );
  const [searchFilter, setSearchFilter] = useState('');

  const filteredConsultations = consultations.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.chiefComplaint.toLowerCase().includes(q) ||
      c.doctorName.toLowerCase().includes(q) ||
      c.assessment.toLowerCase().includes(q) ||
      c.date.includes(q) ||
      c.prescriptions.some((p) => p.medicineName.toLowerCase().includes(q))
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-900">
              Previous Medical Consultations & Encounters ({consultations.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological audit of outpatient visits, assessments, and historical prescriptions
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search diagnosis, medicine, doctor..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Consultations List */}
      {filteredConsultations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <FileText className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No previous consultations recorded</p>
          <p className="text-xs text-slate-400">
            Consultations recorded via the "Today's Consultation" tab will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((item, index) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  isExpanded ? 'border-teal-500 ring-1 ring-teal-200' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Row (Clickable) */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-xs shrink-0">
                      #{consultations.length - index}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {item.chiefComplaint}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          {item.date} {item.time && `• ${item.time}`}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                          <strong>{item.doctorName}</strong>
                        </span>
                        <span>
                          Assessment: <strong className="text-slate-800">{item.assessment || 'N/A'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="text-xs font-semibold text-slate-400">
                      {item.prescriptions?.length || 0} Rx • {item.vitals?.bloodPressure || 'BP recorded'}
                    </span>
                    <button className="p-1 rounded-lg bg-slate-100 text-slate-600">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/40 space-y-5">
                    {/* Vitals Grid */}
                    {item.vitals && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                          <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                          Recorded Vitals at Visit
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 text-xs">
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">BP</span>
                            <span className="font-bold text-slate-800">{item.vitals.bloodPressure || 'N/A'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Pulse</span>
                            <span className="font-bold text-slate-800">{item.vitals.pulse || 'N/A'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">SpO2</span>
                            <span className="font-bold text-slate-800">{item.vitals.spo2 || 'N/A'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Temp</span>
                            <span className="font-bold text-slate-800">{item.vitals.temperature || 'N/A'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Weight</span>
                            <span className="font-bold text-slate-800">{item.vitals.weight || 'N/A'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Resp Rate</span>
                            <span className="font-bold text-slate-800">{item.vitals.respiratoryRate || 'N/A'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Blood Sugar</span>
                            <span className="font-bold text-slate-800">{item.vitals.bloodSugar || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Clinical Notes & Physical Exam */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Clinical History & Current Symptoms
                        </span>
                        <p className="text-slate-800 leading-relaxed pt-1">
                          {item.clinicalHistory || item.currentSymptoms || 'No additional narrative noted.'}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Physical Examination
                        </span>
                        <p className="text-slate-800 leading-relaxed font-mono text-[11px] whitespace-pre-line pt-1">
                          {item.physicalExamination || 'Systemic examination normal.'}
                        </p>
                      </div>
                    </div>

                    {/* Relevant Findings & Assessment */}
                    <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200 space-y-2 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                          Authoritative Doctor Assessment
                        </span>
                        <p className="font-bold text-sm text-slate-900 leading-snug">
                          {item.assessment}
                        </p>
                      </div>

                      {item.relevantFindings && (
                        <div className="pt-2 border-t border-teal-100 text-slate-700">
                          <span className="font-bold text-slate-800">Findings: </span>
                          {item.relevantFindings}
                        </div>
                      )}
                    </div>

                    {/* Prescriptions Table */}
                    {item.prescriptions && item.prescriptions.length > 0 && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-teal-600" />
                          <span className="font-bold text-xs text-slate-900">
                            Prescriptions Issued ({item.prescriptions.length} items)
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                                <th className="p-2.5">Medicine Name</th>
                                <th className="p-2.5">Dosage</th>
                                <th className="p-2.5">Frequency</th>
                                <th className="p-2.5">Duration</th>
                                <th className="p-2.5">Instructions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.prescriptions.map((rx) => (
                                <tr key={rx.id} className="hover:bg-slate-50/50">
                                  <td className="p-2.5 font-bold text-slate-900">{rx.medicineName}</td>
                                  <td className="p-2.5 text-slate-700">{rx.dosage}</td>
                                  <td className="p-2.5 text-slate-700">{rx.frequency}</td>
                                  <td className="p-2.5 text-slate-700">{rx.duration}</td>
                                  <td className="p-2.5 text-slate-600">{rx.instructions}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Treatment Advice & Follow-Up */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Treatment & Lifestyle Advice
                        </span>
                        <p className="text-slate-800 leading-relaxed whitespace-pre-line pt-1">
                          {item.treatmentAdvice || 'Routine outpatient care.'}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Follow-Up & Warnings
                        </span>
                        <p className="text-slate-800 leading-relaxed pt-1">
                          {item.followUpInstructions}
                          {item.followUpDays ? ` (${item.followUpDays} days)` : ''}
                        </p>
                        {item.additionalNotes && (
                          <p className="text-slate-600 italic pt-1 border-t border-slate-100">
                            Notes: {item.additionalNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
