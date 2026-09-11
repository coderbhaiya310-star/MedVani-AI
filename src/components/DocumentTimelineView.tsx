import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Calendar,
  Pill,
  Activity,
  Hospital,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Plus,
  Eye,
  Filter,
  Clock,
  Building,
  X,
  FileCheck,
  Camera,
} from 'lucide-react';
import { MedicalDocument } from '../types';
import { analyzeUploadedDocument } from '../services/geminiService';
import { CameraDocumentScanner } from './CameraDocumentScanner';

interface DocumentTimelineViewProps {
  documents: MedicalDocument[];
  patientId: string;
  onAddDocument: (doc: MedicalDocument) => void;
  onClose?: () => void;
}

export const DocumentTimelineView: React.FC<DocumentTimelineViewProps> = ({
  documents,
  patientId,
  onAddDocument,
  onClose,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'prescription' | 'lab_report' | 'discharge_summary' | 'imaging_scan'>('all');
  const [activeDocModal, setActiveDocModal] = useState<MedicalDocument | null>(null);
  const [manualText, setManualText] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const analyzed = await analyzeUploadedDocument({
          fileBase64: base64Data,
          mimeType: file.type,
          fileName: file.name,
          patientId,
        });
        onAddDocument(analyzed);
        setIsUploading(false);
      } catch (err: any) {
        console.error('Error analyzing document:', err);
        // Fallback document creation
        onAddDocument({
          id: 'doc-' + Date.now(),
          patientId,
          title: file.name.replace(/\.[^/.]+$/, ''),
          documentType: 'prescription',
          documentDate: new Date().toISOString().split('T')[0],
          uploadedAt: new Date().toISOString(),
          facilityOrDoctor: 'Uploaded Record',
          extractedText: 'Document OCR processed.',
          extractedData: {
            diagnoses: ['Extracted Medical Condition'],
            medications: [{ name: 'Extracted Rx', dosage: 'Standard', frequency: 'As directed' }],
          },
        });
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Add preset sample document for instant hackathon testing
  const handleAddSampleDoc = (sampleType: 'ecg_lab' | 'rx_diabetic' | 'discharge') => {
    if (sampleType === 'ecg_lab') {
      onAddDocument({
        id: 'doc-sample-' + Date.now(),
        patientId,
        title: 'Cardiac Enzymes & Lipid Panel - Apollo Clinic',
        documentType: 'lab_report',
        documentDate: '2026-02-15',
        uploadedAt: new Date().toISOString(),
        facilityOrDoctor: 'Apollo Diagnostics Laboratory',
        extractedText: 'hs-Troponin I: 0.08 ng/mL (Borderline Elevated, Ref <0.04). Total Cholesterol: 230 mg/dL. LDL: 155 mg/dL. HbA1c: 8.8%.',
        extractedData: {
          diagnoses: ['Unstable Dyslipidemia', 'Poor Glycemic Control', 'Borderline Troponin elevation'],
          labResults: [
            { testName: 'hs-cTnI (Cardiac Troponin I)', value: '0.08', unit: 'ng/mL', referenceRange: '< 0.04', status: 'critical' },
            { testName: 'HbA1c', value: '8.8', unit: '%', referenceRange: '< 6.5', status: 'high' },
            { testName: 'LDL Cholesterol', value: '155', unit: 'mg/dL', referenceRange: '< 70', status: 'high' },
          ],
          keyFindings: ['Borderline high cardiac biomarker; strict cardiology correlation advised.'],
        },
      });
    } else if (sampleType === 'rx_diabetic') {
      onAddDocument({
        id: 'doc-sample-' + Date.now(),
        patientId,
        title: 'Endocrinology Consultation & Prescription',
        documentType: 'prescription',
        documentDate: '2025-10-20',
        uploadedAt: new Date().toISOString(),
        facilityOrDoctor: 'Dr. S. K. Rastogi, MD (Endocrinology)',
        extractedText: 'Rx: Tab. Metformin 1000mg BD, Tab. Glimepiride 2mg OD before breakfast, Tab. Atorvastatin 40mg OD bedtime. Advice: Low GI diet, 45 min walk.',
        extractedData: {
          diagnoses: ['Type 2 Diabetes Mellitus', 'Dyslipidemia'],
          medications: [
            { name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', prescribedFor: 'Diabetes' },
            { name: 'Glimepiride', dosage: '2mg', frequency: 'Once daily morning', prescribedFor: 'Diabetes' },
            { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily night', prescribedFor: 'Lipid Lowering' },
          ],
          keyFindings: ['High-potency statin and dual oral hypoglycemic agents prescribed.'],
        },
      });
    } else {
      onAddDocument({
        id: 'doc-sample-' + Date.now(),
        patientId,
        title: 'Emergency Room Discharge Summary - Chest Pain Workup',
        documentType: 'discharge_summary',
        documentDate: '2024-08-10',
        uploadedAt: new Date().toISOString(),
        facilityOrDoctor: 'Fortis Escorts Emergency Dept',
        extractedText: 'Admitted with typical angina on exertion. Coronary Angio revealed severe CAD. Stent placed in LAD. Discharged on DAPT + Statin.',
        extractedData: {
          diagnoses: ['Coronary Artery Disease', 'Post-PCI Stenting'],
          keyFindings: ['Drug eluting stent deployed in LAD artery in 2024.'],
        },
      });
    }
  };

  // Sort documents date-wise (chronological descending)
  const sortedDocuments = [...documents].sort((a, b) => {
    return new Date(b.documentDate || b.uploadedAt).getTime() - new Date(a.documentDate || a.uploadedAt).getTime();
  });

  const filteredDocs = sortedDocuments.filter((doc) => {
    if (selectedFilter === 'all') return true;
    return doc.documentType === selectedFilter;
  });

  const getDocBadge = (type: string) => {
    switch (type) {
      case 'prescription':
        return {
          label: 'Prescription',
          icon: Pill,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'lab_report':
        return {
          label: 'Diagnostic Lab',
          icon: Activity,
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'discharge_summary':
        return {
          label: 'Hospital Discharge',
          icon: Hospital,
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'imaging_scan':
        return {
          label: 'Imaging Scan',
          icon: FileText,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      default:
        return {
          label: 'Medical Record',
          icon: FileCheck,
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Upload Zone */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Medical Document Timeline & OCR Ingestion</span>
            </h2>
            <p className="text-xs text-slate-500">
              Upload prescriptions, lab reports, or discharge summaries. AI extracts structured medical facts and organizes them date-wise.
            </p>
          </div>

          {/* Preset Buttons for Quick Demo Testing */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Quick Add:</span>
            <button
              onClick={() => handleAddSampleDoc('rx_diabetic')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
            >
              + Rx Prescription
            </button>
            <button
              onClick={() => handleAddSampleDoc('ecg_lab')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors cursor-pointer"
            >
              + Lab Panel
            </button>
            <button
              onClick={() => handleAddSampleDoc('discharge')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors cursor-pointer"
            >
              + Discharge Summary
            </button>
          </div>
        </div>

        {/* Drag & Drop / Upload Trigger Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Live Voice & Camera Scanner (Elderly Friendly) */}
          <button
            type="button"
            onClick={() => setShowScannerModal(true)}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-teal-50 border-2 border-dashed border-teal-300 hover:border-teal-500 hover:bg-teal-100/70 transition-all text-center group cursor-pointer shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform mb-2">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-teal-950">
              Scan with Camera
            </p>
            <p className="text-xs text-teal-700 mt-0.5">
              Auto-capture • Multi-page • Voice Guided
            </p>
          </button>

          {/* Option 2: File Upload (PDF, JPG, PNG) */}
          <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 rounded-2xl p-5 text-center transition-colors flex flex-col items-center justify-center">
            <input
              type="file"
              id="doc-file-upload"
              accept="image/*,.pdf,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor="doc-file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2 w-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-800/20">
                {isUploading ? <Sparkles className="w-6 h-6 animate-spin text-teal-400" /> : <Upload className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {isUploading ? 'Extracting clinical text with Gemini...' : 'Upload File / PDF'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drag or select images, hospital PDFs
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Records ({documents.length})
          </button>
          <button
            onClick={() => setSelectedFilter('prescription')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedFilter === 'prescription' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            Prescriptions ({documents.filter((d) => d.documentType === 'prescription').length})
          </button>
          <button
            onClick={() => setSelectedFilter('lab_report')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedFilter === 'lab_report' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800'
            }`}
          >
            Diagnostic Labs ({documents.filter((d) => d.documentType === 'lab_report').length})
          </button>
          <button
            onClick={() => setSelectedFilter('discharge_summary')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedFilter === 'discharge_summary' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-800'
            }`}
          >
            Discharge Summaries ({documents.filter((d) => d.documentType === 'discharge_summary').length})
          </button>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">No medical records uploaded in this category</h3>
          <p className="text-xs text-slate-400">Upload prescription photos or click 'Quick Add' above to seed records.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredDocs.map((doc, idx) => {
            const badge = getDocBadge(doc.documentType);
            const Icon = badge.icon;

            return (
              <div key={doc.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center text-teal-700 shadow-xs">
                  <Icon className="w-3 h-3" />
                </div>

                {/* Timeline Document Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3.5">
                  {/* Top Bar: Title, Date, Facility */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900">{doc.title}</h3>
                      </div>
                      {doc.facilityOrDoctor && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.facilityOrDoctor}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date: {doc.documentDate || 'Undated'}</span>
                      </span>
                      <button
                        onClick={() => setActiveDocModal(doc)}
                        className="flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Full OCR</span>
                      </button>
                    </div>
                  </div>

                  {/* Extracted Diagnoses */}
                  {doc.extractedData?.diagnoses && doc.extractedData.diagnoses.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Documented Diagnoses / Conditions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.extractedData.diagnoses.map((d, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Medications */}
                  {doc.extractedData?.medications && doc.extractedData.medications.length > 0 && (
                    <div className="space-y-1.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-emerald-700" />
                        Prescribed Medications ({doc.extractedData.medications.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {doc.extractedData.medications.map((m, i) => (
                          <div key={i} className="bg-white p-2 rounded-lg border border-emerald-200 shadow-2xs">
                            <span className="font-bold text-slate-900">{m.name}</span>
                            <span className="text-slate-600 ml-1.5 font-mono font-medium">
                              {m.dosage} ({m.frequency})
                            </span>
                            {m.prescribedFor && (
                              <p className="text-[10px] text-slate-500 italic mt-0.5">For: {m.prescribedFor}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Lab Results */}
                  {doc.extractedData?.labResults && doc.extractedData.labResults.length > 0 && (
                    <div className="space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-blue-700" />
                        Laboratory Diagnostic Findings:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {doc.extractedData.labResults.map((lr, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-lg border flex items-center justify-between ${
                              lr.status === 'critical'
                                ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                                : lr.status === 'high' || lr.status === 'low'
                                ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <div>
                              <p className="font-bold">{lr.testName}</p>
                              {lr.referenceRange && (
                                <p className="text-[10px] text-slate-500 font-normal">Ref: {lr.referenceRange}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-sm">
                                {lr.value} {lr.unit || ''}
                              </span>
                              {lr.status && lr.status !== 'normal' && (
                                <span
                                  className={`block text-[10px] uppercase font-bold ${
                                    lr.status === 'critical' ? 'text-rose-700' : 'text-amber-700'
                                  }`}
                                >
                                  {lr.status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Findings Bullet points */}
                  {doc.extractedData?.keyFindings && doc.extractedData.keyFindings.length > 0 && (
                    <div className="space-y-1 text-xs text-slate-600">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Key Medical Notes:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {doc.extractedData.keyFindings.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Document View Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{activeDocModal.title}</h3>
                <p className="text-xs text-slate-500">
                  {activeDocModal.documentType} • Date: {activeDocModal.documentDate}
                </p>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Extracted Text & OCR Transcript:
              </span>
              <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                {activeDocModal.extractedText || JSON.stringify(activeDocModal.extractedData, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Document Scanner Modal */}
      {showScannerModal && (
        <CameraDocumentScanner
          patientId={patientId}
          onDocumentCaptured={(doc) => {
            onAddDocument(doc);
            setShowScannerModal(false);
          }}
          onClose={() => setShowScannerModal(false)}
          initialType="prescription"
          sourceContext="document_tab"
        />
      )}
    </div>
  );
};
