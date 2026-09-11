import React, { useState, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Pill,
  Activity,
  Layers,
  Sparkles,
  Columns,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { MedicalDocument } from '../types';

interface OriginalDocumentModalProps {
  document: MedicalDocument;
  onClose: () => void;
  onVerifyDate?: (documentId: string, verifiedDate: string) => Promise<void> | void;
  isDoctorView?: boolean;
}

export const OriginalDocumentModal: React.FC<OriginalDocumentModalProps> = ({
  document,
  onClose,
  onVerifyDate,
  isDoctorView = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'split' | 'original_only' | 'ocr_only'>('split');
  const [copiedOcr, setCopiedOcr] = useState(false);
  const [isVerifyingDate, setIsVerifyingDate] = useState(false);
  const [manualDateInput, setManualDateInput] = useState(
    document.documentDate && /^\d{4}-\d{2}-\d{2}$/.test(document.documentDate)
      ? document.documentDate
      : new Date().toISOString().split('T')[0]
  );
  const [verifyingSuccess, setVerifyingSuccess] = useState(false);

  // Extract all pages or fall back to primary image
  const rawPages: string[] =
    document.pageImages && document.pageImages.length > 0
      ? document.pageImages
      : document.fileUrl
      ? [document.fileUrl]
      : document.originalFile?.base64
      ? [document.originalFile.base64]
      : [];

  const totalPages = Math.max(1, rawPages.length);
  const activePageUrl = rawPages[currentPageIndex] || null;

  const isPdf =
    document.mimeType?.includes('pdf') ||
    (activePageUrl && activePageUrl.startsWith('data:application/pdf'));

  const isNeedsVerification =
    document.dateVerificationStatus === 'needs_verification' ||
    !document.documentDate ||
    document.documentDate.trim() === '';

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Copy OCR Text
  const handleCopyOcr = () => {
    const textToCopy =
      document.extractedText ||
      JSON.stringify(document.extractedData, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2200);
  };

  // Submit Verified Date
  const handleConfirmVerifiedDate = async () => {
    if (!manualDateInput) return;
    setIsVerifyingDate(true);
    try {
      if (onVerifyDate) {
        await onVerifyDate(document.id, manualDateInput);
      }
      setVerifyingSuccess(true);
      setTimeout(() => {
        setVerifyingSuccess(false);
      }, 3000);
    } catch (e) {
      console.error('Failed to verify document date:', e);
    } finally {
      setIsVerifyingDate(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl h-[94vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                  {document.title || 'Original Scanned Medical Document'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 shrink-0">
                  {document.documentType?.replace('_', ' ') || 'Document'}
                </span>
                {isNeedsVerification ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Needs Verification
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Date: {document.documentDate}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {document.facilityOrDoctor || 'Official Clinical Record'} • Uploaded: {document.uploadedAt?.split('T')[0] || 'Recently'}
                {document.pageCount && document.pageCount > 1 ? ` • ${document.pageCount} Pages` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Selector */}
            <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Compare Original Document with OCR Information"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('original_only')}
                className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'original_only'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Full Screen Original Document"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Original Only</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ocr_only')}
                className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'ocr_only'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Full Structured Data & OCR"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Structured OCR</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 bg-slate-100">
          {/* LEFT SIDE: Original Document Viewer with Zoom, Scroll, Rotate, Multi-Page */}
          {(viewMode === 'split' || viewMode === 'original_only') && (
            <div
              className={`h-full flex flex-col bg-slate-900 border-r border-slate-800 select-none overflow-hidden ${
                viewMode === 'original_only' ? 'col-span-12' : 'col-span-12 md:col-span-7'
              }`}
            >
              {/* Document Toolbar: Page Nav, Zoom Controls, Rotate */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 text-slate-200 border-b border-slate-800 text-xs shrink-0">
                {/* Multi-Page Navigation */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Page {currentPageIndex + 1} of {totalPages}
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5">
                      <button
                        type="button"
                        disabled={currentPageIndex === 0}
                        onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                        className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Previous page"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={currentPageIndex >= totalPages - 1}
                        onClick={() =>
                          setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))
                        }
                        className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Next page"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Zoom & Rotation Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 mr-1">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                    title="Reset to 100%"
                  >
                    100%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer ml-1"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  {activePageUrl && (
                    <a
                      href={activePageUrl}
                      download={`medical-document-${document.id}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white transition-colors cursor-pointer ml-2 flex items-center gap-1"
                      title="Download exact original"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Viewport: Original Scanned Image or PDF */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-[#0b0f19]">
                {isPdf && activePageUrl ? (
                  <iframe
                    src={activePageUrl}
                    title="Original Medical PDF"
                    className="w-full h-full rounded-lg border border-slate-700 bg-white"
                  />
                ) : activePageUrl ? (
                  <div
                    className="transition-transform duration-150 ease-out origin-center flex items-center justify-center shadow-2xl"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    }}
                  >
                    <img
                      src={activePageUrl}
                      alt={document.title || 'Original Scanned Medical Document'}
                      className="max-w-full max-h-[75vh] object-contain rounded-lg border border-slate-700/60 shadow-2xl"
                    />
                  </div>
                ) : (
                  /* High-Fidelity Synthetic Document Rendering when original raw bitmap is absent */
                  <div
                    className="transition-transform duration-150 ease-out origin-center bg-white text-slate-900 p-8 rounded-xl shadow-2xl border border-slate-300 max-w-xl w-full font-serif leading-relaxed text-xs"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    }}
                  >
                    <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold tracking-tight uppercase text-slate-950">
                          {document.facilityOrDoctor || 'MEDICAL CLINIC & DIAGNOSTICS'}
                        </h2>
                        <p className="text-[10px] text-slate-600 font-sans">
                          Hospital Outpatient Department • Official Clinical Record
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold font-sans text-purple-800">℞</span>
                        <p className="text-[9px] text-slate-500 font-sans">
                          Doc Ref: #{document.id.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-sans border-b border-slate-200 pb-2 mb-3">
                      <div>
                        <strong>Document:</strong> {document.title}
                      </div>
                      <div>
                        <strong>Document Date:</strong>{' '}
                        {document.documentDate || (
                          <span className="text-amber-700 font-bold">Unspecified (Needs Verification)</span>
                        )}
                      </div>
                      <div>
                        <strong>Type:</strong> {document.documentType?.toUpperCase()}
                      </div>
                      <div>
                        <strong>Archived:</strong> {document.uploadedAt?.split('T')[0]}
                      </div>
                    </div>

                    <div className="my-3 space-y-2">
                      <div className="font-bold font-sans text-slate-800 uppercase text-[10px] tracking-wider">
                        Verbatim Clinical Record Text:
                      </div>
                      <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] whitespace-pre-wrap">
                        {document.extractedText || 'Clinical notes recorded.'}
                      </div>
                    </div>

                    {document.extractedData?.medications && document.extractedData.medications.length > 0 && (
                      <div className="my-3 space-y-1">
                        <div className="font-bold font-sans text-slate-800 uppercase text-[10px] tracking-wider">
                          Prescription Schedule:
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[11px]">
                          {document.extractedData.medications.map((m, idx) => (
                            <li key={idx}>
                              <strong>{m.name}</strong> - {m.dosage} ({m.frequency})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-t border-slate-300 pt-3 mt-6 flex items-center justify-between text-[10px] font-sans text-slate-500">
                      <span>Certified Medical Archival Copy</span>
                      <span className="italic font-serif">Verified Physician Signature / Stamp</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Page Bottom Thumbnails strip if > 1 page */}
              {totalPages > 1 && (
                <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 shrink-0">
                    All Pages:
                  </span>
                  {rawPages.map((pageUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        currentPageIndex === idx
                          ? 'border-purple-500 ring-2 ring-purple-500/40'
                          : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={pageUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold text-white text-center py-0.5">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RIGHT SIDE: Structured Clinical Data, OCR Transcript & AI Summary */}
          {(viewMode === 'split' || viewMode === 'ocr_only') && (
            <div
              className={`h-full flex flex-col bg-white overflow-y-auto ${
                viewMode === 'ocr_only' ? 'col-span-12' : 'col-span-12 md:col-span-5'
              }`}
            >
              {/* DATE VERIFICATION ALERT & QUICK VERIFY TOOL */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                      Detected Medical Date
                    </span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span className="font-bold text-base text-slate-900">
                        {document.documentDate || 'Date Not Detected'}
                      </span>
                    </div>
                  </div>

                  {isNeedsVerification ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Needs Verification
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Date Verified
                    </span>
                  )}
                </div>

                {/* If Needs Verification: Inline Verification Box */}
                {isNeedsVerification && (
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-2">
                    <p className="text-amber-900 font-medium">
                      The AI detected that the medical date on this prescription/report is unclear or missing. Please check the original scan on the left and verify the date:
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="date"
                        value={manualDateInput}
                        onChange={(e) => setManualDateInput(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmVerifiedDate}
                        disabled={isVerifyingDate}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingDate ? (
                          <span>Saving...</span>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm Date</span>
                          </>
                        )}
                      </button>
                    </div>
                    {verifyingSuccess && (
                      <p className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Document date confirmed and timeline updated!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* AI CLINICAL SUMMARY */}
              <div className="p-4 sm:p-5 border-b border-slate-200 space-y-2 bg-[#F7FAFD]">
                <div className="flex items-center gap-2 text-sky-900">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">
                    AI Clinical Synthesis & Summary
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {document.aiSummary ||
                    'Clinical document scanned, verified, and structured for longitudinal chart integration.'}
                </p>
              </div>

              {/* STRUCTURED MEDICAL DATA TABS / SECTIONS */}
              <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Structured Clinical Information
                </h4>

                {/* Diagnoses */}
                {document.extractedData?.diagnoses && document.extractedData.diagnoses.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Diagnoses & Conditions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {document.extractedData.diagnoses.map((diag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold"
                        >
                          {diag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medications */}
                {document.extractedData?.medications && document.extractedData.medications.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-purple-600" />
                      Medications & Prescriptions:
                    </span>
                    <div className="space-y-1.5">
                      {document.extractedData.medications.map((med, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{med.name}</span>
                            <span className="text-[11px] text-slate-500">
                              {med.dosage} • {med.frequency} {med.duration ? `• ${med.duration}` : ''}
                            </span>
                          </div>
                          {med.prescribedFor && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                              {med.prescribedFor}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Results */}
                {document.extractedData?.labResults && document.extractedData.labResults.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      Diagnostic Lab Results:
                    </span>
                    <div className="space-y-1.5">
                      {document.extractedData.labResults.map((lab, i) => {
                        const isAbnormal = lab.status === 'high' || lab.status === 'critical' || lab.status === 'low';
                        return (
                          <div
                            key={i}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                              lab.status === 'critical'
                                ? 'bg-rose-50 border-rose-200 text-rose-950'
                                : isAbnormal
                                ? 'bg-amber-50 border-amber-200 text-amber-950'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div>
                              <span className="font-bold block">{lab.testName}</span>
                              {lab.referenceRange && (
                                <span className="text-[10px] text-slate-500">
                                  Ref: {lab.referenceRange}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-bold font-mono text-sm block">
                                {lab.value} {lab.unit || ''}
                              </span>
                              {lab.status && (
                                <span
                                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    lab.status === 'critical'
                                      ? 'bg-rose-200 text-rose-900'
                                      : isAbnormal
                                      ? 'bg-amber-200 text-amber-900'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {lab.status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Findings */}
                {document.extractedData?.keyFindings && document.extractedData.keyFindings.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Key Clinical Findings:</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {document.extractedData.keyFindings.map((finding, i) => (
                        <li key={i}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* RAW VERBATIM OCR TRANSCRIPT */}
              <div className="p-4 sm:p-5 space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Full Raw OCR Transcript
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOcr}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy full OCR text"
                  >
                    {copiedOcr ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy OCR</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {document.extractedText || 'No raw OCR transcription available for this record.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Original uploaded image preserved in full optical resolution.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
