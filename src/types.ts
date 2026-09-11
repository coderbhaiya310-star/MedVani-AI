export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'mr'
  | 'te'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur'
  | string;

export interface SupportedLanguage {
  code: LanguageCode;
  locale: string;
  name: string;
  nativeName: string;
  englishName: string;
  direction: 'ltr' | 'rtl';
  speechRecognitionLocale: string;
  speechSynthesisLocale: string;
  speechVoiceLang: string;
  script: string;
  greeting: string;
  isRtl?: boolean;
  region?: string;
  exampleQuery?: string;
  listeningPrompt?: string;
  processingPrompt?: string;
}

export interface PatientProfile {
  id: string; // e.g. "PAT-001"
  userId?: string; // Links to AuthUser.id (e.g. "usr-pat-001")
  patientNumber?: string; // e.g. "Patient 001"
  fullName: string;
  dateOfBirth?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  abhaId?: string;
  aadhaarLast4?: string;
  hospitalMrn?: string;
  phoneNumber: string;
  mobile?: string;
  email?: string;
  preferredLanguage: LanguageCode;
  caregiverName?: string;
  caregiverPhone?: string;
  address?: string;
  registrationDate: string;
  createdAt?: string;
  updatedAt?: string;
  consentAudioUrl?: string;
  consentTimestamp?: string;
  consentGiven: boolean;
  status?: 'waiting' | 'in_consultation' | 'completed' | 'cancelled';
  queueNumber?: number;
  arrivalTime?: string;
  priority?: 'critical' | 'urgent' | 'routine';
  chiefComplaint?: string;
}

export interface PatientRecord extends PatientProfile {}

export interface StructuredInterviewState {
  interviewId: string;
  patientId: string;
  language: LanguageCode;
  chiefComplaint: string;
  symptoms: string[];
  onset: string;
  duration: string;
  severity: string | number;
  location: string;
  radiation: string;
  character: string;
  aggravatingFactors?: string;
  relievingFactors?: string;
  associatedSymptoms: string[];
  medicalHistory: string[];
  surgicalHistory: string[];
  medicationHistory: any[];
  allergies: string[];
  familyHistory: string[];
  lifestyle: {
    diet?: string;
    smokingOrTobacco?: string;
    alcohol?: string;
    physicalActivity?: string;
  };
  previousTreatments: string[];
  documentsReferenced: string[];
  redFlags: string[];
  missingInformation: string[];
  conversationTranscript: ChatMessage[];
  interviewCompleted: boolean;
  stage: 'greeting' | 'chief_complaint' | 'symptom_exploration' | 'medication_history' | 'medical_history' | 'confirmation' | 'wrap_up' | 'completed' | string;
  updatedAt: string;
}

export interface StructuredConversationMemory {
  patientInfo?: {
    name?: string;
    age?: number;
    gender?: string;
    id?: string;
  };
  chiefComplaint?: string;
  symptoms?: Array<{
    symptom: string;
    location?: string;
    onset?: string;
    duration?: string;
    severity?: string;
    frequency?: string;
    character?: string;
  }>;
  onset?: string;
  duration?: string;
  severity?: string;
  frequency?: string;
  associatedSymptoms?: string[];
  medicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  familyHistory?: string[];
  socialHistory?: string;
  investigationsOrReports?: string;
  patientStatements?: string[];
  questionsAlreadyAsked?: string[];
  answersAlreadyReceived?: string[];
  confirmedInformation?: string[];
  missingInformation?: string[];
  currentTopic?: string;
  currentLanguage?: string;
  detectedLanguage?: string;
  lastPatientResponse?: string;
  lastAiQuestion?: string;
}

