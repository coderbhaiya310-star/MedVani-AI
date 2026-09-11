import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowLeft,
  User,
  Globe,
  Bell,
  Shield,
  Check,
  ChevronDown,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'language' | 'notifications' | 'privacy'>('profile');
  const [fullName, setFullName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-2xs">
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 text-left">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Left Sidebar Tabs */}
          <aside className="md:col-span-4 border-r border-slate-100 p-4 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Settings Menu
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-teal-600" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'language'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Language</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Privacy & Security</span>
            </button>
          </aside>

          {/* Right Form Content */}
          <section className="md:col-span-8 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {activeTab === 'profile'
                    ? 'Profile Settings'
                    : activeTab === 'language'
                    ? 'Language Preferences'
                    : activeTab === 'notifications'
                    ? 'Notification Channels'
                    : 'Privacy & Data Consent'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage your personal settings</p>
              </div>

              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </span>
              )}
            </div>

            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Preferred Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 pr-8"
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
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab !== 'profile' && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                <p className="text-xs text-slate-600 font-medium">
                  {activeTab === 'language'
                    ? 'Multilingual speech recognition model is set to automatic dialect adaptation.'
                    : activeTab === 'notifications'
                    ? 'SMS and in-app alerts are active for doctor prescription reviews.'
                    : 'ABDM Health ID and HIPAA encryption are enabled by default for clinical privacy.'}
                </p>
                <button
                  onClick={() => setSavedSuccess(true)}
                  className="px-5 py-2 rounded-full bg-teal-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Confirm Preferences
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
