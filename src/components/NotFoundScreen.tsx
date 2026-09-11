import React from 'react';
import { Stethoscope, ArrowLeft, Home } from 'lucide-react';
import { NotFoundIllustration } from './MedicalIllustrations';

interface NotFoundScreenProps {
  onBackToHome: () => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900">Swasthya AI</span>
        </div>

        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </header>

      {/* Main 404 Visual Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-md w-full space-y-6">
          {/* Medical Document / Magnifying Glass Illustration */}
          <div className="flex justify-center">
            <NotFoundIllustration className="w-56 h-56" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Page not found
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Sorry, we couldn't find the page or medical record you're looking for.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onBackToHome}
              className="px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-xs hover:shadow-sm transition cursor-pointer inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <span>Swasthya AI • 404 System Handler</span>
      </footer>
    </div>
  );
};
