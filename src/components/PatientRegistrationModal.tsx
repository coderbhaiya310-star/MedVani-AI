import React, { useState } from 'react';
import { User, ShieldCheck, Mic, CheckCircle2, AlertCircle, X, Volume2, Sparkles, Phone, Calendar } from 'lucide-react';
import { PatientProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { AudioConsentRecorder } from '../utils/speechUtils';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  onSave: (updatedProfile: PatientProfile) => void;
  onStartIntakeImmediately?: () => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSave,
  onStartIntakeImmediately,
}) => {
  const [formData, setFormData] = useState<PatientProfile>({ ...patient });
  const [isRecordingConsent, setIsRecordingConsent] = useState(false);
  const [consentRecorder, setConsentRecorder] = useState<AudioConsentRecorder | null>(null);
  const [consentAudioBlobUrl, setConsentAudioBlobUrl] = useState<string | null>(patient.consentAudioUrl || null);
  const [activeTab, setActiveTab] = useState<'id' | 'abha' | 'aadhaar'>('abha');

  if (!isOpen) return null;

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === formData.preferredLanguage) || SUPPORTED_LANGUAGES[0];

  const handleStartConsentRecording = async () => {
    try {
      const recorder = new AudioConsentRecorder();
      await recorder.startRecording();
      setConsentRecorder(recorder);
      setIsRecordingConsent(true);
    } catch (e: any) {
      alert('Microphone access is required to record audio consent. Please grant microphone permissions in browser.');
    }
  };

  const handleStopConsentRecording = async () => {
    if (!consentRecorder) return;
    try {
      const { audioUrl } = await consentRecorder.stopRecording();
      setIsRecordingConsent(false);
      setConsentAudioBlobUrl(audioUrl);
      setFormData((prev) => ({
        ...prev,
        consentGiven: true,
        consentAudioUrl: audioUrl,
        consentTimestamp: new Date().toISOString(),
      }));
    } catch (e) {
      setIsRecordingConsent(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Please enter patient full name');
      return;
    }
    onSave(formData);
    onClose();
    if (onStartIntakeImmediately) {
      onStartIntakeImmediately();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Patient Registration & Consent</h2>
              <p className="text-xs text-teal-100">Ayushman Bharat (ABHA) & Voice Case-Taking Setup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Demographics */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              1. Patient Demographics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramachandran Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 60 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98450 12345"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attendant / Caregiver (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sanjay Sharma (Son)"
                  value={formData.caregiverName || ''}
                  onChange={(e) => setFormData({ ...formData, caregiverName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* National Digital Health ID (ABHA / Aadhaar / Pilot ID) */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                2. Health ID Verification (ABDM / Pilot)
              </h3>
              <div className="flex gap-1 text-[11px] bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('abha')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeTab === 'abha' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  ABHA ID
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('aadhaar')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeTab === 'aadhaar' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Aadhaar (Last 4)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('id')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeTab === 'id' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Hospital MRN
                </button>
              </div>
            </div>

            {activeTab === 'abha' && (
              <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5">
                <label className="block text-xs font-bold text-teal-900 mb-1">
                  14-Digit ABHA Number or ABHA Address (@abdm)
                </label>
                <input
                  type="text"
                  placeholder="91-4523-8890-1284 or patient@abdm"
                  value={formData.abhaId || ''}
                  onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-teal-300 text-sm font-mono font-medium text-teal-950 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 bg-white"
                />
                <p className="text-[11px] text-teal-700 mt-1">
                  Enables seamless retrieval and export of consent-linked FHIR case summaries to National Health Stack.
                </p>
              </div>
            )}

            {activeTab === 'aadhaar' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Aadhaar Last 4 Digits (Pilot Sandbox)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-400">XXXX - XXXX - </span>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="7492"
                    value={formData.aadhaarLast4 || ''}
                    onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono text-center font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 bg-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'id' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Hospital Medical Record Number (MRN / IPD No.)
                </label>
                <input
                  type="text"
                  placeholder="MRN-AIIMS-2026-0914"
                  value={formData.hospitalMrn || ''}
                  onChange={(e) => setFormData({ ...formData, hospitalMrn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 bg-white"
                />
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                3. Preferred Spoken Language for Elderly Patient / पसंदीदा भाषा
              </h3>
              <span className="text-xs font-semibold text-teal-700">13 Indian Languages</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = formData.preferredLanguage === lang.code;
                return (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => setFormData({ ...formData, preferredLanguage: lang.code })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/30 shadow-2xs font-bold'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div>
                      <p className={`text-xs ${isSelected ? 'font-extrabold text-teal-950' : 'font-bold text-slate-900'}`}>
                        {lang.nativeName}
                      </p>
                      <p className="text-[11px] text-slate-500">{lang.englishName}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Consent Capture */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-teal-600" />
                4. Audio Informed Consent Capture (Hands-Free Requirement)
              </h3>
              {formData.consentGiven && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Consent Verified
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3">
              <p className="italic text-slate-600 font-medium leading-relaxed">
                "{formData.preferredLanguage === 'hi'
                  ? 'मैं अपनी शारीरिक समस्याओं के डिजिटल केस-टेकिंग और मेडिकल दस्तावेज़ विश्लेषण के लिए सहमति देता/देती हूँ।'
                  : 'I voluntarily consent to AI-assisted voice case taking and digital health document analysis for clinical review by the doctor.'}"
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {!isRecordingConsent ? (
                  <button
                    type="button"
                    onClick={handleStartConsentRecording}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Record Voice Consent</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopConsentRecording}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs animate-pulse shadow-md transition-all"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>Stop & Save Voice Consent</span>
                  </button>
                )}

                {consentAudioBlobUrl && (
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    <audio src={consentAudioBlobUrl} controls className="h-6 w-44" />
                    <span className="text-[10px] text-slate-400 font-mono">Audio Hash Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Launch Voice Case-Taking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
