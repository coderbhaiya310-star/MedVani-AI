import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Save,
  CheckCircle2,
  Calendar,
  User,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { CaseTakingSession, DoctorNoteItem } from '../../types';

interface DoctorNotesTabProps {
  session: CaseTakingSession;
  onAddDoctorNote: (note: DoctorNoteItem) => void;
  doctorName?: string;
}

export const DoctorNotesTab: React.FC<DoctorNotesTabProps> = ({
  session,
  onAddDoctorNote,
  doctorName = 'Dr. Rajesh Sharma, MD',
}) => {
  const notes: DoctorNoteItem[] = session.doctorNotes || [];

  const [date, setDate] = useState('2026-08-29');
  const [category, setCategory] = useState<DoctorNoteItem['category']>('Clinical Observation');
  const [priority, setPriority] = useState<'routine' | 'urgent'>('routine');
  const [noteText, setNoteText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote: DoctorNoteItem = {
      id: `note-${Date.now()}`,
      patientId: session.patient.id,
      doctorId: 'doc-current',
      doctorName,
      date,
      category,
      noteText,
      priority,
    };

    onAddDoctorNote(newNote);
    setNoteText('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-900">
              Doctor Clinical Notes & Observations ({notes.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-departmental care coordination, confidential physician remarks, and patient counseling logs
          </p>
        </div>

        <button
          id="add-doctor-note-btn"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel Note' : '+ Add New Doctor Note'}</span>
        </button>
      </div>

      {/* NEW NOTE FORM */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border-2 border-teal-500/40 p-5 shadow-sm space-y-4 animate-fadeIn text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-sm text-slate-900">Create New Doctor Note</span>
            <span className="text-[11px] text-slate-500 font-mono">Date: {date}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                Note Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              >
                <option value="Clinical Observation">Clinical Observation</option>
                <option value="Follow-up Note">Follow-up Note</option>
                <option value="Care Coordination">Care Coordination / Referral</option>
                <option value="Medication Note">Medication Counseling Note</option>
                <option value="Family Discussion">Family / Attendant Discussion</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent / High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                value={doctorName}
                readOnly
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
              Note Text / Remarks *
            </label>
            <textarea
              required
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter detailed clinical observation, discussion with attendants, or follow-up directives..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Note to Patient Record</span>
            </button>
          </div>
        </form>
      )}

      {/* NOTES LIST */}
      {notes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No doctor notes recorded yet</p>
          <p className="text-xs text-slate-400">
            Click "+ Add New Doctor Note" to record physician remarks.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((item) => {
            const isUrgent = item.priority === 'urgent';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-2.5 ${
                  isUrgent ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    {isUrgent && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                        URGENT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {item.doctorName}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                  {item.noteText}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
