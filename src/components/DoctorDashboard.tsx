import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  FileText,
  Clock,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Copy,
  Sparkles,
  Calendar,
  FileSpreadsheet,
  Users,
  ChevronRight,
  ShieldCheck,
  Building,
  HeartPulse,
  History,
  FilePlus2,
  ListOrdered,
  ArrowRight,
} from 'lucide-react';
import {
  CaseTakingSession,
  StructuredClinicalSummary,
  MedicalDocument,
  ConflictFlag,
  ConsultationRecord,
  MedicalReportItem,
  DoctorNoteItem,
} from '../types';
import { dbService } from '../services/dbService';
import { PatientQueueList } from './doctor/PatientQueueList';
import { PatientProfileHeader } from './doctor/PatientProfileHeader';
import { TodaysConsultationTab } from './doctor/TodaysConsultationTab';
import { PreviousHistoryTab } from './doctor/PreviousHistoryTab';
import { MedicalReportsTab } from './doctor/MedicalReportsTab';
import { DateWiseTimelineTab } from './doctor/DateWiseTimelineTab';
import { AiGeneratedHistoryTab } from './doctor/AiGeneratedHistoryTab';
import { MedicationsTab } from './doctor/MedicationsTab';
import { DoctorNotesTab } from './doctor/DoctorNotesTab';
import { SummaryPrintView } from './SummaryPrintView';
import { generateStructuredClinicalSummary } from '../services/geminiService';

