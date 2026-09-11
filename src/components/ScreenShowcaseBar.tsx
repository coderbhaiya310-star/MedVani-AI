import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Eye, Sparkles } from 'lucide-react';

export type ScreenId =
  | '1-landing'
  | '2-role-selection'
  | '3-login'
  | '4-language-selection'
  | '5-patient-home'
  | '6-patient-profile'
  | '7-start-consultation'
  | '8-active-consultation'
  | '9-information-review'
  | '10-consultation-complete'
  | '11-previous-consultations'
  | '12-consultation-details-patient'
  | '13-doctor-dashboard'
  | '14-doctor-patient-queue'
  | '15-doctor-patient-case'
  | '16-doctor-notes'
  | '17-original-conversation'
  | '18-settings'
  | '19-medical-reports'
  | '20-not-found';

interface ScreenShowcaseBarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
}

export const ScreenShowcaseBar: React.FC<ScreenShowcaseBarProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenId; label: string; number: number; group: 'Public' | 'Patient' | 'Doctor' | 'System' }[] = [
    { id: '1-landing', label: 'Landing Page', number: 1, group: 'Public' },
    { id: '2-role-selection', label: 'Role Selection', number: 2, group: 'Public' },
    { id: '3-login', label: 'Login / Sign In', number: 3, group: 'Public' },
    { id: '4-language-selection', label: 'Language Selection', number: 4, group: 'Patient' },
    { id: '5-patient-home', label: 'Patient Home', number: 5, group: 'Patient' },
    { id: '6-patient-profile', label: 'Patient Profile', number: 6, group: 'Patient' },
    { id: '7-start-consultation', label: 'Start Consultation', number: 7, group: 'Patient' },
    { id: '8-active-consultation', label: 'Active Consultation', number: 8, group: 'Patient' },
    { id: '9-information-review', label: 'Information Review', number: 9, group: 'Patient' },
    { id: '10-consultation-complete', label: 'Consultation Complete', number: 10, group: 'Patient' },
    { id: '11-previous-consultations', label: 'My Consultations', number: 11, group: 'Patient' },
    { id: '12-consultation-details-patient', label: 'Consultation Details (Patient)', number: 12, group: 'Patient' },
    { id: '13-doctor-dashboard', label: 'Doctor Dashboard', number: 13, group: 'Doctor' },
    { id: '14-doctor-patient-queue', label: 'Patient Queue (Doctor)', number: 14, group: 'Doctor' },
    { id: '15-doctor-patient-case', label: 'Patient Case (Doctor)', number: 15, group: 'Doctor' },
    { id: '16-doctor-notes', label: 'Doctor Notes', number: 16, group: 'Doctor' },
    { id: '17-original-conversation', label: 'Original Conversation', number: 17, group: 'Doctor' },
    { id: '18-settings', label: 'Settings Screen', number: 18, group: 'System' },
    { id: '19-medical-reports', label: 'Medical Reports', number: 19, group: 'Patient' },
    { id: '20-not-found', label: 'Page Not Found (404)', number: 20, group: 'System' },
  ];

  const currentScreenObj = screens.find((s) => s.id === currentScreen) || screens[0];

  return (
    <div className="fixed bottom-3 right-3 z-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Expanded Screen Selector Drawer */}
      {isOpen && (
        <div className="mb-2 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 w-80 sm:w-96 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-3 duration-200 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs text-slate-900">
                20-Screen Healthcare System
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold px-1.5 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="text-[11px] text-slate-500 my-2">
            Click any screen to jump directly or preview the clinical flow:
          </div>

          <div className="space-y-1">
            {screens.map((s) => {
              const isCurrent = s.id === currentScreen;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectScreen(s.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-teal-50 hover:text-teal-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s.number}
                    </span>
                    <span className="truncate">{s.label}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {s.group}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer backdrop-blur-xs border border-slate-700/50"
      >
        <Layers className="w-3.5 h-3.5 text-teal-400" />
        <span className="hidden sm:inline">Screen {currentScreenObj.number}:</span>
        <span className="text-teal-200 truncate max-w-[140px] sm:max-w-none">
          {currentScreenObj.label}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