export interface LiveExtractionState {
  chiefComplaint?: string;
  symptoms?: string[];
  associatedSymptoms?: string[];
  location?: string;
  duration?: string;
  severity?: string;
  progression?: string;
  character?: string;
  feverTemperature?: string;
  previousEpisodes?: string;
  pastMedicalHistory?: string[];
  pastSurgicalHistory?: string[];
  currentMedications?: string[];
  medicationsMentioned?: string[];
  allergies?: string[];
  familyHistory?: string[];
  socialHabits?: {
    lifestyleFactors?: string;
    habits?: string;
    occupationOrEnvironment?: string;
  };
  previousTreatment?: string;
  reportsAvailable?: string;
  vitals?: {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
    spo2?: string;
    respiratoryRate?: string;
    otherMeasurements?: string;
  };
  relevantNegativeSymptoms?: string[];
  recentlyTakenMedicines?: string[];
  treatmentAlreadyTried?: string;
  patientsOwnWords?: string[];
  missingInformation?: string[];
  clinicalConsiderations?: string[];
  formattedDoctorSummaryText?: string;
  triggers?: string;
  previousOccurrence?: string;
  additionalInformation?: string;
  conflictsDetected?: string[];
  redFlags?: string[];
  recapSummary?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'patient' | 'system';
  text: string;
  translatedText?: string;
  timestamp: string;
  audioBlobUrl?: string;
  clinicalTag?: 'chief_complaint' | 'symptom_detail' | 'medication' | 'history' | 'allergy' | 'lifestyle' | 'red_flag' | 'general' | 'confirmation' | 'wrap_up';
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  consultationId?: string;
  documentName?: string;
  title: string;
  documentType: 'prescription' | 'lab_report' | 'discharge_summary' | 'imaging_scan' | 'vaccination' | 'other';
  documentDate: string;
  uploadedAt: string;
  uploadedBy?: string;
  facilityOrDoctor?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  ocrConfidence?: number;
  pageCount?: number;
  pageImages?: string[];
  isAiExtracted?: boolean;
  requiresDoctorReview?: boolean;
  originalLanguage?: string;
  patientNameInDoc?: string;
  qualityCheck?: {
    isReadable: boolean;
    blurScore?: number;
    lightingQuality?: 'good' | 'low_light' | 'glare';
    feedback?: string;
  };
  extractedText?: string;
  extractedData?: {
    diagnoses?: string[];
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration?: string;
      prescribedFor?: string;
    }>;
    labResults?: Array<{
      testName: string;
      value: string;
      unit?: string;
      referenceRange?: string;
      status?: 'normal' | 'high' | 'low' | 'critical';
    }>;
    keyFindings?: string[];
  };
}

export interface ConflictFlag {
  id: string;
  severity: 'high' | 'medium' | 'low';
  category: 'medication' | 'diagnosis' | 'timeline' | 'allergy' | 'lifestyle';
  title: string;
  patientClaim: string;
  documentEvidence: string;
  sourceDocumentId?: string;
  clinicalImpact: string;
  doctorResolution?: 'pending' | 'patient_correct' | 'document_correct' | 'reconciled' | 'followup_needed';
  doctorNote?: string;
}

export interface MedicationReconciliationItem {
  id: string;
  medicationName: string;
  patientReportedDose?: string;
  patientReportedFrequency?: string;
  documentPrescribedDose?: string;
  documentPrescribedFrequency?: string;
  sourceDocumentTitle?: string;
  adherenceStatus: 'adherent' | 'non_adherent' | 'dose_mismatch' | 'stopped_by_patient' | 'unverified';
  notes?: string;
}

export interface StructuredClinicalSummary {
  id: string;
  patientId: string;
  consultationId?: string;
  createdAt: string;
  updatedAt: string;
  intakeStage: 'in_progress' | 'completed' | 'doctor_reviewed' | 'finalized';
  
  patientOverview?: {
    patientName: string;
    age: number;
    gender: string;
    patientId: string;
    consultationId?: string;
    visitDate: string;
    preferredLanguage?: string;
  };

