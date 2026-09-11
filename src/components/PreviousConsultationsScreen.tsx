import React from 'react';
import {
  Stethoscope,
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Home,
  User,
  FileText,
} from 'lucide-react';
import { CaseTakingSession } from '../types';

interface ConsultationItem {
  id: string;
  title: string;
  status: 'Reviewed' | 'Waiting for review';
  date: string;
  time: string;
  doctorName?: string;
  summaryPreview: string;
}

interface PreviousConsultationsScreenProps {
  onSelectConsultation: (id: string) => void;
  onNewConsultation: () => void;
  onBack: () => void;
}

export const PreviousConsultationsScreen: React.FC<PreviousConsultationsScreenProps> = ({
  onSelectConsultation,
  onNewConsultation,
  onBack,
}) => {
  const consultations: ConsultationItem[] = [
    {
      id: 'cons-1',
      title: 'Abdominal pain',
      status: 'Waiting for review',
      date: 'Today, 5 Sep 2025',
      time: '11:30 AM',
      doctorName: 'Dr. Rajesh Sharma',
      summaryPreview: 'Pain in center of abdomen since yesterday. Associated mild nausea.',
    },
    {
      id: 'cons-2',
      title: 'Fever & Chills',
      status: 'Waiting for review',
      date: '28 Aug 2025',
      time: '04:15 PM',
      doctorName: 'Dr. Anita Desai',
      summaryPreview: 'Low-grade fever for 2 days. Responsive to paracetamol, mild fatigue.',
    },
    {
      id: 'cons-3',
      title: 'Headache & Fatigue',
      status: 'Reviewed',
      date: '15 Aug 2025',
      time: '10:00 AM',
      doctorName: 'Dr. Rajesh Sharma',
      summaryPreview: 'Tension-type frontal headache after screen exposure. Hydration advised.',
    },
    {
      id: 'cons-4',
      title: 'Seasonal Cough',
      status: 'Reviewed',
      date: '02 Aug 2025',
      time: '02:45 PM',
      doctorName: 'Dr. Vikram Seth',
      summaryPreview: 'Dry cough without chest pain or wheezing. Prescribed steam inhalation.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-16">
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
      <main className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6 flex-1 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Consultations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track your recorded intakes and physician review status
            </p>
          </div>

          <button
            onClick={onNewConsultation}
            className="px-4 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Intake</span>
          </button>
        </div>

        {/* List of Consultation Cards */}
        <div className="space-y-3.5">
          {consultations.map((item) => {
            const isReviewed = item.status === 'Reviewed';
            return (
              <div
                key={item.id}
                onClick={() => onSelectConsultation(item.id)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition">
                      {item.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isReviewed
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {item.summaryPreview}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                    {item.doctorName && (
                      <>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">{item.doctorName}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-teal-50 text-slate-400 group-hover:text-teal-700 flex items-center justify-center transition shrink-0">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
