import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Mic,
  Calendar,
  Pill,
  Clock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Heart,
  ChevronRight,
  Plus,
  ShieldCheck,
  Activity,
  ArrowRight,
  Phone,
  Sparkles,
} from 'lucide-react';
import { AuthUser } from '../types';

interface PatientPortalPageProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export const PatientPortalPage: React.FC<PatientPortalPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // State for tabs or views within portal
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'prescriptions' | 'appointments'>('overview');

  const patientName = user?.fullName || 'Rahul Kumar';
  const patientEmail = user?.email || 'rahul.kumar@gmail.com';
  const abhaId = '91-4521-8963-7412';

  // Sample medical history
  const medicalHistory = [
    {
      id: 'MH-1',
      condition: 'Seasonal Allergic Rhinitis',
      diagnosedDate: '12 Jan 2025',
      doctor: 'Dr. Sharma (Pulmonology)',
      status: 'Managed',
      notes: 'Triggered by dust and pollen. Recommended antihistamines during spring.',
    },
    {
      id: 'MH-2',
      condition: 'Mild Acute Bronchitis',
      diagnosedDate: '04 Oct 2024',
      doctor: 'Dr. Priya Nair (General Medicine)',
      status: 'Resolved',
      notes: '7-day course of antibiotics and steam inhalation. Follow-up clear.',
    },
    {
      id: 'MH-3',
      condition: 'Known Drug Allergy: Penicillin',
      diagnosedDate: 'Verified 2022',
      doctor: 'Clinical Allergy Panel',
      status: 'Critical Alert',
      notes: 'Causes skin hives and swelling. Avoid all beta-lactam antibiotics.',
    },
  ];

  // Sample prescriptions
  const prescriptions = [
    {
      id: 'RX-8821',
      medication: 'Montelukast + Levocetirizine',
      dosage: '10mg / 5mg',
      frequency: 'Once daily at bedtime',
      duration: '14 days (6 days remaining)',
      doctor: 'Dr. Sharma',
      status: 'Active',
    },
    {
      id: 'RX-7430',
      medication: 'Paracetamol 650mg',
      dosage: '650mg',
      frequency: 'SOS (as needed for fever/headache)',
      duration: '5 days',
      doctor: 'Dr. Priya Nair',
      status: 'Completed',
    },
    {
      id: 'RX-6190',
      medication: 'Normal Saline Nasal Spray',
      dosage: '2 sprays in each nostril',
      frequency: 'Twice daily',
      duration: '30 days',
      doctor: 'Dr. Sharma',
      status: 'Active',
    },
  ];

  // Sample appointments
  const appointments = [
    {
      id: 'APT-104',
      doctor: 'Dr. Sharma',
      specialty: 'General Medicine & Pulmonology',
      hospital: 'Swasthya Apollo Clinical Centre, OPD-3',
      date: 'Tomorrow, 12 Sep 2026',
      time: '10:30 AM',
      type: 'Follow-up Consultation',
      status: 'Confirmed',
    },
    {
      id: 'APT-098',
      doctor: 'Dr. Ananya Roy',
      specialty: 'Dermatology & Allergy Care',
      hospital: 'Virtual OPD / Voice Telehealth',
      date: '24 Sep 2026',
      time: '04:00 PM',
      type: 'Routine Review',
      status: 'Scheduled',
    },
    {
      id: 'APT-082',
      doctor: 'Dr. Priya Nair',
      specialty: 'General Medicine',
      hospital: 'Swasthya District Hospital',
      date: '14 Aug 2026',
      time: '11:15 AM',
      type: 'In-person Consultation',
      status: 'Completed',
    },
  ];

  return (
    <div
      id="patient-portal-container"
      className="min-h-screen w-full bg-[#F4F8FD] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800"
    >
      {/* ── TOP NAVIGATION BAR ── */}
      <header
        id="patient-portal-header"
        className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00B4D8] flex items-center justify-center text-white shadow-xs">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                  Swasthya <span className="text-[#2563EB] font-black">AI</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs text-[#64748B] hidden sm:block">
                Clinical Intelligence for Better Care
              </p>
            </div>
          </div>

          {/* User Profile & Logout Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{patientName}</p>
                <p className="text-xs text-slate-500">ABHA: {abhaId}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {patientName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="patient-portal-logout-btn"
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
              title="Logout from Patient Portal"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN PORTAL CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* WELCOME BANNER */}
        <div
          id="patient-welcome-banner"
          className="w-full bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#3B82F6] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          {/* Background Ambient Circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-32 -bottom-16 w-48 h-48 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="space-y-2 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-blue-50 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Health Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {patientName}!
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Your digital health records, active prescriptions, and upcoming consultations are synchronized with the hospital system.
            </p>
          </div>

          {/* Start Voice Consultation & Document Timeline Buttons */}
          <div className="z-10 shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="patient-start-voice-consult-btn"
              type="button"
              onClick={() => navigate('/voice-intake')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-[#1E40AF] hover:bg-blue-50 active:scale-98 font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <span>Start Voice Consultation</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/30 backdrop-blur-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Medical Document Timeline & OCR</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Previous Medical History</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'prescriptions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Prescriptions ({prescriptions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'appointments'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments ({appointments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 ml-auto"
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Document Timeline (Oldest → Newest)</span>
          </button>
        </div>

        {/* ── 3 CORE SECTIONS (GRID OR SELECTED TAB) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SECTION 1: PREVIOUS MEDICAL HISTORY */}
          <div
            id="patient-medical-history-section"
            className={`bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col ${
              activeTab === 'overview' || activeTab === 'history' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">Previous Medical History</h2>
                  <p className="text-xs text-slate-500">Past diagnoses and conditions</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto">
              {medicalHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-800">{item.condition}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Critical Alert'
                          ? 'bg-rose-100 text-rose-700'
                          : item.status === 'Active'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.notes}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-200/60">
                    <span>{item.doctor}</span>
                    <span>{item.diagnosedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: PRESCRIPTIONS */}
          <div
            id="patient-prescriptions-section"
            className={`bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col ${
              activeTab === 'overview' || activeTab === 'prescriptions' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">Prescriptions</h2>
                  <p className="text-xs text-slate-500">Active medicines & directions</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-blue-950">{rx.medication}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        rx.status === 'Active'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Dosage: {rx.dosage}</p>
                  <p className="text-xs text-slate-600 mt-0.5">Instructions: {rx.frequency}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-blue-100">
                    <span>Prescribed by {rx.doctor}</span>
                    <span>{rx.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: APPOINTMENTS */}
          <div
            id="patient-appointments-section"
            className={`bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col ${
              activeTab === 'overview' || activeTab === 'appointments' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">Appointments</h2>
                  <p className="text-xs text-slate-500">Upcoming & past doctor visits</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-purple-950">{apt.doctor}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : apt.status === 'Scheduled'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{apt.specialty}</p>
                  <p className="text-xs font-semibold text-slate-800 mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{apt.date} • {apt.time}</span>
                  </p>
                  <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-purple-100">
                    {apt.hospital}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 select-none border-t border-slate-200 bg-white">
        © 2026 Swasthya AI Clinical Patient Portal. Protected under ABDM Digital Health Mission.
      </footer>
    </div>
  );
};
