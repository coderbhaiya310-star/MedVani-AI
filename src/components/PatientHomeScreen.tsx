import React, { useState } from 'react';
import {
  Stethoscope,
  ChevronDown,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  User,
  Home,
  Mic,
  Upload,
  Calendar,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import { PatientProfile, CaseTakingSession, AuthUser } from '../types';
import { PatientAvatarIllustration } from './MedicalIllustrations';

interface PatientHomeScreenProps {
  user: AuthUser;
  session: CaseTakingSession;
  onStartConsultation: () => void;
  onOpenConsultations: () => void;
  onOpenReports: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({
  user,
  session,
  onStartConsultation,
  onOpenConsultations,
  onOpenReports,
  onOpenProfile,
  onOpenSettings,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const patientName = session.patient?.fullName || user.fullName || 'Priya';
  const firstName = patientName.split(' ')[0] || 'Priya';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24">
      {/* 1. Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">Swasthya AI</span>
        </div>

        {/* User Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full hover:bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-semibold text-slate-800">{firstName}</span>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-sky-100 flex items-center justify-center">
              <PatientAvatarIllustration className="w-8 h-8" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-900">{patientName}</div>
                <div className="text-[11px] text-slate-400">Patient ID: {session.patient?.id || 'PAT-001'}</div>
              </div>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 flex-1">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hello, {firstName}!
            </h1>
            <p className="text-sm sm:text-base text-slate-500">
              How are you feeling today?
            </p>
          </div>
          {/* Gentle leaf/health decorative visual */}
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Large Primary Consultation Banner Card */}
        <div className="bg-[#F0F7FF] rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 text-xs font-bold">
                <Mic className="w-3.5 h-3.5 text-teal-700" />
                <span>Voice-First AI Clinical Intake</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Start a Consultation
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                Tell us what you're experiencing and we'll help organize the information for your doctor.
              </p>

              <div className="pt-2">
                <button
                  onClick={onStartConsultation}
                  className="px-7 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Start Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Medical/AI Illustration icon on right */}
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="w-32 h-32 rounded-3xl bg-white shadow-xs border border-sky-100 flex items-center justify-center text-teal-600">
                <Stethoscope className="w-16 h-16 stroke-[1.5]" />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Secondary Cards Below */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
          {/* Card 1: My Consultations */}
          <div
            onClick={onOpenConsultations}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition">
                  My Consultations
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  View your previous consultations and doctor reviews.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-700 pt-2 border-t border-slate-50">
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Medical Reports */}
          <div
            onClick={onOpenReports}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-700 transition">
                  Medical Reports
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload and view your lab tests and prescriptions.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-sky-700 pt-2 border-t border-slate-50">
              <span>Upload & View</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: My Profile */}
          <div
            onClick={onOpenProfile}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition">
                  My Profile
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your personal and medical information.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 pt-2 border-t border-slate-50">
              <span>Edit Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-6 py-2.5 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-1 text-teal-700 font-bold text-[11px] cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={onOpenConsultations}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 font-medium text-[11px] cursor-pointer"
          >
            <Clock className="w-5 h-5" />
            <span>Consultations</span>
          </button>
          <button
            onClick={onOpenReports}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 font-medium text-[11px] cursor-pointer"
          >
            <FileText className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button
            onClick={onOpenProfile}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 font-medium text-[11px] cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