  chiefComplaint: string;
  historyOfPresentIllness: {
    symptoms?: string[];
    onset: string;
    duration: string;
    severity?: string;
    progression?: string;
    locationAndRadiation: string;
    characterAndSeverity: string; // 1-10 or descriptive
    character?: string;
    aggravatingFactors: string;
    relievingFactors: string;
    associatedSymptoms: string[];
    relevantNegativeSymptoms?: string[];
    chronologicalNarrative: string;
  };
  
  symptomsBreakdown?: Array<{
    symptom: string;
    location?: string;
    onset?: string;
    duration?: string;
    character?: string;
    severity?: string;
    radiation?: string;
    associatedSymptoms?: string[];
  }>;

  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  previousSimilarEpisodes?: string;
  relevantMedicalHistory?: {
    diabetes?: string;
    hypertension?: string;
    heartDisease?: string;
    previousSurgery?: string;
    otherConditions?: string;
  };

  allergies: Array<{ allergen: string; reaction: string; severity: 'mild' | 'moderate' | 'severe' }>;
  allergiesSummaryText?: string;
  familyHistory: string[];
  socialHabits: {
    diet?: string;
    smokingOrTobacco?: string;
    alcohol?: string;
    physicalActivity?: string;
    lifestyleFactors?: string;
    habits?: string;
    occupationOrEnvironment?: string;
  };
  
  previousTreatment?: {
    consultedDoctorBefore?: string;
    previousMedications?: string;
    uploadedPrescriptionDetails?: string;
    recentlyTakenMedicines?: string;
    treatmentAlreadyTried?: string;
  };

  vitals?: {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
    spo2?: string;
    respiratoryRate?: string;
    otherMeasurements?: string;
  };

  investigationsAndReportsSummary?: {
    previousTests?: string;
    labResults?: string;
    imagingOrReportInfo?: string;
    prescriptionInfo?: string;
    ocrExtractedInfo?: string;
  };

  currentSymptomSummary?: string;
  patientsOwnWords?: string[];

  medicationReconciliation: MedicationReconciliationItem[];
  conflicts: ConflictFlag[];
  
  documentsReviewed?: Array<{
    id: string;
    name: string;
    documentType: string;
    documentDate: string;
    facilityOrDoctor?: string;
    ocrConfidence?: number;
  }>;

  relevantDocumentFindings?: Array<{
    sourceDocName: string;
    category: string;
    findingText: string;
    verifiedByDoctor?: boolean;
    isAbnormal?: boolean;
  }>;

  reviewOfSystems: {
    general?: string;
    cardiovascular?: string;
    respiratory?: string;
    gastrointestinal?: string;
    neurological?: string;
    musculoskeletal?: string;
  };
  
  provisionalDifferentialDiagnosis: Array<{
    condition: string;
    likelihood: 'high' | 'moderate' | 'low';
    rationale: string;
  }>;
  clinicalConsiderations?: string[]; // Potential clinical considerations for physician review (clearly marked as considerations, not confirmed diagnoses)
  
  redFlagsOrUrgentAlerts: string[];
  missingInformation?: string[];
  relevantPositiveFindings?: string[];
  relevantNegativeFindings?: string[];
  importantPatientStatements?: string[];
  informationRequiringDoctorVerification?: string[];
  consultationDateTime?: string;
  completeConversationReference?: Array<{
    id?: string;
    sender: string;
    text: string;
    timestamp: string;
    clinicalTag?: string;
  }>;
  aiExecutiveSummary?: string;
  formattedDoctorSummaryText?: string; // Long, structured, professional clinical consultation summary formatted for the doctor
  doctorReviewStatus?: 'pending_review' | 'verified_by_doctor' | 'amended_by_doctor';

  suggestedInvestigationsForDoctor: string[];
  suggestedClarifyingQuestionsForDoctor: string[];
  
  doctorAssessment?: string;
  doctorPrescriptionPlan?: Array<{
    medicine: string;
    dosage: string;
    timing: string;
    instructions: string;
  }>;
  doctorFollowUpDays?: number;
  doctorSignatureName?: string;
}

