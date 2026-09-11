import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
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
  Eye,
  ExternalLink,
  Pill,
  X,
  Building,
  FileSpreadsheet,
  Download,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import {
  AuthUser,
  PatientRecord,
  CaseTakingSession,
  MedicalDocument,
  MedicalReportItem,
  ConsultationRecord,
  StructuredInterviewState,
} from '../types';
import { dbService } from '../services/dbService';
import { OriginalDocumentModal } from '../components/OriginalDocumentModal';

interface DoctorPortalPageProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export const DoctorPortalPage: React.FC<DoctorPortalPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'patients' | 'history' | 'consultations' | 'appointments'>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PAT-001');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Database State
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [activeSession, setActiveSession] = useState<CaseTakingSession | null>(null);
  const [patientDocuments, setPatientDocuments] = useState<MedicalDocument[]>([]);
  const [patientReports, setPatientReports] = useState<MedicalReportItem[]>([]);
  const [patientConsultations, setPatientConsultations] = useState<ConsultationRecord[]>([]);
  const [interviewState, setInterviewState] = useState<StructuredInterviewState | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);

  const handleVerifyDocDate = async (docId: string, newDate: string) => {
    try {
      const updated = await dbService.verifyDocumentDate(docId, newDate);
      if (updated) {
        setPatientDocuments((prev) => prev.map((d) => (d.id === docId ? updated : d)));
        setViewingDoc(updated);
      }
      await fetch(`/api/documents/${docId}/verify-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentDate: newDate }),
      }).catch(() => {});
    } catch (e) {
      console.error('Error verifying date by doctor:', e);
    }
  };

  const doctorName = user?.fullName || 'Dr. Rajesh Sharma, MD';
  const doctorSpecialty = 'Senior Consultant • General & Internal Medicine';

  // 1. Initial Load of Patients from Database
  useEffect(() => {
    let isMounted = true;
    const loadPatients = async () => {
      try {
        dbService.ensureInitialized();
        const pts = await dbService.getPatients();
        if (isMounted) {
          setPatientRecords(pts);
          if (pts.length > 0 && (!selectedPatientId || selectedPatientId === 'PAT-101')) {
            setSelectedPatientId(pts[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading patients:', err);
      }
    };
    loadPatients();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load Selected Patient's Complete Isolated Data
  useEffect(() => {
    let isMounted = true;
    if (!selectedPatientId) return;

    const loadPatientDetails = async () => {
      setIsLoadingSession(true);
      try {
        const [session, docs, reports, consultations, interview] = await Promise.all([
          dbService.loadFullSessionForPatient(selectedPatientId),
          dbService.getPatientDocuments(selectedPatientId),
          dbService.getPatientReports(selectedPatientId),
          dbService.getPatientConsultations(selectedPatientId),
          dbService.getInterviewState(selectedPatientId),
        ]);

        if (isMounted) {
          setActiveSession(session);
          setPatientDocuments(docs);
          setPatientReports(reports);
          setPatientConsultations(consultations);
          setInterviewState(interview);
        }
      } catch (err) {
        console.error(`Error loading data for ${selectedPatientId}:`, err);
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    };

    loadPatientDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedPatientId]);

  // Derived patient list for rendering
  const mappedPatients = patientRecords.map((p, index) => {
    const queueNum = p.queueNumber || index + 1;
    const tokenStr = `A-${String(queueNum).padStart(2, '0')}`;
    const priorityLabel = p.priority === 'urgent' || p.priority === 'critical' ? 'Urgent' : 'Routine';
    const statusLabel =
      p.status === 'completed'
        ? 'Triage Completed'
        : p.status === 'in-progress'
        ? 'Voice Intake Completed'
        : 'Waiting in OPD Queue';

    return {
      id: p.id,
      name: p.fullName,
      age: p.age,
      gender: p.gender === 'male' ? 'Male' : p.gender === 'female' ? 'Female' : 'Other',
      phone: p.phoneNumber || p.mobile || '+91 98765 00000',
      chiefComplaint: p.chiefComplaint || 'Routine Medical Checkup',
      priority: priorityLabel,
      status: statusLabel,
      tokenNumber: tokenStr,
      raw: p,
    };
  });

  const filteredPatients = mappedPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePatientItem = mappedPatients.find((p) => p.id === selectedPatientId) || mappedPatients[0];

  // Helper properties from loaded data
  const summary = activeSession?.summary;
  const live = activeSession?.liveExtraction;
  const conversationTranscript =
    activeSession?.messages && activeSession.messages.length > 0
      ? activeSession.messages
      : interviewState?.conversationTranscript && interviewState.conversationTranscript.length > 0
      ? interviewState.conversationTranscript
      : [];
  const latestVitals = patientConsultations[0]?.vitals || {
    bloodPressure: '122/80 mmHg',
    pulse: '76 bpm',
    spo2: '98%',
    temperature: '98.6 °F',
  };

  const allergiesList =
    summary?.allergies && summary.allergies.length > 0
      ? summary.allergies.map((a) => `${a.allergen} (${a.reaction || 'Adverse reaction'})`).join(', ')
      : interviewState?.allergies && interviewState.allergies.length > 0
      ? interviewState.allergies.join(', ')
      : 'No known drug allergies (NKDA)';

  const chronicConditions =
    summary?.pastMedicalHistory && summary.pastMedicalHistory.length > 0
      ? summary.pastMedicalHistory.join(', ')
      : interviewState?.medicalHistory && interviewState.medicalHistory.length > 0
      ? interviewState.medicalHistory.join(', ')
      : 'None reported';

  const investigationsSummary =
    patientDocuments.length > 0
      ? patientDocuments.map((d) => d.title).join(' • ')
      : 'Routine vitals and examination';

  const medicationsList =
    summary?.medicationReconciliation && summary.medicationReconciliation.length > 0
      ? summary.medicationReconciliation
      : interviewState?.medicationHistory && interviewState.medicationHistory.length > 0
      ? interviewState.medicationHistory.map((m) => ({
          drugName: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          prescribedBy: m.prescribedFor,
        }))
      : [];

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
              {doctorSpecialty}. {mappedPatients.length} patients registered in today's OPD queue. AI-assisted nurse intake records, conversational transcripts, and medical documents are ready for evaluation.
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
            <span>Patient List ({mappedPatients.length})</span>
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
            <span>Patient Case Sheet & Documents ({activePatientItem?.name || 'Patient'})</span>
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
            <span>Consultations ({patientConsultations.length})</span>
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
            <span>Appointments Today ({mappedPatients.length})</span>
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
                    placeholder="Search patient, ID, or complaint..."
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
                          View Case & Files <ChevronRight className="w-3.5 h-3.5" />
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
                  <h3 className="font-bold text-base text-slate-900">{activePatientItem?.name}</h3>
                  <p className="text-xs text-slate-500">ID: {activePatientItem?.id} • Token: {activePatientItem?.tokenNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Full History & Files ({patientDocuments.length}) →
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Critical Allergies */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    Critical Allergies:
                  </span>
                  <p className="text-amber-900 mt-0.5">{allergiesList}</p>
                </div>

                {/* Recorded Vitals */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                    Recorded Vitals:
                  </span>
                  <p className="text-slate-800 mt-0.5 font-mono">
                    BP: {latestVitals.bloodPressure || '120/80 mmHg'} • Pulse: {latestVitals.pulse || '74 bpm'} • SpO2: {latestVitals.spo2 || '98%'} • Temp: {latestVitals.temperature || '98.6°F'}
                  </p>
                </div>

                {/* Chronic Conditions */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Chronic Conditions:</span>
                  <p className="text-slate-600 mt-0.5">{chronicConditions}</p>
                </div>

                {/* AI Nurse Chief Complaint & Key Symptoms */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI Nurse Intake Summary:
                  </span>
                  <p className="text-blue-950 font-medium mt-0.5">
                    {summary?.chiefComplaint || activePatientItem?.chiefComplaint}
                  </p>
                  {live?.symptoms && live.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {live.symptoms.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Uploaded Documents Quick Access */}
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-purple-700" />
                      Uploaded Documents ({patientDocuments.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="text-[11px] text-purple-700 font-semibold hover:underline cursor-pointer"
                    >
                      View all
                    </button>
                  </div>
                  {patientDocuments.length === 0 ? (
                    <p className="text-slate-500 italic text-[11px]">No uploaded documents on file.</p>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      {patientDocuments.slice(0, 3).map((doc) => (
                        <div
                          key={doc.id}
                          className="p-2 bg-white rounded-lg border border-purple-200 flex items-center justify-between"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-slate-800 text-[11px] block truncate">{doc.title}</span>
                            <span className="text-[10px] text-slate-500">{doc.documentDate} • {doc.documentType}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="px-2 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Full Clinical Case & Files ({activePatientItem?.name})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PATIENT HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
            {/* Header & Patient Meta */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-extrabold text-2xl text-slate-900">
                    {activePatientItem?.name}
                  </h2>
                  <span className="px-3 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-xs">
                    {activePatientItem?.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                      activePatientItem?.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {activePatientItem?.priority} Priority
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Age: {activePatientItem?.age}y • Gender: {activePatientItem?.gender} • Phone: {activePatientItem?.phone} • Token: {activePatientItem?.tokenNumber}
                  {activePatientItem?.raw?.abhaId && ` • ABHA ID: ${activePatientItem.raw.abhaId}`}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/voice-intake')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Resume Voice Examination</span>
                </button>
              </div>
            </div>

            {/* 1. AI CLINICAL NURSE CONVERSATION TRANSCRIPT */}
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">AI Nurse Intake Conversation Transcript</h3>
                    <p className="text-xs text-slate-500">
                      Complete dialogue captured between patient and AI Nurse ({conversationTranscript.length} exchanges)
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 font-semibold rounded-lg">
                  Direct Patient Words
                </span>
              </div>

              {/* Transcript Scroll Container */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {conversationTranscript.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3">No recorded conversation messages yet.</p>
                ) : (
                  conversationTranscript.map((msg, i) => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div
                        key={msg.id || i}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          isAi
                            ? 'bg-blue-50/70 border-blue-200 text-blue-950 mr-4 sm:mr-12'
                            : 'bg-white border-slate-200 text-slate-800 ml-4 sm:ml-12 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold ${isAi ? 'text-blue-700' : 'text-slate-700'}`}>
                            {isAi ? 'AI Clinical Nurse' : activePatientItem?.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. AI CLINICAL CASE SUMMARY & CONCLUSIONS */}
            <div className="bg-[#F0F7FF] rounded-2xl p-5 sm:p-6 border border-sky-200 space-y-4">
              <div className="flex items-center justify-between border-b border-sky-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">AI Structured Clinical Case Conclusions</h3>
                    <p className="text-xs text-slate-500">
                      Automated medical synthesis and differential diagnosis
                    </p>
                  </div>
                </div>
              </div>

              {/* Provisional Differential Diagnosis */}
              {summary?.provisionalDifferentialDiagnosis && summary.provisionalDifferentialDiagnosis.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-sky-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Provisional Differential Diagnosis:
                  </span>
                  <div className="space-y-2">
                    {summary.provisionalDifferentialDiagnosis.map((diag, i) => (
                      <div key={i} className="p-3 bg-sky-50/60 rounded-lg border border-sky-100">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-sky-950">{diag.condition}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-800">
                            {diag.likelihood} likelihood
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{diag.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Narrative / HPI */}
              <div className="p-4 bg-white rounded-xl border border-sky-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">
                  History of Present Illness Narrative:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {summary?.historyOfPresentIllness?.chronologicalNarrative ||
                    `${activePatientItem?.name} presented with ${summary?.chiefComplaint || activePatientItem?.chiefComplaint}. Onset: ${summary?.historyOfPresentIllness?.onset || 'Recent'}. Location: ${summary?.historyOfPresentIllness?.locationAndRadiation || 'As noted'}. Severity: ${summary?.historyOfPresentIllness?.characterAndSeverity || 'Moderate'}.`}
                </p>
              </div>

              {/* Red Flags & Urgent Alerts */}
              {summary?.redFlagsOrUrgentAlerts && summary.redFlagsOrUrgentAlerts.length > 0 && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-1.5 text-xs">
                  <span className="font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Clinical Red Flags / Urgent Alerts:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-rose-900 font-medium">
                    {summary.redFlagsOrUrgentAlerts.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Investigations & Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {summary?.suggestedInvestigationsForDoctor && summary.suggestedInvestigationsForDoctor.length > 0 && (
                  <div className="p-3.5 bg-white rounded-xl border border-sky-200 space-y-1.5">
                    <span className="font-bold text-slate-800 uppercase tracking-wider block">
                      Suggested Investigations:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {summary.suggestedInvestigationsForDoctor.map((inv, idx) => (
                        <li key={idx}>{inv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary?.suggestedClarifyingQuestionsForDoctor && summary.suggestedClarifyingQuestionsForDoctor.length > 0 && (
                  <div className="p-3.5 bg-white rounded-xl border border-sky-200 space-y-1.5">
                    <span className="font-bold text-slate-800 uppercase tracking-wider block">
                      Recommended Clarifying Questions:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {summary.suggestedClarifyingQuestionsForDoctor.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 3. UPLOADED MEDICAL DOCUMENTS, SCANS & PRESCRIPTIONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Uploaded Medical Documents & Files ({patientDocuments.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Scanned prescriptions, lab reports, imaging scans, and previous discharge summaries
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/documents')}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Document Timeline View</span>
                </button>
              </div>

              {patientDocuments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-500 italic">No uploaded documents or files found for this patient.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patientDocuments.map((doc) => {
                    const isUnclearDate =
                      doc.dateVerificationStatus === 'needs_verification' ||
                      !doc.documentDate ||
                      doc.documentDate.trim() === '';

                    return (
                      <div
                        key={doc.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                                  {doc.documentType.replace('_', ' ')}
                                </span>
                                {isUnclearDate ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>Needs Verification</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Verified</span>
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-sm text-slate-900 leading-snug">{doc.title}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => setViewingDoc(doc)}
                              className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer shrink-0"
                              title="Inspect original document & OCR"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <strong>Date:</strong> {doc.documentDate || 'Unspecified'} {doc.facilityOrDoctor && `• ${doc.facilityOrDoctor}`}
                          </p>

                          {/* AI Summary Preview */}
                          {doc.aiSummary && (
                            <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 line-clamp-2">
                              <span className="font-bold text-purple-800">AI Summary: </span>
                              {doc.aiSummary}
                            </div>
                          )}

                          {/* OCR Text Preview */}
                          {doc.extractedText && !doc.aiSummary && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 line-clamp-2 font-mono">
                              {doc.extractedText}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {doc.uploadedAt ? `Archived: ${doc.uploadedAt.split('T')[0]}` : 'Ready for review'}
                            {doc.pageCount && doc.pageCount > 1 ? ` • ${doc.pageCount} pgs` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Original & OCR</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. CLINICAL DETAILS GRID (Complaint, Allergies, Chronic, Vitals, Medications) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Chief Complaint & Onset */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Chief Complaint & Onset</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {summary?.chiefComplaint || activePatientItem?.chiefComplaint}
                  </p>
                  {live?.duration && (
                    <p className="text-xs text-slate-500 mt-1">
                      <strong>Duration:</strong> {live.duration} {live.location && `• Location: ${live.location}`}
                    </p>
                  )}
                </div>

                {/* Drug Allergies */}
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <h4 className="font-bold text-sm text-rose-800 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Drug Allergies & Adverse Reactions</span>
                  </h4>
                  <p className="text-xs text-rose-700 leading-relaxed font-semibold">{allergiesList}</p>
                </div>

                {/* Chronic Co-morbidities */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Chronic Co-morbidities & Past History</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{chronicConditions}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Clinical Vitals */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <h4 className="font-bold text-sm text-blue-900 mb-1 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-blue-600" />
                    <span>Recent Clinical Vitals</span>
                  </h4>
                  <p className="text-xs text-blue-800 font-mono leading-relaxed">
                    BP: {latestVitals.bloodPressure || '120/80 mmHg'} • Pulse: {latestVitals.pulse || '74 bpm'} • SpO2: {latestVitals.spo2 || '98%'} • Temp: {latestVitals.temperature || '98.6°F'}
                  </p>
                </div>

                {/* Prescribed Medications & Reconciliation */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <h4 className="font-bold text-sm text-emerald-900 mb-1 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-700" />
                    <span>Current Medications & Reconciliation</span>
                  </h4>
                  {medicationsList.length === 0 ? (
                    <p className="text-xs text-emerald-800">None currently prescribed or reported.</p>
                  ) : (
                    <div className="space-y-1.5 mt-2">
                      {medicationsList.map((med, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{med.drugName}</span>
                            <span className="text-slate-500 ml-1.5">{med.dosage} ({med.frequency})</span>
                          </div>
                          {med.prescribedBy && (
                            <span className="text-[10px] text-slate-400 italic">By: {med.prescribedBy}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Diagnostic Investigations Overview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Diagnostic Investigations Overview</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{investigationsSummary}</p>
                </div>
              </div>
            </div>

            {/* 5. STRUCTURED LAB REPORTS & TESTS TABLE */}
            {patientReports.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Ingested Laboratory Diagnostic Reports ({patientReports.length})</span>
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-3">Test Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Result</th>
                        <th className="p-3">Reference Range</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {patientReports.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-slate-900">{r.testName}</td>
                          <td className="p-3">{r.reportType}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{r.result} {r.units || ''}</td>
                          <td className="p-3 text-slate-500">{r.referenceRange || 'Standard'}</td>
                          <td className="p-3 text-slate-500">{r.reportDate}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                                r.status === 'critical'
                                  ? 'bg-rose-100 text-rose-700'
                                  : r.status === 'abnormal'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CONSULTATIONS TAB */}
        {activeTab === 'consultations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">OPD Consultations</h2>
                <p className="text-xs text-slate-500">Live intake summaries, diagnoses, and completed visits</p>
              </div>
            </div>

            <div className="space-y-4">
              {patientConsultations.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-500 italic">
                    No prior consultations on file for {activePatientItem?.name}.
                  </p>
                </div>
              ) : (
                patientConsultations.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{activePatientItem?.name}</span>
                        <span className="text-xs text-slate-400">({c.id})</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {c.doctorName} • Date: {c.date} • Time: {c.time}
                      </p>
                      <p className="text-xs text-slate-700 font-medium mt-1">
                        <strong>Chief Complaint:</strong> {c.chiefComplaint}
                      </p>
                      {c.clinicalHistory && (
                        <p className="text-xs text-slate-500 italic mt-0.5">{c.clinicalHistory}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      Open Clinical Sheet
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-900">Doctor Appointment Schedule</h2>
                <p className="text-xs text-slate-500">Scheduled clinical evaluations for today's OPD</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mappedPatients.map((patient, index) => {
                const times = ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '02:00 PM'];
                const appointmentTime = times[index % times.length];
                return (
                  <div
                    key={patient.id}
                    className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-sm text-blue-950">{appointmentTime}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {patient.status}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                      <p className="text-xs text-slate-500">{patient.chiefComplaint} • OPD Room 3B</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setActiveTab('history');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold cursor-pointer"
                    >
                      Consult
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── HIGH RESOLUTION ORIGINAL DOCUMENT & OCR MODAL ── */}
      {viewingDoc && (
        <OriginalDocumentModal
          document={viewingDoc}
          onClose={() => setViewingDoc(null)}
          onVerifyDate={handleVerifyDocDate}
        />
      )}

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 select-none border-t border-slate-200 bg-white">
        © 2026 Swasthya AI Doctor Portal. Connected to Hospital OPD & Clinical Intelligence.
      </footer>
    </div>
  );
};
