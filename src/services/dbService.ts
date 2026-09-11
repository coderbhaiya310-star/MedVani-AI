import {
  PatientRecord,
  ConsultationRecord,
  MedicalReportItem,
  MedicalDocument,
  DoctorNoteItem,
  TimelineEventItem,
  StructuredInterviewState,
  StructuredClinicalSummary,
  ChatMessage,
  CaseTakingSession,
  AuthUser,
} from '../types';
import { getLocalizedWelcomeGreeting } from '../i18n/languages';
import { SEEDED_INTERVIEWS, SEEDED_DOCUMENTS } from './seededPatientClinicalData';

// LocalStorage Keys for complete browser persistence
const STORAGE_KEYS = {
  PATIENTS: 'swasthya_db_patients',
  CONSULTATIONS: 'swasthya_db_consultations',
  REPORTS: 'swasthya_db_reports',
  DOCUMENTS: 'swasthya_db_documents',
  INTERVIEWS: 'swasthya_db_interviews',
  TIMELINES: 'swasthya_db_timelines',
  DOCTOR_NOTES: 'swasthya_db_doctor_notes',
  RECENT_PATIENTS: 'swasthya_db_recent_patients',
  INITIALIZED: 'swasthya_db_v6_complete_doctor_data',
};

// Safe JSON local storage helpers
function readStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading from localStorage [${key}]:`, e);
    return defaultValue;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to localStorage [${key}]:`, e);
  }
}

// ----------------------------------------------------
// PATIENT NUMBERING & IDENTIFIER GENERATION
// ----------------------------------------------------

export function generatePatientNumber(existingCount: number): string {
  const num = (existingCount + 1).toString().padStart(3, '0');
  return `Patient ${num}`;
}

export function generatePatientId(existingCount: number): string {
  const num = (existingCount + 1).toString().padStart(3, '0');
  return `PAT-${num}`;
}

export function generateConsultationId(patientId: string, visitNumber: number): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const visitStr = visitNumber.toString().padStart(2, '0');
  return `CON-${dateStr}-${patientId.replace('PAT-', '')}-${visitStr}`;
}

// ----------------------------------------------------
// DATABASE SERVICE IMPLEMENTATION
// ----------------------------------------------------

class DatabaseService {
  constructor() {
    this.ensureInitialized();
  }

