import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { LanguageCode, PatientRegistrationPayload } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { speakTextAloud, stopSpeaking } from '../utils/speechUtils';
import { authService } from '../services/authService';

interface PatientRegistrationScreenProps {
  onBackToLogin: () => void;
  onRegistrationComplete: () => void;
}

export const PatientRegistrationScreen: React.FC<PatientRegistrationScreenProps> = ({
  onBackToLogin,
  onRegistrationComplete,
}) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>('en');
  const [abhaId, setAbhaId] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSpeakingConsent, setIsSpeakingConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const consentNoticeText =
    preferredLanguage === 'hi'
      ? 'मैं अपनी स्वास्थ्य जानकारी, वर्तमान लक्षण और पिछले मेडिकल पर्चे स्वस्थ्य एआई व मेरे डॉक्टर के साथ साझा करने की सहमति देता हूँ। यह डेटा सुरक्षित रहेगा।'
      : 'I voluntarily consent to share my health difficulties, symptoms, and medical records with Swasthya AI and my consulting physician for clinical intake and diagnosis. My data is protected and confidential.';

  const handleListenToConsent = () => {
    if (isSpeakingConsent) {
      stopSpeaking();
      setIsSpeakingConsent(false);
    } else {
      setIsSpeakingConsent(true);
      speakTextAloud(
        consentNoticeText,
        preferredLanguage,
        0.85,
        () => setIsSpeakingConsent(true),
        () => setIsSpeakingConsent(false)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Email / Login ID is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    if (!confirmPassword) {
      setErrorMessage('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!consentGiven) {
      setErrorMessage('Patient consent is required to proceed with clinical registration.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: PatientRegistrationPayload = {
        fullName: fullName.trim(),
        age: Number(age) || 30,
        gender,
        phoneNumber: cleanPhone,
        email: cleanEmail,
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
        preferredLanguage,
        abhaId: abhaId.trim() || undefined,
        address: address.trim() || undefined,
        emergencyContactName: emergencyName.trim() || undefined,
        emergencyContactPhone: emergencyPhone.trim() || undefined,
        consentGiven,
      };

      await authService.registerPatient(payload);
      setIsLoading(false);
      onRegistrationComplete();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto w-full bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-7">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
            <span className="text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-200/70 px-2.5 py-0.5 rounded-full">
              Patient Registration
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Set up your profile for secure, multilingual clinical care.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ramachandran Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Age (Years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all"
                required
              />
            </div>
          </div>

          {/* Gender & Preferred Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Gender</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 rounded-lg text-xs font-medium capitalize border transition-all cursor-pointer ${
                      gender === g
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Preferred Language <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-teal-700 font-medium">13 Languages</span>
              </div>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.englishName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Number & ABHA ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                ABHA ID / Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 91-4523-8890-1284"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Email / Login ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Email / Login ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-10 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 focus:outline-hidden transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Informed Clinical Consent */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Informed Clinical Consent & Privacy
              </span>
              <button
                type="button"
                onClick={handleListenToConsent}
                className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSpeakingConsent
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{isSpeakingConsent ? 'Reading Aloud...' : 'Listen to Consent'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
              "{consentNoticeText}"
            </p>

            <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                required
              />
              <span className="text-xs text-slate-700 leading-snug">
                I understand and consent to allow the clinical system to record symptoms and prepare medical summaries for my physician.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading || !consentGiven}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>

          {/* Back to Login link footer */}
          <p className="text-center text-xs text-slate-500 pt-1">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-semibold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
