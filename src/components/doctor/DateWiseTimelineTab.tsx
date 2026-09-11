import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Pill,
  Activity,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { CaseTakingSession, ConsultationRecord, MedicalReportItem, DoctorNoteItem } from '../../types';

interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  type: 'consultation' | 'report' | 'prescription' | 'doctor_note' | 'ai_summary';
  title: string;
  subtitle: string;
  description?: string;
  badgeText: string;
  badgeColor: string;
  details?: Record<string, any>;
}

interface DateWiseTimelineTabProps {
  session: CaseTakingSession;
}

export const DateWiseTimelineTab: React.FC<DateWiseTimelineTabProps> = ({ session }) => {
  const [filterType, setFilterType] = useState<'all' | 'consultation' | 'report' | 'prescription' | 'note'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Aggregate all events from the session
  const events: TimelineEvent[] = [];

  // 1. Consultations
  (session.consultations || []).forEach((c) => {
    events.push({
      id: `timeline-cons-${c.id}`,
      date: c.date,
      time: c.time,
      type: 'consultation',
      title: `Clinical Consultation: ${c.chiefComplaint}`,
      subtitle: `${c.doctorName}`,
      description: `Assessment: ${c.assessment}\nTreatment: ${c.treatmentAdvice}`,
      badgeText: 'Consultation',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      details: c,
    });

    // Prescriptions issued in consultation
    if (c.prescriptions && c.prescriptions.length > 0) {
      events.push({
        id: `timeline-rx-${c.id}`,
        date: c.date,
        time: c.time,
        type: 'prescription',
        title: `Prescriptions Issued (${c.prescriptions.length} items)`,
        subtitle: `Prescribed by ${c.doctorName}`,
        description: c.prescriptions.map((p) => `• ${p.medicineName} (${p.dosage}) - ${p.frequency}`).join('\n'),
        badgeText: 'Prescriptions',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        details: { prescriptions: c.prescriptions },
      });
    }
  });

  // 2. Medical Reports
  (session.reports || []).forEach((r) => {
    events.push({
      id: `timeline-rep-${r.id}`,
      date: r.reportDate,
      type: 'report',
      title: `${r.reportType}: ${r.testName}`,
      subtitle: `Facility: ${r.facilityOrLab || 'Diagnostic Lab'}`,
      description: `Result: ${r.result} ${r.units || ''}${r.referenceRange ? ` (Ref: ${r.referenceRange})` : ''}${r.doctorNotes ? `\nDoctor Note: ${r.doctorNotes}` : ''}`,
      badgeText: r.reportType,
      badgeColor: r.status === 'critical' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-blue-100 text-blue-800 border-blue-200',
      details: r,
    });
  });

  // 3. Uploaded Documents
  (session.documents || []).forEach((doc) => {
    events.push({
      id: `timeline-doc-${doc.id}`,
      date: doc.documentDate || '2026-08-29',
      type: 'report',
      title: `Document Uploaded: ${doc.title}`,
      subtitle: doc.facilityOrDoctor || 'Medical Records Archive',
      description: doc.extractedText,
      badgeText: doc.documentType.replace('_', ' ').toUpperCase(),
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      details: doc,
    });
  });

  // 4. Doctor Notes
  (session.doctorNotes || []).forEach((n) => {
    events.push({
      id: `timeline-note-${n.id}`,
      date: n.date,
      type: 'doctor_note',
      title: `Doctor Clinical Note: ${n.category}`,
      subtitle: `${n.doctorName}`,
      description: n.noteText,
      badgeText: 'Doctor Note',
      badgeColor: n.priority === 'urgent' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-slate-100 text-slate-800 border-slate-200',
      details: n,
    });
  });

  // 5. AI Intake Session
  if (session.summary.chiefComplaint) {
    events.push({
      id: `timeline-ai-intake`,
      date: '2026-08-29',
      time: '08:30 AM',
      type: 'ai_summary',
      title: 'AI Digital Clinical Intake & Voice History',
      subtitle: 'Ayushman Clinical Voice Engine',
      description: `Chief Complaint: ${session.summary.chiefComplaint}\n${session.summary.historyOfPresentIllness?.chronologicalNarrative || ''}`,
      badgeText: 'AI Voice Intake',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      details: session.summary,
    });
  }

  // Sort events chronologically (newest first)
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    if (filterType === 'consultation') return e.type === 'consultation';
    if (filterType === 'report') return e.type === 'report';
    if (filterType === 'prescription') return e.type === 'prescription';
    if (filterType === 'note') return e.type === 'doctor_note';
    return true;
  });

  // Group events by date
  const groupedByDate: Record<string, TimelineEvent[]> = {};
  filteredEvents.forEach((ev) => {
    if (!groupedByDate[ev.date]) {
      groupedByDate[ev.date] = [];
    }
    groupedByDate[ev.date].push(ev);
  });

  const uniqueDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-900">
              Date-Wise Chronological Medical Timeline ({filteredEvents.length} milestones)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic lifetime health trajectory integrating consultations, investigations, prescriptions, and notes
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setFilterType('consultation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'consultation'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            Consultations
          </button>
          <button
            onClick={() => setFilterType('report')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'report'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Reports & Labs
          </button>
          <button
            onClick={() => setFilterType('prescription')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'prescription'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'note'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Doctor Notes
          </button>
        </div>
      </div>

      {/* Timeline List */}
      {uniqueDates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <Activity className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No timeline milestones matching filter</p>
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-slate-200 before:z-0">
          {uniqueDates.map((dateStr) => {
            const dateEvents = groupedByDate[dateStr];
            const isToday = dateStr === '2026-08-29' || dateStr === new Date().toISOString().split('T')[0];

            return (
              <div key={dateStr} className="relative z-10 space-y-3">
                {/* Date Node Label */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 sm:w-16 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-xs border ${
                      isToday
                        ? 'bg-teal-600 text-white border-teal-700 ring-4 ring-teal-100'
                        : 'bg-slate-900 text-white border-slate-800'
                    }`}
                  >
                    {isToday ? 'TODAY' : dateStr.split('-')[0]}
                  </div>
                  <div className="bg-white px-3.5 py-1 rounded-xl border border-slate-200 shadow-xs">
                    <span className="font-extrabold text-xs text-slate-800">
                      {new Date(dateStr).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      ({dateEvents.length} event{dateEvents.length > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Event Cards under this date */}
                <div className="pl-10 sm:pl-14 space-y-3">
                  {dateEvents.map((ev) => {
                    const isExpanded = expandedId === ev.id;

                    const getIcon = () => {
                      if (ev.type === 'consultation') return <Stethoscope className="w-4 h-4 text-teal-600" />;
                      if (ev.type === 'prescription') return <Pill className="w-4 h-4 text-amber-600" />;
                      if (ev.type === 'report') return <FileText className="w-4 h-4 text-blue-600" />;
                      if (ev.type === 'doctor_note') return <FileSpreadsheet className="w-4 h-4 text-slate-600" />;
                      return <Sparkles className="w-4 h-4 text-purple-600" />;
                    };

                    return (
                      <div
                        key={ev.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:border-slate-300 transition-all"
                      >
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                              {getIcon()}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{ev.title}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${ev.badgeColor}`}
                                >
                                  {ev.badgeText}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{ev.subtitle}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {ev.time && (
                              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {ev.time}
                              </span>
                            )}
                            <button className="p-1 rounded-lg bg-slate-100 text-slate-600">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && ev.description && (
                          <div className="p-4 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-800 space-y-2 whitespace-pre-line leading-relaxed">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              Clinical Milestone Record
                            </span>
                            <div className="bg-white p-3 rounded-xl border border-slate-200 font-sans">
                              {ev.description}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