  /**
   * Initializes default database with pre-configured demo cases if not initialized yet
   */
  public ensureInitialized(forceReset = false): void {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit || forceReset) {
      this.seedInitialDatabase();
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  /**
   * Helper to normalize patient IDs and aliases (e.g. PAT-001, PAT-101, usr-pat-001)
   * Ensures strict patient data retrieval without cross-patient leakage.
   */
  public getEquivalentPatientIds(patientId: string): Set<string> {
    const ids = new Set<string>();
    if (!patientId) return ids;
    const clean = patientId.trim();
    ids.add(clean);
    ids.add(clean.toLowerCase());
    ids.add(clean.toUpperCase());

    // Extract numeric suffix
    const match = clean.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num === 1 || num === 101) {
        ['PAT-001', 'PAT-101', 'usr-pat-001', 'pat-001', 'pat-101', 'patient 001', 'patient 101', 'Patient 001'].forEach((x) => ids.add(x));
      } else if (num === 2 || num === 102) {
        ['PAT-002', 'PAT-102', 'usr-pat-002', 'pat-002', 'pat-102', 'patient 002', 'patient 102', 'Patient 002'].forEach((x) => ids.add(x));
      } else if (num === 3 || num === 103) {
        ['PAT-003', 'PAT-103', 'usr-pat-003', 'pat-003', 'pat-103', 'patient 003', 'patient 103', 'Patient 003'].forEach((x) => ids.add(x));
      } else if (num === 4 || num === 104) {
        ['PAT-004', 'PAT-104', 'usr-pat-004', 'pat-004', 'pat-104', 'patient 004', 'patient 104', 'Patient 004'].forEach((x) => ids.add(x));
      } else if (num === 5 || num === 105) {
        ['PAT-005', 'PAT-105', 'usr-pat-005', 'pat-005', 'pat-105', 'patient 005', 'patient 105', 'Patient 005'].forEach((x) => ids.add(x));
      }
    }
    return ids;
  }

  // -----------------------------
  // PATIENT CRUD OPERATIONS
  // -----------------------------

  public async getPatients(options?: {
    status?: string;
    search?: string;
    todayOnly?: boolean;
    sortBy?: 'today_queue' | 'newest_registration' | 'waiting_time' | 'priority' | 'last_visit' | 'patient_number' | 'name';
  }): Promise<PatientRecord[]> {
    const patients = readStorage<PatientRecord[]>(STORAGE_KEYS.PATIENTS, []);
    let result = [...patients];

    // Search filter across patient ID, number, name, mobile, ABHA ID, complaint
    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          (p.patientNumber && p.patientNumber.toLowerCase().includes(q)) ||
          p.fullName.toLowerCase().includes(q) ||
          (p.phoneNumber && p.phoneNumber.includes(q)) ||
          (p.abhaId && p.abhaId.toLowerCase().includes(q)) ||
          (p.chiefComplaint && p.chiefComplaint.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (options?.status && options.status !== 'all') {
      result = result.filter((p) => p.status === options.status);
    }

    // Today Only filter
    if (options?.todayOnly) {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(
        (p) =>
          (p.registrationDate && p.registrationDate.startsWith(today)) ||
          p.status === 'waiting' ||
          p.status === 'in_consultation'
      );
    }

    // Sorting
    const sortBy = options?.sortBy || 'today_queue';
    result.sort((a, b) => {
      if (sortBy === 'today_queue') {
        // Today's patients: Arrival/queue order 1st -> 2nd -> 3rd
        const queueA = a.queueNumber || 999;
        const queueB = b.queueNumber || 999;
        return queueA - queueB;
      }
      if (sortBy === 'newest_registration') {
        return new Date(b.createdAt || b.registrationDate).getTime() - new Date(a.createdAt || a.registrationDate).getTime();
      }
      if (sortBy === 'waiting_time') {
        const timeA = a.arrivalTime || '23:59';
        const timeB = b.arrivalTime || '23:59';
        return timeA.localeCompare(timeB);
      }
      if (sortBy === 'priority') {
        const priorityWeight = { critical: 3, urgent: 2, routine: 1 };
        const pA = priorityWeight[a.priority || 'routine'] || 0;
        const pB = priorityWeight[b.priority || 'routine'] || 0;
        return pB - pA;
      }
      if (sortBy === 'patient_number') {
        return a.id.localeCompare(b.id);
      }
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }
      return 0;
    });

    return result;
  }

  public async getPatientById(patientId: string): Promise<PatientRecord | null> {
    const patients = readStorage<PatientRecord[]>(STORAGE_KEYS.PATIENTS, []);
    return patients.find((p) => p.id === patientId) || null;
  }

  public async getPatientByUserId(userId: string): Promise<PatientRecord | null> {
    const patients = readStorage<PatientRecord[]>(STORAGE_KEYS.PATIENTS, []);
    return patients.find((p) => p.userId === userId) || null;
  }

  public async getPatientByNumber(patientNumber: string): Promise<PatientRecord | null> {
    const patients = readStorage<PatientRecord[]>(STORAGE_KEYS.PATIENTS, []);
    return patients.find((p) => p.patientNumber === patientNumber) || null;
  }

  public async searchPatients(query: string): Promise<PatientRecord[]> {
    return this.getPatients({ search: query });
  }

  public async createPatient(payload: Partial<PatientRecord>): Promise<PatientRecord> {
    const patients = readStorage<PatientRecord[]>(STORAGE_KEYS.PATIENTS, []);
    const nextCount = patients.length;
    const generatedId = payload.id || generatePatientId(nextCount);
    const generatedNumber = payload.patientNumber || generatePatientNumber(nextCount);
    const now = new Date().toISOString();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPatient: PatientRecord = {
      id: generatedId,
      patientNumber: generatedNumber,
      fullName: payload.fullName || 'New Patient',
      age: payload.age || 40,
      gender: payload.gender || 'male',
      phoneNumber: payload.phoneNumber || '',
      email: payload.email || '',
      dateOfBirth: payload.dateOfBirth,
      preferredLanguage: payload.preferredLanguage || 'en',
      abhaId: payload.abhaId,
      address: payload.address,
      caregiverName: payload.caregiverName,
      caregiverPhone: payload.caregiverPhone,
      registrationDate: payload.registrationDate || now,
      createdAt: now,
      updatedAt: now,
      consentGiven: payload.consentGiven ?? true,
      status: payload.status || 'waiting',
      queueNumber: payload.queueNumber || nextCount + 1,
      arrivalTime: payload.arrivalTime || timeNow,
      priority: payload.priority || 'routine',
      chiefComplaint: payload.chiefComplaint || 'Clinical evaluation',
    };

    const updatedPatients = [...patients, newPatient];
    writeStorage(STORAGE_KEYS.PATIENTS, updatedPatients);

    // Create initial timeline event
    await this.createTimelineEvent({
      patientId: newPatient.id,
      date: now.split('T')[0],
      time: timeNow,
      type: 'document',
      title: 'Patient Registered & Enrolled',
      subtitle: `Assigned ${newPatient.patientNumber} (${newPatient.id})`,
      details: `Registered for clinical consultation in OPD. Preferred language: ${newPatient.preferredLanguage}.`,
      badgeText: 'Registration',
      badgeColor: 'blue',
    });

    return newPatient;
  }

  public async updatePatient(patientId: string, updates: Partial<PatientRecord>): Promise<PatientRecord | null> {
    const patients = readStorage<PatientRecord[]>(STORAGE_KEYS.PATIENTS, []);
    const index = patients.findIndex((p) => p.id === patientId);
    if (index === -1) return null;

    const updated: PatientRecord = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    patients[index] = updated;
    writeStorage(STORAGE_KEYS.PATIENTS, patients);
    return updated;
  }

  public async deletePatient(patientId: string): Promise<boolean> {
    const patients = readStorage<PatientRecord[]>(STORAGE_KEYS.PATIENTS, []);
    const filtered = patients.filter((p) => p.id !== patientId);
    writeStorage(STORAGE_KEYS.PATIENTS, filtered);
    return true;
  }

  /**
   * Load isolated session for authenticated user
   * First queries the backend session isolation endpoint (/api/patient/current-session)
   * Falls back to user-scoped storage (swasthya_user_session_${userId})
   * If fresh user, initializes a clean, empty session for this user without ANY cross-user leaks
   */
  public async loadUserSession(user: AuthUser, token?: string): Promise<CaseTakingSession> {
    const userStorageKey = `swasthya_user_session_${user.id}`;

    // 1. Try backend server-authoritative isolated session
    if (token) {
      try {
        const res = await fetch('/api/patient/current-session', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.session) {
            writeStorage(userStorageKey, data.session);
            return data.session;
          }
        }
      } catch (err) {
        console.warn('Backend session fetch error, falling back to local user store:', err);
      }
    }

    // 2. Check user-scoped localStorage
    const localUserSession = readStorage<CaseTakingSession | null>(userStorageKey, null);
    if (localUserSession && localUserSession.patient?.userId === user.id) {
      return localUserSession;
    }

    // 3. If this user corresponds to a seeded account (Rahul Kumar or Demo Patient), load their matching seeded session
    if (user.id === 'usr-pat-001' || user.id === 'usr-pat-user-example' || user.associatedPatientId === 'PAT-001') {
      const matchId = user.associatedPatientId || (user.id === 'usr-pat-001' ? 'PAT-001' : 'PAT-003');
      const seeded = await this.loadFullSessionForPatient(matchId);
      if (seeded) {
        seeded.patient.userId = user.id;
        writeStorage(userStorageKey, seeded);
        return seeded;
      }
    }

    // 4. Clean isolated session strictly for this new user
    const lang = user.preferredLanguage || 'en';
    const cleanSession: CaseTakingSession = {
      id: `session-${user.id}`,
      patient: {
        id: user.associatedPatientId || `PAT-${Date.now().toString().slice(-4)}`,
        userId: user.id,
        fullName: user.fullName,
        age: user.age || 30,
        gender: user.gender || 'other',
        phoneNumber: user.phoneNumber || '',
        email: user.email,
        abhaId: user.abhaId,
        preferredLanguage: lang,
        registrationDate: user.createdAt || new Date().toISOString(),
        consentGiven: user.consentGiven ?? true,
        status: 'waiting',
        priority: 'routine',
        chiefComplaint: '',
      },
      priority: 'routine',
      activeLanguage: lang,
      isVoiceActive: false,
      isListening: false,
      isAiSpeaking: false,
      conversationPhase: 'greeting',
      messages: [
        {
          id: `msg-welcome-${user.id}`,
          sender: 'ai',
          text: getLocalizedWelcomeGreeting(lang, user.fullName),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      documents: [],
      summary: null,
      liveExtraction: {
        chiefComplaint: '',
        symptoms: [],
      },
    };

    writeStorage(userStorageKey, cleanSession);

    // Sync back to backend if token is available
    if (token) {
      fetch('/api/patient/current-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session: cleanSession }),
      }).catch(() => {});
    }

    return cleanSession;
  }

  /**
   * Save isolated session for authenticated user
   */
  public async saveUserSession(userId: string, session: CaseTakingSession, token?: string): Promise<void> {
    const userStorageKey = `swasthya_user_session_${userId}`;
    writeStorage(userStorageKey, session);

    if (token) {
      try {
        await fetch('/api/patient/current-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ session }),
        });
      } catch (err) {
        console.warn('Failed to sync session to backend:', err);
      }
    }
  }

  /**
   * Load complete, isolated session for a specific patient
   * Guaranteed to fetch only records matching the target patientId or userId
   */
  public async loadFullSessionForPatient(patientIdOrUserId: string): Promise<CaseTakingSession | null> {
    let patient = await this.getPatientById(patientIdOrUserId);
    if (!patient) {
      patient = await this.getPatientByUserId(patientIdOrUserId);
    }
    if (!patient) {
      // Also attempt case-insensitive match on patient number / id
      const all = await this.getPatients();
      patient = all.find(
        (p) =>
          p.id.toLowerCase() === patientIdOrUserId.toLowerCase() ||
          p.userId?.toLowerCase() === patientIdOrUserId.toLowerCase() ||
          p.patientNumber?.toLowerCase() === patientIdOrUserId.toLowerCase()
      ) || null;
    }

    if (!patient) {
      return null;
    }

    const docs = await this.getPatientDocuments(patient.id);
    const reports = await this.getPatientReports(patient.id);
    const consultations = await this.getPatientConsultations(patient.id);
    const timeline = await this.getPatientTimeline(patient.id);
    const interview = await this.getInterviewState(patient.id);
    const doctorNotes = await this.getPatientDoctorNotes(patient.id);

    const hasInterviewMessages = interview?.conversationTranscript && interview.conversationTranscript.length > 0;

    const session: CaseTakingSession = {
      id: `session-${patient.id.toLowerCase()}`,
      patient: {
        id: patient.id,
        userId: patient.userId,
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        phoneNumber: patient.phoneNumber || patient.mobile || '',
        email: patient.email,
        abhaId: patient.abhaId,
        preferredLanguage: patient.preferredLanguage || 'en',
        caregiverName: patient.caregiverName,
        caregiverPhone: patient.caregiverPhone,
        registrationDate: patient.registrationDate || patient.createdAt || new Date().toISOString(),
        consentGiven: patient.consentGiven ?? true,
      },
      priority: patient.priority || 'routine',
      activeLanguage: patient.preferredLanguage || 'en',
      messages: hasInterviewMessages
        ? interview!.conversationTranscript
        : [
            {
              id: `msg-welcome-${patient.id}`,
              sender: 'ai',
              text: getLocalizedWelcomeGreeting(patient.preferredLanguage || 'en', patient.fullName),
              timestamp: patient.arrivalTime || '09:00 AM',
            },
          ],
      liveExtraction: {
        chiefComplaint: interview?.chiefComplaint || patient.chiefComplaint || '',
        symptoms: interview?.symptoms || (patient.chiefComplaint ? [patient.chiefComplaint] : []),
        location: interview?.location,
        duration: interview?.duration,
        severity: interview?.severity ? String(interview.severity) : undefined,
        associatedSymptoms: interview?.associatedSymptoms,
        redFlags: interview?.redFlags,
      },
      summary: {
        id: `sum-${patient.id}`,
        patientId: patient.id,
        createdAt: patient.createdAt || new Date().toISOString(),
        updatedAt: patient.updatedAt || new Date().toISOString(),
        intakeStage: patient.status === 'completed' ? 'doctor_reviewed' : 'completed',
        chiefComplaint: interview?.chiefComplaint || patient.chiefComplaint || 'Clinical evaluation',
        historyOfPresentIllness: {
          onset: interview?.onset || 'Recent',
          duration: interview?.duration || '1-2 days',
          locationAndRadiation: interview?.location || 'Generalized',
          characterAndSeverity: interview?.severity ? String(interview.severity) : 'Moderate',
          aggravatingFactors: interview?.aggravatingFactors || 'Exertion',
          relievingFactors: interview?.relievingFactors || 'Rest',
          associatedSymptoms: interview?.associatedSymptoms || [],
          chronologicalNarrative: `${patient.fullName} presented for evaluation. Chief complaint: ${interview?.chiefComplaint || patient.chiefComplaint || 'Routine medical checkup'}.`,
        },
        pastMedicalHistory: interview?.medicalHistory || (patient.age > 60 ? ['Hypertension'] : []),
        pastSurgicalHistory: interview?.surgicalHistory || [],
        allergies: (interview?.allergies || []).map((a: string) => ({
          allergen: a,
          reaction: 'Reported allergy',
          severity: 'moderate' as const,
        })),
        familyHistory: interview?.familyHistory || [],
        socialHabits: {
          diet: 'Standard balanced Indian diet',
          smokingOrTobacco: 'None reported',
          alcohol: 'None reported',
          physicalActivity: 'Moderate daily activities',
        },
        medicationReconciliation: [],
        conflicts: [],
        reviewOfSystems: {
          general: 'Conscious, oriented to time and place.',
          cardiovascular: 'No acute palpitations reported.',
          respiratory: 'Breathing comfortably at room air.',
          gastrointestinal: 'No active nausea/vomiting reported unless stated.',
          neurological: 'Alert and responsive.',
          musculoskeletal: 'Normal ambulatory function.',
        },
        provisionalDifferentialDiagnosis: [
          {
            condition: patient.chiefComplaint || 'Clinical Symptom Evaluation',
            likelihood: 'high' as const,
            rationale: 'Primary presenting complaint during structured AI nurse intake.',
          },
        ],
        redFlagsOrUrgentAlerts: interview?.redFlags?.length ? interview.redFlags : (patient.priority === 'critical' ? ['High priority triage flagged'] : []),
        suggestedInvestigationsForDoctor: ['CBC', 'Routine vitals', 'ECG if indicated'],
        suggestedClarifyingQuestionsForDoctor: [
          'Verify current medication adherence and dosage timing.',
          'Review any recent over-the-counter medication intake.',
        ],
      },
      documents: docs,
      reports: reports,
      consultations: consultations,
      doctorNotes: doctorNotes,
      isVoiceActive: false,
      isListening: false,
      isAiSpeaking: false,
      conversationPhase: (interview?.stage as any) || 'greeting',
      lastVisitDate: consultations.length > 0 ? consultations[0].date : undefined,
    };

    return session;
  }

  // -----------------------------
  // CONSULTATIONS OPERATIONS (Strictly Isolated by patientId)
  // -----------------------------

  public async getPatientConsultations(patientId: string): Promise<ConsultationRecord[]> {
    const allConsultations = readStorage<ConsultationRecord[]>(STORAGE_KEYS.CONSULTATIONS, []);
    const validIds = this.getEquivalentPatientIds(patientId);
    return allConsultations
      .filter((c) => c.patientId && (validIds.has(c.patientId) || validIds.has(c.patientId.toLowerCase()) || validIds.has(c.patientId.toUpperCase())))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async getConsultationById(consultationId: string): Promise<ConsultationRecord | null> {
    const allConsultations = readStorage<ConsultationRecord[]>(STORAGE_KEYS.CONSULTATIONS, []);
    return allConsultations.find((c) => c.id === consultationId) || null;
  }

  public async createConsultation(payload: Partial<ConsultationRecord> & { patientId: string }): Promise<ConsultationRecord> {
    const allConsultations = readStorage<ConsultationRecord[]>(STORAGE_KEYS.CONSULTATIONS, []);
    const patientConsultations = allConsultations.filter((c) => c.patientId === payload.patientId);
    const visitNumber = (patientConsultations.length + 1);

    const now = new Date().toISOString();
    const dateStr = payload.date || now.split('T')[0];
    const timeStr = payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newConsultation: ConsultationRecord = {
      id: payload.id || generateConsultationId(payload.patientId, visitNumber),
      patientId: payload.patientId,
      doctorId: payload.doctorId || 'DOC-AIIMS-7842',
      doctorName: payload.doctorName || 'Dr. Rajesh Sharma, MD',
      date: dateStr,
      time: timeStr,
      chiefComplaint: payload.chiefComplaint || 'Routine Medical Checkup',
      clinicalHistory: payload.clinicalHistory || '',
      currentSymptoms: payload.currentSymptoms || '',
      physicalExamination: payload.physicalExamination || '',
      vitals: payload.vitals || {
        bloodPressure: '120/80 mmHg',
        pulse: '74 bpm',
        spo2: '98%',
        temperature: '98.6 °F',
        weight: '68 kg',
      },
      relevantFindings: payload.relevantFindings || '',
      assessment: payload.assessment || 'Clinical evaluation completed.',
      treatmentAdvice: payload.treatmentAdvice || '',
      prescriptions: payload.prescriptions || [],
      followUpInstructions: payload.followUpInstructions || 'Follow up in 7 days or sooner if symptoms worsen.',
      followUpDays: payload.followUpDays || 7,
      additionalNotes: payload.additionalNotes || '',
      status: payload.status || 'completed',
    };

    const updated = [newConsultation, ...allConsultations.filter((c) => c.id !== newConsultation.id)];
    writeStorage(STORAGE_KEYS.CONSULTATIONS, updated);

    // Update patient status to completed & update chief complaint
    await this.updatePatient(payload.patientId, {
      status: 'completed',
      chiefComplaint: newConsultation.chiefComplaint,
    });

    // Record Timeline Event
    await this.createTimelineEvent({
      patientId: payload.patientId,
      date: dateStr,
      time: timeStr,
      type: 'consultation',
      title: `Physician Encounter — Visit #${visitNumber}`,
      subtitle: `Assessment: ${newConsultation.assessment.substring(0, 75)}...`,
      details: `Prescribed ${newConsultation.prescriptions.length} medications. Follow up in ${newConsultation.followUpDays} days.`,
      badgeText: 'Consultation',
      badgeColor: 'emerald',
      referenceId: newConsultation.id,
    });

    return newConsultation;
  }

  public async updateConsultation(consultationId: string, updates: Partial<ConsultationRecord>): Promise<ConsultationRecord | null> {
    const all = readStorage<ConsultationRecord[]>(STORAGE_KEYS.CONSULTATIONS, []);
    const idx = all.findIndex((c) => c.id === consultationId);
    if (idx === -1) return null;

    const updated: ConsultationRecord = {
      ...all[idx],
      ...updates,
    };
    all[idx] = updated;
    writeStorage(STORAGE_KEYS.CONSULTATIONS, all);
    return updated;
  }

  // -----------------------------
  // MEDICAL REPORTS OPERATIONS (Strictly Isolated by patientId)
  // -----------------------------

  public async getPatientReports(patientId: string): Promise<MedicalReportItem[]> {
    const all = readStorage<MedicalReportItem[]>(STORAGE_KEYS.REPORTS, []);
    const validIds = this.getEquivalentPatientIds(patientId);
    return all
      .filter((r) => r.patientId && (validIds.has(r.patientId) || validIds.has(r.patientId.toLowerCase()) || validIds.has(r.patientId.toUpperCase())))
      .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
  }

  public async createMedicalReport(payload: Partial<MedicalReportItem> & { patientId: string }): Promise<MedicalReportItem> {
    const all = readStorage<MedicalReportItem[]>(STORAGE_KEYS.REPORTS, []);
    const now = new Date().toISOString();
    const newReport: MedicalReportItem = {
      id: payload.id || `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patientId: payload.patientId,
      reportDate: payload.reportDate || now.split('T')[0],
      uploadedAt: now,
      reportType: payload.reportType || 'Blood Test',
      testName: payload.testName || 'Diagnostic Panel',
      result: payload.result || 'Standard values',
      units: payload.units,
      referenceRange: payload.referenceRange,
      facilityOrLab: payload.facilityOrLab || 'Central Diagnostics Lab',
      doctorNotes: payload.doctorNotes,
      status: payload.status || 'normal',
      documentUrl: payload.documentUrl,
    };

    const updated = [newReport, ...all];
    writeStorage(STORAGE_KEYS.REPORTS, updated);

    // Create Timeline Event
    await this.createTimelineEvent({
      patientId: payload.patientId,
      date: newReport.reportDate,
      type: 'report',
      title: `${newReport.reportType}: ${newReport.testName}`,
      subtitle: `Result: ${newReport.result} ${newReport.units || ''}`,
      details: newReport.doctorNotes || 'Diagnostic report ingested and linked to electronic health chart.',
      badgeText: newReport.status.toUpperCase(),
      badgeColor: newReport.status === 'critical' ? 'rose' : newReport.status === 'abnormal' ? 'amber' : 'purple',
      referenceId: newReport.id,
    });

    return newReport;
  }

  // -----------------------------
  // MEDICAL DOCUMENTS (OCR / Files)
  // -----------------------------

  public async getPatientDocuments(patientId: string): Promise<MedicalDocument[]> {
    const all = readStorage<MedicalDocument[]>(STORAGE_KEYS.DOCUMENTS, []);
    const validIds = this.getEquivalentPatientIds(patientId);
    return all
      .filter((d) => d.patientId && (validIds.has(d.patientId) || validIds.has(d.patientId.toLowerCase()) || validIds.has(d.patientId.toUpperCase())))
      .sort((a, b) => {
        // Automatic chronological arrangement: oldest → newest by detected medical date
        const timeA = a.documentDate && a.dateVerificationStatus !== 'needs_verification'
          ? new Date(a.documentDate).getTime()
          : (a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0);
        const timeB = b.documentDate && b.dateVerificationStatus !== 'needs_verification'
          ? new Date(b.documentDate).getTime()
          : (b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0);
        return timeA - timeB;
      });
  }

  public async saveDocument(doc: MedicalDocument): Promise<MedicalDocument> {
    const all = readStorage<MedicalDocument[]>(STORAGE_KEYS.DOCUMENTS, []);
    const existingIndex = all.findIndex((d) => d.id === doc.id);
    let updated: MedicalDocument[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = { ...all[existingIndex], ...doc };
    } else {
      updated = [doc, ...all];
    }
    writeStorage(STORAGE_KEYS.DOCUMENTS, updated);
    return doc;
  }

  public async createDocument(payload: Partial<MedicalDocument> & { patientId: string }): Promise<MedicalDocument> {
    const all = readStorage<MedicalDocument[]>(STORAGE_KEYS.DOCUMENTS, []);
    const now = new Date().toISOString();
    const hasValidDate = Boolean(payload.documentDate && /^\d{4}-\d{2}-\d{2}$/.test(payload.documentDate));
    const newDoc: MedicalDocument = {
      id: payload.id || `doc-${Date.now()}`,
      patientId: payload.patientId,
      title: payload.title || 'Medical Record Document',
      documentType: payload.documentType || 'other',
      documentDate: hasValidDate ? (payload.documentDate as string) : '',
      dateVerificationStatus: payload.dateVerificationStatus || (hasValidDate ? 'verified' : 'needs_verification'),
      textVerificationStatus: payload.textVerificationStatus || 'verified',
      aiSummary: payload.aiSummary || 'Medical record preserved and indexed for physician evaluation.',
      uploadedAt: now,
      facilityOrDoctor: payload.facilityOrDoctor || 'Hospital Clinic',
      fileUrl: payload.fileUrl,
      fileData: payload.fileData || payload.fileUrl,
      mimeType: payload.mimeType || 'image/jpeg',
      originalFile: payload.originalFile,
      extractedText: payload.extractedText,
      extractedData: payload.extractedData,
      pageCount: payload.pageCount || 1,
      pageImages: payload.pageImages || (payload.fileUrl ? [payload.fileUrl] : []),
      qualityCheck: payload.qualityCheck,
      isAiExtracted: payload.isAiExtracted ?? true,
      requiresDoctorReview: payload.requiresDoctorReview ?? true,
    };

    const updated = [newDoc, ...all];
    writeStorage(STORAGE_KEYS.DOCUMENTS, updated);
    return newDoc;
  }

  public async verifyDocumentDate(docId: string, verifiedDate: string): Promise<MedicalDocument | null> {
    const all = readStorage<MedicalDocument[]>(STORAGE_KEYS.DOCUMENTS, []);
    const idx = all.findIndex((d) => d.id === docId);
    if (idx === -1) return null;

    const updatedDoc: MedicalDocument = {
      ...all[idx],
      documentDate: verifiedDate,
      dateVerificationStatus: 'verified',
    };
    all[idx] = updatedDoc;
    writeStorage(STORAGE_KEYS.DOCUMENTS, all);
    return updatedDoc;
  }

  // -----------------------------
  // AI INTERVIEW SESSION & INCREMENTAL MEMORY
  // -----------------------------

  public async getInterviewState(patientId: string): Promise<StructuredInterviewState | null> {
    const all = readStorage<Record<string, StructuredInterviewState>>(STORAGE_KEYS.INTERVIEWS, {});
    if (all[patientId]) return all[patientId];
    const validIds = this.getEquivalentPatientIds(patientId);
    for (const key of Object.keys(all)) {
      if (validIds.has(key) || validIds.has(key.toLowerCase()) || validIds.has(key.toUpperCase())) {
        return all[key];
      }
    }
    return null;
  }

  public async saveInterviewState(patientId: string, state: Partial<StructuredInterviewState>): Promise<StructuredInterviewState> {
    const all = readStorage<Record<string, StructuredInterviewState>>(STORAGE_KEYS.INTERVIEWS, {});
    const existing = all[patientId] || {
      interviewId: `int-${Date.now()}`,
      patientId,
      language: 'en',
      chiefComplaint: '',
      symptoms: [],
      onset: '',
      duration: '',
      severity: '',
      location: '',
      radiation: '',
      character: '',
      associatedSymptoms: [],
      medicalHistory: [],
      surgicalHistory: [],
      medicationHistory: [],
      allergies: [],
      familyHistory: [],
      lifestyle: {},
      previousTreatments: [],
      documentsReferenced: [],
      redFlags: [],
      missingInformation: [],
      conversationTranscript: [],
      interviewCompleted: false,
      stage: 'greeting',
      updatedAt: new Date().toISOString(),
    };

    const updatedState: StructuredInterviewState = {
      ...existing,
      ...state,
      updatedAt: new Date().toISOString(),
    };

    all[patientId] = updatedState;
    writeStorage(STORAGE_KEYS.INTERVIEWS, all);

    // If chief complaint was identified, also update the patient's record
    if (updatedState.chiefComplaint && updatedState.chiefComplaint.trim()) {
      await this.updatePatient(patientId, {
        chiefComplaint: updatedState.chiefComplaint,
      });
    }

    return updatedState;
  }

  // -----------------------------
  // TIMELINE EVENTS
  // -----------------------------

  public async getPatientTimeline(patientId: string): Promise<TimelineEventItem[]> {
    const all = readStorage<Array<TimelineEventItem & { patientId: string }>>(STORAGE_KEYS.TIMELINES, []);
    const validIds = this.getEquivalentPatientIds(patientId);
    return all
      .filter((t) => t.patientId && (validIds.has(t.patientId) || validIds.has(t.patientId.toLowerCase()) || validIds.has(t.patientId.toUpperCase())))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async createTimelineEvent(event: Partial<TimelineEventItem> & { patientId: string }): Promise<TimelineEventItem> {
    const all = readStorage<Array<TimelineEventItem & { patientId: string }>>(STORAGE_KEYS.TIMELINES, []);
    const newEvent: TimelineEventItem & { patientId: string } = {
      id: event.id || `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patientId: event.patientId,
      date: event.date || new Date().toISOString().split('T')[0],
      time: event.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: event.type || 'consultation',
      title: event.title || 'Medical Event',
      subtitle: event.subtitle,
      details: event.details,
      badgeText: event.badgeText,
      badgeColor: event.badgeColor || 'blue',
      referenceId: event.referenceId,
    };

    const updated = [newEvent, ...all];
    writeStorage(STORAGE_KEYS.TIMELINES, updated);
    return newEvent;
  }

  // -----------------------------
  // DOCTOR NOTES
  // -----------------------------

  public async getPatientDoctorNotes(patientId: string): Promise<DoctorNoteItem[]> {
    const all = readStorage<DoctorNoteItem[]>(STORAGE_KEYS.DOCTOR_NOTES, []);
    const validIds = this.getEquivalentPatientIds(patientId);
    return all
      .filter((n) => n.patientId && (validIds.has(n.patientId) || validIds.has(n.patientId.toLowerCase()) || validIds.has(n.patientId.toUpperCase())))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async createDoctorNote(payload: Partial<DoctorNoteItem> & { patientId: string }): Promise<DoctorNoteItem> {
    const all = readStorage<DoctorNoteItem[]>(STORAGE_KEYS.DOCTOR_NOTES, []);
    const now = new Date().toISOString();
    const newNote: DoctorNoteItem = {
      id: payload.id || `note-${Date.now()}`,
      patientId: payload.patientId,
      doctorId: payload.doctorId || 'DOC-AIIMS-7842',
      doctorName: payload.doctorName || 'Dr. Rajesh Sharma, MD',
      date: payload.date || now.split('T')[0],
      category: payload.category || 'Clinical Observation',
      noteText: payload.noteText || '',
      priority: payload.priority || 'routine',
    };

    const updated = [newNote, ...all];
    writeStorage(STORAGE_KEYS.DOCTOR_NOTES, updated);

    // Add Timeline Event
    await this.createTimelineEvent({
      patientId: payload.patientId,
      date: newNote.date,
      type: 'doctor_note',
      title: `Physician Clinical Note — ${newNote.category}`,
      subtitle: `By ${newNote.doctorName}`,
      details: newNote.noteText,
      badgeText: 'Doctor Note',
      badgeColor: 'slate',
      referenceId: newNote.id,
    });

    return newNote;
  }

  // -----------------------------
  // RECENT PATIENTS TRACKER
  // -----------------------------

  public async addRecentPatient(patientId: string): Promise<void> {
    let recent = readStorage<string[]>(STORAGE_KEYS.RECENT_PATIENTS, []);
    recent = [patientId, ...recent.filter((id) => id !== patientId)].slice(0, 6);
    writeStorage(STORAGE_KEYS.RECENT_PATIENTS, recent);
  }

  public async getRecentPatients(): Promise<PatientRecord[]> {
    const recentIds = readStorage<string[]>(STORAGE_KEYS.RECENT_PATIENTS, []);
    const patients = await this.getPatients();
    return recentIds.map((id) => patients.find((p) => p.id === id)).filter(Boolean) as PatientRecord[];
  }

  // -----------------------------
  // QUEUE METRICS
  // -----------------------------

  public async getQueueMetrics(): Promise<{
    totalToday: number;
    waiting: number;
    inConsultation: number;
    completed: number;
    critical: number;
  }> {
    const patients = await this.getPatients();
    const totalToday = patients.length;
    const waiting = patients.filter((p) => p.status === 'waiting').length;
    const inConsultation = patients.filter((p) => p.status === 'in_consultation').length;
    const completed = patients.filter((p) => p.status === 'completed').length;
    const critical = patients.filter((p) => p.priority === 'critical' || p.priority === 'urgent').length;

    return {
      totalToday,
      waiting,
      inConsultation,
      completed,
      critical,
    };
  }

  // -----------------------------
  // SEED MULTIPLE FICTIONAL PATIENTS (Hackathon Demo Set)
  // -----------------------------

  private seedInitialDatabase(): void {
    const initialPatients: PatientRecord[] = [
      {
        id: 'PAT-001',
        userId: 'usr-pat-001',
        patientNumber: 'Patient 001',
        fullName: 'Rahul Kumar',
        dateOfBirth: '1996-04-12',
        age: 28,
        gender: 'male',
        mobile: '+91 98765 11001',
        phoneNumber: '+91 98765 11001',
        email: 'rahul.kumar@gmail.com',
        preferredLanguage: 'hi',
        abhaId: '91-8842-1002-3910',
        address: 'Sector 14, Gurugram, Haryana',
        registrationDate: '2026-08-29T08:30:00.000Z',
        createdAt: '2026-08-29T08:30:00.000Z',
        updatedAt: '2026-08-29T08:30:00.000Z',
        consentGiven: true,
        status: 'waiting',
        queueNumber: 1,
        arrivalTime: '09:05',
        priority: 'urgent',
        chiefComplaint: 'Acute right lower quadrant abdominal pain with nausea',
      },
      {
        id: 'PAT-002',
        userId: 'usr-pat-002',
        patientNumber: 'Patient 002',
        fullName: 'Anita Sharma',
        dateOfBirth: '1981-09-18',
        age: 45,
        gender: 'female',
        mobile: '+91 98765 22002',
        phoneNumber: '+91 98765 22002',
        email: 'anita.sharma@outlook.com',
        preferredLanguage: 'en',
        abhaId: '91-4412-9090-1123',
        address: 'Pocket B, Mayur Vihar, New Delhi',
        registrationDate: '2026-08-29T08:45:00.000Z',
        createdAt: '2026-08-29T08:45:00.000Z',
        updatedAt: '2026-08-29T08:45:00.000Z',
        consentGiven: true,
        status: 'waiting',
        queueNumber: 2,
        arrivalTime: '09:15',
        priority: 'urgent',
        chiefComplaint: 'High-grade fever with productive cough & wheezing for 4 days',
      },
      {
        id: 'PAT-003',
        userId: 'usr-pat-003',
        patientNumber: 'Patient 003',
        fullName: 'Ramesh Singh',
        dateOfBirth: '1958-03-24',
        age: 68,
        gender: 'male',
        mobile: '+91 98765 43210',
        phoneNumber: '+91 98765 43210',
        email: 'ramesh.singh@gmail.com',
        preferredLanguage: 'en',
        abhaId: '91-7842-9901-2345',
        address: 'B-12, Green Park Extension, New Delhi',
        registrationDate: '2026-08-29T09:00:00.000Z',
        createdAt: '2026-08-29T09:00:00.000Z',
        updatedAt: '2026-08-29T09:00:00.000Z',
        consentGiven: true,
        status: 'in_consultation',
        queueNumber: 3,
        arrivalTime: '09:20',
        priority: 'critical',
        chiefComplaint: 'Bilateral knee pain, exertional chest heaviness, stopped statin therapy',
      },
      {
        id: 'PAT-004',
        userId: 'usr-pat-004',
        patientNumber: 'Patient 004',
        fullName: 'Savitri Devi',
        dateOfBirth: '1954-11-05',
        age: 72,
        gender: 'female',
        mobile: '+91 98111 22334',
        phoneNumber: '+91 98111 22334',
        email: 'savitri.family@gmail.com',
        preferredLanguage: 'hi',
        abhaId: '91-3321-4455-6677',
        address: 'House #402, Civil Lines, Jaipur, Rajasthan',
        registrationDate: '2026-08-29T08:15:00.000Z',
        createdAt: '2026-08-29T08:15:00.000Z',
        updatedAt: '2026-08-29T08:15:00.000Z',
        consentGiven: true,
        status: 'completed',
        queueNumber: 4,
        arrivalTime: '08:50',
        priority: 'critical',
        chiefComplaint: 'Severe throbbing headache with visual blurriness (BP 185/105 mmHg)',
      },
      {
        id: 'PAT-005',
        userId: 'usr-pat-005',
        patientNumber: 'Patient 005',
        fullName: 'Gurpreet Singh',
        dateOfBirth: '1956-07-14',
        age: 70,
        gender: 'male',
        mobile: '+91 98222 33445',
        phoneNumber: '+91 98222 33445',
        email: 'gurpreet.s@yahoo.com',
        preferredLanguage: 'pa',
        abhaId: '91-9988-7766-5544',
        address: 'Model Town, Ludhiana, Punjab',
        registrationDate: '2026-08-29T07:45:00.000Z',
        createdAt: '2026-08-29T07:45:00.000Z',
        updatedAt: '2026-08-29T07:45:00.000Z',
        consentGiven: true,
        status: 'completed',
        queueNumber: 5,
        arrivalTime: '08:40',
        priority: 'routine',
        chiefComplaint: 'Diabetes follow-up, burning sensation in feet & microalbuminuria',
      },
    ];

    writeStorage(STORAGE_KEYS.PATIENTS, initialPatients);

    // Initial Consultations for Patients 001 to 005
    const initialConsultations: ConsultationRecord[] = [
      // Patient 001 - Visit 1 (Previous)
      {
        id: 'CON-2026-08-15-001-01',
        patientId: 'PAT-001',
        doctorId: 'DOC-AIIMS-7842',
        doctorName: 'Dr. Rajesh Sharma, MD',
        date: '2026-08-15',
        time: '11:00 AM',
        chiefComplaint: 'Mild dyspepsia and bloating after oily meals',
        clinicalHistory: '28yo male presented with upper abdominal discomfort.',
        currentSymptoms: 'Bloating, intermittent epigastric fullness.',
        physicalExamination: 'Soft abdomen, non-tender, bowel sounds active.',
        vitals: {
          bloodPressure: '120/78 mmHg',
          pulse: '72 bpm',
          spo2: '99%',
          temperature: '98.4 °F',
          weight: '68 kg',
        },
        relevantFindings: 'No organomegaly or guarding.',
        assessment: 'Functional Dyspepsia / Dietary indiscretion.',
        treatmentAdvice: 'Advised bland diet, avoid late night heavy meals.',
        prescriptions: [
          {
            id: 'rx-p1-1',
            medicineName: 'Pantoprazole 40mg',
            dosage: '40mg',
            frequency: 'Once daily before breakfast',
            duration: '14 days',
            instructions: 'Take 30 mins before morning meal',
          },
        ],
        followUpInstructions: 'Return if pain shifts or fever develops.',
        followUpDays: 14,
        status: 'completed',
      },

      // Patient 002 - Visit 1 (Previous)
      {
        id: 'CON-2026-08-10-002-01',
        patientId: 'PAT-002',
        doctorId: 'DOC-AIIMS-7842',
        doctorName: 'Dr. Rajesh Sharma, MD',
        date: '2026-08-10',
        time: '10:30 AM',
        chiefComplaint: 'Seasonal allergic rhinitis and dry cough',
        clinicalHistory: '45yo female with recurrent monsoon allergies.',
        currentSymptoms: 'Sneezing, clear nasal discharge, dry ticklish cough.',
        physicalExamination: 'Pharynx congested, chest clear, no ronchi.',
        vitals: {
          bloodPressure: '124/82 mmHg',
          pulse: '76 bpm',
          spo2: '98%',
          temperature: '98.6 °F',
          weight: '62 kg',
        },
        assessment: 'Allergic Bronchitis / Upper Airway Cough Syndrome.',
        treatmentAdvice: 'Steam inhalation twice daily, warm saline gargles.',
        prescriptions: [
          {
            id: 'rx-p2-1',
            medicineName: 'Levocetirizine + Montelukast (5mg/10mg)',
            dosage: '1 tablet',
            frequency: 'Once daily at bedtime',
            duration: '10 days',
            instructions: 'Take after dinner',
          },
        ],
        followUpInstructions: 'Review if fever or purulent sputum develops.',
        followUpDays: 10,
        status: 'completed',
      },

      // Patient 003 - Ramesh Singh Consultations (Visit 1 & 2)
      {
        id: 'CON-2026-08-01-003-01',
        patientId: 'PAT-003',
        doctorId: 'DOC-AIIMS-7842',
        doctorName: 'Dr. Rajesh Sharma, MD',
        date: '2026-08-01',
        time: '10:00 AM',
        chiefComplaint: 'Severe knee pain and difficulty walking upstairs',
        clinicalHistory: '68yo male with chronic knee osteoarthritis and CAD history.',
        currentSymptoms: 'Crepitus in bilateral knees, morning stiffness for 20 mins.',
        physicalExamination: 'Bilateral knee effusion mild, tenderness along medial joint line.',
        vitals: {
          bloodPressure: '138/88 mmHg',
          pulse: '78 bpm',
          spo2: '97%',
          temperature: '98.4 °F',
          weight: '76 kg',
        },
        assessment: 'Bilateral Knee Osteoarthritis (Grade III) with Gastric Irritation history.',
        treatmentAdvice: 'Avoid high-impact stairs, gentle quadriceps strengthening exercises.',
        prescriptions: [
          {
            id: 'rx-p3-1',
            medicineName: 'Paracetamol 650mg',
            dosage: '650mg',
            frequency: 'Twice daily SOS for pain',
            duration: '15 days',
            instructions: 'Avoid NSAIDs like Diclofenac or Aceclofenac due to gastric erosion history',
          },
        ],
        followUpInstructions: 'Review with knee X-ray.',
        followUpDays: 28,
        status: 'completed',
      },

      // Patient 004 - Savitri Devi
      {
        id: 'CON-2026-08-29-004-01',
        patientId: 'PAT-004',
        doctorId: 'DOC-AIIMS-7842',
        doctorName: 'Dr. Rajesh Sharma, MD',
        date: '2026-08-29',
        time: '09:00 AM',
        chiefComplaint: 'Hypertensive Emergency Evaluation / Severe Headache',
        clinicalHistory: '72yo female admitted with severe throbbing headache and blurred vision.',
        currentSymptoms: 'Headache 8/10, dizziness, lightheadedness.',
        physicalExamination: 'BP elevated at 185/105 mmHg, fundoscopy showed grade 2 hypertensive retinopathy.',
        vitals: {
          bloodPressure: '185/105 mmHg',
          pulse: '84 bpm',
          spo2: '97%',
          temperature: '98.6 °F',
          weight: '64 kg',
        },
        assessment: 'Accelerated Hypertension / Hypertensive Urgency.',
        treatmentAdvice: 'Immediate oral anti-hypertensive titrations, low salt diet < 2g/day.',
        prescriptions: [
          {
            id: 'rx-p4-1',
            medicineName: 'Amlodipine + Telmisartan (5mg/40mg)',
            dosage: '1 tablet',
            frequency: 'Once daily morning',
            duration: '30 days',
            instructions: 'Monitor daily home BP log',
          },
          {
            id: 'rx-p4-2',
            medicineName: 'Hydrochlorothiazide 12.5mg',
            dosage: '12.5mg',
            frequency: 'Once daily morning',
            duration: '30 days',
            instructions: 'Take after breakfast',
          },
        ],
        followUpInstructions: 'Repeat BP check tomorrow morning.',
        followUpDays: 2,
        status: 'signed',
      },

      // Patient 005 - Gurpreet Singh
      {
        id: 'CON-2026-08-29-005-01',
        patientId: 'PAT-005',
        doctorId: 'DOC-AIIMS-7842',
        doctorName: 'Dr. Rajesh Sharma, MD',
        date: '2026-08-29',
        time: '08:45 AM',
        chiefComplaint: 'Type 2 Diabetes Mellitus Comprehensive Review',
        clinicalHistory: '70yo male with 14-year history of diabetes and diabetic neuropathy.',
        currentSymptoms: 'Burning dysesthesia in bilateral soles, nocturia x 3.',
        physicalExamination: 'Decreased vibration sense in bilateral lower extremities (monofilament 4/10).',
        vitals: {
          bloodPressure: '132/84 mmHg',
          pulse: '74 bpm',
          spo2: '98%',
          temperature: '98.4 °F',
          weight: '82 kg',
        },
        assessment: 'Uncontrolled Type 2 Diabetes (HbA1c 9.2%) with Peripheral Neuropathy.',
        treatmentAdvice: 'Diabetic foot care regimen, strict carbohydrate restriction.',
        prescriptions: [
          {
            id: 'rx-p5-1',
            medicineName: 'Metformin 1000mg ER + Teneligliptin 20mg',
            dosage: '1 tablet',
            frequency: 'Twice daily after meals',
            duration: '60 days',
            instructions: 'Take with breakfast and dinner',
          },
          {
            id: 'rx-p5-2',
            medicineName: 'Pregabalin 75mg + Methylcobalamin 1500mcg',
            dosage: '1 capsule',
            frequency: 'Once daily at bedtime',
            duration: '30 days',
            instructions: 'For neuropathic pain and burning soles',
          },
        ],
        followUpInstructions: 'Repeat fasting & PP blood sugar in 2 weeks.',
        followUpDays: 14,
        status: 'signed',
      },
    ];

    writeStorage(STORAGE_KEYS.CONSULTATIONS, initialConsultations);

    // Initial Medical Reports for all patients
    const initialReports: MedicalReportItem[] = [
      // Patient 001 Reports
      {
        id: 'rep-p1-1',
        patientId: 'PAT-001',
        reportDate: '2026-08-28',
        uploadedAt: '2026-08-29T08:35:00.000Z',
        reportType: 'Ultrasound',
        testName: 'Abdominal & Pelvic Ultrasound',
        result: 'Thickened appendix (7.8mm) with mild periappendiceal fat stranding',
        units: 'mm',
        referenceRange: '< 6.0 mm',
        status: 'critical',
        facilityOrLab: 'Max Imaging Center',
        doctorNotes: 'Early acute appendicitis vs ileocecal inflammation. Surgical consultation recommended.',
      },
      {
        id: 'rep-p1-2',
        patientId: 'PAT-001',
        reportDate: '2026-08-28',
        uploadedAt: '2026-08-29T08:36:00.000Z',
        reportType: 'Blood Test',
        testName: 'Complete Blood Count (CBC) & TLC',
        result: 'TLC 14,800 /cu.mm (Neutrophils 84%)',
        units: '/cu.mm',
        referenceRange: '4,000 - 11,000',
        status: 'critical',
        facilityOrLab: 'Thyrocare Labs',
        doctorNotes: 'Leukocytosis consistent with acute inflammatory process.',
      },

      // Patient 002 Reports
      {
        id: 'rep-p2-1',
        patientId: 'PAT-002',
        reportDate: '2026-08-27',
        uploadedAt: '2026-08-29T08:50:00.000Z',
        reportType: 'X-Ray',
        testName: 'Chest X-Ray (PA View)',
        result: 'Right middle lobe patchy consolidation consistent with bronchopneumonia',
        status: 'abnormal',
        facilityOrLab: 'Apollo Diagnostics',
        doctorNotes: 'Community-acquired pneumonia changes. Initiate antibiotic coverage.',
      },
      {
        id: 'rep-p2-2',
        patientId: 'PAT-002',
        reportDate: '2026-08-27',
        uploadedAt: '2026-08-29T08:51:00.000Z',
        reportType: 'Blood Test',
        testName: 'Serum C-Reactive Protein (CRP)',
        result: '48.5',
        units: 'mg/L',
        referenceRange: '< 5.0 mg/L',
        status: 'critical',
        facilityOrLab: 'Apollo Diagnostics',
        doctorNotes: 'Elevated inflammatory marker.',
      },

      // Patient 003 Reports
      {
        id: 'rep-p3-1',
        patientId: 'PAT-003',
        reportDate: '2026-08-15',
        uploadedAt: '2026-08-29T09:05:00.000Z',
        reportType: 'X-Ray',
        testName: 'Bilateral Knee Weight-Bearing X-Ray',
        result: 'Marked joint space narrowing medial compartment, subchondral sclerosis',
        status: 'abnormal',
        facilityOrLab: 'AIIMS Radiology Dept',
        doctorNotes: 'Grade III tricompartmental osteoarthritis.',
      },
      {
        id: 'rep-p3-2',
        patientId: 'PAT-003',
        reportDate: '2026-07-20',
        uploadedAt: '2026-08-29T09:06:00.000Z',
        reportType: 'Blood Test',
        testName: 'Lipid Profile (Off-Statin Level)',
        result: 'LDL: 168 mg/dL, Total Cholesterol: 245 mg/dL',
        units: 'mg/dL',
        referenceRange: 'LDL < 70 (high risk CAD)',
        status: 'critical',
        facilityOrLab: 'Dr. Lal PathLabs',
        doctorNotes: 'High cardiovascular risk due to discontinued Rosuvastatin.',
      },

      // Patient 004 Reports
      {
        id: 'rep-p4-1',
        patientId: 'PAT-004',
        reportDate: '2026-08-29',
        uploadedAt: '2026-08-29T08:20:00.000Z',
        reportType: 'ECG',
        testName: '12-Lead Electrocardiogram',
        result: 'Sinus rhythm, Left Ventricular Hypertrophy (Sokolow-Lyon index > 35mm)',
        status: 'abnormal',
        facilityOrLab: 'Emergency OPD ECG',
        doctorNotes: 'LVH strain pattern secondary to long-standing poorly controlled hypertension.',
      },

      // Patient 005 Reports
      {
        id: 'rep-p5-1',
        patientId: 'PAT-005',
        reportDate: '2026-08-26',
        uploadedAt: '2026-08-29T07:50:00.000Z',
        reportType: 'Blood Test',
        testName: 'Glycated Hemoglobin (HbA1c)',
        result: '9.2',
        units: '%',
        referenceRange: '< 5.7% (Normal), < 7.0% (Diabetic Goal)',
        status: 'critical',
        facilityOrLab: 'Metropolis Healthcare',
        doctorNotes: 'Suboptimal glycemic control. High risk of progressive nephropathy and retinopathy.',
      },
    ];

    writeStorage(STORAGE_KEYS.REPORTS, initialReports);

    // Initial Timeline Events
    const initialTimelines: Array<TimelineEventItem & { patientId: string }> = [
      {
        id: 'tl-p1-1',
        patientId: 'PAT-001',
        date: '2026-08-29',
        time: '09:05 AM',
        type: 'ai_summary',
        title: 'Voice Intake Completed',
        subtitle: 'Chief Complaint: Abdominal pain (2 days, right side, severity 7/10)',
        details: 'Patient reports sharp pain since yesterday evening, accompanied by 2 episodes of nausea and low fever.',
        badgeText: 'AI Intake',
        badgeColor: 'purple',
      },
      {
        id: 'tl-p1-2',
        patientId: 'PAT-001',
        date: '2026-08-28',
        time: '04:30 PM',
        type: 'report',
        title: 'Ultrasound: Thickened Appendix (7.8mm)',
        subtitle: 'Max Imaging Center',
        details: 'Radiological confirmation of acute inflammatory appendiceal changes.',
        badgeText: 'Ultrasound',
        badgeColor: 'rose',
      },
      {
        id: 'tl-p2-1',
        patientId: 'PAT-002',
        date: '2026-08-29',
        time: '09:15 AM',
        type: 'ai_summary',
        title: 'Voice Intake Completed',
        subtitle: 'Chief Complaint: Fever (102°F) & productive cough with green sputum',
        details: 'Patient reports shortness of breath on exertion and chills. SpO2 96%.',
        badgeText: 'AI Intake',
        badgeColor: 'purple',
      },
      {
        id: 'tl-p3-1',
        patientId: 'PAT-003',
        date: '2026-08-29',
        time: '09:20 AM',
        type: 'ai_summary',
        title: 'Multimodal AI Intake & Conflict Flagged',
        subtitle: 'Chief Complaint: Severe knee pain; Statin discontinuation flagged',
        details: 'Identified safety conflict: Patient stopped Rosuvastatin 20mg 3 months ago without physician guidance despite DES stent in LAD (2021).',
        badgeText: 'High Alert',
        badgeColor: 'rose',
      },
    ];

    writeStorage(STORAGE_KEYS.TIMELINES, initialTimelines);

    // Initial Medical Documents per patient
    const initialDocuments: MedicalDocument[] = [
      {
        id: 'doc-p1-usg',
        patientId: 'PAT-001',
        title: 'Abdominal Ultrasound (Appendix Evaluation)',
        documentType: 'lab_report',
        documentDate: '2026-08-28',
        uploadedAt: '2026-08-28T16:40:00.000Z',
        facilityOrDoctor: 'Max Imaging Center, Gurugram',
        extractedText: 'Abdominal Ultrasound: Visualized blind-ending tubular non-compressible aperistaltic structure in the right lower quadrant measuring 7.8 mm in outer diameter. Minimal periappendiceal fluid noted. Impression: Consistent with Acute Early Appendicitis.',
      },
      {
        id: 'doc-p2-cxr',
        patientId: 'PAT-002',
        title: 'Chest X-Ray PA View (Pneumonia Protocol)',
        documentType: 'lab_report',
        documentDate: '2026-08-27',
        uploadedAt: '2026-08-27T11:20:00.000Z',
        facilityOrDoctor: 'City Diagnostic Labs, Delhi',
        extractedText: 'Chest X-Ray (PA View): Right middle lobe consolidation with air bronchograms. Left lung field clear. Costophrenic angles sharp. Cardiac shadow normal. Impression: Right Middle Lobe Bronchopneumonia.',
      },
      {
        id: 'doc-p3-discharge',
        patientId: 'PAT-003',
        title: 'Hospital Discharge Summary (Post-PCI Stenting)',
        documentType: 'discharge_summary',
        documentDate: '2021-11-14',
        uploadedAt: '2021-11-14T10:00:00.000Z',
        facilityOrDoctor: 'Fortis Escorts Heart Institute',
        extractedText: 'Discharge Summary: 63yo male admitted with ACS - NSTEMI. Successful Primary Angioplasty with Drug Eluting Stent (Xience Sierra 3.0 x 24mm) to Mid-LAD. Advised strict adherence to Dual Antiplatelet Therapy (Aspirin 75mg + Clopidogrel 75mg) and High-Intensity Rosuvastatin 20mg OD.',
      },
      {
        id: 'doc-p3-lipid',
        patientId: 'PAT-003',
        title: 'Comprehensive Lipid Profile',
        documentType: 'lab_report',
        documentDate: '2026-08-10',
        uploadedAt: '2026-08-10T09:15:00.000Z',
        facilityOrDoctor: 'Dr. Lal PathLabs',
        extractedText: 'Lipid Panel: Total Cholesterol: 242 mg/dL (High), LDL: 168 mg/dL (Critical High for CAD patient), HDL: 38 mg/dL, Triglycerides: 190 mg/dL. Alert: Marked elevation following patient statin discontinuation.',
      },
      {
        id: 'doc-p4-ecg',
        patientId: 'PAT-004',
        title: '12-Lead ECG Report (Hypertension Workup)',
        documentType: 'lab_report',
        documentDate: '2026-08-20',
        uploadedAt: '2026-08-20T08:30:00.000Z',
        facilityOrDoctor: 'SMS Medical College Hospital, Jaipur',
        extractedText: '12-Lead ECG: Sinus rhythm, HR 88 bpm. Left ventricular hypertrophy with strain pattern (Sokolow-Lyon index > 35mm). No acute ischemic ST-segment elevation.',
      },
      {
        id: 'doc-p5-hba1c',
        patientId: 'PAT-005',
        title: 'Quarterly Diabetic Panel & Urine Albumin/Creatinine',
        documentType: 'lab_report',
        documentDate: '2026-08-15',
        uploadedAt: '2026-08-15T09:00:00.000Z',
        facilityOrDoctor: 'Metropolis Healthcare, Ludhiana',
        extractedText: 'HbA1c: 9.2% (Uncontrolled). Fasting Plasma Glucose: 198 mg/dL. Urine Microalbumin/Creatinine Ratio: 145 mg/g (Microalbuminuria Stage).',
      },
    ];

    // Seed comprehensive Medical Documents per patient
    writeStorage(STORAGE_KEYS.DOCUMENTS, SEEDED_DOCUMENTS);

    // Seed comprehensive Structured AI Interviews & Transcripts per patient
    writeStorage(STORAGE_KEYS.INTERVIEWS, SEEDED_INTERVIEWS);
  }
}

export const dbService = new DatabaseService();
