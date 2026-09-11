import React from 'react';
import { Stethoscope, ArrowLeft } from 'lucide-react';
import { PatientAvatarIllustration, DoctorAvatarIllustration } from './MedicalIllustrations';

interface RoleSelectionScreenProps {
  onSelectPatient: () => void;
  onSelectDoctor: () => void;
  onBack?: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectPatient,
  onSelectDoctor,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900">Swasthya AI</span>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        )}
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How will you use Swasthya AI?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Select your role to access your personalized medical workspace
            </p>
          </div>

          {/* Two Large Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-center">
            {/* Patient Card */}
            <div className="bg-[#F0F7FF] rounded-3xl p-8 border border-sky-100 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col items-center justify-between space-y-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xs border border-sky-50">
                <PatientAvatarIllustration className="w-20 h-20" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Patient</h2>
                <p className="text-xs text-slate-600 leading-relaxed px-2">
                  Share your health problem and prepare your information for a doctor.
                </p>
              </div>

              <button
                onClick={onSelectPatient}
                className="w-full py-3.5 px-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                Continue as Patient
              </button>
            </div>

            {/* Doctor Card */}
            <div className="bg-[#F0F7FF] rounded-3xl p-8 border border-sky-100 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col items-center justify-between space-y-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xs border border-sky-50">
                <DoctorAvatarIllustration className="w-20 h-20" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Doctor</h2>
                <p className="text-xs text-slate-600 leading-relaxed px-2">
                  Review patient information and clinical history.
                </p>
              </div>

              <button
                onClick={onSelectDoctor}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-slate-50 text-teal-700 border-1.5 border-teal-600 font-semibold text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                Continue as Doctor
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
