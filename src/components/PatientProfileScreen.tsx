import React, { useState } from 'react';
import { Stethoscope, ArrowLeft, ChevronDown, Check, User } from 'lucide-react';
import { PatientProfile, LanguageCode } from '../types';

interface PatientProfileScreenProps {
  patient: PatientProfile;
  onSave: (updated: PatientProfile) => void;
  onBack: () => void;
}

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  patient,
  onSave,
  onBack,
}) => {
  const [fullName, setFullName] = useState(patient.fullName || 'Priya Sharma');
  const [dateOfBirth, setDateOfBirth] = useState(patient.dateOfBirth || '1996-01-12');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(patient.gender || 'female');
  const [mobileNumber, setMobileNumber] = useState(patient.phoneNumber || '+91 98765 43210');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(patient.preferredLanguage || 'hi');
  const [medicalConditions, setMedicalConditions] = useState('None');
  const [allergies, setAllergies] = useState('None');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientProfile = {
      ...patient,
      fullName,
      dateOfBirth,
      gender,
      phoneNumber: mobileNumber,
      preferredLanguage,
    };
    onSave(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900">Swasthya AI</span>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Form */}
      <main className="max-w-2xl mx-auto w-full px-4 py-8 flex-1">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Profile</h1>
            {isSavedNotice && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved successfully</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal Information
              </h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Gender</label>
                  <div className="relative">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition pr-10"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Preferred Language</label>
                  <div className="relative">
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition pr-10"
                    >
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="en">English</option>
                      <option value="hinglish">Hinglish</option>
                      <option value="gu">Gujarati (ગુજરાતી)</option>
                      <option value="mr">Marathi (मराठी)</option>
                      <option value="bn">Bengali (বাংলা)</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="te">Telugu (తెలుగు)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Medical Information */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Medical Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Medical Conditions</label>
                  <div className="relative">
                    <select
                      value={medicalConditions}
                      onChange={(e) => setMedicalConditions(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition pr-10"
                    >
                      <option value="None">None</option>
                      <option value="Diabetes">Diabetes (Type 2)</option>
                      <option value="Hypertension">Hypertension</option>
                      <option value="Asthma">Asthma</option>
                      <option value="Thyroid">Thyroid Disorder</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Allergies</label>
                  <div className="relative">
                    <select
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition pr-10"
                    >
                      <option value="None">None</option>
                      <option value="Penicillin">Penicillin</option>
                      <option value="Sulfa">Sulfa drugs</option>
                      <option value="Peanuts">Peanuts</option>
                      <option value="Dust/Pollen">Dust/Pollen</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-xs hover:shadow-sm transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
