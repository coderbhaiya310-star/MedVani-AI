import React from 'react';
import { Stethoscope, ArrowLeft, Mic, Keyboard } from 'lucide-react';

interface StartConsultationScreenProps {
  onStartVoice: () => void;
  onTypeInstead: () => void;
  onBack: () => void;
}

export const StartConsultationScreen: React.FC<StartConsultationScreenProps> = ({
  onStartVoice,
  onTypeInstead,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
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
          <span>Back</span>
        </button>
      </header>

      {/* Main Centered Minimal & Distraction-free Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-md w-full space-y-8">
          {/* Top Micro Visual: Microphone inside soft layered circular medical graphic */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100 shadow-2xs">
              <Mic className="w-9 h-9 text-teal-600" />
            </div>
          </div>

          {/* Heading and Supporting Text */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tell us what you're feeling
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              You can speak naturally. We'll ask a few questions based on what you tell us.
            </p>
          </div>

          {/* Large Circular Microphone Button */}
          <div className="pt-2 flex flex-col items-center space-y-3">
            <button
              onClick={onStartVoice}
              className="w-24 h-24 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer animate-mic-pulse"
              title="Tap to speak"
            >
              <Mic className="w-10 h-10" />
            </button>
            <span className="text-sm font-bold text-slate-800">Tap to Speak</span>
          </div>

          {/* Secondary Type Instead link */}
          <div className="pt-4">
            <button
              onClick={onTypeInstead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Type instead</span>
            </button>
          </div>
        </div>
      </main>

      {/* Empty bottom space for balance */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <span>Swasthya AI Voice Clinical Intake</span>
      </footer>
    </div>
  );
};
