import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  Eye,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MedicalDocument } from '../types';

interface MedicalReportsScreenProps {
  documents: MedicalDocument[];
  onUploadDocument: (file: File) => void;
  onBack: () => void;
}

export const MedicalReportsScreen: React.FC<MedicalReportsScreenProps> = ({
  documents,
  onUploadDocument,
  onBack,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);

  const defaultReports: MedicalDocument[] = [
    {
      id: 'doc-1',
      patientId: 'PAT-001',
      title: 'Abdominal Ultrasound Scan.pdf',
      documentName: 'Abdominal Ultrasound Scan.pdf',
      documentType: 'lab_report',
      documentDate: '2025-09-02',
      uploadedAt: '2025-09-02',
      extractedText: 'Gallbladder: Normal wall thickness. Liver: Normal echotexture. No cholelithiasis. Mild bowel gas pattern in central abdomen.',
    },
    {
      id: 'doc-2',
      patientId: 'PAT-001',
      title: 'Complete Blood Count (CBC).pdf',
      documentName: 'Complete Blood Count (CBC).pdf',
      documentType: 'lab_report',
      documentDate: '2025-08-20',
      uploadedAt: '2025-08-20',
      extractedText: 'Hemoglobin: 13.2 g/dL (Normal). TLC: 8,400 /mcL. Platelets: 2.4 Lakhs. CRP: Negative.',
    },
    {
      id: 'doc-3',
      patientId: 'PAT-001',
      title: 'Prescription - Dr. Rajesh.pdf',
      documentName: 'Prescription - Dr. Rajesh.pdf',
      documentType: 'prescription',
      documentDate: '2025-07-15',
      uploadedAt: '2025-07-15',
      extractedText: 'Rx: Tab Pantoprazole 40mg OD x 5 days. Tab Domperidone 10mg BD x 3 days. Dietary advice given.',
    },
  ];

  const reportList = documents && documents.length > 0 ? documents : defaultReports;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDocument(e.target.files[0]);
    }
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
      <main className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6 flex-1 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Medical Reports & Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload and organize your clinical test results, prescriptions, and discharge summaries
          </p>
        </div>

        {/* Upload Box */}
        <label className="block border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/40 rounded-3xl p-8 text-center cursor-pointer transition-all group">
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white text-teal-600 flex items-center justify-center shadow-xs border border-teal-100 group-hover:scale-105 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Tap or drag files to upload medical report
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Supports PDF, JPG, PNG reports • Automatically processed for doctor timeline
              </div>
            </div>
            <span className="px-4 py-2 rounded-full bg-teal-600 text-white text-xs font-semibold shadow-xs">
              Select File
            </span>
          </div>
        </label>

        {/* List of Reports */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Your Uploaded Reports ({reportList.length})
          </h2>

          <div className="space-y-3">
            {reportList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900">{doc.title}</div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {doc.uploadedAt}
                      </span>
                      {doc.documentType && (
                        <>
                          <span>•</span>
                          <span className="capitalize font-medium text-slate-600">
                            {doc.documentType.replace('_', ' ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDoc(doc);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* View Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 truncate pr-4">
                {selectedDoc.title}
              </h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Extracted Clinical Findings</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed max-h-60 overflow-y-auto">
                {selectedDoc.extractedText || 'Processed report ready for doctor review.'}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 rounded-full bg-teal-600 text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
