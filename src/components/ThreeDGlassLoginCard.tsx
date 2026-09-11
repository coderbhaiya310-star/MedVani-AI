import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Mic,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { VoiceAssistedLoginModal } from './VoiceAssistedLoginModal';

interface ThreeDGlassLoginCardProps {
  initialRole?: UserRole;
  onLoginSuccess: () => void;
  onOpenRegistration: () => void;
  className?: string;
}

export const ThreeDGlassLoginCard: React.FC<ThreeDGlassLoginCardProps> = ({
  initialRole = 'patient',
  onLoginSuccess,
  onOpenRegistration,
  className = '',
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
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

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
          : 'कृपया एडमिन आईडी या ईमेल दर्ज करें।'
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
          // Send OTP
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
    setShowDemoMenu(false);
    setErrorMessage('');
    setSuccessNotice('पंजीकृत क्रेडेंशियल्स फॉर्म में भर दिए गए हैं। कृपया नीचे "Sign In" बटन पर क्लिक करके लॉगिन करें।');
  };

  return (
    <div
      className={`relative w-full max-w-[420px] sm:max-w-[440px] mx-auto rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 p-5 sm:p-6 lg:p-7 shadow-[0_20px_50px_rgba(37,99,235,0.12)] text-left transition-all duration-300 ${className}`}
      style={{
        boxShadow:
          '0 25px 50px -12px rgba(37, 99, 235, 0.15), 0 10px 25px -5px rgba(13, 148, 136, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 1)',
      }}
    >
      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-2xl mb-4.5">
        <button
          type="button"
          onClick={() => {
            setSelectedRole('patient');
            setErrorMessage('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedRole === 'patient'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>Patient</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole('doctor');
            setErrorMessage('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedRole === 'doctor'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 shrink-0" />
          <span>Doctor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole('admin');
            setErrorMessage('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedRole === 'admin'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Admin</span>
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {selectedRole === 'patient'
            ? 'Patient Portal Login'
            : selectedRole === 'doctor'
            ? 'Doctor Clinical Login'
            : 'Admin Portal Login'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-snug">
          {selectedRole === 'patient'
            ? 'Enter your mobile number, email, or ABHA ID to access records.'
            : selectedRole === 'doctor'
            ? 'Enter your Staff ID or hospital email to review OPD queue.'
            : 'Enter administrator credentials to audit compliance logs.'}
        </p>
      </div>

      {/* Voice-assisted Login Option for Elderly Patients */}
      {selectedRole === 'patient' && (
        <button
          type="button"
          onClick={() => setIsVoiceModalOpen(true)}
          className="w-full mb-3.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-teal-50/90 via-sky-50/70 to-blue-50/60 border border-teal-200/80 hover:border-teal-300 text-teal-900 text-xs font-bold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:shadow-teal-500/10 hover:-translate-y-0.5 active:translate-y-0 group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <span className="block text-xs font-bold text-teal-950 truncate">बोलकर लॉगिन करें (Voice Login)</span>
              <span className="text-[10px] text-teal-700 font-normal block truncate">बुजुर्ग मरीजों के लिए सरल विकल्प</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <div className="hidden sm:flex items-center gap-0.5 h-3.5 px-1 bg-teal-100/70 rounded-md">
              <div className="w-0.5 bg-teal-600 rounded-full animate-wave-bar-1" />
              <div className="w-0.5 bg-teal-600 rounded-full animate-wave-bar-2" />
              <div className="w-0.5 bg-teal-600 rounded-full animate-wave-bar-3" />
            </div>
            <span className="text-[11px] font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
              Start →
            </span>
          </div>
        </button>
      )}

      {/* Success / Fill Notice */}
      {successNotice && (
        <div className="mb-3.5 p-2.5 sm:p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-3.5 p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Identifier Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {selectedRole === 'patient'
              ? 'Email / Mobile / ABHA ID'
              : selectedRole === 'doctor'
              ? 'Staff ID / Doctor Email'
              : 'Admin ID / Email'}{' '}
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {selectedRole === 'patient' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                selectedRole === 'patient'
                  ? 'e.g. +91 98140 22334 or Email'
                  : selectedRole === 'doctor'
                  ? 'e.g. DOC-8842 or doctor@swasthya.ai'
                  : 'e.g. ADM-1001 or admin@swasthya.ai'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition shadow-inner"
            />
          </div>
        </div>

        {/* Password or OTP Field */}
        {!isOtpMode ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsOtpMode(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap"
              >
                Login via OTP instead
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                One-Time Password (OTP) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsOtpMode(false);
                  setOtpSent(false);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap"
              >
                Use Password instead
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder={otpSent ? 'Enter 4-digit OTP (e.g. 1234)' : 'Click Login to send OTP'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition shadow-inner"
              />
            </div>
            {otpSent && (
              <p className="text-[11px] text-teal-600 mt-1 font-medium">
                ✓ OTP sent to your registered contact! (Use 1234)
              </p>
            )}
          </div>
        )}

        {/* Remember Device & Forgot Password */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-600 whitespace-nowrap">Remember device</span>
          </label>

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(37,99,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_14px_28px_-6px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.985] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isLoading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Create Account Link */}
      <div className="text-center pt-4 text-xs text-slate-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onOpenRegistration}
          className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer underline"
        >
          Create Account
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative px-3 bg-white text-xs text-slate-400 font-medium">or</span>
      </div>

      {/* Registered Sample Accounts Dropdown (Fills form credentials, requires user to click Sign In) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDemoMenu(!showDemoMenu)}
          className="w-full py-2.5 px-4 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-700 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>पंजीकृत टेस्ट एकाउंट्स (Fill Credentials)</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showDemoMenu ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Registered Credentials Auto-Fill Menu */}
        {showDemoMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 z-40 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xl space-y-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
              पंजीकृत क्रेडेंशियल्स भरें (Fill in Form)
            </div>

            {/* Rahul Kumar */}
            <button
              type="button"
              onClick={() => {
                handleFillSampleCredentials('patient', '+91 98765 11001', 'Password@123');
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-blue-50 flex items-center justify-between cursor-pointer group"
            >
              <div>
                <span className="font-bold text-slate-800 group-hover:text-blue-600 block">
                  राहुल कुमार (Rahul Kumar)
                </span>
                <span className="text-[10px] text-slate-400">+91 98765 11001 • Pass: Password@123</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-100 px-2 py-0.5 rounded-full">
                Fill Form →
              </span>
            </button>

            {/* Savitri Devi */}
            <button
              type="button"
              onClick={() => {
                handleFillSampleCredentials('patient', '+91 98111 22334', 'Password@123');
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-teal-50 flex items-center justify-between cursor-pointer group"
            >
              <div>
                <span className="font-bold text-slate-800 group-hover:text-teal-600 block">
                  सावित्री देवी (Savitri Devi)
                </span>
                <span className="text-[10px] text-slate-400">+91 98111 22334 • Pass: Password@123</span>
              </div>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 group-hover:bg-teal-100 px-2 py-0.5 rounded-full">
                Fill Form →
              </span>
            </button>

            {/* Dr. Priya Nair */}
            <button
              type="button"
              onClick={() => {
                handleFillSampleCredentials('doctor', 'DOC-8842', 'Doctor@123');
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-blue-50 flex items-center justify-between cursor-pointer group border-t border-slate-100"
            >
              <div>
                <span className="font-bold text-slate-800 group-hover:text-blue-600 block">
                  डॉ. प्रिया नायर (Dr. Priya Nair)
                </span>
                <span className="text-[10px] text-slate-400">ID: DOC-8842 • Pass: Doctor@123</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100 px-2 py-0.5 rounded-full">
                Fill Form →
              </span>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => {
                handleFillSampleCredentials('admin', 'ADM-1001', 'Admin@123');
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-purple-50 flex items-center justify-between cursor-pointer group"
            >
              <div>
                <span className="font-bold text-slate-800 group-hover:text-purple-600 block">
                  सिस्टम एडमिन (System Admin)
                </span>
                <span className="text-[10px] text-slate-400">ID: ADM-1001 • Pass: Admin@123</span>
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 group-hover:bg-purple-100 px-2 py-0.5 rounded-full">
                Fill Form →
              </span>
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-2.5">
        सुरक्षा के लिए केवल पंजीकृत मोबाइल नंबर, ईमेल व पासवर्ड से ही लॉगिन संभव है
      </p>

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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-slate-900">Reset Password</h4>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Enter your registered mobile or email to receive a password recovery link.
            </p>

            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Verification code sent to your mobile/email!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter email or mobile"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Send OTP
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotSuccess(false);
              }}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
