import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, Globe, Play, Activity } from 'lucide-react';

interface VoiceDemoScenario {
  language: string;
  nativePrompt: string;
  translation: string;
  extractedSymptom: string;
  extractedDuration: string;
  extractedSeverity: string;
  conflictFlag?: string;
}

const DEMO_SCENARIOS: VoiceDemoScenario[] = [
  {
    language: 'Hindi (हिन्दी)',
    nativePrompt: 'डॉक्टर साहब, पिछले 3 दिनों से सीने के बीच में भारी दबाव महसूस हो रहा है, जो बाएं हाथ तक जाता है।',
    translation: 'Doctor, for the past 3 days I feel a heavy pressure in the center of my chest that radiates to my left arm.',
    extractedSymptom: 'Retrosternal Angina / Left Arm Radiation',
    extractedDuration: '3 days (Acute onset)',
    extractedSeverity: '7 / 10 (Moderate-Severe)',
    conflictFlag: 'Correlate with past stent history',
  },
  {
    language: 'English',
    nativePrompt: 'I have severe burning abdominal pain in the right lower quadrant since last night with fever.',
    translation: 'Patient reporting RLQ abdominal pain and fevers suggestive of acute appendicitis.',
    extractedSymptom: 'Right Lower Quadrant Abdominal Pain',
    extractedDuration: '14 hours (Acute progressive)',
    extractedSeverity: '8 / 10 (Severe with Guarding)',
    conflictFlag: 'Rule out acute appendicitis (Urgent USG)',
  },
  {
    language: 'Tamil (தமிழ்)',
    nativePrompt: 'இரண்டு வாரமாக கடுமையான மூச்சுத் திணறல் உள்ளது, மாடிப்படிகளில் ஏறும் போது அதிகமாகிறது.',
    translation: 'I have had severe shortness of breath for two weeks, worsening when climbing stairs.',
    extractedSymptom: 'Exertional Dyspnea (NYHA Class III)',
    extractedDuration: '2 weeks (Subacute)',
    extractedSeverity: 'NYHA Class III Functional Limitation',
    conflictFlag: 'Echocardiogram & BNP check advised',
  },
  {
    language: 'Punjabi (ਪੰਜਾਬੀ)',
    nativePrompt: 'ਮੇਰੇ ਗੋਡਿਆਂ ਵਿੱਚ ਬਹੁਤ ਦਰਦ ਹੈ ਅਤੇ ਮੈਂ ਦਰਦ ਨਿਵਾਰਕ ਦਵਾਈਆਂ ਖਾ ਰਿਹਾ ਹਾਂ।',
    translation: 'My knees hurt a lot and I am self-medicating with over-the-counter painkillers.',
    extractedSymptom: 'Bilateral Knee Osteoarthritis Pain',
    extractedDuration: 'Chronic with acute exacerbation',
    extractedSeverity: '6 / 10 Continuous',
    conflictFlag: 'NSAID + Statin / Antiplatelet interaction check',
  },
];

export const VoiceExperienceDemoSection: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);

  const scenario = DEMO_SCENARIOS[selectedScenarioIndex];

  const handleSimulate = (index: number) => {
    setSelectedScenarioIndex(index);
    setIsSimulatingVoice(true);
    setTimeout(() => {
      setIsSimulatingVoice(false);
    }, 1800);
  };

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 max-w-7xl mx-auto text-left">
      <div className="rounded-3xl bg-white/90 border border-white/80 p-8 sm:p-12 shadow-[0_20px_50px_rgba(37,99,235,0.07)] relative overflow-hidden backdrop-blur-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Speech Scenario Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-bold">
              <Mic className="w-3.5 h-3.5 text-teal-600" />
              <span>Voice-First Clinical Intake Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Natural Dialect Recognition Across{' '}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                13 Indian Languages
              </span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Tuned specifically for elderly accents, rural idioms, and regional clinical terminology. The engine continuously detects pause cadences, asks smart clinical follow-ups, and normalizes spoken claims into standard medical terminology.
            </p>

            {/* Language Scenario Pills */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 block">Select Sample Patient Utterance:</span>
              <div className="flex flex-wrap gap-2">
                {DEMO_SCENARIOS.map((sc, idx) => (
                  <button
                    key={sc.language}
                    type="button"
                    onClick={() => handleSimulate(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedScenarioIndex === idx
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-102'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{sc.language}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: 3D Holographic Voice Recognition Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 p-6 shadow-xl backdrop-blur-xl relative overflow-hidden space-y-5">
              {/* Mic Status & Waveform Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSimulatingVoice
                        ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                        : 'bg-gradient-to-tr from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25'
                    }`}
                  >
                    <Mic className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {isSimulatingVoice ? 'Transcribing Regional Audio...' : 'Multilingual Speech-to-Intent'}
                    </span>
                    <span className="text-[10px] text-teal-600 font-bold">
                      {isSimulatingVoice ? 'Sampling Rate: 16 kHz • Neural STT' : 'Ready for conversational intake'}
                    </span>
                  </div>
                </div>

                {/* Animated Audio Equalizer Bars */}
                <div className="flex items-center gap-1 h-6">
                  {[12, 24, 16, 28, 20, 10, 22, 14].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-teal-500 rounded-full transition-all duration-200"
                      style={{
                        height: isSimulatingVoice ? `${(h * 1.5) % 24 + 6}px` : '4px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Spoken Text Transcript Box */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Spoken Utterance</span>
                  <span className="text-teal-600 font-bold">{scenario.language}</span>
                </div>
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 font-medium text-slate-800 text-sm italic">
                  "{scenario.nativePrompt}"
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">English Translation: </span>
                  {scenario.translation}
                </div>
              </div>

              {/* Real-Time Clinical Extracted Entities */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Autonomous Clinical Entity Extraction (FHIR Observation)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">Chief Symptom</span>
                    <span className="font-extrabold text-teal-700">{scenario.extractedSymptom}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">Severity / Grading</span>
                    <span className="font-extrabold text-amber-600">{scenario.extractedSeverity}</span>
                  </div>
                </div>

                {scenario.conflictFlag && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>{scenario.conflictFlag}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
