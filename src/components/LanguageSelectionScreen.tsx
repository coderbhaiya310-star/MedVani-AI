import React, { useState } from 'react';
import { Stethoscope, ArrowLeft, Check, Globe } from 'lucide-react';
import { LanguageCode } from '../types';

interface LanguageSelectionScreenProps {
  currentLanguage?: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onContinue: () => void;
  onBack?: () => void;
}

interface LanguageOption {
  code: LanguageCode;
  native: string;
  english: string;
  iconText: string;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  currentLanguage = 'hi',
  onSelectLanguage,
  onContinue,
  onBack,
}) => {
  const [selectedCode, setSelectedCode] = useState<LanguageCode>(currentLanguage);

  const languages: LanguageOption[] = [
    { code: 'hi', native: 'हिंदी', english: 'Hindi', iconText: 'हिं' },
    { code: 'en', native: 'English', english: 'English', iconText: 'En' },
    { code: 'hinglish', native: 'Hinglish', english: 'Hinglish', iconText: 'H+E' },
    { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', iconText: 'ગુ' },
    { code: 'mr', native: 'मराठी', english: 'Marathi', iconText: 'म' },
    { code: 'bn', native: 'বাংলা', english: 'Bengali', iconText: 'বা' },
    { code: 'ta', native: 'தமிழ்', english: 'Tamil', iconText: 'த' },
    { code: 'te', native: 'తెలుగు', english: 'Telugu', iconText: 'తె' },
  ];

  const handleChoose = (code: LanguageCode) => {
    setSelectedCode(code);
    onSelectLanguage(code);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900">Swasthya AI</span>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 sm:py-14 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="text-left sm:text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Which language are you most comfortable with?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              You can change this anytime during your consultation.
            </p>
          </div>

          {/* Languages 4x2 Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {languages.map((lang) => {
              const isSelected = selectedCode === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => handleChoose(lang.code)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-600 shadow-sm ring-1 ring-teal-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {lang.iconText}
                  </div>

                  <div>
                    <div className="font-bold text-base text-slate-900">{lang.native}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{lang.english}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Continue CTA */}
        <div className="pt-10">
          <button
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all cursor-pointer text-center"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
};
