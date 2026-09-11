import React, { useState } from 'react';
import {
  Stethoscope,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Mic,
  Fingerprint,
  Phone,
  Shield,
  Activity,
  HeartPulse,
  ChevronRight,
  Plus,
  Radio,
} from 'lucide-react';
import { UserRole } from '../types';
import { authService, DEMO_PATIENTS } from '../services/authService';
import { VoiceAssistedLoginModal } from './VoiceAssistedLoginModal';

interface LoginScreenProps {
  initialRole?: UserRole;
  onLoginSuccess: () => void;
  onOpenRegistration: () => void;
  onBackToHome?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialRole = 'patient',
  onLoginSuccess,
  onOpenRegistration,
  onBackToHome,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [showAllDemoProfiles, setShowAllDemoProfiles] = useState(false);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!identifier.trim()) {
      setErrorMessage(
        selectedRole === 'patient'
          ? 'कृपया अपना पंजीकृत मोबाइल नंबर, ईमेल या ABHA ID दर्ज करें।'
          : selectedRole === 'doctor'
          ? 'कृपया डॉक्टर स्टाफ आईडी या ईमेल दर्ज करें।'
          : 'कृपया एडमिन स्टाफ आईडी या ईमेल दर्ज करें।'
      );
      return;
    }

    if (!isOtpMode && !password.trim()) {
      setErrorMessage('कृपया अपना पासवर्ड दर्ज करें। (Password is required)');
      return;
    }

    setIsLoading(true);
    try {
      if (isOtpMode) {
        if (!otpSent) {
          setOtpSent(true);
          setIsLoading(false);
          setSuccessNotice('ओटीपी आपके पंजीकृत मोबाइल नंबर पर भेज दिया गया है। (डेमो के लिए 1234 दर्ज करें)');
          return;
        }
        await authService.loginPatient(identifier, otpCode, true);
      } else {
        if (selectedRole === 'patient') {
          await authService.loginPatient(identifier, password, false);
        } else if (selectedRole === 'doctor') {
          await authService.loginDoctor(identifier, password);
        } else {
          await authService.loginAdmin(identifier, password);
        }
      }
      setIsLoading(false);
      onLoginSuccess();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'लॉगिन विफल रहा। कृपया सही क्रेडेंशियल्स दर्ज करें।');
    }
  };

  // Fill sample account credentials into inputs (Does NOT bypass login; user must click Sign In)
  const handleFillSampleCredentials = (role: UserRole, sampleId: string, samplePass: string) => {
    setSelectedRole(role);
    setIdentifier(sampleId);
    setPassword(samplePass);
    setIsOtpMode(false);
    setErrorMessage('');
    setSuccessNotice('पंजीकृत क्रेडेंशियल्स फॉर्म में भर दिए गए हैं। कृपया नीचे "सुरक्षित लॉगिन करें (Sign In)" बटन पर क्लिक करें।');
  };

  // Forgot password submit handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-left font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F0F7FF]/60 to-[#F8FAFC]">
      {/* ── BACKGROUND 3D HEALTHCARE FLOATING ACCENTS (Lightweight & Clean) ── */}
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-16 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* 1. Floating 3D Medical Cross Badge (Top-Left) */}
      <div className="hidden md:flex absolute top-16 left-8 lg:left-16 pointer-events-none -z-0 items-center gap-3 p-3 rounded-2xl bg-white/80 border border-white/90 shadow-[0_12px_28px_-6px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-md animate-float-slow-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <div className="text-left pr-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 block">ABDM Network</span>
          <span className="text-xs font-bold text-slate-700">Digital Health Node</span>
        </div>
      </div>

      {/* 2. Floating 3D Healthcare Shield Badge (Top-Right) */}
      <div className="hidden md:flex absolute top-20 right-8 lg:right-16 pointer-events-none -z-0 items-center gap-3 p-3 rounded-2xl bg-white/80 border border-white/90 shadow-[0_12px_28px_-6px_rgba(13,148,136,0.08),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-md animate-float-slow-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
          <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="text-left pr-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-600 block">FHIR R4 Verified</span>
          <span className="text-xs font-bold text-slate-700">End-to-End Encrypted</span>
        </div>
      </div>

      {/* 3. Floating 3D Heart Pulse Badge (Bottom-Left) */}
      <div className="hidden lg:flex absolute bottom-16 left-12 pointer-events-none -z-0 items-center gap-3 p-3 rounded-2xl bg-white/80 border border-white/90 shadow-[0_12px_28px_-6px_rgba(225,29,72,0.08),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-md animate-float-slow-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
          <HeartPulse className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="text-left pr-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-600 block">Vitals Realtime</span>
          <span className="text-xs font-bold text-slate-700">Telemetry Sync</span>
        </div>
      </div>

      {/* 4. Floating 3D Hospital OPD Badge (Bottom-Right) */}
      <div className="hidden lg:flex absolute bottom-20 right-12 pointer-events-none -z-0 items-center gap-3 p-3 rounded-2xl bg-white/80 border border-white/90 shadow-[0_12px_28px_-6px_rgba(99,102,241,0.08),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-md animate-float-slow-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Activity className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="text-left pr-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 block">Clinical AI</span>
          <span className="text-xs font-bold text-slate-700">OPQRST Engine</span>
        </div>
      </div>

      {/* ── TOP BREADCRUMB & BACK NAVIGATION ── */}
      <div className="w-full max-w-[480px] sm:max-w-[500px] flex items-center justify-between mb-4 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs text-[11px] font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ABDM FHIR R4 • Secure Clinical Gate</span>
        </div>

        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-blue-600 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>होम पेज (Home)</span>
          </button>
        )}
      </div>

      {/* ── MAIN LOGIN 3D CARD (STRICT HIERARCHY) ── */}
      <div className="relative w-full max-w-[480px] sm:max-w-[500px] rounded-[28px] bg-white/95 backdrop-blur-2xl border border-white/90 p-5 sm:p-7 text-left shadow-[0_25px_60px_-15px_rgba(37,99,235,0.12),0_10px_25px_-5px_rgba(15,23,42,0.04),inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-300 z-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
        {/* Subtle Card Top Metallic Highlight */}
        <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

        {/* 1. ROLE SELECTOR TABS: Patient / Doctor / Admin */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl mb-6 shadow-inner border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('patient');
              setErrorMessage('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedRole === 'patient'
                ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.12),0_1px_2px_rgba(0,0,0,0.04)] scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>Patient (मरीज)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('doctor');
              setErrorMessage('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedRole === 'doctor'
                ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.12),0_1px_2px_rgba(0,0,0,0.04)] scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 shrink-0" />
            <span>Doctor (डॉक्टर)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setErrorMessage('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.12),0_1px_2px_rgba(0,0,0,0.04)] scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Admin (एडमिन)</span>
          </button>
        </div>

        {/* 2. TITLE: Patient Portal Login */}
        <div className="mb-2">
          <div className="flex items-center gap-2 text-blue-600 text-[11px] font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {selectedRole === 'patient'
                ? 'Verified Patient Portal'
                : selectedRole === 'doctor'
                ? 'Clinical EHR Terminal'
                : 'System Administration'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
            {selectedRole === 'patient'
              ? 'Patient Portal Login'
              : selectedRole === 'doctor'
              ? 'Doctor Clinical Login'
              : 'Administrator Console'}
          </h1>
        </div>

        {/* 3. DESCRIPTION */}
        <p className="text-xs sm:text-[13px] text-slate-500 mb-5 leading-relaxed font-normal">
          {selectedRole === 'patient'
            ? 'Access your ABHA digital health records, past consultations, and verified prescriptions securely.'
            : selectedRole === 'doctor'
            ? 'Sign in with your hospital staff credentials to access the active OPD queue and case manager.'
            : 'Authenticate with administrative credentials for audit logs, compliance checks, and RBAC control.'}
        </p>

        {/* 4. VOICE ASSISTED LOGIN (Displayed for Patients) */}
        {selectedRole === 'patient' && (
          <div className="mb-5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/90 via-sky-50/70 to-blue-50/60 border border-teal-200/80 shadow-2xs hover:border-teal-300 hover:shadow-md hover:shadow-teal-500/10 transition-all duration-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* 3D Soft Teal Mic Icon with subtle glow */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-500/25 shrink-0">
                  <Mic className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-teal-950 truncate">
                      बोलकर लॉगिन करें (Voice Assisted Login)
                    </h4>
                  </div>
                  <p className="text-[11px] text-teal-700 truncate mt-0.5 font-medium">
                    बुजुर्ग या ग्रामीण मरीजों के लिए — बस अपना नाम या फ़ोन बोलें।
                  </p>
                </div>
              </div>

              {/* Animated Waveform Equalizer & Start Button */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="hidden sm:flex items-center gap-0.5 h-4 px-1.5 py-1 bg-teal-100/60 rounded-lg">
                  <div className="w-0.5 bg-teal-600 rounded-full animate-wave-bar-1" />
                  <div className="w-0.5 bg-teal-600 rounded-full animate-wave-bar-2" />
                  <div className="w-0.5 bg-teal-600 rounded-full animate-wave-bar-3" />
                  <div className="w-0.5 bg-teal-600 rounded-full animate-wave-bar-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:shadow-teal-600/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  शुरू करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success / Fill Notice */}
        {successNotice && (
          <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-800 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600 mt-0.5" />
            <span className="font-medium">{successNotice}</span>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* ── LOGIN FORM (EMAIL / MOBILE → PASSWORD / OTP → REMEMBER → BUTTON) ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 5. EMAIL / MOBILE / IDENTIFIER FIELD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                {selectedRole === 'patient' ? (
                  <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>
                  {selectedRole === 'patient'
                    ? 'Email / Mobile / ABHA ID'
                    : selectedRole === 'doctor'
                    ? 'Staff ID / Hospital Email'
                    : 'Admin Staff ID / Official Email'}
                </span>
                <span className="text-rose-500">*</span>
              </span>
              {selectedRole === 'patient' && (
                <span className="text-[10px] text-blue-600 font-mono font-semibold">
                  e.g. 91-8842-1002-3910
                </span>
              )}
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                {selectedRole === 'patient' ? (
                  <Phone className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === 'patient'
                    ? '9876543210 या 91-8842-1002-3910'
                    : selectedRole === 'doctor'
                    ? 'DOC-8842 या doctor@swasthya.ai'
                    : 'ADM-1001 या admin@swasthya.ai'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)]"
              />
            </div>
          </div>

          {/* 6. PASSWORD / OTP FIELD */}
          {!isOtpMode ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Password (पासवर्ड)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsOtpMode(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  Login via OTP instead
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="अपना पासवर्ड या सुरक्षा पिन दर्ज करें"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>One-Time Password (OTP)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpMode(false);
                    setOtpSent(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  Use Password instead
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder={otpSent ? '4-digit OTP दर्ज करें (Use 1234)' : 'OTP भेजने के लिए लॉगिन पर क्लिक करें'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)]"
                />
              </div>
              {otpSent && (
                <p className="text-[11px] text-teal-600 mt-1.5 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>सत्यापन OTP भेजा गया! (त्वरित डेमो के लिए 1234 का उपयोग करें)</span>
                </p>
              )}
            </div>
          )}

          {/* 7. REMEMBER DEVICE + FORGOT PASSWORD */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">Remember this device</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors whitespace-nowrap"
            >
              पासवर्ड भूल गए?
            </button>
          </div>

          {/* 8. LOGIN BUTTON (PREMIUM 3D ELEVATION & HOVER/PRESS ANIMATIONS) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(37,99,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_14px_28px_-6px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.985] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50 mt-1"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>प्रमाणित किया जा रहा है (Authenticating)...</span>
              </span>
            ) : (
              <>
                <span>
                  {isOtpMode && !otpSent
                    ? 'OTP प्राप्त करें (Get OTP)'
                    : 'लॉगिन करें (Sign In)'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* 9. CREATE ACCOUNT (REGISTRATION LINK) */}
        <div className="text-center pt-4 mt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            खाता नहीं है? (New Patient?){' '}
            <button
              type="button"
              onClick={onOpenRegistration}
              className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer ml-1 underline transition-colors"
            >
              नया मरीज पंजीकृत करें (Register Here)
            </button>
          </p>
        </div>

        {/* 10. REGISTERED TEST ACCOUNTS (FILLS FORM CREDENTIALS) */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>पंजीकृत टेस्ट एकाउंट्स (Fill Credentials)</span>
            </span>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
              पासवर्ड आवश्यक (Requires Sign In)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Test Account via Email */}
            <button
              type="button"
              onClick={() => handleFillSampleCredentials('patient', 'user@example.com', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-left transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>Email Login Test</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  Fill Email
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                user@example.com • Password@123
              </span>
            </button>

            {/* Test Account via Mobile */}
            <button
              type="button"
              onClick={() => handleFillSampleCredentials('patient', '9876543210', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 text-left transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Mobile Login Test</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Fill Mobile
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                9876543210 • Password@123
              </span>
            </button>

            {/* Rahul Kumar */}
            <button
              type="button"
              onClick={() => handleFillSampleCredentials('patient', '+91 98765 11001', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-left transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>राहुल कुमार (28 M)</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  Fill Form
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                +91 98765 11001 • Pass: Password@123
              </span>
            </button>

            {/* Savitri Devi */}
            <button
              type="button"
              onClick={() => handleFillSampleCredentials('patient', '+91 98111 22334', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-teal-50/80 border border-slate-200/80 hover:border-teal-300 text-left transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-teal-600 shrink-0" />
                  <span>सावित्री देवी (72 F)</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                  Fill Form
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                +91 98111 22334 • Pass: Password@123
              </span>
            </button>
          </div>

          {/* Expandable Doctor & Admin Quick Access */}
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAllDemoProfiles(!showAllDemoProfiles)}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{showAllDemoProfiles ? 'कम दिखाएं (Show Less)' : 'डॉक्टर / एडमिन क्रेडेंशियल्स देखें (Staff Profiles)'}</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${showAllDemoProfiles ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showAllDemoProfiles && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => handleFillSampleCredentials('doctor', 'DOC-8842', 'Doctor@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center gap-1.5">
                    <Stethoscope className="w-3 h-3 text-blue-600" />
                    <span>डॉ. प्रिया नायर (M.D.)</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    DOC-8842
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFillSampleCredentials('admin', 'ADM-1001', 'Admin@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200/80 hover:border-purple-300 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700 flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-purple-600" />
                    <span>सिस्टम एडमिनिस्ट्रेटर</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    ADM-1001
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS (VOICE ASSISTED & FORGOT PASSWORD) ── */}
      {/* Voice-Assisted Login Modal for Elderly Patients */}
      {isVoiceModalOpen && (
        <VoiceAssistedLoginModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onFillCredentials={(filledId, filledPass) => {
            handleFillSampleCredentials('patient', filledId, filledPass || 'Password@123');
          }}
        />
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h4 className="font-bold text-base text-slate-900">पासवर्ड रीसेट करें (Reset Password)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              अपना पंजीकृत मोबाइल नंबर या ईमेल दर्ज करें। हम सत्यापन कोड भेजेंगे।
            </p>
            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>सत्यापन लिंक आपके ईमेल/मोबाइल पर भेज दिया गया है!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="ईमेल या 10-अंकीय मोबाइल नंबर"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition shadow-inner"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer"
                >
                  OTP कोड भेजें (Send OTP)
                </button>
              </form>
            )}
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotSuccess(false);
              }}
              className="w-full py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