export interface ConsultationVitals {
  bloodPressure?: string;
  pulse?: string;
  spo2?: string;
  temperature?: string;
  weight?: string;
  respiratoryRate?: string;
  bloodSugar?: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time?: string;
  chiefComplaint: string;
  clinicalHistory: string;
  currentSymptoms: string;
  physicalExamination: string;
  vitals: ConsultationVitals;
  relevantFindings?: string;
  assessment: string; // Doctor's clinical impression (doctor-authored)
  treatmentAdvice: string;
  prescriptions: PrescriptionItem[];
  followUpInstructions: string;
  followUpDays?: number;
  additionalNotes?: string;
  attachedReportIds?: string[];
  status: 'draft' | 'completed' | 'signed';
}

export interface MedicalReportItem {
  id: string;
  patientId: string;
  reportDate: string; // YYYY-MM-DD
  uploadedAt: string;
  reportType: 'Blood Test' | 'X-Ray' | 'ECG' | 'CT Scan' | 'MRI Scan' | 'Ultrasound' | 'Pathology' | 'Prescription' | 'Discharge Summary' | 'Medical Certificate' | 'Other';
  testName: string;
  result: string;
  units?: string;
  referenceRange?: string;
  doctorNotes?: string;
  facilityOrLab?: string;
  documentUrl?: string;
  fileUrl?: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
}

export interface DoctorNoteItem {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  category: 'Clinical Observation' | 'Follow-up Note' | 'Care Coordination' | 'Medication Note' | 'Family Discussion';
  noteText: string;
  priority?: 'routine' | 'urgent';
}

export interface TimelineEventItem {
  id: string;
  date: string;
  time?: string;
  type: 'consultation' | 'report' | 'prescription' | 'ai_summary' | 'document' | 'doctor_note';
  title: string;
  subtitle?: string;
  details?: string;
  badgeText?: string;
  badgeColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  referenceId?: string;
}

export interface CaseTakingSession {
  id: string;
  patient: PatientProfile;
  messages: ChatMessage[];
  documents: MedicalDocument[];
  summary: StructuredClinicalSummary;
  liveExtraction?: LiveExtractionState;
  isVoiceActive: boolean;
  isListening: boolean;
  isAiSpeaking: boolean;
  activeLanguage: LanguageCode;
  conversationPhase: 'greeting' | 'chief_complaint' | 'symptom_exploration' | 'medication_history' | 'medical_history' | 'confirmation' | 'wrap_up' | 'completed';
  consultations?: ConsultationRecord[];
  reports?: MedicalReportItem[];
  doctorNotes?: DoctorNoteItem[];
  priority?: 'critical' | 'urgent' | 'routine';
  lastVisitDate?: string;
}

// ==========================================
// AUTHENTICATION & ROLE-BASED ACCESS TYPES
// ==========================================

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  // Doctor/Staff specific
  staffId?: string;
  department?: string;
  hospitalName?: string;
  designation?: string;
  medicalLicenseNumber?: string;
  // Patient specific
  associatedPatientId?: string;
  associatedCaseId?: string;
  consentGiven?: boolean;
  preferredLanguage?: LanguageCode;
  abhaId?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  // Admin specific
  adminLevel?: 'super_admin' | 'hospital_admin' | 'clinical_supervisor';
  createdAt: string;
  lastLogin: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  sessionId?: string | null;
  sessionExpiresAt: string | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'LOGIN' | 'LOGOUT' | 'CASE_CREATED' | 'CASE_REVIEWED' | 'DOCUMENT_UPLOADED' | 'SUMMARY_FINALIZED' | 'PRESCRIPTION_SIGNED' | 'CONSENT_GRANTED' | 'CONSENT_WITHDRAWN' | 'USER_ROLE_UPDATED';
  details: string;
  ipAddress?: string;
  patientId?: string;
}

export interface PatientRegistrationPayload {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword?: string;
  preferredLanguage: LanguageCode;
  abhaId?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  consentGiven: boolean;
}

