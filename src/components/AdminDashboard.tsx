import React, { useState } from 'react';
import {
  Shield,
  Users,
  Activity,
  FileCheck,
  Server,
  Settings,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AuthUser, AuditLogEntry, UserRole } from '../types';
import { authService, DEMO_PATIENTS, DEMO_DOCTOR_USER, DEMO_ADMIN_USER } from '../services/authService';

interface AdminDashboardProps {
  user: AuthUser;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'audit' | 'settings'>('metrics');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => authService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Registered demo users list
  const allUsers: AuthUser[] = [
    DEMO_ADMIN_USER,
    DEMO_DOCTOR_USER,
    ...Object.values(DEMO_PATIENTS),
  ];

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phoneNumber?.includes(searchQuery) ||
      u.staffId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRefreshAudit = () => {
    setAuditLogs(authService.getAuditLogs());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Hospital IT & Clinical Compliance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            System Administration & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Authenticated Admin: <strong className="text-white">{user.fullName}</strong> • Role: Super Administrator
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            User Directory ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            EHR Config
          </button>
        </div>
      </div>

      {/* METRICS VIEW */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Patient Intakes</span>
              <div className="text-3xl font-extrabold text-teal-700">3 Cases</div>
              <p className="text-[11px] text-slate-500 font-medium">Ramesh (CAD), Savitri (OA/GI), Gurpreet (CKD)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Medical Records OCR</span>
              <div className="text-3xl font-extrabold text-indigo-700">11 Docs</div>
              <p className="text-[11px] text-slate-500 font-medium">100% extracted with medication reconciliation</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Clinical Conflicts Detected</span>
              <div className="text-3xl font-extrabold text-amber-700">5 Flags</div>
              <p className="text-[11px] text-slate-500 font-medium">3 High Severity (Statin, NSAID, Diuretic)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Compliance & Security</span>
              <div className="text-3xl font-extrabold text-emerald-700">100%</div>
              <p className="text-[11px] text-slate-500 font-medium">ABDM FHIR R4 & DISHA consent verified</p>
            </div>
          </div>

          {/* Infrastructure Health Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-teal-600" />
              Connected Clinical Services & Health Endpoints
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Gemini 3.8 Flash Engine</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-slate-600">Model: models/gemini-3.8-flash (Multilingual Clinical Extraction)</p>
                <span className="text-[10px] text-emerald-700 font-semibold">Latency: ~480ms</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Speech Audio Subsystem</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-slate-600">Web Speech Recognition + Synthesis (8 Indian Languages)</p>
                <span className="text-[10px] text-emerald-700 font-semibold">Elderly Pause Threshold: 2400ms</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">ABHA / ABDM Gateway</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-slate-600">HIPAA & DISHA Compliant Electronic Consent Vault</p>
                <span className="text-[10px] text-emerald-700 font-semibold">FHIR R4 Bundle Validation: OK</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER DIRECTORY VIEW */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hospital User & Role Directory</h2>
              <p className="text-xs text-slate-500">Manage patient credentials, authorized doctors, and system admins</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 w-60"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50"
              >
                <option value="all">All Roles</option>
                <option value="patient">Patients Only</option>
                <option value="doctor">Doctors Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">User Name & ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Contact Details</th>
                  <th className="p-3">Department / ABHA</th>
                  <th className="p-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{u.id}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'doctor'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-teal-100 text-teal-800 border border-teal-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{u.email || '—'}</div>
                      <div className="text-[11px] text-slate-400">{u.phoneNumber || '—'}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      {u.department || u.abhaId ? (
                        <span className="font-mono text-[11px] text-slate-700">
                          {u.department || `ABHA: ${u.abhaId}`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL VIEW */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security & Compliance Audit Trail</h2>
              <p className="text-xs text-slate-500">Immutable logging of logins, consent grants, and case actions</p>
            </div>
            <button
              onClick={handleRefreshAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.userName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                      {log.userRole}
                    </span>
                    <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      ACTION: {log.action}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{log.details}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                  <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                  <div>IP: {log.ipAddress || '127.0.0.1'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900">EHR & AI Gateway Configuration</h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Acoustic & Silence Thresholds</h3>
              <p className="text-slate-600">
                Silence timeout for detecting elderly patient answer completion without requiring manual button taps.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="font-semibold text-slate-800">Current Delay: 2,400 milliseconds (2.4s)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Optimized for Geriatric Pauses
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Security & Token Life</h3>
              <p className="text-slate-600">
                Session tokens expire automatically after 8 hours of inactivity for patient accounts and 12 hours for clinical staff.
              </p>
              <span className="text-slate-500 font-mono text-[11px]">Storage: swasthya_clinical_auth_session (Encrypted local persistence)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
