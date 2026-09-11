import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building,
  Upload,
  X,
  FilePlus2,
  Activity,
  Image as ImageIcon,
  HeartPulse,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Check,
  Edit2,
  Save,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';
import { MedicalReportItem, CaseTakingSession, MedicalDocument } from '../../types';

interface MedicalReportsTabProps {
  session: CaseTakingSession;
  onAddReport: (report: MedicalReportItem) => void;
  onUpdateDocument?: (doc: MedicalDocument) => void;
}

export const MedicalReportsTab: React.FC<MedicalReportsTabProps> = ({ session, onAddReport, onUpdateDocument }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<MedicalDocument | null>(null);

  // Inspector Viewer controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isEditingExtracted, setIsEditingExtracted] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');

  // Form states for new report
  const [reportDate, setReportDate] = useState('2026-08-29');
  const [reportType, setReportType] = useState<MedicalReportItem['reportType']>('Blood Test');
  const [testName, setTestName] = useState('');
  const [result, setResult] = useState('');
  const [units, setUnits] = useState('');
  const [referenceRange, setReferenceRange] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [facilityOrLab, setFacilityOrLab] = useState('Central Diagnostic Laboratory');
  const [status, setStatus] = useState<'normal' | 'abnormal' | 'critical'>('normal');
  const [simulatedFileName, setSimulatedFileName] = useState('');

  const reports: MedicalReportItem[] = session.reports || [];
  const documents: MedicalDocument[] = session.documents || [];

  // Filter logic
  const filteredReports = reports.filter((r) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'blood') return r.reportType === 'Blood Test' || r.reportType === 'Pathology';
    if (selectedCategory === 'imaging') return ['X-Ray', 'CT Scan', 'MRI Scan', 'Ultrasound'].includes(r.reportType);
    if (selectedCategory === 'ecg') return r.reportType === 'ECG';
    if (selectedCategory === 'rx') return r.reportType === 'Prescription';
    if (selectedCategory === 'discharge') return r.reportType === 'Discharge Summary';
    return true;
  });

  const handleOpenDocViewer = (doc: MedicalDocument) => {
    setSelectedDocForViewer(doc);
    setZoomLevel(100);
    setRotation(0);
    setIsFullScreen(false);
    setIsEditingExtracted(false);
    setEditedText(doc.extractedText || '');
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  const handleSaveDocEdit = () => {
    if (!selectedDocForViewer) return;
    const updatedDoc: MedicalDocument = {
      ...selectedDocForViewer,
      extractedText: editedText,
      requiresDoctorReview: false,
    };
    setSelectedDocForViewer(updatedDoc);
    setIsEditingExtracted(false);
    if (onUpdateDocument) {
      onUpdateDocument(updatedDoc);
    }
  };

  const handleMarkDocVerified = () => {
    if (!selectedDocForViewer) return;
    const updatedDoc: MedicalDocument = {
      ...selectedDocForViewer,
      requiresDoctorReview: false,
    };
    setSelectedDocForViewer(updatedDoc);
    if (onUpdateDocument) {
      onUpdateDocument(updatedDoc);
    }
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const newReport: MedicalReportItem = {
      id: `rep-${Date.now()}`,
      patientId: session.patient.id,
      reportDate,
      uploadedAt: new Date().toISOString(),
      reportType,
      testName,
      result,
      units: units || undefined,
      referenceRange: referenceRange || undefined,
      doctorNotes: doctorNotes || undefined,
      facilityOrLab,
      status,
      fileUrl: simulatedFileName ? `blob:${simulatedFileName}` : undefined,
    };

    onAddReport(newReport);
    setIsAddModalOpen(false);

    // Reset fields
    setTestName('');
    setResult('');
    setUnits('');
    setReferenceRange('');
    setDoctorNotes('');
    setSimulatedFileName('');
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSimulatedFileName(e.target.files[0].name);
      if (!testName) {
        setTestName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  return (
    <div className="space-y-6" id="medical-reports-root">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-900">
              Scanned Documents & Diagnostic Reports ({reports.length + documents.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Original patient uploaded prescriptions, ultrasound scans, pathology panels, and discharge records with side-by-side OCR review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-todays-report-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>+ Add Medical Report</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Records ({reports.length + documents.length})
        </button>
        <button
          onClick={() => setSelectedCategory('rx')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedCategory === 'rx'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setSelectedCategory('blood')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedCategory === 'blood'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Blood & Lab Reports
        </button>
        <button
          onClick={() => setSelectedCategory('imaging')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedCategory === 'imaging'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Imaging (X-Ray/USG/CT)
        </button>
        <button
          onClick={() => setSelectedCategory('discharge')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedCategory === 'discharge'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Discharge Summaries
        </button>
      </div>

      {/* Uploaded Scanned Documents Highlight Section */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Original Patient Uploaded Scans ({documents.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Click to open side-by-side original comparison view</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleOpenDocViewer(doc)}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-400 p-4 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {doc.documentType.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 pt-1 group-hover:text-teal-700 transition-colors">
                        {doc.title || doc.documentName}
                      </h4>
                    </div>
                    {doc.ocrConfidence ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {doc.ocrConfidence}% OCR
                      </span>
                    ) : null}
                  </div>

                  {/* Document Thumbnail Preview Mockup */}
                  <div className="h-32 w-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center group-hover:bg-teal-50/40 transition-colors">
                    {doc.fileUrl && doc.fileUrl.startsWith('data:image') ? (
                      <img
                        src={doc.fileUrl}
                        alt="Original Scanned Document"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-slate-400 p-3 text-center">
                        <ImageIcon className="w-8 h-8 text-teal-600/70" />
                        <span className="text-[10px] font-mono text-slate-500 font-semibold line-clamp-1">
                          {doc.documentName || doc.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-2xs">
                      <Eye className="w-4 h-4" />
                      <span>Inspect Original Scan</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono text-[11px]">
                    {doc.extractedText}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100 mt-2">
                  <span className="font-semibold">{doc.documentDate || 'Recent'}</span>
                  <span className="text-teal-600 font-bold flex items-center gap-1">
                    <span>Inspect</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Lab & Diagnostic Reports Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Diagnostic Investigation Panels ({filteredReports.length})
        </h3>

        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No additional investigation records found</p>
            <p className="text-xs text-slate-400">
              Click "+ Add Medical Report" to record new laboratory parameters or imaging findings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => {
              const isCritical = report.status === 'critical';
              const isAbnormal = report.status === 'abnormal';

              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-3 flex flex-col justify-between ${
                    isCritical
                      ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                      : isAbnormal
                      ? 'border-amber-300'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {report.reportType}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 pt-1 leading-snug">
                          {report.testName}
                        </h3>
                      </div>

                      {isCritical ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                          CRITICAL VALUE
                        </span>
                      ) : isAbnormal ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                          ABNORMAL
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                          NORMAL
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Result / Value</span>
                        {report.units && (
                          <span className="text-[11px] font-mono text-slate-500">Unit: {report.units}</span>
                        )}
                      </div>
                      <p className="font-bold text-sm text-slate-900">
                        {report.result} {report.units}
                      </p>
                      {report.referenceRange && (
                        <p className="text-[11px] text-slate-500">
                          Ref Range: <span className="font-mono text-slate-700">{report.referenceRange}</span>
                        </p>
                      )}
                    </div>

                    {report.doctorNotes && (
                      <div className="text-xs text-slate-600 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                        <strong>Clinical Note: </strong>
                        {report.doctorNotes}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Date: <strong>{report.reportDate}</strong>
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {report.facilityOrLab || 'Central Lab'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ORIGINAL SCANNED DOCUMENT SIDE-BY-SIDE INSPECTOR MODAL */}
      {selectedDocForViewer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fadeIn">
          <div className={`bg-white w-full rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden transition-all ${
            isFullScreen ? 'h-full max-w-full' : 'h-[92vh] max-w-6xl'
          }`}>
            {/* Modal Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">
                      {selectedDocForViewer.title || selectedDocForViewer.documentName}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-teal-600 text-white text-[10px] uppercase font-bold">
                      {selectedDocForViewer.documentType.replace('_', ' ')}
                    </span>
                    {selectedDocForViewer.ocrConfidence && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        {selectedDocForViewer.ocrConfidence}% OCR Accuracy
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Patient ID: {selectedDocForViewer.patientId || session.patient.id} • Consultation: {selectedDocForViewer.consultationId || session.patient.consultationId || 'Active'} • Date: {selectedDocForViewer.documentDate}
                  </p>
                </div>
              </div>

              {/* Top Bar Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedDocForViewer(null)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Screen Body: Left = Original Scan, Right = Extracted Data */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
              {/* LEFT PANE: ORIGINAL SCANNED DOCUMENT VIEWER */}
              <div className="flex flex-col bg-slate-900/95 overflow-hidden relative">
                {/* Image Toolbar */}
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-white text-xs border-b border-slate-700 shrink-0">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                    Original Scanned Document
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleZoomOut}
                      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 py-0.5 rounded bg-slate-900 font-mono text-[11px]">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleRotate}
                      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors ml-1"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-bold text-slate-200 ml-1"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Canvas / Image Display */}
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
                  {selectedDocForViewer.fileUrl && selectedDocForViewer.fileUrl.startsWith('data:image') ? (
                    <div
                      className="transition-transform duration-150 origin-center shadow-2xl rounded-sm"
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      }}
                    >
                      <img
                        src={selectedDocForViewer.fileUrl}
                        alt="Original Scanned Document"
                        className="max-h-[70vh] object-contain rounded border border-slate-700 bg-white"
                      />
                    </div>
                  ) : (
                    /* High-resolution rendered clinical document simulation */
                    <div
                      className="transition-transform duration-150 origin-center bg-white text-slate-900 p-6 rounded-lg shadow-2xl border border-slate-200 w-full max-w-md space-y-4 font-mono text-xs"
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      }}
                    >
                      <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                        <h2 className="font-black text-sm uppercase tracking-wide">
                          {selectedDocForViewer.facilityOrDoctor || 'MEDICAL CENTER CLINIC'}
                        </h2>
                        <p className="text-[10px] text-slate-600">DEPARTMENT OF CLINICAL SPECIALTIES • OUTPATIENT RECORD</p>
                        <p className="text-[9px] text-slate-500">Date: {selectedDocForViewer.documentDate || '2026-08-28'} • Rx ID: RX-99482-A</p>
                      </div>

                      <div className="text-[10px] space-y-0.5 border-b border-slate-200 pb-2">
                        <p><strong>Patient Name:</strong> {session.patient.fullName}</p>
                        <p><strong>Age/Gender:</strong> {session.patient.age}Y / {session.patient.gender.toUpperCase()}</p>
                        <p><strong>Patient ID:</strong> {session.patient.id}</p>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <p className="font-bold uppercase text-[10px] text-slate-500 tracking-wider">℞ CLINICAL PRESCRIPTION / FINDINGS:</p>
                        <p className="whitespace-pre-line text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 font-sans">
                          {selectedDocForViewer.extractedText}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                        <span>Signed by Treating Specialist, MD</span>
                        <span>Official Hospital Seal Verified</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANE: AI-EXTRACTED STRUCTURED INFORMATION & DOCTOR VERIFICATION */}
              <div className="flex flex-col bg-slate-50 overflow-hidden">
                {/* Extracted Header */}
                <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      AI OCR Extracted Clinical Data
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditingExtracted ? (
                      <button
                        onClick={handleSaveDocEdit}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save OCR Edits</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditingExtracted(true);
                          setEditedText(selectedDocForViewer.extractedText || '');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Extracted Data</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Structured Fields Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                  {/* Extracted Diagnoses */}
                  {selectedDocForViewer.extractedData?.diagnoses && selectedDocForViewer.extractedData.diagnoses.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Extracted Clinical Diagnoses
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDocForViewer.extractedData.diagnoses.map((dx, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold"
                          >
                            ✓ {dx}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Prescribed Medications */}
                  {selectedDocForViewer.extractedData?.medications && selectedDocForViewer.extractedData.medications.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Extracted Medications & Dosing
                      </span>
                      <div className="space-y-2">
                        {selectedDocForViewer.extractedData.medications.map((med, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900">{med.name}</p>
                              <p className="text-[11px] text-slate-600">
                                Dose: <span className="font-semibold text-slate-800">{med.dosage}</span> • Frequency: <span className="font-semibold text-slate-800">{med.frequency}</span>
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Extracted
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Lab Results */}
                  {selectedDocForViewer.extractedData?.labResults && selectedDocForViewer.extractedData.labResults.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Extracted Lab / Diagnostic Findings
                      </span>
                      <div className="space-y-1.5">
                        {selectedDocForViewer.extractedData.labResults.map((lab, i) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              lab.status === 'abnormal' || lab.status === 'high' || lab.status === 'critical'
                                ? 'bg-rose-50 border-rose-200 text-rose-900 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div>
                              <p className="font-bold">{lab.testName}</p>
                              <p className="text-[11px] text-slate-600">
                                Value: <strong>{lab.value} {lab.unit}</strong> (Ref: {lab.referenceRange})
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              lab.status === 'abnormal' || lab.status === 'high' || lab.status === 'critical'
                                ? 'bg-rose-200 text-rose-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {lab.status || 'NORMAL'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full Text Transcript */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Full OCR Text Transcript
                    </span>
                    {isEditingExtracted ? (
                      <textarea
                        rows={6}
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono leading-relaxed"
                      />
                    ) : (
                      <p className="text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {selectedDocForViewer.extractedText}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Verification Footer */}
                <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Doctor Verification ensures clinical summary integration accuracy</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMarkDocVerified}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Verify Document</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD REPORT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilePlus2 className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm">Add Medical Report / Diagnostic Investigation</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Report Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="Blood Test">Blood Test / Lab</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="ECG">ECG / Cardiac</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="MRI Scan">MRI Scan</option>
                    <option value="Ultrasound">Ultrasound (USG)</option>
                    <option value="Pathology">Pathology / Biopsy</option>
                    <option value="Prescription">Prescription Document</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Medical Certificate">Medical Certificate</option>
                    <option value="Other">Other Diagnostic Report</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Test / Examination Name *
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Complete Blood Count, Serum Creatinine, Ultrasound Abdomen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Result / Quantitative Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="e.g. 142, Normal sinus rhythm, Clear"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Units (if applicable)
                  </label>
                  <input
                    type="text"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="e.g. mg/dL, g/dL, %"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Reference Range
                  </label>
                  <input
                    type="text"
                    value={referenceRange}
                    onChange={(e) => setReferenceRange(e.target.value)}
                    placeholder="e.g. 70 - 100 mg/dL"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Clinical Finding Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="critical">Critical High / Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Diagnostic Facility / Laboratory Name
                </label>
                <input
                  type="text"
                  value={facilityOrLab}
                  onChange={(e) => setFacilityOrLab(e.target.value)}
                  placeholder="e.g. Central Biochemistry Laboratory"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Doctor's Clinical Notes / Interpretation
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Diagnostic impression, comparison with previous baseline..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* File Attachment Upload Simulation */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Attach Report File (PDF / Image)
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 text-center hover:bg-slate-100 transition-colors">
                  <input
                    type="file"
                    id="report-file-upload"
                    onChange={handleSimulatedFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="report-file-upload" className="cursor-pointer flex flex-col items-center gap-1">
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span className="text-[11px] font-semibold text-slate-700">
                      {simulatedFileName ? simulatedFileName : 'Click to select or drag & drop report file'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Report to Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