interface DoctorDashboardProps {
  session: CaseTakingSession;
  onUpdateSession: (updated: Partial<CaseTakingSession>) => void;
  onSwitchToPatientView?: () => void;
  doctorName?: string;
  departmentName?: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  session,
  onUpdateSession,
  onSwitchToPatientView,
  doctorName = 'Dr. Rajesh Sharma, MD, DNB (Internal Medicine)',
  departmentName = 'General & Internal Medicine OPD',
}) => {
  // Navigation mode: 'patient-list' or 'patient-record'
  const [viewMode, setViewMode] = useState<'patient-list' | 'patient-record'>('patient-record');

  // EHR Active Tab within patient-record
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'todays-consultation'
    | 'previous-history'
    | 'medical-reports'
    | 'timeline'
    | 'ai-history'
    | 'medications'
    | 'doctor-notes'
  >('overview');

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // All patients pool for OPD queue dynamically loaded from database
  const [allQueueSessions, setAllQueueSessions] = useState<CaseTakingSession[]>([session]);

  // Load all patients from database for queue
  useEffect(() => {
    let isMounted = true;
    const loadQueue = async () => {
      try {
        const patients = await dbService.getPatients();
        const loadedSessions = await Promise.all(
          patients.map(async (p) => {
            if (p.id === session.patient.id) {
              return session;
            }
            const fullSession = await dbService.loadFullSessionForPatient(p.id);
            return fullSession;
          })
        );
        if (isMounted) {
          const valid = loadedSessions.filter(Boolean) as CaseTakingSession[];
          setAllQueueSessions(valid.length > 0 ? valid : [session]);
        }
      } catch (err) {
        console.error('Failed to load queue from database:', err);
      }
    };

    loadQueue();
    return () => {
      isMounted = false;
    };
  }, [session.patient.id]);

  // Keep current active session updated in the queue array
  useEffect(() => {
    setAllQueueSessions((prev) =>
      prev.map((s) => (s.patient.id === session.patient.id ? { ...session } : s))
    );
  }, [session]);

  const handleSelectPatientFromQueue = (selectedSession: CaseTakingSession) => {
    onUpdateSession(selectedSession);
    setViewMode('patient-record');
    setActiveTab('overview');
  };

  // Handlers for data persistence
  const handleSaveConsultation = (consultation: ConsultationRecord) => {
    const existingConsultations = session.consultations || [];
    const index = existingConsultations.findIndex((c) => c.id === consultation.id);
    let updatedConsultations: ConsultationRecord[];

    if (index >= 0) {
      updatedConsultations = [...existingConsultations];
      updatedConsultations[index] = consultation;
    } else {
      updatedConsultations = [consultation, ...existingConsultations];
    }

    onUpdateSession({
      consultations: updatedConsultations,
      lastVisitDate: consultation.date,
      summary: {
        ...session.summary,
        doctorAssessment: consultation.assessment,
        doctorPrescriptionPlan: consultation.prescriptions.map((p) => ({
          medicine: p.medicineName,
          dosage: p.dosage,
          timing: p.frequency,
          instructions: p.instructions,
        })),
        doctorFollowUpDays: consultation.followUpDays,
        doctorSignatureName: consultation.doctorName,
        intakeStage: 'doctor_reviewed',
      },
    });
  };

  const handleAddReport = (newReport: MedicalReportItem) => {
    const updatedReports = [newReport, ...(session.reports || [])];

    // Also mirror to documents array for OCR timeline
    const newDoc: MedicalDocument = {
      id: `doc-${newReport.id}`,
      patientId: session.patient.id,
      title: `${newReport.reportType}: ${newReport.testName}`,
      documentType:
        newReport.reportType === 'Blood Test' || newReport.reportType === 'Pathology'
          ? 'lab_report'
          : newReport.reportType === 'Prescription'
          ? 'prescription'
          : newReport.reportType === 'Discharge Summary'
          ? 'discharge_summary'
          : 'other',
      documentDate: newReport.reportDate,
      uploadedAt: newReport.uploadedAt,
      facilityOrDoctor: newReport.facilityOrLab,
      extractedText: `Result: ${newReport.result} ${newReport.units || ''}. Reference: ${newReport.referenceRange || 'N/A'}. Notes: ${newReport.doctorNotes || 'None'}`,
    };

    onUpdateSession({
      reports: updatedReports,
      documents: [newDoc, ...(session.documents || [])],
    });
  };

  const handleAddDoctorNote = (newNote: DoctorNoteItem) => {
    const updatedNotes = [newNote, ...(session.doctorNotes || [])];
    onUpdateSession({
      doctorNotes: updatedNotes,
    });
  };

  const handleUpdateSummary = (updatedSummary: StructuredClinicalSummary) => {
    onUpdateSession({
      summary: updatedSummary,
    });
  };

  const handleRegenerateSummary = async () => {
    setIsRegenerating(true);
    try {
      const regenerated = await generateStructuredClinicalSummary({
        messages: session.messages,
        patient: session.patient,
        documents: session.documents,
      });
      onUpdateSession({ summary: regenerated });
    } catch (e) {
      console.error('Failed to regenerate summary:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyClinicalNote = () => {
    const s = session.summary;
    const p = session.patient;
    const textToCopy = `
=== OFFICIAL CLINICAL ENCOUNTER NOTE ===
Patient: ${p.fullName} (${p.age}y / ${p.gender}) | ABHA: ${p.abhaId || 'N/A'} | ID: ${p.id}
Date: ${new Date().toLocaleDateString()} | Attending: ${doctorName}

CHIEF COMPLAINT:
${s.chiefComplaint}

HISTORY OF PRESENT ILLNESS:
${s.historyOfPresentIllness?.chronologicalNarrative || 'N/A'}
- Onset: ${s.historyOfPresentIllness?.onset || 'N/A'}
- Duration: ${s.historyOfPresentIllness?.duration || 'N/A'}
- Severity/Character: ${s.historyOfPresentIllness?.characterAndSeverity || 'N/A'}
- Aggravating/Relieving: ${s.historyOfPresentIllness?.aggravatingFactors || 'N/A'} / ${s.historyOfPresentIllness?.relievingFactors || 'N/A'}

PAST HISTORY:
Medical: ${(s.pastMedicalHistory || []).join(', ') || 'None'}
Surgical: ${(s.pastSurgicalHistory || []).join(', ') || 'None'}
Allergies: ${(s.allergies || []).map((a) => `${a.allergen} (${a.reaction})`).join(', ') || 'None'}

DOCTOR ASSESSMENT:
${s.doctorAssessment || 'Clinical evaluation in progress.'}

ACTIVE MEDICATIONS / PRESCRIPTIONS:
${(s.doctorPrescriptionPlan || [])
  .map((m) => `• ${m.medicine} - ${m.dosage} (${m.timing}) [${m.instructions}]`)
  .join('\n') || 'None'}

FOLLOW-UP:
Review in ${s.doctorFollowUpDays || 14} days.
=========================================
`.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* MODE A: PATIENT LIST / QUEUE */}
      {viewMode === 'patient-list' ? (
        <PatientQueueList
          allSessions={allQueueSessions}
          activeSessionId={session.id}
          onSelectPatient={handleSelectPatientFromQueue}
          doctorName={doctorName}
          departmentName={departmentName}
        />
      ) : (
        /* MODE B: COMPLETE PATIENT RECORD PAGE */
        <div className="space-y-6">
          {/* Patient Profile Demographics Banner & Chief Complaint */}
          <PatientProfileHeader
            patient={session.patient}
            summary={session.summary}
            priority={session.priority || 'routine'}
            onBackToQueue={() => setViewMode('patient-list')}
            onOpenTodaysConsultation={() => setActiveTab('todays-consultation')}
            onOpenAddReport={() => setActiveTab('medical-reports')}
            onPrintRecord={() => setShowPrintModal(true)}
            onCopyClinicalNote={handleCopyClinicalNote}
            copySuccess={copySuccess}
          />

          {/* TAB NAVIGATION BAR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Overview & Summary</span>
            </button>

            <button
              id="tab-todays-consultation"
              onClick={() => setActiveTab('todays-consultation')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'todays-consultation'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Today's Consultation</span>
            </button>

            <button
              id="tab-previous-history"
              onClick={() => setActiveTab('previous-history')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'previous-history'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Previous History ({(session.consultations || []).length})</span>
            </button>

            <button
              id="tab-medical-reports"
              onClick={() => setActiveTab('medical-reports')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'medical-reports'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reports & Docs ({(session.reports || []).length + (session.documents || []).length})</span>
            </button>

            <button
              id="tab-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Medical Timeline</span>
            </button>

            <button
              id="tab-ai-history"
              onClick={() => setActiveTab('ai-history')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'ai-history'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Voice Intake</span>
            </button>

            <button
              id="tab-medications"
              onClick={() => setActiveTab('medications')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'medications'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Medications</span>
            </button>

            <button
              id="tab-doctor-notes"
              onClick={() => setActiveTab('doctor-notes')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'doctor-notes'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Doctor Notes ({(session.doctorNotes || []).length})</span>
            </button>
          </div>

          {/* ACTIVE TAB CONTENT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Action Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Active Encounter: {session.patient.fullName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Review synthesized intake, verified documents, and enter today's authoritative assessment.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('todays-consultation')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Begin / Edit Today's Consultation →</span>
                  </button>
                </div>
              </div>

              {/* Red Flags Alert Box (if present) */}
              {(session.summary.redFlagsOrUrgentAlerts || []).length > 0 && (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Clinical Red Flags & Urgent Alerts Detected</span>
                  </div>
                  <ul className="space-y-1.5 pt-1">
                    {session.summary.redFlagsOrUrgentAlerts.map((flag, idx) => (
                      <li
                        key={idx}
                        className="text-xs font-bold text-rose-800 bg-white p-2.5 rounded-xl border border-rose-200"
                      >
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3-Column Clinical Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Col 1: HPI & Complaint */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs uppercase text-slate-500">
                      Chief Complaint & HPI
                    </span>
                    <button
                      onClick={() => setActiveTab('ai-history')}
                      className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer"
                    >
                      View Full AI Intake →
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-900 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                    {session.summary.chiefComplaint}
                  </p>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="line-clamp-4 leading-relaxed">
                      {session.summary.historyOfPresentIllness?.chronologicalNarrative}
                    </p>
                  </div>
                </div>

                {/* Col 2: Active Medications & Reconciliation */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs uppercase text-slate-500">
                      Active Medications & Adherence
                    </span>
                    <button
                      onClick={() => setActiveTab('medications')}
                      className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer"
                    >
                      Reconcile ({session.summary.medicationReconciliation?.length || 0}) →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(session.summary.medicationReconciliation || []).slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{m.medicationName}</span>
                          <span className="text-[11px] text-slate-500">
                            {m.patientReportedDose || m.documentPrescribedDose}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            m.adherenceStatus === 'stopped_by_patient'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {m.adherenceStatus === 'stopped_by_patient' ? 'STOPPED' : 'ADHERENT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 3: Key Investigations & Next Steps */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs uppercase text-slate-500">
                      Recommended Investigations
                    </span>
                    <button
                      onClick={() => setActiveTab('medical-reports')}
                      className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer"
                    >
                      View Reports →
                    </button>
                  </div>

                  <ul className="space-y-1.5 text-xs">
                    {(session.summary.suggestedInvestigationsForDoctor || []).map((inv, idx) => (
                      <li
                        key={idx}
                        className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-800 font-medium flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        <span className="line-clamp-1">{inv}</span>
                      </li>
                    ))}
                    {(session.summary.suggestedInvestigationsForDoctor || []).length === 0 && (
                      <li className="text-slate-400 italic">No pending investigations</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'todays-consultation' && (
            <TodaysConsultationTab
              session={session}
              onSaveConsultation={handleSaveConsultation}
              doctorName={doctorName}
            />
          )}

          {activeTab === 'previous-history' && (
            <PreviousHistoryTab session={session} />
          )}

          {activeTab === 'medical-reports' && (
            <MedicalReportsTab
              session={session}
              onAddReport={handleAddReport}
              onUpdateDocument={(updatedDoc) => {
                const updatedDocs = (session.documents || []).map((d) =>
                  d.id === updatedDoc.id ? updatedDoc : d
                );
                onUpdateSession({ documents: updatedDocs });
              }}
            />
          )}

          {activeTab === 'timeline' && <DateWiseTimelineTab session={session} />}

          {activeTab === 'ai-history' && (
            <AiGeneratedHistoryTab
              session={session}
              onUpdateSummary={handleUpdateSummary}
              onRegenerateSummary={handleRegenerateSummary}
              isRegenerating={isRegenerating}
              onViewDocumentTab={() => setActiveTab('medical-reports')}
            />
          )}

          {activeTab === 'medications' && <MedicationsTab session={session} />}

          {activeTab === 'doctor-notes' && (
            <DoctorNotesTab
              session={session}
              onAddDoctorNote={handleAddDoctorNote}
              doctorName={doctorName}
            />
          )}
        </div>
      )}

      {/* SUMMARY PRINT MODAL */}
      {showPrintModal && (
        <SummaryPrintView
          summary={session.summary}
          patient={session.patient}
          documents={session.documents}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
