import React from 'react';
import { Stethoscope, ArrowRight, Home, FileText } from 'lucide-react';
import { SuccessCheckmarkIllustration } from './MedicalIllustrations';

interface ConsultationCompleteScreenProps {
  onViewConsultation: () => void;
  onBackToHome: () => void;
}

export const ConsultationCompleteScreen: React.FC<ConsultationCompleteScreenProps> = ({
  onViewConsultation,
  onBackToHome,
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
      </header>

      {/* Main Success Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-md w-full space-y-8">
          {/* Circular Teal Checkmark Icon */}
          <div className="flex justify-center">
            <SuccessCheckmarkIllustration className="w-24 h-24" />
          </div>

          {/* Headings */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your information has been sent to the doctor.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your doctor will review the information before making medical decisions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={onViewConsultation}
              className="w-full py-4 px-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Consultation</span>
            </button>

            <button
              onClick={onBackToHome}
              className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <span>Swasthya AI Healthcare Clinical Network</span>
      </footer>
    </div>
  );
};
