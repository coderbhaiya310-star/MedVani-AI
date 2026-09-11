import React, { useState } from 'react';
import {
  Stethoscope,
  LayoutDashboard,
  Users,
  Globe,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Settings,
} from 'lucide-react';
import { DoctorAvatarIllustration } from './MedicalIllustrations';
import { AuthUser } from '../types';

interface PatientConsultationRow {
  id: string;
  name: string;
  ageGender: string;
  problem: string;
  language: string;
  status: 'New' | 'In Review' | 'Reviewed';
  time: string;
  urgency: 'routine' | 'urgent';
}

interface DoctorDashboardScreenProps {
  user: AuthUser;
  onOpenPatientQueue: () => void;
  onSelectPatientCase: (patientId: string) => void;
  onOpenLanguageSettings: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const DoctorDashboardScreen: React.FC<DoctorDashboardScreenProps> = ({
  user,
  onOpenPatientQueue,
  onSelectPatientCase,
  onOpenLanguageSettings,
  onOpenSettings,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'notifications' | 'privacy'>('dashboard');

  const stats = [
    { label: 'Patients', value: '25', sub: 'Active registry', color: 'bg-teal-50 text-teal-700' },
    { label: 'Consultations', value: '18', sub: 'Completed today', color: 'bg-sky-50 text-sky-700' },
    { label: 'New cases', value: '8', sub: 'Awaiting triage', color: 'bg-amber-50 text-amber-700' },
    { label: 'Pending reviews', value: '5', sub: 'Action required', color: 'bg-rose-50 text-rose-700' },
  ];

  const recentConsultations: PatientConsultationRow[] = [
    {
      id: 'p-1',
      name: 'Priya Sharma',
      ageGender: '28y, F',
      problem: 'Abdominal pain (center)',
      language: 'Hindi',
      status: 'New',
      time: '10 min ago',
      urgency: 'urgent',
    },
    {
      id: 'p-2',
      name: 'Ramesh Patel',
      ageGender: '54y, M',
      problem: 'Chest tightness & fatigue',
      language: 'Gujarati',
      status: 'In Review',
      time: '25 min ago',
      urgency: 'urgent',
    },
    {
      id: 'p-3',
      name: 'Sunita Roy',
      ageGender: '35y, F',
      problem: 'High fever for 3 days',
      language: 'Bengali',
      status: 'New',
      time: '1 hr ago',
      urgency: 'routine',
    },
    {
      id: 'p-4',
      name: 'Arun Kumar',
      ageGender: '42y, M',
      problem: 'Knee inflammation & stiffness',
      language: 'Tamil',
      status: 'Reviewed',
      time: '2 hrs ago',
      urgency: 'routine',
    },
    {
      id: 'p-5',
      name: 'Meena Kulkarni',
      ageGender: '61y, F',
      problem: 'Dizziness & missed BP dose',
      language: 'Marathi',
      status: 'Reviewed',
      time: '3 hrs ago',
      urgency: 'routine',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 hidden md:flex shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Stethoscope className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Swasthya AI</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={onOpenPatientQueue}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Patients</span>
            </button>

            <button
              onClick={onOpenLanguageSettings}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Language</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Notifications</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Privacy & Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <DoctorAvatarIllustration className="w-9 h-9" />
            <div className="text-left overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user.fullName || 'Dr. Rajesh'}
              </div>
              <div className="text-[10px] text-slate-400">Physician • General Med</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900">Swasthya AI</span>
          </div>

          <div className="hidden md:block text-xs font-medium text-slate-400">
            EHR Core Clinical Intelligence System
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPatientQueue}
              className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
            >
              View Patient Queue
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <DoctorAvatarIllustration className="w-7 h-7" />
              <span className="text-xs font-bold text-slate-800">{user.fullName || 'Dr. Rajesh'}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto text-left">
          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Doctor Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time patient intake summaries, multilingual triage, and clinical verification
            </p>
          </div>

          {/* Top Statistics 4 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2"
              >
                <div className="text-xs font-semibold text-slate-500">{s.label}</div>
                <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-[11px] text-slate-400">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Table: Recent Patient Consultations */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Recent Patient Consultations
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Voice intakes processed with Gemini clinical structuring
                </p>
              </div>

              <button
                onClick={onOpenPatientQueue}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View all patients</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Patient</th>
                    <th className="py-3 px-5">Problem</th>
                    <th className="py-3 px-5">Language</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Time</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {recentConsultations.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-teal-50/30 transition-colors cursor-pointer"
                      onClick={() => onSelectPatientCase(row.id)}
                    >
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{row.name}</div>
                        <div className="text-[11px] text-slate-400">{row.ageGender}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-slate-800">{row.problem}</span>
                        {row.urgency === 'urgent' && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Attention
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                          {row.language}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            row.status === 'New'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : row.status === 'In Review'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-400">{row.time}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatientCase(row.id);
                          }}
                          className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
