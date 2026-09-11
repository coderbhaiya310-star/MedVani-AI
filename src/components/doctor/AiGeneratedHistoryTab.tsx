import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  FileText,
  MessageSquare,
  CheckCircle2,
  Edit3,
  Save,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Stethoscope,
  Info,
  User,
  Calendar,
  Activity,
  Pill,
  Clock,
  Layers,
  Search,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Flame,
  Copy,
} from 'lucide-react';
import { CaseTakingSession, StructuredClinicalSummary, ConflictFlag } from '../../types';
import { ConflictFlagsBanner } from '../ConflictFlagsBanner';

interface AiGeneratedHistoryTabProps {
  session: CaseTakingSession;
  onUpdateSummary: (updatedSummary: StructuredClinicalSummary) => void;
  onRegenerateSummary?: () => void;
  isRegenerating?: boolean;
  onViewDocumentTab?: (docId?: string) => void;
}

export const AiGeneratedHistoryTab: React.FC<AiGeneratedHistoryTabProps> = ({
  session,
  onUpdateSummary,
  onRegenerateSummary,
  isRegenerating = false,
  onViewDocumentTab,
}) => {
  const summary = session.summary;
  const [isEditing, setIsEditing] = useState(false);
  const [editedChiefComplaint, setEditedChiefComplaint] = useState(summary.chiefComplaint || '');
  const [editedNarrative, setEditedNarrative] = useState(
    summary.historyOfPresentIllness?.chronologicalNarrative || ''
  );
  const [editedOnset, setEditedOnset] = useState(summary.historyOfPresentIllness?.onset || '');
  const [editedDuration, setEditedDuration] = useState(summary.historyOfPresentIllness?.duration || '');
  const [editedSeverity, setEditedSeverity] = useState(
    summary.historyOfPresentIllness?.characterAndSeverity || ''
  );
  const [editedAggravating, setEditedAggravating] = useState(
    summary.historyOfPresentIllness?.aggravatingFactors || ''
  );
  const [editedRelieving, setEditedRelieving] = useState(
    summary.historyOfPresentIllness?.relievingFactors || ''
  );
  const [editedLocation, setEditedLocation] = useState(
    summary.historyOfPresentIllness?.locationAndRadiation || ''
  );

  const [activeSourceView, setActiveSourceView] = useState<'all' | 'doctor_consultation_text' | 'patient_reported' | 'document_evidence'>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [doctorVerificationStatus, setDoctorVerificationStatus] = useState<'pending_review' | 'verified' | 'amended'>(
    summary.doctorReviewStatus || 'pending_review'
  );

  const handleSaveEdit = () => {
    const updated: StructuredClinicalSummary = {
      ...summary,
      chiefComplaint: editedChiefComplaint,
      doctorReviewStatus: 'amended',
      historyOfPresentIllness: {
        ...summary.historyOfPresentIllness,
        onset: editedOnset,
        duration: editedDuration,
        characterAndSeverity: editedSeverity,
        aggravatingFactors: editedAggravating,
        relievingFactors: editedRelieving,
        locationAndRadiation: editedLocation,
        chronologicalNarrative: editedNarrative,
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateSummary(updated);
    setDoctorVerificationStatus('amended');
    setIsEditing(false);
  };

  const handleMarkVerified = () => {
    const nextStatus = doctorVerificationStatus === 'verified' ? 'pending_review' : 'verified';
    setDoctorVerificationStatus(nextStatus);
    onUpdateSummary({
      ...summary,
      doctorReviewStatus: nextStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateConflict = (
    conflictId: string,
    status: 'pending' | 'patient_correct' | 'document_correct' | 'reconciled' | 'followup_needed',
    doctorNote?: string
  ) => {
    const updatedConflicts = (summary.conflicts || []).map((c) =>
      c.id === conflictId ? { ...c, doctorResolution: status, doctorNote: doctorNote || c.doctorNote } : c
    );
    onUpdateSummary({ ...summary, conflicts: updatedConflicts });
  };

  const patientOverview = summary.patientOverview || {
    patientName: session.patient.fullName,
    age: session.patient.age,
    gender: session.patient.gender,
    patientId: session.patient.id,
    consultationId: session.patient.consultationId || `CON-${session.patient.id}-01`,
    visitDate: new Date().toISOString().split('T')[0],
    preferredLanguage: session.patient.preferredLanguage,
  };

  return (
    <div className="space-y-6" id="ai-clinical-intake-summary-root">
      {/* 1. TOP HEADER & PROMINENT AI DISCLAIMER */}
      <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-200 text-amber-900 uppercase tracking-wider">
                AI GENERATED — DOCTOR REVIEW REQUIRED
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                doctorVerificationStatus === 'verified'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : doctorVerificationStatus === 'amended'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {doctorVerificationStatus === 'verified'
                  ? '✓ Verified by Doctor'
                  : doctorVerificationStatus === 'amended'
                  ? '✎ Amended by Doctor'
                  : '⏳ Pending Doctor Review'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Patient Voice Intake + OCR Prescription Engine
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              This summary is an AI-assisted synthesis designed to reduce intake documentation load. The treating physician retains ultimate responsibility for patient assessment, diagnosis verification, and prescription authorization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleMarkVerified}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              doctorVerificationStatus === 'verified'
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{doctorVerificationStatus === 'verified' ? 'Verified' : 'Verify Summary'}</span>
          </button>

          {onRegenerateSummary && (
            <button
              onClick={onRegenerateSummary}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Synthesizing...' : 'Re-Run Intake'}</span>
            </button>
          )}

          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Edits</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit AI Summary</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. PATIENT OVERVIEW BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>{patientOverview.patientName}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender</span>
            <span className="font-semibold text-slate-800">
              {patientOverview.age} yrs • {patientOverview.gender.toUpperCase()}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient ID</span>
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              {patientOverview.patientId}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Consultation ID</span>
            <span className="font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
              {patientOverview.consultationId}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Visit Date</span>
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{patientOverview.visitDate}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Language</span>
            <span className="font-semibold text-slate-800">
              {patientOverview.preferredLanguage?.toUpperCase() || 'HINDI'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. RED FLAGS & URGENT ALERTS (IF ANY) */}
      {summary.redFlagsOrUrgentAlerts && summary.redFlagsOrUrgentAlerts.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-sm text-rose-900 uppercase tracking-wide">
              Red Flags & Urgent Clinical Alerts
            </h3>
          </div>
          <ul className="space-y-1.5 pt-1">
            {summary.redFlagsOrUrgentAlerts.map((rf, idx) => (
              <li
                key={idx}
                className="text-xs font-bold text-rose-900 bg-white/80 p-2.5 rounded-xl border border-rose-200 flex items-start gap-2 shadow-2xs"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{rf}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. CONFLICT DETECTION & RESOLUTION ENGINE */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Clinical Information Audit & Conflict Detection</span>
        </h3>
        <ConflictFlagsBanner
          conflicts={summary.conflicts || []}
          onUpdateConflictStatus={handleUpdateConflict}
        />
      </div>

      {/* 5. SOURCE SEPARATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs flex-wrap">
        <span className="text-slate-400 font-bold uppercase text-[10px] mr-2">Intake Source:</span>
        <button
          onClick={() => setActiveSourceView('all')}
          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeSourceView === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Comprehensive Clinical Summary
        </button>
        <button
          onClick={() => setActiveSourceView('doctor_consultation_text')}
          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSourceView === 'doctor_consultation_text' ? 'bg-indigo-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Doctor Consultation Sheet (Full Text)</span>
        </button>
        <button
          onClick={() => setActiveSourceView('patient_reported')}
          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeSourceView === 'patient_reported' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Patient Verbal Transcript ({session.messages?.length || 0})
        </button>
        <button
          onClick={() => setActiveSourceView('document_evidence')}
          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeSourceView === 'document_evidence' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Scanned Documents & Reports ({session.documents?.length || 0})
        </button>
      </div>

      {/* DOCTOR CONSULTATION SHEET (FULL TEXT VIEW) */}
      {activeSourceView === 'doctor_consultation_text' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Structured Doctor Consultation Summary</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Complete, synthesized clinical consultation sheet ready for medical chart integration.
              </p>
            </div>
            <button
              onClick={() => {
                if (summary.formattedDoctorSummaryText) {
                  navigator.clipboard.writeText(summary.formattedDoctorSummaryText);
                  setCopiedSummary(true);
                  setTimeout(() => setCopiedSummary(false), 2000);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Consultation Sheet'}</span>
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-line select-text">
            {summary.formattedDoctorSummaryText || 'No structured consultation text available.'}
          </div>
        </div>
      )}

      {/* PATIENT-REPORTED VOICE INTAKE VIEW */}
      {activeSourceView === 'patient_reported' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>Voice Interview Transcript Statements</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {session.messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl text-xs space-y-1 ${
                  m.sender === 'patient'
                    ? 'bg-teal-50/70 border border-teal-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className={m.sender === 'patient' ? 'text-teal-800 uppercase' : 'text-slate-500 uppercase'}>
                    {m.sender === 'patient' ? '🗣️ Patient Verbal Statement' : '🤖 AI Clinical Voice Agent'}
                  </span>
                  <span className="text-slate-400">{m.timestamp}</span>
                </div>
                <p className="text-slate-800 leading-relaxed">{m.text}</p>
                {m.clinicalTag && (
                  <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    Tag: {m.clinicalTag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENT EVIDENCE VIEW */}
      {activeSourceView === 'document_evidence' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>OCR Extracted Document Evidence & Original Scans</span>
            </h3>
            {onViewDocumentTab && (
              <button
                onClick={() => onViewDocumentTab()}
                className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Document Inspector</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-3">
            {session.documents.map((d) => (
              <div key={d.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{d.title || d.documentName}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] uppercase">
                      {d.documentType}
                    </span>
                    {d.ocrConfidence && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                        OCR {d.ocrConfidence}% Confidence
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{d.documentDate}</span>
                </div>
                <p className="text-slate-700 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed">
                  {d.extractedText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN SYNTHESIZED CASE VIEW */}
      {activeSourceView === 'all' && (
        <div className="space-y-6">
          {/* VITALS & CLINICAL SNAPSHOT */}
          {summary.vitals && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Vital Signs (Recorded / Patient-Reported)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Triage Check</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Temperature</span>
                  <span className="font-semibold text-slate-800">{summary.vitals.temperature || 'Not recorded'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Pressure</span>
                  <span className="font-semibold text-slate-800">{summary.vitals.bloodPressure || 'Not recorded'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Pulse / HR</span>
                  <span className="font-semibold text-slate-800">{summary.vitals.heartRate || 'Not recorded'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SpO2</span>
                  <span className="font-semibold text-slate-800">{summary.vitals.spo2 || 'Not recorded'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Resp. Rate</span>
                  <span className="font-semibold text-slate-800">{summary.vitals.respiratoryRate || 'Not recorded'}</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION A: CHIEF COMPLAINT & HPI */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                1. Chief Complaint (Patient Reported & Standardized)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedChiefComplaint}
                  onChange={(e) => setEditedChiefComplaint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                />
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-slate-900 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                    {summary.chiefComplaint}
                  </p>
                  {summary.previousSimilarEpisodes && summary.previousSimilarEpisodes !== 'Not provided' && (
                    <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold">Prior Episodes:</span>
                      <span>{summary.previousSimilarEpisodes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* HPI Breakdown */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                2. History of Present Illness (OPQRST Dimensions)
              </span>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Onset</span>
                    <input
                      type="text"
                      value={editedOnset}
                      onChange={(e) => setEditedOnset(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Duration</span>
                    <input
                      type="text"
                      value={editedDuration}
                      onChange={(e) => setEditedDuration(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Character & Severity</span>
                    <input
                      type="text"
                      value={editedSeverity}
                      onChange={(e) => setEditedSeverity(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Location & Radiation</span>
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Aggravating Factors</span>
                    <input
                      type="text"
                      value={editedAggravating}
                      onChange={(e) => setEditedAggravating(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Relieving Factors</span>
                    <input
                      type="text"
                      value={editedRelieving}
                      onChange={(e) => setEditedRelieving(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Onset</span>
                    <span className="font-semibold text-slate-800">{summary.historyOfPresentIllness?.onset || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                    <span className="font-semibold text-slate-800">{summary.historyOfPresentIllness?.duration || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Severity</span>
                    <span className="font-semibold text-slate-800">
                      {summary.historyOfPresentIllness?.characterAndSeverity || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                    <span className="font-semibold text-slate-800">
                      {summary.historyOfPresentIllness?.locationAndRadiation || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Aggravating</span>
                    <span className="font-semibold text-slate-800">
                      {summary.historyOfPresentIllness?.aggravatingFactors || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Relieving</span>
                    <span className="font-semibold text-slate-800">
                      {summary.historyOfPresentIllness?.relievingFactors || 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              {/* Full Chronological Narrative */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Chronological Clinical Narrative
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editedNarrative}
                    onChange={(e) => setEditedNarrative(e.target.value)}
                    className="w-full p-3 bg-slate-50 border rounded-xl text-xs leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {summary.historyOfPresentIllness?.chronologicalNarrative || 'No detailed narrative.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION B: CURRENT SYMPTOMS BREAKDOWN TABLE */}
          {summary.symptomsBreakdown && summary.symptomsBreakdown.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase text-slate-700 block">
                3. Current Symptoms Breakdown
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase">
                      <th className="p-2.5 rounded-l-lg">Symptom</th>
                      <th className="p-2.5">Location</th>
                      <th className="p-2.5">Onset & Duration</th>
                      <th className="p-2.5">Character / Severity</th>
                      <th className="p-2.5 rounded-r-lg">Associated Signs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.symptomsBreakdown.map((sb, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-bold text-slate-900">{sb.symptom}</td>
                        <td className="p-2.5 text-slate-700">{sb.location}</td>
                        <td className="p-2.5 text-slate-700">{sb.onset} • {sb.duration}</td>
                        <td className="p-2.5 font-semibold text-rose-700">{sb.severity} ({sb.character})</td>
                        <td className="p-2.5 text-slate-600">
                          {sb.associatedSymptoms?.join(', ') || 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION C: RELEVANT MEDICAL HISTORY & PAST SURGICAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase text-slate-700 block">
                4. Relevant Medical & Surgical History
              </span>
              <div className="space-y-2 text-xs">
                {summary.relevantMedicalHistory && (
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Diabetes:</span>
                      <span className="font-semibold text-slate-800">{summary.relevantMedicalHistory.diabetes || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Hypertension:</span>
                      <span className="font-semibold text-slate-800">{summary.relevantMedicalHistory.hypertension || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Heart Disease:</span>
                      <span className="font-semibold text-slate-800">{summary.relevantMedicalHistory.heartDisease || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Prior Surgery:</span>
                      <span className="font-semibold text-slate-800">{summary.relevantMedicalHistory.previousSurgery || 'None'}</span>
                    </div>
                  </div>
                )}

                <p className="font-bold text-slate-500 text-[10px] uppercase pt-1">Past Diagnoses:</p>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  {(summary.pastMedicalHistory || []).map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                  {(!summary.pastMedicalHistory || summary.pastMedicalHistory.length === 0) && (
                    <li className="text-slate-400">None reported</li>
                  )}
                </ul>

                <p className="font-bold text-slate-500 text-[10px] uppercase pt-1">Past Surgical Interventions:</p>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  {(summary.pastSurgicalHistory || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                  {(!summary.pastSurgicalHistory || summary.pastSurgicalHistory.length === 0) && (
                    <li className="text-slate-400">No major surgeries</li>
                  )}
                </ul>
              </div>
            </div>

            {/* SECTION D: ALLERGIES, PREVIOUS TREATMENT & SOCIAL HABITS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase text-slate-700 block">
                5. Allergies & Previous Treatment
              </span>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-bold text-slate-500 text-[10px] uppercase mb-1">Allergies & Sensitivities:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(summary.allergies || []).map((a, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold"
                      >
                        {a.allergen} ({a.reaction})
                      </span>
                    ))}
                    {(!summary.allergies || summary.allergies.length === 0) && (
                      <span className="text-slate-400 italic">No known drug allergies reported</span>
                    )}
                  </div>
                </div>

                {summary.previousTreatment && (
                  <div className="bg-teal-50/50 p-2.5 rounded-xl border border-teal-100 space-y-1">
                    <p className="font-bold text-teal-800 text-[10px] uppercase">Prior Consultations & Rx:</p>
                    <p className="text-slate-800">
                      <span className="font-semibold">Consulted Before:</span> {summary.previousTreatment.consultedDoctorBefore}
                    </p>
                    <p className="text-slate-800">
                      <span className="font-semibold">Medications Taken:</span> {summary.previousTreatment.previousMedications}
                    </p>
                  </div>
                )}

                <div>
                  <p className="font-bold text-slate-500 text-[10px] uppercase mb-1">Social Habits:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold">Diet</span>
                      <span className="text-slate-800">{summary.socialHabits?.diet || 'Standard'}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold">Tobacco / Smoking</span>
                      <span className="text-slate-800">{summary.socialHabits?.smokingOrTobacco || 'Denied'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION E: MEDICATION RECONCILIATION TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-700 block">
                6. Medication Reconciliation (Verbal vs. Document Prescribed)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {summary.medicationReconciliation?.length || 0} Medications Tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase">
                    <th className="p-2.5 rounded-l-lg">Medication</th>
                    <th className="p-2.5">Patient Reported Dose</th>
                    <th className="p-2.5">Prescribed in Document</th>
                    <th className="p-2.5">Adherence Status</th>
                    <th className="p-2.5 rounded-r-lg">Source & Clinical Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(summary.medicationReconciliation || []).map((med, idx) => (
                    <tr key={med.id || idx} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        <span>{med.medicationName}</span>
                      </td>
                      <td className="p-2.5 text-slate-700">
                        {med.patientReportedDose} ({med.patientReportedFrequency})
                      </td>
                      <td className="p-2.5 text-slate-700 font-semibold">
                        {med.documentPrescribedDose} ({med.documentPrescribedFrequency})
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          med.adherenceStatus === 'adherent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : med.adherenceStatus === 'stopped_by_patient'
                            ? 'bg-rose-100 text-rose-800'
                            : med.adherenceStatus === 'dose_mismatch'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {med.adherenceStatus?.replace('_', ' ') || 'unverified'}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600 text-[11px]">
                        <span className="font-semibold text-slate-800">{med.sourceDocumentTitle}:</span> {med.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION F: UPLOADED DOCUMENTS REVIEWED & RELEVANT DOCUMENT FINDINGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700 block">
                  7. Uploaded Documents & Reports
                </span>
                {onViewDocumentTab && (
                  <button
                    onClick={() => onViewDocumentTab()}
                    className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Scans</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <ul className="space-y-2 text-xs">
                {(summary.documentsReviewed || []).map((doc, idx) => (
                  <li key={doc.id || idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {doc.documentType?.toUpperCase()} • {doc.documentDate} • {doc.facilityOrDoctor}
                      </p>
                    </div>
                    {doc.ocrConfidence && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                        {doc.ocrConfidence}% OCR
                      </span>
                    )}
                  </li>
                ))}
                {(!summary.documentsReviewed || summary.documentsReviewed.length === 0) && (
                  <p className="text-xs text-slate-400 italic">No medical records uploaded for this session.</p>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase text-slate-700 block">
                8. Relevant Document Findings (Labs & Imaging)
              </span>
              <ul className="space-y-2 text-xs">
                {(summary.relevantDocumentFindings || []).map((rf, idx) => (
                  <li
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs ${
                      rf.isAbnormal
                        ? 'bg-rose-50/70 border-rose-200 text-rose-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
                      <span className={rf.isAbnormal ? 'text-rose-700 uppercase' : 'text-slate-500 uppercase'}>
                        {rf.sourceDocName} • {rf.category}
                      </span>
                      {rf.isAbnormal && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 uppercase text-[9px]">
                          Abnormal
                        </span>
                      )}
                    </div>
                    <p>{rf.findingText}</p>
                  </li>
                ))}
                {(!summary.relevantDocumentFindings || summary.relevantDocumentFindings.length === 0) && (
                  <p className="text-xs text-slate-400 italic">No abnormal lab or diagnostic findings extracted.</p>
                )}
              </ul>
            </div>
          </div>

          {/* SECTION G: CLINICAL CONSIDERATIONS & MISSING INFORMATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div>
                <span className="text-xs font-bold uppercase text-slate-700 block">
                  9. Potential Clinical Considerations for Physician Review
                </span>
                <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                  (Clearly marked as considerations — not confirmed diagnoses)
                </span>
              </div>

              {summary.clinicalConsiderations && summary.clinicalConsiderations.length > 0 && (
                <div className="space-y-1.5 pb-2">
                  {summary.clinicalConsiderations.map((cc, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{cc}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2.5">
                {(summary.provisionalDifferentialDiagnosis || []).map((diff, idx) => (
                  <div key={idx} className="p-3 bg-teal-50/40 rounded-xl border border-teal-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{diff.condition}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        diff.likelihood === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {diff.likelihood} consideration
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{diff.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase text-slate-700 block">
                10. Missing / Incomplete Information
              </span>
              <ul className="space-y-2 text-xs">
                {(summary.missingInformation || []).map((mi, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2 text-xs font-medium"
                  >
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{mi}</span>
                  </li>
                ))}
                {(!summary.missingInformation || summary.missingInformation.length === 0) && (
                  <li className="text-slate-400 italic">All key intake dimensions gathered satisfactorily.</li>
                )}
              </ul>

              {/* AI Executive Summary */}
              {summary.aiExecutiveSummary && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    AI Clinical Executive Summary
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {summary.aiExecutiveSummary}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION H: SUGGESTED INVESTIGATIONS & CLARIFYING QUESTIONS */}
          {summary.suggestedClarifyingQuestionsForDoctor && summary.suggestedClarifyingQuestionsForDoctor.length > 0 && (
            <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-teal-900">
                  11. Suggested Clarifying Questions for Consultation
                </h3>
              </div>
              <p className="text-xs text-teal-800">
                Targeted clinical questions suggested by AI to close gaps identified between verbal claims and records:
              </p>
              <ul className="space-y-1.5 pt-1">
                {summary.suggestedClarifyingQuestionsForDoctor.map((q, idx) => (
                  <li
                    key={idx}
                    className="text-xs font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-teal-200/80 shadow-2xs flex items-start gap-2"
                  >
                    <span className="text-teal-600 font-bold">Q{idx + 1}:</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
