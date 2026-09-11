import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  CaseTakingSession,
  LanguageCode,
  PatientProfile,
  AuthSession,
  AuthUser,
  MedicalDocument,
  StructuredClinicalSummary,
} from './types';
import { authService } from './services/authService';
import { dbService } from './services/dbService';
import { useLanguage } from './contexts/LanguageContext';
import { terminateAllSpeechEngines } from './utils/speechUtils';
import { getLocalizedWelcomeGreeting } from './i18n/languages';

// Primary Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SignUpPage } from './pages/SignUpPage';
import { PatientPortalPage } from './pages/PatientPortalPage';
import { DoctorPortalPage } from './pages/DoctorPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

// Portal & Workspace Views
import { Header } from './components/Header';
import { PatientPortalDashboard } from './components/PatientPortalDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { VoiceIntakeView } from './components/VoiceIntakeView';
import { DocumentTimelineView } from './components/DocumentTimelineView';
import { AdminDashboard } from './components/AdminDashboard';

// Modals
import { PatientRegistrationModal } from './components/PatientRegistrationModal';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { SummaryPrintView } from './components/SummaryPrintView';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authSession, setAuthSession] = useState<AuthSession | null>(() =>
    authService.getCurrentSession()
  );
  const [currentSession, setCurrentSession] = useState<CaseTakingSession | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [printSummaryData, setPrintSummaryData] = useState<{
    summary: StructuredClinicalSummary;
    patient: PatientProfile;
    documents: MedicalDocument[];
  } | null>(null);

  const { language, setLanguage, isLanguageSelectorOpen, closeLanguageSelector } = useLanguage();

  // Fallback patient profile
  const defaultPatientProfile: PatientProfile = {
    id: 'PAT-001',
    fullName: 'Rahul Kumar',
    age: 28,
    gender: 'male',
    phoneNumber: '+91 98765 43210',
    preferredLanguage: language || 'hi',
    consentGiven: true,
    registrationDate: new Date().toISOString(),
  };

  const defaultClinicalSession: CaseTakingSession = {
    id: 'session-rahul-28',
    patient: defaultPatientProfile,
    activeLanguage: language || 'hi',
    isVoiceActive: false,
    isListening: false,
    isAiSpeaking: false,
    conversationPhase: 'symptom_exploration',
    messages: [
      {
        id: 'msg-init-1',
        sender: 'ai',
        text: 'नमस्ते राहुल जी! मैं स्वास्थ्या एआई हूँ। कृपया बताइए कि आज आपको क्या शारीरिक परेशानी महसूस हो रही है?',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-init-2',
        sender: 'patient',
        text: 'डॉक्टर साहब, मुझे पिछले 3 दिनों से सीने के बीच में भारी दबाव महसूस हो रहा है, जो बाएं हाथ तक जाता है।',
        timestamp: '10:01 AM',
      },
    ],
    documents: [],
    summary: {
      id: 'sum-01',
      patientId: 'PAT-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      intakeStage: 'in_progress',
      chiefComplaint: 'Retrosternal chest pressure with left arm radiation',
      historyOfPresentIllness: {
        onset: '3 days ago (Acute onset)',
        duration: '3 days',
        locationAndRadiation: 'Retrosternal center radiating to left arm',
        characterAndSeverity: 'Heavy crushing pressure, 7/10',
        aggravatingFactors: 'Brisk walking, climbing stairs',
        relievingFactors: 'Rest, sublingual nitrates',
        associatedSymptoms: ['Mild diaphoresis', 'Exertional dyspnea'],
        chronologicalNarrative:
          'Patient experienced acute onset retrosternal chest pain 3 days ago while climbing stairs.',
      },
      pastMedicalHistory: ['Hypertension (3 years)'],
      pastSurgicalHistory: ['Appendectomy (2018)'],
      allergies: [
        {
          allergen: 'Penicillin',
          reaction: 'Skin rash, urticaria',
          severity: 'moderate',
        },
      ],
      familyHistory: ['Father had myocardial infarction at age 54'],
      socialHabits: {
        smokingOrTobacco: 'Non-smoker',
        alcohol: 'Social, occasional',
        diet: 'Vegetarian',
      },
      medicationReconciliation: [],
      conflicts: [],
      reviewOfSystems: {},
      provisionalDifferentialDiagnosis: [
        {
          condition: 'Acute Coronary Syndrome (Unstable Angina)',
          likelihood: 'high',
          rationale: 'Retrosternal radiation with left arm involvement and cardiac risk factors.',
        },
      ],
      redFlagsOrUrgentAlerts: ['Retrosternal chest pain with left arm radiation requires urgent ECG'],
      suggestedInvestigationsForDoctor: ['12-lead ECG stat', 'Troponin-I serial', '2D Echocardiogram'],
      suggestedClarifyingQuestionsForDoctor: [
        'Did the pain occur at rest or only upon physical exertion?',
      ],
    },
    liveExtraction: {
      chiefComplaint: 'Retrosternal chest pressure with left arm radiation',
      duration: '3 days',
      location: 'Center of chest, left arm',
      symptoms: ['Chest pressure', 'Arm radiation', 'Mild shortness of breath'],
      severity: '7/10',
    },
    priority: 'urgent',
    lastVisitDate: new Date().toISOString(),
  };

  // Factory to produce a clean, isolated session for an authenticated user
  const createFreshUserSession = (user: AuthUser): CaseTakingSession => {
    const lang = user.preferredLanguage || 'en';
    return {
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
  };

  // Load session strictly scoped to the authenticated user's ID
  const loadUserSessionData = async (user: AuthUser) => {
    try {
      const token = authService.getToken() || undefined;
      const userSession = await dbService.loadUserSession(user, token);
      setCurrentSession(userSession);
    } catch (err) {
      console.warn('Error loading user session, creating fresh isolated session:', err);
      setCurrentSession(createFreshUserSession(user));
    }
  };

  // Auth session subscription and data loading
  useEffect(() => {
    const session = authService.getCurrentSession();
    setAuthSession(session);

    if (session?.isAuthenticated && session.user) {
      loadUserSessionData(session.user);
    } else {
      setCurrentSession(null);
    }

    const unsubscribe = authService.subscribe((s) => {
      setAuthSession(s);
      if (s?.isAuthenticated && s.user) {
        loadUserSessionData(s.user);
      } else {
        terminateAllSpeechEngines();
        setCurrentSession(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update session state scoped to authenticated user
  const handleUpdateSession = (updated: Partial<CaseTakingSession>) => {
    setCurrentSession((prev) => {
      const user = authSession?.user;
      const base = prev || (user ? createFreshUserSession(user) : defaultClinicalSession);
      const nextSession = {
        ...base,
        ...updated,
      };
      if (user?.id) {
        dbService.saveUserSession(user.id, nextSession, authService.getToken() || undefined);
      }
      return nextSession;
    });
  };

  // Sample Case Switcher (for testing/doctors)
  const handleSelectSampleCase = async (caseId: string) => {
    if (authSession?.user?.role === 'patient') {
      return;
    }
    try {
      const loaded = await dbService.loadFullSessionForPatient(caseId);
      if (loaded) {
        setCurrentSession(loaded);
      }
    } catch (err) {
      console.warn('Could not switch sample case from db:', err);
    }
  };

  // Language Change
  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    handleUpdateSession({ activeLanguage: lang });
  };

  // Consent update
  const handleUpdateConsent = (granted: boolean) => {
    if (!currentSession) return;
    handleUpdateSession({
      patient: {
        ...currentSession.patient,
        consentGiven: granted,
      },
    });
  };

  // Add document
  const handleAddDocument = (doc: MedicalDocument) => {
    if (!currentSession) return;
    const docs = [doc, ...(currentSession.documents || [])];
    handleUpdateSession({ documents: docs });
  };

  // Logout
  const handleLogout = () => {
    terminateAllSpeechEngines();
    authService.logout();
    setAuthSession(null);
    setCurrentSession(null);
    navigate('/login');
  };

  const currentUser = authSession?.user || authService.getCurrentUser() || null;
  const activeSession =
    currentSession || (currentUser ? createFreshUserSession(currentUser) : defaultClinicalSession);

  // Check whether we are on a page with its own self-contained top bar (login, signup, and portal dashboards)
  const isDedicatedPortalPage =
    location.pathname === '/patient-portal' ||
    location.pathname === '/patient-dashboard' ||
    location.pathname === '/doctor-portal' ||
    location.pathname === '/doctor-dashboard' ||
    location.pathname === '/admin-portal' ||
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/doctor' ||
    location.pathname === '/admin';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const hideCommonHeader = isAuthPage || isDedicatedPortalPage;

  return (
    <div className="min-h-screen bg-futuristic-clinic text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Common Top Navigation Bar across pages (except /login, /signup, and dedicated portal pages) */}
      {!hideCommonHeader && (
        <Header
          user={currentUser}
          currentSession={activeSession}
          onSelectSampleCase={handleSelectSampleCase}
          onLanguageChange={handleLanguageChange}
          onLogout={handleLogout}
        />
      )}

      {/* 2. Routes (Separate URL and Page for each section) */}
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* 1. Home Page: Route / */}
          <Route
            path="/"
            element={
              <HomePage
                onStartVoiceFlow={() => {
                  if (currentUser) {
                    navigate('/voice-intake');
                  } else {
                    navigate('/login');
                  }
                }}
              />
            }
          />

          {/* 2. Login Page: Route /login */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLoginSuccess={() => {
                  const s = authService.getCurrentSession();
                  setAuthSession(s);
                }}
              />
            }
          />

          {/* 3. Features Page: Route /features */}
          <Route path="/features" element={<FeaturesPage />} />

          {/* 4. About Page: Route /about */}
          <Route path="/about" element={<AboutPage />} />

          {/* 5. Contact Page: Route /contact */}
          <Route path="/contact" element={<ContactPage />} />

          {/* 6. Sign Up Page: Route /signup */}
          <Route
            path="/signup"
            element={
              <SignUpPage
                onRegisterSuccess={() => {
                  const s = authService.getCurrentSession();
                  setAuthSession(s);
                }}
              />
            }
          />

          {/* 7. Patient Portal: Route /patient-portal */}
          <Route
            path="/patient-portal"
            element={
              !currentUser ? (
                <Navigate to="/login" replace />
              ) : currentUser.role === 'patient' ? (
                <PatientPortalPage user={currentUser} onLogout={handleLogout} />
              ) : currentUser.role === 'doctor' ? (
                <Navigate to="/doctor-portal" replace />
              ) : (
                <Navigate to="/admin-portal" replace />
              )
            }
          />

          {/* 8. Doctor Portal & Dashboard: Route /doctor-portal & /doctor-dashboard */}
          <Route
            path="/doctor-portal"
            element={
              !currentUser ? (
                <Navigate to="/login" replace />
              ) : currentUser.role === 'doctor' ? (
                <DoctorPortalPage user={currentUser} onLogout={handleLogout} />
              ) : currentUser.role === 'patient' ? (
                <Navigate to="/patient-portal" replace />
              ) : (
                <Navigate to="/admin-portal" replace />
              )
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              !currentUser ? (
                <Navigate to="/login" replace />
              ) : currentUser.role === 'doctor' ? (
                <DoctorPortalPage user={currentUser} onLogout={handleLogout} />
              ) : currentUser.role === 'patient' ? (
                <Navigate to="/patient-portal" replace />
              ) : (
                <Navigate to="/admin-portal" replace />
              )
            }
          />
          <Route path="/doctor" element={<Navigate to="/doctor-dashboard" replace />} />

          {/* 9. Admin Portal & Dashboard: Route /admin-portal & /admin-dashboard */}
          <Route
            path="/admin-portal"
            element={
              !currentUser ? (
                <Navigate to="/login" replace />
              ) : currentUser.role === 'admin' ? (
                <AdminPortalPage user={currentUser} onLogout={handleLogout} />
              ) : currentUser.role === 'doctor' ? (
                <Navigate to="/doctor-portal" replace />
              ) : (
                <Navigate to="/patient-portal" replace />
              )
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              !currentUser ? (
                <Navigate to="/login" replace />
              ) : currentUser.role === 'admin' ? (
                <AdminPortalPage user={currentUser} onLogout={handleLogout} />
              ) : currentUser.role === 'doctor' ? (
                <Navigate to="/doctor-portal" replace />
              ) : (
                <Navigate to="/patient-portal" replace />
              )
            }
          />
          <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />

          {/* Patient Portal Dashboard: Route /patient-dashboard */}
          <Route
            path="/patient-dashboard"
            element={<Navigate to="/patient-portal" replace />}
          />

          {/* Voice Intake Flow: Route /voice-intake */}
          <Route
            path="/voice-intake"
            element={
              <div className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
                <VoiceIntakeView
                  key={`voice-intake-${authSession?.sessionId || currentUser?.id || 'guest'}`}
                  session={activeSession}
                  onUpdateSession={handleUpdateSession}
                  onOpenDocuments={() => navigate('/documents')}
                  onOpenRegistration={() => setIsRegistrationModalOpen(true)}
                  onViewDoctorDashboard={() => navigate('/doctor-portal')}
                />
              </div>
            }
          />

          {/* Medical Records & Document Timeline: Route /documents */}
          <Route
            path="/documents"
            element={
              <div className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
                <DocumentTimelineView
                  documents={activeSession.documents || []}
                  patientId={activeSession.patient?.id || 'PAT-001'}
                  onAddDocument={handleAddDocument}
                  onClose={() =>
                    navigate(
                      currentUser?.role === 'doctor'
                        ? '/doctor-portal'
                        : '/patient-portal'
                    )
                  }
                />
              </div>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Patient Registration / Profile Modal */}
      {isRegistrationModalOpen && (
        <PatientRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          patient={activeSession.patient || defaultPatientProfile}
          onSave={(updatedProfile) => {
            handleUpdateSession({ patient: updatedProfile });
            setIsRegistrationModalOpen(false);
          }}
          onStartIntakeImmediately={() => {
            setIsRegistrationModalOpen(false);
            navigate('/voice-intake');
          }}
        />
      )}

      {/* 4. Full Multilingual Language Selector Dialog */}
      {(isLanguageModalOpen || isLanguageSelectorOpen) && (
        <LanguageSelectModal
          isOpen={true}
          onClose={() => {
            setIsLanguageModalOpen(false);
            closeLanguageSelector();
          }}
          onSelect={(code) => {
            handleLanguageChange(code);
            setIsLanguageModalOpen(false);
            closeLanguageSelector();
          }}
          onSelectLanguage={(code) => {
            handleLanguageChange(code);
            setIsLanguageModalOpen(false);
            closeLanguageSelector();
          }}
        />
      )}

      {/* 5. Printable Clinical Case Sheet Modal */}
      {printSummaryData && (
        <SummaryPrintView
          summary={printSummaryData.summary}
          patient={printSummaryData.patient}
          documents={printSummaryData.documents}
          onClose={() => setPrintSummaryData(null)}
        />
      )}
    </div>
  );
}
