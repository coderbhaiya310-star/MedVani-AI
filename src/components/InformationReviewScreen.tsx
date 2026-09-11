import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowLeft,
  Edit2,
  Check,
  Send,
  AlertCircle,
  FileCheck,
  Shield,
  Activity,
  Calendar,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { CaseTakingSession } from '../types';

interface InformationReviewScreenProps {
  session: CaseTakingSession;
  onGoBack: () => void;
  onConfirmAndSend: () => void;
}

export const InformationReviewScreen: React.FC<InformationReviewScreenProps> = ({
  session,
  onGoBack,
  onConfirmAndSend,
}) => {
  const [mainProblem, setMainProblem] = useState(
    session.liveExtraction?.chiefComplaint || 'Abdominal Pain (Pet dard)'
  );
  const [duration, setDuration] = useState(
    session.liveExtraction?.duration || 'Since yesterday (Kal se)'
  );
  const [location, setLocation] = useState(
    session.liveExtraction?.location || 'Center of abdomen'
  );
  const [otherSymptoms, setOtherSymptoms] = useState(
    session.liveExtraction?.symptoms?.join(', ') || 'Vomiting: No, Mild nausea reported'
  );

  const [editingField, setEditingField] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900">Swasthya AI</span>
        </div>

        <button
          onClick={onGoBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chat</span>
        </button>
      </header>

      {/* Main Review Form */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12 space-y-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="text-left space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Let's check what we understood
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Please confirm the information before sending to your doctor.
            </p>
          </div>

          {/* Cards for Structured Extraction */}
          <div className="space-y-3.5 text-left">
            {/* 1. Main Problem */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-400">Main Problem</div>
                  {editingField === 'problem' ? (
                    <input
                      type="text"
                      value={mainProblem}
                      onChange={(e) => setMainProblem(e.target.value)}
                      onBlur={() => setEditingField(null)}
                      autoFocus
                      className="w-full text-sm font-bold text-slate-900 border-b border-teal-500 focus:outline-none py-1 mt-0.5"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{mainProblem}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditingField(editingField === 'problem' ? null : 'problem')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editingField === 'problem' ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* 2. Duration */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-400">Duration</div>
                  {editingField === 'duration' ? (
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      onBlur={() => setEditingField(null)}
                      autoFocus
                      className="w-full text-sm font-bold text-slate-900 border-b border-teal-500 focus:outline-none py-1 mt-0.5"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{duration}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditingField(editingField === 'duration' ? null : 'duration')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editingField === 'duration' ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* 3. Location */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-400">Location</div>
                  {editingField === 'location' ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onBlur={() => setEditingField(null)}
                      autoFocus
                      className="w-full text-sm font-bold text-slate-900 border-b border-teal-500 focus:outline-none py-1 mt-0.5"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{location}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditingField(editingField === 'location' ? null : 'location')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editingField === 'location' ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* 4. Other Symptoms */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-400">Other Symptoms</div>
                  {editingField === 'symptoms' ? (
                    <input
                      type="text"
                      value={otherSymptoms}
                      onChange={(e) => setOtherSymptoms(e.target.value)}
                      onBlur={() => setEditingField(null)}
                      autoFocus
                      className="w-full text-sm font-bold text-slate-900 border-b border-teal-500 focus:outline-none py-1 mt-0.5"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{otherSymptoms}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditingField(editingField === 'symptoms' ? null : 'symptoms')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editingField === 'symptoms' ? 'Done' : 'Edit'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onGoBack}
            className="w-full sm:w-1/3 py-3.5 px-6 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={onConfirmAndSend}
            className="w-full sm:w-2/3 py-3.5 px-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Send to Doctor</span>
          </button>
        </div>
      </main>
    </div>
  );
};
