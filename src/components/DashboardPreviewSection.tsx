import React, { useState } from 'react';
import {
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
  Pill,
} from 'lucide-react';

export const DashboardPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'soap' | 'conflicts' | 'opqrst' | 'timeline'>('soap');

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 max-w-7xl mx-auto text-left">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Futuristic Physician Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            EHR Core & AI Clinical Summary Engine
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl font-normal leading-relaxed">
            Real-time transformation of conversational multi-lingual dialogue into structured OPQRST vectors, cross-referenced drug alerts, and certified SOAP documentation.
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {[
            { id: 'soap', label: 'SOAP Summary', icon: FileText },
            { id: 'conflicts', label: 'Drug Conflicts (1)', icon: AlertTriangle },
            { id: 'opqrst', label: 'OPQRST Exploration', icon: Activity },
            { id: 'timeline', label: 'Prescription Timeline', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Futuristic 3D Glass Dashboard Container */}
      <div className="relative rounded-3xl bg-white/95 border border-slate-200/90 shadow-[0_20px_50px_rgba(37,99,235,0.08)] overflow-hidden backdrop-blur-2xl">
        {/* Top Metallic Window Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Patient: Ramesh Singh (68M) • ABHA ID: 91-8834-2901 • Post-PCI CAD</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Intake Synced
            </span>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Profile & Real-time Vitals */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Chief Complaint</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                  High Priority
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 leading-snug">
                Substernal heavy chest pressure radiating to left jaw during exertion, 3 days duration.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-bold">BP Reading</span>
                  <span className="text-sm font-black text-amber-600">148/92 mmHg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-bold">SpO2 Level</span>
                  <span className="text-sm font-black text-emerald-600">98% Room Air</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-bold">Heart Rate</span>
                  <span className="text-sm font-black text-blue-600">76 bpm Regular</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-bold">Language</span>
                  <span className="text-sm font-black text-teal-600">हिन्दी / English</span>
                </div>
              </div>
            </div>

            {/* AI Warning Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Reconciliation Conflict Detected</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Patient stated taking Ibuprofen 400mg OTC for back pain while actively prescribed Dual Antiplatelet Therapy (Aspirin + Clopidogrel). High GI bleed hazard.
              </p>
            </div>
          </div>

          {/* Right Column: Active Interactive View */}
          <div className="lg:col-span-8 bg-slate-50/60 rounded-2xl p-6 border border-slate-200 relative">
            {activeTab === 'soap' && (
              <div className="space-y-4 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2 font-extrabold text-sm text-blue-700">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI Drafted Clinical SOAP Note (ICD-10 I20.9 & I25.10)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Autosaved 2 mins ago</span>
                </div>

                <div className="space-y-3 text-slate-700">
                  <div>
                    <span className="font-bold text-teal-700 uppercase tracking-wider text-[11px] block mb-1">
                      Subjective (S)
                    </span>
                    <p className="bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed shadow-2xs">
                      68-year-old male with history of coronary artery disease s/p PCI with drug-eluting stent (2022), hypertension, and dyslipidemia presents with 3-day history of exertional substernal chest tightness radiating to the left arm and jaw. Episodes last 5-10 minutes and resolve with rest. Patient reports mild shortness of breath. Denies syncope, diaphoresis, or palpitations.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-blue-700 uppercase tracking-wider text-[11px] block mb-1">
                      Objective (O)
                    </span>
                    <p className="bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed shadow-2xs">
                      Alert, in no acute distress. Vitals: BP 148/92, HR 76 regular, RR 16, SpO2 98%. CV: S1/S2 present, no murmurs/rubs. Lungs: Clear to auscultation bilaterally. Extremities: No peripheral edema.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px] block mb-1">
                      Assessment & Plan (A/P)
                    </span>
                    <p className="bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed shadow-2xs">
                      1. Recurrent Exertional Angina / Unstable Angina suspect (I20.0). Urgent 12-lead ECG, High-sensitivity Troponin I, and Cardiology consult. Discontinue Ibuprofen immediately; initiate Atorvastatin 80mg, Metoprolol Succinate 50mg, and sublingual Nitroglycerin PRN.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conflicts' && (
              <div className="space-y-4 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-700 border-b border-slate-200 pb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Clinical Cross-Verification Matrix</span>
                </div>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <span>Severe Drug-Drug & GI Hemorrhage Hazard</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Level 1 Alert</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Past Prescription OCR shows <strong>Clopidogrel 75mg QD</strong> + <strong>Aspirin 81mg QD</strong>. Patient voice intake transcript reported self-administering <strong>Ibuprofen 400mg TID</strong> for knee osteoarthritis.
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-2 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Recommended Substitute: Topical Diclofenac or Acetaminophen 500mg max.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'opqrst' && (
              <div className="space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-sm text-teal-700 border-b border-slate-200 pb-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Structured OPQRST Symptom Decomposition</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-extrabold text-teal-700 block text-[11px]">Onset (O)</span>
                    <span className="text-slate-600 text-[11px]">Gradual over last 3 days, primarily during morning walks.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-extrabold text-teal-700 block text-[11px]">Provocation (P)</span>
                    <span className="text-slate-600 text-[11px]">Worse with brisk walking/stairs; relieved by sitting.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-extrabold text-teal-700 block text-[11px]">Quality (Q)</span>
                    <span className="text-slate-600 text-[11px]">Heavy, squeezing elephant-like pressure.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-extrabold text-teal-700 block text-[11px]">Radiation (R)</span>
                    <span className="text-slate-600 text-[11px]">Radiates to left medial arm and mandibular angle.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-extrabold text-teal-700 block text-[11px]">Severity (S)</span>
                    <span className="text-slate-600 text-[11px]">Rated 7/10 at peak, 0/10 at rest.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-extrabold text-teal-700 block text-[11px]">Time / Course (T)</span>
                    <span className="text-slate-600 text-[11px]">Episodes persist 5-10 minutes each.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-sm text-blue-700 border-b border-slate-200 pb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Longitudinal Medication Timeline</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        <span>Aspirin 81 mg + Clopidogrel 75 mg</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Prescribed post-DES stenting • Dr. Nair</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        <span>Atorvastatin 40 mg PO QHS</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Lipid management (Target LDL &lt; 55 mg/dL)</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
