import React, { useState } from 'react';
import {
  Search,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  FileText,
  Stethoscope,
  Activity,
  Filter,
} from 'lucide-react';
import { CaseTakingSession } from '../../types';

interface PatientQueueListProps {
  allSessions: CaseTakingSession[];
  activeSessionId: string;
  onSelectPatient: (session: CaseTakingSession) => void;
  doctorName?: string;
  departmentName?: string;
}

export const PatientQueueList: React.FC<PatientQueueListProps> = ({
  allSessions,
  activeSessionId,
  onSelectPatient,
  doctorName = 'Dr. Rajesh Sharma, MD',
  departmentName = 'General & Internal Medicine OPD',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'critical' | 'urgent' | 'routine'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'completed' | 'in_review'>('all');

  // Filter patients based on search and filters
  const filteredPatients = allSessions.filter((session) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      session.patient.fullName.toLowerCase().includes(q) ||
      session.patient.id.toLowerCase().includes(q) ||
      (session.patient.abhaId && session.patient.abhaId.toLowerCase().includes(q)) ||
      (session.patient.phoneNumber && session.patient.phoneNumber.includes(q)) ||
      (session.summary.chiefComplaint && session.summary.chiefComplaint.toLowerCase().includes(q));

    const matchesPriority =
      filterPriority === 'all' ||
      session.priority === filterPriority ||
      (filterPriority === 'critical' && session.summary.redFlagsOrUrgentAlerts?.length > 0);

    const hasTodayConsultation = (session.consultations || []).some(
      (c) => c.date === '2026-08-29' || c.status === 'completed'
    );
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && hasTodayConsultation) ||
      (filterStatus === 'ready' && !hasTodayConsultation && session.messages?.length > 2) ||
      (filterStatus === 'in_review' && session.summary.intakeStage === 'doctor_reviewed');

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const totalPatients = allSessions.length;
  const criticalCount = allSessions.filter(
    (s) => s.priority === 'critical' || s.priority === 'urgent' || s.summary.redFlagsOrUrgentAlerts?.length > 0
  ).length;
  const completedCount = allSessions.filter((s) =>
    (s.consultations || []).some((c) => c.date === '2026-08-29' || c.status === 'completed')
  ).length;
  const readyCount = totalPatients - completedCount;

  return (
    <div className="space-y-6">
      {/* Header & OPD Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Today's Patient Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              OPD Room #4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {departmentName} • Treating Physician: <strong className="text-slate-800">{doctorName}</strong>
          </p>
        </div>

        {/* Quick Metric Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total in Queue</span>
            <p className="text-base font-black text-slate-800">{totalPatients}</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-rose-600">High Alert</span>
            <p className="text-base font-black text-rose-700">{criticalCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-blue-600">Ready for Doctor</span>
            <p className="text-base font-black text-blue-800">{readyCount}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Consulted Today</span>
            <p className="text-base font-black text-emerald-800">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="patient-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient Name, ID, Mobile Number, or ABHA Number..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterPriority === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({allSessions.length})
          </button>
          <button
            onClick={() => setFilterPriority('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterPriority === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Critical / High Alert ({criticalCount})
          </button>
          <button
            onClick={() => setFilterPriority('routine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterPriority === 'routine'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Routine
          </button>
        </div>
      </div>

      {/* Patient Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No patients match your search criteria</p>
            <p className="text-xs text-slate-400">Try adjusting the search query or priority filters</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPatients.map((item, index) => {
              const isSelected = item.id === activeSessionId;
              const hasAlerts = (item.summary.redFlagsOrUrgentAlerts || []).length > 0;
              const hasConflicts = (item.summary.conflicts || []).length > 0;
              const isCritical = item.priority === 'critical' || hasAlerts;
              const isUrgent = item.priority === 'urgent';
              const hasConsultationToday = (item.consultations || []).some(
                (c) => c.date === '2026-08-29' || c.status === 'completed'
              );

              return (
                <div
                  key={item.id}
                  id={`patient-row-${item.id}`}
                  onClick={() => onSelectPatient(item)}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer hover:bg-teal-50/40 ${
                    isSelected ? 'bg-teal-50/70 border-l-4 border-l-teal-600' : ''
                  }`}
                >
                  {/* Left: Patient Info */}
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Index / Priority Marker */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : isUrgent
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isCritical ? '⚠️' : `#${index + 1}`}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                          {item.patient.fullName || 'Unnamed Patient'}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {item.patient.age} yrs • {item.patient.gender?.toUpperCase()}
                        </span>

                        {/* Priority Badge */}
                        {isCritical ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                            HIGH ALERT
                          </span>
                        ) : isUrgent ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                            URGENT REVIEW
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            ROUTINE
                          </span>
                        )}

                        {hasConsultationToday && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Consultation Saved
                          </span>
                        )}
                      </div>

                      {/* Chief Complaint Highlight */}
                      <p className="text-xs text-slate-700 font-medium line-clamp-1">
                        <strong className="text-slate-900 font-semibold">Chief Complaint: </strong>
                        {item.summary.chiefComplaint || 'Pending intake completion'}
                      </p>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                        <span>ID: <strong className="font-mono text-slate-700">{item.patient.id}</strong></span>
                        {item.patient.abhaId && (
                          <span>ABHA: <strong className="font-mono text-slate-700">{item.patient.abhaId}</strong></span>
                        )}
                        <span>Last Visit: <strong>{item.lastVisitDate || 'First Visit'}</strong></span>
                        <span>Documents: <strong>{item.documents.length}</strong></span>
                        {hasConflicts && (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {item.summary.conflicts.length} Conflict Flagged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      id={`open-record-btn-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(item);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <span>Open Patient Record</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
