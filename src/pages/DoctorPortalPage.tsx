import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Users,
  FileText,
  Calendar,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Activity,
  User,
  HeartPulse,
  Phone,
  ArrowRight,
  ClipboardList,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { AuthUser } from '../types';

interface DoctorPortalPageProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export const DoctorPortalPage: React.FC<DoctorPortalPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'patients' | 'history' | 'consultations' | 'appointments'>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PAT-101');
  const [searchQuery, setSearchQuery] = useState('');

  const doctorName = user?.fullName || 'Dr. Sharma';
  const doctorSpecialty = 'Senior Consultant • General Medicine & Pulmonology';

  // Sample patient list
  const patientList = [
    {
      id: 'PAT-101',
      name: 'Rahul Kumar',
      age: 28,
      gender: 'Male',
      phone: '+91 98765 43210',
      chiefComplaint: 'Productive cough for 5 days, low-grade evening fever, chest tightness',
      priority: 'Urgent',
      status: 'Waiting in OPD Queue',
      tokenNumber: 'A-12',
      history: {
        chronicDiseases: 'Mild childhood asthma, Seasonal Rhinitis',
        allergies: 'Penicillin (Severe hives)',
        lastVisit: '14 Aug 2026',
        vitals: 'BP: 124/82 mmHg • Pulse: 78 bpm • SpO2: 98% • Temp: 99.1°F',
        recentInvestigations: 'Chest X-Ray (Clear, no consolidation), CBC (Mild leukocytosis)',
        previousDiagnosis: 'Acute Upper Respiratory Tract Infection',
      },
    },
    {
      id: 'PAT-102',
      name: 'Sunita Devi',
      age: 52,
      gender: 'Female',
      phone: '+91 98450 11223',
      chiefComplaint: 'Knee joint pain exacerbated upon climbing stairs, morning stiffness',
      priority: 'Routine',
      status: 'Triage Completed',
      tokenNumber: 'A-14',
      history: {
        chronicDiseases: 'Type 2 Diabetes Mellitus (HbA1c 7.1%), Hypertension',
        allergies: 'No known drug allergies (NKDA)',
        lastVisit: '02 Jul 2026',
        vitals: 'BP: 138/88 mmHg • Pulse: 72 bpm • SpO2: 99% • Blood Sugar: 142 mg/dL',
        recentInvestigations: 'Bilateral Knee X-Ray (Grade II Osteoarthritis changes)',
        previousDiagnosis: 'Bilateral Knee Osteoarthritis',
      },
    },
    {
      id: 'PAT-103',
      name: 'Amitabh Sen',
      age: 44,
      gender: 'Male',
      phone: '+91 97110 55443',
      chiefComplaint: 'Acute epigastric burning post meals, occasional acid regurgitation',
      priority: 'Routine',
      status: 'Ready for Review',
      tokenNumber: 'A-15',
      history: {
        chronicDiseases: 'GERD, Hyperlipidemia',
        allergies: 'Sulfa drugs (rash)',
        lastVisit: '29 May 2026',
        vitals: 'BP: 120/80 mmHg • Pulse: 76 bpm • SpO2: 99% • Temp: 98.4°F',
        recentInvestigations: 'Upper GI Endoscopy (Mild antral gastritis, H. pylori negative)',
        previousDiagnosis: 'Non-erosive Reflux Disease (NERD)',
      },
    },
    {
      id: 'PAT-104',
      name: 'Meera Patel',
      age: 34,
      gender: 'Female',
      phone: '+91 99234 88776',
      chiefComplaint: 'Severe throbbing hemicranial headache with photophobia and nausea',
      priority: 'Urgent',
      status: 'Voice Intake Completed',
      tokenNumber: 'A-16',
      history: {
        chronicDiseases: 'Episodic Migraine without aura',
        allergies: 'Aspirin (Gastric irritation)',
        lastVisit: '10 Feb 2026',
        vitals: 'BP: 118/76 mmHg • Pulse: 84 bpm • SpO2: 99% • Temp: 98.6°F',
        recentInvestigations: 'Brain MRI (Normal, no focal intracranial lesion)',
        previousDiagnosis: 'Common Migraine',
      },
    },
  ];

  // Consultations today
  const consultations = [
    {
      id: 'CONS-901',
      patientName: 'Rahul Kumar',
      token: 'A-12',
      time: '10:00 AM',
      type: 'OPD Clinical Intake',
      status: 'In Progress',
      summary: 'Voice interview conducted in Hindi. Auto-transcribed & translated to medical English.',
    },
    {
      id: 'CONS-902',
      patientName: 'Kavita Joshi',
      token: 'A-08',
      time: '09:30 AM',
      type: 'Follow-up Review',
      status: 'Completed',
      summary: 'Prescribed continuation of inhalation therapy. Spirometry normal.',
    },
    {
      id: 'CONS-903',
      patientName: 'Ramesh Verma',
      token: 'A-05',
      time: '09:00 AM',
      type: 'New Consultation',
      status: 'Completed',
      summary: 'Referred to Cardiology for 2D Echo evaluation. Blood pressure stabilized.',
    },
  ];

  // Appointments schedule
  const appointments = [
    {
      id: 'APT-D1',
      time: '10:30 AM',
      patientName: 'Sunita Devi',
      type: 'Follow-up Consultation',
      room: 'OPD Room 3B',
      status: 'Upcoming',
    },
    {
      id: 'APT-D2',
      time: '11:15 AM',
      patientName: 'Amitabh Sen',
      type: 'New Patient Intake',
      room: 'OPD Room 3B',
      status: 'Upcoming',
    },
    {
      id: 'APT-D3',
      time: '12:00 PM',
      patientName: 'Meera Patel',
      type: 'Clinical Assessment',
      room: 'OPD Room 3B',
      status: 'Scheduled',
    },
    {
      id: 'APT-D4',
      time: '02:30 PM',
      patientName: 'Deepak Saxena',
      type: 'Teleconsultation / Voice Review',
      room: 'Virtual Room',
      status: 'Scheduled',
    },
  ];

  const filteredPatients = patientList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePatient = patientList.find((p) => p.id === selectedPatientId) || patientList[0];

  return (
    <div
      id="doctor-portal-container"
      className="min-h-screen w-full bg-[#F4F8FD] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800"
    >
      {/* ── TOP NAVIGATION BAR ── */}
      <header
        id="doctor-portal-header"
        className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                  Swasthya <span className="text-[#2563EB] font-black">AI</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Doctor Portal
                </span>
              </div>
              <p className="text-xs text-[#64748B] hidden sm:block">
                Clinical Intelligence & OPD Management
              </p>
            </div>
          </div>

          {/* Doctor Profile & Logout Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{doctorName}</p>
                <p className="text-xs text-slate-500">OPD Block B • Room 3</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs border border-blue-200">
                Dr
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="doctor-portal-logout-btn"
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
              title="Logout from Doctor Portal"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN PORTAL CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* DOCTOR BANNER */}
        <div
          id="doctor-welcome-banner"
          className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Active OPD Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good day, {doctorName}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              {doctorSpecialty}. 4 patients waiting in today's OPD queue. AI-assisted voice intake notes are ready for review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/voice-intake')}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Open Voice Examination</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'patients'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patient List ({patientList.length})</span>
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
            <span>Patient History ({activePatient.name})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'consultations'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Consultations ({consultations.length})</span>
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
            <span>Appointments Today ({appointments.length})</span>
          </button>
        </div>

        {/* ── TAB CONTENT ── */}
        {/* 1. PATIENT LIST TAB */}
        {activeTab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Patient List Table / Cards */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-bold text-lg text-slate-900">Today's Patient Queue</h2>
                <div className="relative w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient or complaint..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredPatients.map((patient) => {
                  const isSelected = selectedPatientId === patient.id;
                  return (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                          : 'border-slate-100 bg-slate-50/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                            {patient.tokenNumber}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-slate-900">{patient.name}</span>
                            <span className="text-xs text-slate-400 ml-2">
                              {patient.age}y • {patient.gender} • {patient.id}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            patient.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {patient.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        <strong className="text-slate-700">Complaint:</strong> {patient.chiefComplaint}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-200/60">
                        <span>{patient.status}</span>
                        <span className="text-blue-600 font-semibold flex items-center gap-1">
                          View History <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Quick Patient History Snapshot */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{activePatient.name}</h3>
                  <p className="text-xs text-slate-500">ID: {activePatient.id} • Token: {activePatient.tokenNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Full History →
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-800">Critical Allergies:</span>
                  <p className="text-amber-900 mt-0.5">{activePatient.history.allergies}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Recorded Vitals:</span>
                  <p className="text-slate-800 mt-0.5 font-mono">{activePatient.history.vitals}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Chronic Conditions:</span>
                  <p className="text-slate-600 mt-0.5">{activePatient.history.chronicDiseases}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Recent Investigations:</span>
                  <p className="text-slate-600 mt-0.5">{activePatient.history.recentInvestigations}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/voice-intake')}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Begin Clinical Intake for {activePatient.name}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PATIENT HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">
                  Detailed Medical History: {activePatient.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Age: {activePatient.age} | Gender: {activePatient.gender} | Contact: {activePatient.phone}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-full text-xs">
                  {activePatient.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Chief Complaint & Onset</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{activePatient.chiefComplaint}</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <h4 className="font-bold text-sm text-rose-800 mb-1">Drug Allergies & Adverse Reactions</h4>
                  <p className="text-xs text-rose-700 leading-relaxed">{activePatient.history.allergies}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Chronic Co-morbidities</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{activePatient.history.chronicDiseases}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <h4 className="font-bold text-sm text-blue-900 mb-1">Recent Clinical Vitals</h4>
                  <p className="text-xs text-blue-800 font-mono leading-relaxed">{activePatient.history.vitals}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Diagnostic Investigations</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{activePatient.history.recentInvestigations}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Previous Diagnosis & Notes</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Last visit on {activePatient.history.lastVisit}: {activePatient.history.previousDiagnosis}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CONSULTATIONS TAB */}
        {activeTab === 'consultations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">OPD Consultations Today</h2>
                <p className="text-xs text-slate-500">Live intake summaries, diagnoses, and completed visits</p>
              </div>
            </div>

            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">{c.patientName}</span>
                      <span className="text-xs text-slate-400">({c.id})</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          c.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{c.type} • Slot {c.time} • Token {c.token}</p>
                    <p className="text-xs text-slate-500 italic mt-1">{c.summary}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/voice-intake')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Open Clinical Sheet
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">Doctor Appointment Schedule</h2>
                <p className="text-xs text-slate-500">Scheduled clinical evaluations for today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-blue-950">{apt.time}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {apt.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{apt.patientName}</p>
                    <p className="text-xs text-slate-500">{apt.type} • {apt.room}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/voice-intake')}
                    className="px-3.5 py-2 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold cursor-pointer"
                  >
                    Consult
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 select-none border-t border-slate-200 bg-white">
        © 2026 Swasthya AI Doctor Portal. Connected to Hospital OPD & Clinical Intelligence.
      </footer>
    </div>
  );
};
