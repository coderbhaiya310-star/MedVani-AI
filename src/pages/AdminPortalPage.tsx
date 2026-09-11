import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  Activity,
  LogOut,
  Stethoscope,
  Server,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Search,
  Settings,
  Database,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Hospital,
} from 'lucide-react';
import { AuthUser } from '../types';

interface AdminPortalPageProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'patients' | 'doctors'>('overview');
  const [userFilter, setUserFilter] = useState<'all' | 'doctor' | 'patient' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const adminName = user?.fullName || 'Super Admin';

  // System KPI overview
  const systemMetrics = {
    totalPatients: '1,420',
    activeDoctors: '24',
    consultationsToday: '148',
    systemHealth: '99.98%',
    abdmSyncStatus: 'Connected & Compliant',
    voiceServerLatency: '42ms',
  };

  // Sample users list
  const usersList = [
    {
      id: 'USR-001',
      name: 'Dr. Sharma',
      email: 'dr.sharma@apollo.com',
      role: 'doctor',
      department: 'General Medicine',
      status: 'Active',
      lastLogin: 'Today, 09:15 AM',
    },
    {
      id: 'USR-002',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@gmail.com',
      role: 'patient',
      department: 'Outpatient OPD',
      status: 'Active',
      lastLogin: 'Today, 10:05 AM',
    },
    {
      id: 'USR-003',
      name: 'Dr. Priya Nair',
      email: 'dr.priya@swasthya.ai',
      role: 'doctor',
      department: 'Pediatrics',
      status: 'Active',
      lastLogin: 'Yesterday, 04:30 PM',
    },
    {
      id: 'USR-004',
      name: 'Sunita Devi',
      email: 'sunita.devi@yahoo.com',
      role: 'patient',
      department: 'Orthopedics OPD',
      status: 'Active',
      lastLogin: 'Yesterday, 11:20 AM',
    },
    {
      id: 'USR-005',
      name: 'Super Admin',
      email: 'admin@swasthya.gov.in',
      role: 'admin',
      department: 'Hospital IT & Compliance',
      status: 'Active',
      lastLogin: 'Current Session',
    },
    {
      id: 'USR-006',
      name: 'Amitabh Sen',
      email: 'amitabh.sen@rediffmail.com',
      role: 'patient',
      department: 'Gastroenterology',
      status: 'Inactive',
      lastLogin: '05 Sep 2026',
    },
  ];

  // Sample patient records
  const patientRecords = [
    {
      id: 'PAT-101',
      name: 'Rahul Kumar',
      age: 28,
      gender: 'Male',
      abhaId: '91-4521-8963-7412',
      phone: '+91 98765 43210',
      registeredDate: '10 Jan 2026',
      status: 'Verified (ABDM)',
      visitsCount: 4,
    },
    {
      id: 'PAT-102',
      name: 'Sunita Devi',
      age: 52,
      gender: 'Female',
      abhaId: '91-3829-1029-4451',
      phone: '+91 98450 11223',
      registeredDate: '14 Feb 2026',
      status: 'Verified (ABDM)',
      visitsCount: 7,
    },
    {
      id: 'PAT-103',
      name: 'Amitabh Sen',
      age: 44,
      gender: 'Male',
      abhaId: '91-7788-9900-1122',
      phone: '+91 97110 55443',
      registeredDate: '02 Mar 2026',
      status: 'Verified (ABDM)',
      visitsCount: 2,
    },
    {
      id: 'PAT-104',
      name: 'Meera Patel',
      age: 34,
      gender: 'Female',
      abhaId: '91-1122-3344-5566',
      phone: '+91 99234 88776',
      registeredDate: '18 Apr 2026',
      status: 'Pending KYC',
      visitsCount: 1,
    },
  ];

  // Sample doctor records
  const doctorRecords = [
    {
      id: 'DOC-01',
      name: 'Dr. Sharma',
      qualification: 'MBBS, MD (General Medicine)',
      specialty: 'Internal Medicine & Pulmonology',
      licenseNumber: 'MCI-DEL-44129',
      activeShift: 'Morning OPD (09:00 - 14:00)',
      patientsSeenToday: 18,
      rating: '4.9 / 5.0',
    },
    {
      id: 'DOC-02',
      name: 'Dr. Priya Nair',
      qualification: 'MBBS, DCH (Pediatrics)',
      specialty: 'Child Health & Neonatology',
      licenseNumber: 'KMC-88120',
      activeShift: 'Afternoon OPD (14:00 - 19:00)',
      patientsSeenToday: 14,
      rating: '4.8 / 5.0',
    },
    {
      id: 'DOC-03',
      name: 'Dr. Ananya Roy',
      qualification: 'MBBS, MD (Dermatology)',
      specialty: 'Dermatology & Clinical Allergies',
      licenseNumber: 'WBMC-39102',
      activeShift: 'Teleconsultation Shift',
      patientsSeenToday: 11,
      rating: '4.9 / 5.0',
    },
    {
      id: 'DOC-04',
      name: 'Dr. Rajesh Khanna',
      qualification: 'MBBS, MS (Orthopedics)',
      specialty: 'Joint Replacement & Trauma',
      licenseNumber: 'MMC-77218',
      activeShift: 'Morning OPD (09:00 - 14:00)',
      patientsSeenToday: 22,
      rating: '4.7 / 5.0',
    },
  ];

  const filteredUsers = usersList.filter((u) => {
    const matchesFilter = userFilter === 'all' || u.role === userFilter;
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div
      id="admin-portal-container"
      className="min-h-screen w-full bg-[#F4F8FD] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800"
    >
      {/* ── TOP NAVIGATION BAR ── */}
      <header
        id="admin-portal-header"
        className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5 text-blue-400 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                  Swasthya <span className="text-[#2563EB] font-black">AI</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-[#64748B] hidden sm:block">
                Hospital IT Administration & Compliance
              </p>
            </div>
          </div>

          {/* Admin Profile & Logout Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{adminName}</p>
                <p className="text-xs text-emerald-600 font-semibold">● Security Level 3</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                Adm
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="admin-portal-logout-btn"
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
              title="Logout from Admin Portal"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN PORTAL CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* ADMIN WELCOME BANNER */}
        <div
          id="admin-welcome-banner"
          className="w-full bg-[#0F172A] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="space-y-2 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-300">
              <Shield className="w-3.5 h-3.5" />
              <span>Hospital Core Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Administration: {adminName}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Real-time oversight of hospital clinical users, patient registries, doctor OPD assignments, and ABDM health cloud integration.
            </p>
          </div>

          <div className="z-10 flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-left">
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">System Status</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Services Nominal
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>System Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'users'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({usersList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'patients'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Patient Records ({patientRecords.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'doctors'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Records ({doctorRecords.length})</span>
          </button>
        </div>

        {/* ── TAB CONTENT ── */}
        {/* 1. SYSTEM OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total Patients</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{systemMetrics.totalPatients}</div>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +12% this month
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Active Doctors on Duty</span>
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{systemMetrics.activeDoctors}</div>
                <p className="text-xs text-slate-500 mt-1">Across 6 hospital departments</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Consultations Today</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{systemMetrics.consultationsToday}</div>
                <p className="text-xs text-slate-500 mt-1">Voice and in-person OPD</p>
              </div>
            </div>

            {/* Secondary System Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  Infrastructure & Cloud Telemetry
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600">System Uptime</span>
                    <span className="font-bold text-emerald-600">{systemMetrics.systemHealth}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600">ABDM National Health Gateway</span>
                    <span className="font-bold text-emerald-600">{systemMetrics.abdmSyncStatus}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600">Voice AI Transcription Latency</span>
                    <span className="font-bold text-blue-600">{systemMetrics.voiceServerLatency}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-700" />
                  Security & Compliance Audits
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                    <span>HIPAA & DISHA Compliance</span>
                    <span className="font-bold">Passed (Aug 2026)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600">End-to-End Encryption</span>
                    <span className="font-bold text-slate-800">AES-256 Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600">Daily Backup Snapshot</span>
                    <span className="font-bold text-slate-800">03:00 AM UTC (Verified)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">System User Accounts</h2>
                <p className="text-xs text-slate-500">Manage patient, doctor, and admin authorizations</p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs">
                  {(['all', 'patient', 'doctor', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setUserFilter(r)}
                      className={`px-3 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-colors ${
                        userFilter === r ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search user..."
                    className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 w-44"
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-3">User ID</th>
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Department / Ward</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-slate-500">{u.id}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            u.role === 'doctor'
                              ? 'bg-blue-100 text-blue-700'
                              : u.role === 'admin'
                              ? 'bg-slate-900 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-3 text-slate-500">{u.department}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PATIENT RECORDS TAB */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">Hospital Patient Master Records</h2>
                <p className="text-xs text-slate-500">Government ABHA verified registry and clinical file directory</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientRecords.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-base text-slate-900">{p.name}</span>
                      <span className="text-xs text-slate-500 ml-2">
                        {p.age}y • {p.gender}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                      {p.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong className="text-slate-700">ABHA ID:</strong> {p.abhaId}</p>
                    <p><strong className="text-slate-700">Contact:</strong> {p.phone}</p>
                    <p><strong className="text-slate-700">Total Clinical Encounters:</strong> {p.visitsCount} visits</p>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span>File ID: {p.id}</span>
                    <span>Registered on {p.registeredDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. DOCTOR RECORDS TAB */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">Doctor Credential & Clinical Registry</h2>
                <p className="text-xs text-slate-500">Medical council registration, OPD assignments, and shifts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctorRecords.map((d) => (
                <div
                  key={d.id}
                  className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-base text-blue-950">{d.name}</span>
                      <p className="text-xs text-slate-500">{d.qualification}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800">
                      ★ {d.rating}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong className="text-slate-800">Specialty:</strong> {d.specialty}</p>
                    <p><strong className="text-slate-800">Medical Registration:</strong> {d.licenseNumber}</p>
                    <p><strong className="text-slate-800">Current Shift:</strong> {d.activeShift}</p>
                    <p><strong className="text-slate-800">Patients Seen Today:</strong> {d.patientsSeenToday}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 border-t border-blue-100 flex items-center justify-between">
                    <span>Staff Code: {d.id}</span>
                    <span className="text-emerald-600 font-semibold">Active On Duty</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 select-none border-t border-slate-200 bg-white">
        © 2026 Swasthya AI Administration Portal. System records protected under ABDM guidelines.
      </footer>
    </div>
  );
};
