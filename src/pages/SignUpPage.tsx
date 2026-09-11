import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Stethoscope,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { authService } from '../services/authService';

interface SignUpPageProps {
  onRegisterSuccess?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setErrorMessage('Please enter your 10-digit mobile number.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please check and re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.registerPatient({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.mobileNumber.trim(),
        password: formData.password,
        age: 30,
        gender: 'other',
        preferredLanguage: 'en',
        consentGiven: true,
      });

      setIsLoading(false);
      setSuccessMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess();
        navigate('/login');
      }, 1200);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div id="signup-page-container" className="min-h-screen w-full bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-[#EDF6FF] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">
            Swasthya <span className="text-blue-600 font-black">AI</span>
          </span>
        </Link>

        <Link
          id="signup-back-to-login-top-btn"
          to="/login"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.1)] border border-slate-100 text-left">
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Patient Registration</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Join Swasthya AI for fast voice-powered clinical history and secure health records.
          </p>
        </div>

        {/* Error / Success Notifications */}
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

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="signup-fullname-input"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Rahul Kumar / Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signup-email-input"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="signup-mobile-input"
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create password (min 6 characters)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-confirmpassword-input"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Consent note */}
          <div className="text-[11px] text-slate-500 leading-relaxed pt-1">
            By creating an account, you consent to encrypted storage of your clinical records and health consultation summaries.
          </div>

          {/* Create Account button */}
          <button
            id="signup-create-account-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Back to Login link */}
        <div className="mt-5 text-center text-xs text-slate-600">
          <span>Already have an account? </span>
          <Link
            id="signup-back-to-login-link"
            to="/login"
            className="font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </div>

      <footer className="w-full text-center py-4 text-xs text-slate-400">
        <span>© 2026 Swasthya AI • ABDM FHIR R4 Compliant</span>
      </footer>
    </div>
  );
};
