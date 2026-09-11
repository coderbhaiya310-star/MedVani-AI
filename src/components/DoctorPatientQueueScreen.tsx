import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  UserCheck,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface QueuePatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  duration: string;
  status: 'New' | 'In Review' | 'Reviewed';
  urgency: 'routine' | 'urgent';
  timeWaiting: string;
}

interface DoctorPatientQueueScreenProps {
  onSelectPatient: (id: string) => void;
  onBack: () => void;
}

export const DoctorPatientQueueScreen: React.FC<DoctorPatientQueueScreenProps> = ({
  onSelectPatient,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'New' | 'In Review' | 'Reviewed'>('All');

  const patients: QueuePatient[] = [
    {
      id: 'p-1',
      name: 'Priya Sharma',
      age: 28,
      gender: 'F',
      complaint: 'Abdominal pain (center)',
      duration: '1 day',
      status: 'New',
      urgency: 'urgent',
      timeWaiting: '12m',
    },
    {
      id: 'p-2',
      name: 'Ramesh Patel',
      age: 54,
      gender: 'M',
      complaint: 'Chest tightness & fatigue',
      duration: '3 hours',
      status: 'In Review',
      urgency: 'urgent',
      timeWaiting: '25m',
    },
    {
      id: 'p-3',
      name: 'Sunita Roy',
      age: 35,
      gender: 'F',
      complaint: 'Persistent high fever & chills',
      duration: '3 days',
      status: 'New',
      urgency: 'routine',
      timeWaiting: '45m',
    },
    {
      id: 'p-4',
      name: 'Arun Kumar',
      age: 42,
      gender: 'M',
      complaint: 'Right knee joint inflammation',
      duration: '1 week',
      status: 'Reviewed',
      urgency: 'routine',
      timeWaiting: 'Done',
    },
    {
      id: 'p-5',
      name: 'Meena Kulkarni',
      age: 61,
      gender: 'F',
      complaint: 'Dizziness, missed BP medication',
      duration: '2 days',
      status: 'Reviewed',
      urgency: 'routine',
      timeWaiting: 'Done',
    },
    {
      id: 'p-6',
      name: 'Aakash Verma',
      age: 19,
      gender: 'M',
      complaint: 'Acute sore throat, difficulty swallowing',
      duration: '2 days',
      status: 'New',
      urgency: 'routine',
      timeWaiting: '1h 10m',
    },
  ];

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.complaint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-2xs">
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
          <span>Dashboard</span>
        </button>
      </header>

      {/* Main Queue Content */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-6 flex-1 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active patient clinical sessions awaiting doctor verification and prescription
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name or symptom..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 shadow-2xs"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {(['All', 'New', 'In Review', 'Reviewed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-white text-teal-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab} {tab === 'All' ? '(25)' : tab === 'New' ? '(8)' : tab === 'In Review' ? '(5)' : '(12)'}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Patient</th>
                  <th className="py-3.5 px-5">Age</th>
                  <th className="py-3.5 px-5">Complaint</th>
                  <th className="py-3.5 px-5">Duration</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPatient(p.id)}
                    className="hover:bg-teal-50/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400">Wait: {p.timeWaiting}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {p.age}y, {p.gender}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-slate-900">{p.complaint}</span>
                      {p.urgency === 'urgent' && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Priority
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">{p.duration}</td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.status === 'New'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : p.status === 'In Review'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-teal-50 text-teal-700 border border-teal-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(p.id);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-2xs transition cursor-pointer"
                      >
                        View Case
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
  );
};
