import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  User,
  Shield,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Globe,
  Mic,
  ShieldCheck,
  Zap,
  Check,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Users,
  ChevronRight,
} from 'lucide-react';
import { DoctorIllustrationHero } from '../components/DoctorIllustrationHero';
import { authService } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { LanguageCode, UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { language, setLanguage, openLanguageSelector } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('Password@123');
  const [otpCode, setOtpCode] = useState('1234');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setSuccessMessage('');
    setIsOtpMode(false);

    if (role === 'patient') {
      setIdentifier('9876543210');
      setPassword('Password@123');
    } else if (role === 'doctor') {
      setIdentifier('dr.sharma@apollo.com');
      setPassword('Password@123');
    } else {
      setIdentifier('admin@swasthya.gov.in');
      setPassword('Password@123');
    }
  };

  const handleFillTestCredentials = (role: UserRole, idVal: string, passVal: string) => {
    handleRoleChange(role);
    setIdentifier(idVal);
    setPassword(passVal);
    setSuccessMessage(`Credentials auto-filled for demo ${role}`);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (selectedRole === 'patient') {
        await authService.loginPatient(identifier, isOtpMode ? otpCode : password, isOtpMode);
      } else if (selectedRole === 'doctor') {
        await authService.loginDoctor(identifier, password);
      } else {
        await authService.loginAdmin(identifier, password);
      }

      setSuccessMessage('Authentication verified! Redirecting to clinical workspace...');
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      setTimeout(() => {
        if (selectedRole === 'doctor') {
          navigate('/doctor-dashboard');
        } else if (selectedRole === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/patient-portal');
        }
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await authService.loginPatient('9876543210', 'Password@123');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      setTimeout(() => {
        navigate('/patient-portal');
      }, 400);
    } catch (err) {
      setErrorMessage('Voice login error. Please try standard login.');
      setIsLoading(false);
    }
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen w-full bg-[#EDF5FE] relative overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-100 selection:text-blue-900"
    >
      {/* ── AMBIENT SOFT BACKGROUND BLOBS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-gradient-to-br from-blue-100/50 to-teal-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-gradient-to-bl from-sky-100/40 to-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <svg
          className="absolute -bottom-24 -left-32 w-[900px] h-[600px] opacity-40"
          viewBox="0 0 900 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50 400 C 150 220, 380 480, 650 340 C 780 270, 850 350, 920 420 L 920 650 L -50 650 Z"
            fill="#DCEBFA"
          />
        </svg>
      </div>

      {/* ── TOP BAR ── */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 flex items-center justify-between z-20">
        {/* Left: Swasthya AI Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="w-11 h-11 rounded-full bg-[#00B4D8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Stethoscope className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="text-left">
            <div className="leading-tight">
              <span className="font-extrabold text-xl sm:text-[22px] text-[#0F172A] tracking-tight">
                Swasthya <span className="text-[#2563EB] font-black">AI</span>
              </span>
            </div>
            <p className="text-[12px] text-[#64748B] font-medium leading-normal">
              Clinical Intelligence for Better Care
            </p>
          </div>
        </Link>

        {/* Right: Back to Home + Language Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-white/80 transition-all border border-slate-200/60 bg-white/40 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#1E293B] bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden xs:inline">{currentLang.nativeName}</span>
              <span className="text-xs text-[#64748B]">({currentLang.code.toUpperCase()})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                <div className="text-xs font-bold text-[#64748B] px-3 py-1.5 uppercase tracking-wider">
                  Select Language
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        language === lang.code
                          ? 'bg-blue-50 text-[#2563EB] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-xs text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── 2-COLUMN MAIN CONTENT ── */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1 flex items-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* LEFT COLUMN: Vector Doctor Illustration & Branding */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div
              onClick={handleVoiceLogin}
              className="w-full max-w-[460px] cursor-pointer transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99] group"
              title="Click to start Voice Intake"
            >
              <DoctorIllustrationHero className="w-full h-auto" />
            </div>

            {/* Typography */}
            <div className="mt-4 space-y-2 select-none">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                Swasthya <span className="text-[#2563EB] font-black">AI</span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                Clinical Intelligence for Better Care
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-md font-normal pt-1">
                Voice-powered healthcare assistant that helps you get the right medical guidance, instantly and easily.
              </p>
            </div>

            {/* Three Feature Badges */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-7 pt-6 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#2563EB] shadow-xs">
                  <Mic className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#2563EB]" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-[#475569]">Voice Enabled</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#2563EB] shadow-xs">
                  <ShieldCheck className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#2563EB]" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-[#475569]">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#2563EB] shadow-xs">
                  <Zap className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#2563EB] fill-[#2563EB]" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-[#475569]">Fast & Reliable</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Login Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-[490px] bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.08),0_0_1px_1px_rgba(0,0,0,0.03)] border border-slate-100 relative">
              {/* Role Selector Tabs */}
              <div className="p-1 rounded-full bg-[#F1F5F9] flex items-center justify-between mb-7">
                <button
                  type="button"
                  onClick={() => handleRoleChange('patient')}
                  className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'patient'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('doctor')}
                  className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'doctor'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Headings */}
              <div className="text-left mb-6">
                <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                  {selectedRole === 'patient'
                    ? 'Patient Portal Login'
                    : selectedRole === 'doctor'
                    ? 'Doctor Portal Login'
                    : 'Admin Portal Login'}
                </h3>
                <p className="text-sm text-[#64748B] mt-1.5 font-normal leading-relaxed">
                  {selectedRole === 'patient'
                    ? 'Enter your mobile number, email, or ABHA ID to access your health records.'
                    : selectedRole === 'doctor'
                    ? 'Enter your hospital staff credentials to access OPD queue and clinical summaries.'
                    : 'Enter administrative credentials to oversee hospital operations.'}
                </p>
              </div>

              {/* Status Notifications */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                {/* Identifier Input */}
                <div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-[#94A3B8]">
                      <Phone className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <input
                      id="login-identifier-input"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        selectedRole === 'patient'
                          ? 'Mobile / Email / ABHA ID'
                          : 'Hospital Email / Staff ID'
                      }
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-slate-300 text-slate-900 placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password / OTP Input */}
                {!isOtpMode ? (
                  <div>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-[#94A3B8]">
                        <Lock className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <input
                        id="login-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-slate-300 text-slate-900 placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 stroke-[1.8]" /> : <Eye className="w-5 h-5 stroke-[1.8]" />}
                      </button>
                    </div>

                    {/* Remember device + Forgot Password row */}
                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
                      <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none">
                        <div
                          onClick={() => setRememberDevice(!rememberDevice)}
                          className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer ${
                            rememberDevice ? 'bg-[#2563EB] text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {rememberDevice && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-normal text-[#475569]">Remember device</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setErrorMessage('For demo access, use password: Password@123 or click Test Credentials below.')}
                        className="text-[#2563EB] hover:underline font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Patient Login via OTP toggle */}
                    {selectedRole === 'patient' && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOtpMode(true);
                            setErrorMessage('');
                            setSuccessMessage('');
                          }}
                          className="text-xs text-[#2563EB] hover:underline font-medium cursor-pointer"
                        >
                          Login via OTP instead
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-[#94A3B8]">
                        <Lock className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 4-digit OTP (e.g. 1234)"
                        maxLength={6}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#E2E8F0] text-slate-900 placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all tracking-widest font-mono"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpMode(false);
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-[#2563EB] hover:underline font-medium cursor-pointer"
                      >
                        ← Login via Password instead
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuccessMessage('New demo OTP sent: 1234')}
                        className="text-[#64748B] hover:text-[#2563EB] cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action Button: Login -> */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-semibold text-base shadow-[0_4px_14px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2 transition-all hover:scale-[1.005] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-4 text-xs uppercase font-bold text-slate-400">or</span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                {/* Voice Login Button */}
                <button
                  type="button"
                  onClick={handleVoiceLogin}
                  className="w-full py-3 px-6 rounded-2xl bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/60 text-[#2563EB] font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Mic className="w-4 h-4 text-[#2563EB]" />
                  <span>Use Voice Login</span>
                </button>

                {/* Create Account Link */}
                <div className="text-center pt-2">
                  <p className="text-xs sm:text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#2563EB] font-semibold hover:underline cursor-pointer">
                      Create Account
                    </Link>
                  </p>
                </div>
              </form>

              {/* Test Credentials Card (Exact Match to Reference Screenshot) */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowTestCredentials(!showTestCredentials)}
                  className="w-full p-4 rounded-2xl bg-[#EFF6FE] hover:bg-[#E2EFFE] border border-blue-100 flex items-center justify-between transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1E293B]">
                        Test Credentials <span className="font-normal text-xs text-[#64748B]">(For Demo)</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Use the demo account to explore the platform.
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-[#2563EB] transition-transform duration-200 ${
                      showTestCredentials ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {showTestCredentials && (
                  <div className="mt-3 p-3.5 bg-white rounded-2xl space-y-2.5 text-xs border border-blue-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Patient: Rahul Kumar</span>
                      <button
                        type="button"
                        onClick={() => handleFillTestCredentials('patient', '9876543210', 'Password@123')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        Auto-fill
                      </button>
                    </div>
                    <p className="text-slate-500 font-mono text-[11px]">9876543210 / Password@123</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">Doctor: Dr. Sharma</span>
                      <button
                        type="button"
                        onClick={() => handleFillTestCredentials('doctor', 'dr.sharma@apollo.com', 'Password@123')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        Auto-fill
                      </button>
                    </div>
                    <p className="text-slate-500 font-mono text-[11px]">dr.sharma@apollo.com / Password@123</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">Admin: Super Admin</span>
                      <button
                        type="button"
                        onClick={() => handleFillTestCredentials('admin', 'admin@swasthya.gov.in', 'Password@123')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        Auto-fill
                      </button>
                    </div>
                    <p className="text-slate-500 font-mono text-[11px]">admin@swasthya.gov.in / Password@123</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 z-10 select-none">
        © 2026 Swasthya AI Clinical Systems. All health data protected under ABDM and HIPAA guidelines.
      </footer>
    </div>
  );
};
