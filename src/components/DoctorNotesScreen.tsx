import React, { useState } from 'react';
import { Stethoscope, ArrowLeft, Check, Save, FileText, Tag } from 'lucide-react';

interface DoctorNotesScreenProps {
  patientName?: string;
  onSave: (notes: string, category: string) => void;
  onBack: () => void;
}

export const DoctorNotesScreen: React.FC<DoctorNotesScreenProps> = ({
  patientName = 'Priya Sharma, 28 years | Female',
  onSave,
  onBack,
}) => {
  const [notes, setNotes] = useState(
    'Impression: Acute gastritis vs. early appendicular colic.\nPlan: Advise ultrasound abdomen if pain persists > 24 hours. Prescribed antacid (Pantoprazole 40mg od) and antispasmodic (Drotaverine 40mg sos). Review in 2 days.'
  );
  const [category, setCategory] = useState<'Clinical Impression' | 'Treatment Plan' | 'Prescription Notes' | 'Differential Diagnosis'>('Clinical Impression');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSave(notes, category);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-2xs">
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
          <span>Back to Case</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6 flex-1 text-left">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Doctor Notes</h1>
              <p className="text-xs text-slate-500 mt-0.5">{patientName}</p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved to Clinical Record</span>
              </span>
            )}
          </div>

          {/* Note Category Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Note Category</label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  'Clinical Impression',
                  'Treatment Plan',
                  'Prescription Notes',
                  'Differential Diagnosis',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    category === cat
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Large Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Clinical Remarks</label>
            <textarea
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your clinical notes here..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-xs hover:shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Clinical Notes</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
