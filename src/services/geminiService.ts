import { ChatMessage, PatientProfile, MedicalDocument, StructuredClinicalSummary, LanguageCode, LiveExtractionState } from '../types';
import { authService } from './authService';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = authService.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const sessId = authService.getCurrentSessionId();
  if (sessId) headers['x-session-id'] = sessId;
  return headers;
}

export async function sendClinicalChatMessage(params: {
  messages: ChatMessage[];
  patient: PatientProfile;
  documents: MedicalDocument[];
  activeLanguage: LanguageCode;
  conversationPhase: string;
  liveExtraction?: LiveExtractionState;
  signal?: AbortSignal;
}): Promise<{
  replyText: string;
  englishTranslation?: string;
  clinicalTag: 'chief_complaint' | 'symptom_detail' | 'medication' | 'history' | 'allergy' | 'lifestyle' | 'red_flag' | 'general' | 'confirmation' | 'wrap_up';
  nextPhase: string;
  isUrgentRedFlag?: boolean;
  isDocumentScanIntent?: boolean;
  clinicalNotes?: string;
  liveExtraction?: LiveExtractionState;
}> {
  const { signal, ...payload } = params;
  const res = await fetch('/api/clinical/chat', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to communicate with clinical AI');
  }

  return res.json();
}

export async function analyzeUploadedDocument(params: {
  fileBase64?: string;
  mimeType?: string;
  fileName?: string;
  fileText?: string;
  documentType?: string;
  patientId?: string;
  signal?: AbortSignal;
}): Promise<MedicalDocument> {
  const { signal, ...payload } = params;
  const res = await fetch('/api/clinical/analyze-document', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to analyze medical document');
  }

  return res.json();
}

export async function generateStructuredClinicalSummary(params: {
  messages: ChatMessage[];
  patient: PatientProfile;
  documents: MedicalDocument[];
  liveExtraction?: LiveExtractionState;
  signal?: AbortSignal;
}): Promise<StructuredClinicalSummary> {
  const { signal, ...payload } = params;
  const res = await fetch('/api/clinical/generate-summary', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to generate clinical summary');
  }

  return res.json();
}
