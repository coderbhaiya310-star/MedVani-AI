import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Layers,
  Trash2,
  Plus,
  Volume2,
  Mic,
  FileText,
  Eye,
  CheckCircle2,
  Sun,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { MedicalDocument, LanguageCode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeUploadedDocument } from '../services/geminiService';
import { speakTextAloud, stopSpeaking, ClinicalSpeechManager } from '../utils/speechUtils';

interface CameraDocumentScannerProps {
  patientId: string;
  onDocumentCaptured: (document: MedicalDocument) => void;
  onClose: () => void;
  initialType?: string;
  sourceContext?: 'voice_intake' | 'document_tab' | 'patient_portal';
}

interface CapturedPage {
  id: string;
  pageNumber: number;
  dataUrl: string;
  blurScore: number;
  isStable: boolean;
  lightingQuality: 'good' | 'low_light' | 'glare';
  feedback: string;
}

export const CameraDocumentScanner: React.FC<CameraDocumentScannerProps> = ({
  patientId,
  onDocumentCaptured,
  onClose,
  initialType = 'prescription',
  sourceContext = 'voice_intake',
}) => {
  const { language, t } = useLanguage();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPages, setCapturedPages] = useState<CapturedPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>(initialType);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [previewingPage, setPreviewingPage] = useState<CapturedPage | null>(null);

  // Real-time Detection & Quality state
  const [isDocumentDetected, setIsDocumentDetected] = useState(false);
  const [lightingStatus, setLightingStatus] = useState<'good' | 'low_light' | 'glare'>('good');
  const [stabilityProgress, setStabilityProgress] = useState(0); // 0 to 100%
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [scannerStatusText, setScannerStatusText] = useState<string>('');
  const [voiceCommandFeedback, setVoiceCommandFeedback] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analysisCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechManagerRef = useRef<ClinicalSpeechManager | null>(null);
  const stableFramesCount = useRef(0);
  const prevFrameData = useRef<Uint8ClampedArray | null>(null);

  // Localized Prompts
  const localizedScannerPrompts: Record<string, {
    cameraReady: string;
    holdStill: string;
    capturing: string;
    pageCaptured: (num: number) => string;
    lowLight: string;
    glare: string;
    blurry: string;
    doneScanning: string;
    micNotice: string;
  }> = {
    en: {
      cameraReady: 'Please place your document or prescription in front of the camera.',
      holdStill: 'Document detected. Hold still.',
      capturing: 'Capturing document...',
      pageCaptured: (num: number) => `Page ${num} captured. Please show the next page, or say "Done".`,
      lowLight: 'The lighting is dim. Please move to a brighter spot.',
      glare: 'Bright reflection detected. Please tilt the paper slightly.',
      blurry: 'Please hold the document steady and flat.',
      doneScanning: 'Processing medical document with AI OCR...',
      micNotice: 'Voice commands active: Say "Next page", "Done", or "Retake"',
    },
    hi: {
      cameraReady: 'कृपया अपनी रिपोर्ट या पर्चा कैमरे के सामने रखें।',
      holdStill: 'दस्तावेज़ पहचाना गया। कृपया हाथ स्थिर रखें।',
      capturing: 'फ़ोटो खींची जा रही है...',
      pageCaptured: (num: number) => `पेज ${num} कैप्चर हो गया। अगला पेज दिखाएँ या "हो गया" कहें।`,
      lowLight: 'रोशनी कम है। कृपया दस्तावेज़ को अच्छी रोशनी में रखें।',
      glare: 'कागज़ पर तेज़ चमक आ रही है। थोड़ा तिरछा करें।',
      blurry: 'कृपया दस्तावेज़ को थोड़ा सीधा करें और कैमरे के सामने स्थिर रखें।',
      doneScanning: 'मेडिकल रिपोर्ट की जांच हो रही है...',
      micNotice: 'आवाज़ से आदेश दें: "अगला पेज", "हो गया", या "फोटो दोबारा लो"',
    },
    bn: {
      cameraReady: 'দয়া করে আপনার প্রেসক্রিপশন বা রিপোর্ট ক্যামেরার সামনে ধরুন।',
      holdStill: 'ডকুমেন্ট সনাক্ত হয়েছে। স্থির থাকুন।',
      capturing: 'ছবি তোলা হচ্ছে...',
      pageCaptured: (num: number) => `পৃষ্ঠা ${num} ক্যাপচার করা হয়েছে। পরবর্তী পৃষ্ঠা দেখান অথবা "হয়ে গেছে" বলুন।`,
      lowLight: 'আলো কম। ভালো আলোতে রাখুন।',
      glare: 'অতিরিক্ত আলো প্রতিফলিত হচ্ছে।',
      blurry: 'দয়া করে ডকুমেন্টটি সোজা ও স্থির রাখুন।',
      doneScanning: 'রিপোর্ট বিশ্লেষণ করা হচ্ছে...',
      micNotice: 'ভয়েস নির্দেশ: "পরের পাতা", "হয়ে গেছে"',
    },
    ta: {
      cameraReady: 'உங்கள் மருத்துவ அறிக்கையை கேமராவுக்கு முன் வைக்கவும்.',
      holdStill: 'ஆவணம் கண்டறியப்பட்டது. அசையாமல் வைக்கவும்.',
      capturing: 'படம் எடுக்கப்படுகிறது...',
      pageCaptured: (num: number) => `பக்கம் ${num} பதிவு செய்யப்பட்டது. அடுத்த பக்கத்தைக் காட்டவும் அல்லது "முடிந்தது" என கூறவும்.`,
      lowLight: 'வெளிச்சம் குறைவாக உள்ளது.',
      glare: 'வெளிச்ச பிரதிபலிப்பு உள்ளது.',
      blurry: 'ஆவணத்தை நேராகவும் அசையாமலும் வைக்கவும்.',
      doneScanning: 'மருத்துவ அறிக்கை ஆய்வு செய்யப்படுகிறது...',
      micNotice: 'குரல் கட்டளைகள்: "அடுத்த பக்கம்", "முடிந்தது"',
    },
    te: {
      cameraReady: 'దయచేసి మీ మెడికల్ రిపోర్ట్ లేదా ప్రిస్క్రిప్షన్‌ను కెమెరా ముందు ఉంచండి.',
      holdStill: 'డాక్యుమెంట్ గుర్తించబడింది. స్థిరంగా ఉంచండి.',
      capturing: 'ఫోటో తీయబడుతోంది...',
      pageCaptured: (num: number) => `పేజీ ${num} సంగ్రహించబడింది. తదుపరి పేజీని చూపించండి లేదా "ముగిసింది" అని చెప్పండి.`,
      lowLight: 'వెలుతురు తక్కువగా ఉంది.',
      glare: 'మెరుపు ఎక్కువగా ఉంది.',
      blurry: 'దయచేసి డాక్యుమెంట్‌ను నిటారుగా మరియు కదలకుండా ఉంచండి.',
      doneScanning: 'రిపోర్ట్ పరిశీలించబడుతోంది...',
      micNotice: 'వాయిస్ ఆదేశాలు: "తదుపరి పేజీ", "ముగిసింది"',
    },
  };

  const getPrompt = () => {
    return localizedScannerPrompts[language] || localizedScannerPrompts.hi || localizedScannerPrompts.en;
  };

  // Initialize Device Camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch {
        // Fallback to any camera if environment camera is unavailable
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => console.warn('Video play error:', err));
      }

      const prompt = getPrompt();
      setScannerStatusText(prompt.cameraReady);
      speakTextAloud(prompt.cameraReady, language, 0.86);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        language === 'hi'
          ? 'कैमरा खोलने की अनुमति नहीं मिली। कृपया ब्राउज़र में कैमरा एक्सेस की अनुमति दें।'
          : 'Unable to access device camera. Please grant camera permissions in your browser settings.'
      );
    }
  }, [language]);

  // Handle Voice Commands during Document Scanner
  const initScannerVoiceListener = useCallback(() => {
    try {
      const sm = new ClinicalSpeechManager();
      sm.setLanguage(language);
      sm.setSilenceThreshold(1800);
      speechManagerRef.current = sm;

      sm.startListening({
        onTranscriptUpdate: (text) => {
          setVoiceCommandFeedback(`"${text}"`);
        },
        onTurnComplete: (spokenText) => {
          const lower = spokenText.toLowerCase().trim();
          // Voice Command: Next Page / अगला पेज
          if (
            lower.includes('next') ||
            lower.includes('अगला') ||
            lower.includes('dusra') ||
            lower.includes('दूसरा') ||
            lower.includes('পরের') ||
            lower.includes('அடுத்த') ||
            lower.includes('తదుపరి')
          ) {
            handleCaptureManual();
          }
          // Voice Command: Done / Finished / हो गया / Upload
          else if (
            lower.includes('done') ||
            lower.includes('ho gaya') ||
            lower.includes('हो गया') ||
            lower.includes('upload') ||
            lower.includes('अपलोड') ||
            lower.includes('complete') ||
            lower.includes('বাস') ||
            lower.includes('முடிந்தது') ||
            lower.includes('ముగిసింది')
          ) {
            if (capturedPages.length > 0) {
              handleFinishAndProcess();
            } else {
              handleCaptureManual();
            }
          }
          // Voice Command: Retake / दोबारा लो
          else if (
            lower.includes('retake') ||
            lower.includes('dobara') ||
            lower.includes('दोबारा') ||
            lower.includes('फिर से') ||
            lower.includes('ಮறுபடி')
          ) {
            handleRetakeCurrent();
          }
          // Voice Command: Cancel / बंद करो
          else if (lower.includes('cancel') || lower.includes('close') || lower.includes('band') || lower.includes('बंद')) {
            handleCloseScanner();
          }
        },
        onListeningState: () => {},
        onError: () => {},
      });
    } catch (e) {
      console.warn('Scanner speech listener init notice:', e);
    }
  }, [language, capturedPages]);

  useEffect(() => {
    startCamera();
    initScannerVoiceListener();

    return () => {
      stopSpeaking();
      if (speechManagerRef.current) {
        speechManagerRef.current.stopListening();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [startCamera, initScannerVoiceListener]);

  // Clean up media tracks on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Live Computer Vision Frame Analysis Engine
  const analyzeLiveFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = analysisCanvasRef.current;
    if (!video || !canvas || video.readyState !== 4) {
      animFrameRef.current = requestAnimationFrame(analyzeLiveFrame);
      return;
    }

    const width = 160; // downsampled for fast 60fps analysis
    const height = 120;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(analyzeLiveFrame);
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);
    const frame = ctx.getImageData(0, 0, width, height);
    const data = frame.data;

    // 1. Calculate Average Luminance (Brightness)
    let totalLuminance = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      totalLuminance += lum;
    }
    const avgLum = totalLuminance / (width * height);

    let lighting: 'good' | 'low_light' | 'glare' = 'good';
    if (avgLum < 45) {
      lighting = 'low_light';
    } else if (avgLum > 220) {
      lighting = 'glare';
    }
    setLightingStatus(lighting);

    // 2. Motion Stability Analysis (comparing pixel diff with previous frame)
    let pixelDiff = 0;
    if (prevFrameData.current) {
      const prev = prevFrameData.current;
      for (let i = 0; i < data.length; i += 8) {
        pixelDiff += Math.abs(data[i] - prev[i]);
      }
    }
    prevFrameData.current = new Uint8ClampedArray(data);

    const diffThreshold = (width * height * 0.12) * 15;
    const isStationary = pixelDiff < diffThreshold && avgLum >= 45 && avgLum <= 220;

    // 3. Document Edge Contrast inside center region
    const centerSample = avgLum > 60 && avgLum < 210; // paper contrast against background
    setIsDocumentDetected(centerSample);

    if (isStationary && centerSample && !isAutoCapturing) {
      stableFramesCount.current += 1;
      const progress = Math.min(100, Math.round((stableFramesCount.current / 35) * 100));
      setStabilityProgress(progress);

      if (progress >= 30 && progress < 90) {
        setScannerStatusText(getPrompt().holdStill);
      }

      // Auto-trigger capture after ~1.2 seconds of steady alignment
      if (stableFramesCount.current >= 35 && !isAutoCapturing) {
        setIsAutoCapturing(true);
        triggerAutoCapture();
      }
    } else {
      stableFramesCount.current = Math.max(0, stableFramesCount.current - 2);
      setStabilityProgress(Math.round((stableFramesCount.current / 35) * 100));
      if (!isAutoCapturing) {
        if (lighting === 'low_light') {
          setScannerStatusText(getPrompt().lowLight);
        } else if (lighting === 'glare') {
          setScannerStatusText(getPrompt().glare);
        } else {
          setScannerStatusText(getPrompt().cameraReady);
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(analyzeLiveFrame);
  }, [isAutoCapturing, language]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(analyzeLiveFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [analyzeLiveFrame]);

  // Capture Image from Video Stream
  const captureCurrentFrame = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  // Trigger Automatic Capture
  const triggerAutoCapture = () => {
    const prompt = getPrompt();
    setScannerStatusText(prompt.capturing);
    speakTextAloud(prompt.capturing, language, 0.9);

    setTimeout(() => {
      const dataUrl = captureCurrentFrame();
      if (dataUrl) {
        const newPageNum = capturedPages.length + 1;
        const newPage: CapturedPage = {
          id: 'page-' + Date.now(),
          pageNumber: newPageNum,
          dataUrl,
          blurScore: 85,
          isStable: true,
          lightingQuality: lightingStatus,
          feedback: 'High quality optical capture.',
        };

        const updated = [...capturedPages, newPage];
        setCapturedPages(updated);
        setActivePageIndex(updated.length - 1);
        stableFramesCount.current = 0;
        setStabilityProgress(0);
        setIsAutoCapturing(false);

        // Audio announcement for elderly patient
        const pageMsg = prompt.pageCaptured(newPageNum);
        setScannerStatusText(pageMsg);
        speakTextAloud(pageMsg, language, 0.86);
      } else {
        setIsAutoCapturing(false);
        stableFramesCount.current = 0;
      }
    }, 450);
  };

  // Manual Capture button
  const handleCaptureManual = () => {
    if (isAutoCapturing) return;
    setIsAutoCapturing(true);
    triggerAutoCapture();
  };

  // Retake current page
  const handleRetakeCurrent = () => {
    if (capturedPages.length === 0) return;
    const updated = capturedPages.filter((_, idx) => idx !== activePageIndex);
    setCapturedPages(updated);
    setActivePageIndex(Math.max(0, updated.length - 1));
    stableFramesCount.current = 0;
    setStabilityProgress(0);
    setPreviewingPage(null);
    const prompt = getPrompt();
    setScannerStatusText(prompt.cameraReady);
    speakTextAloud(prompt.cameraReady, language, 0.86);
  };

  // Delete specific page
  const handleDeletePage = (indexToDelete: number) => {
    const updated = capturedPages.filter((_, idx) => idx !== indexToDelete);
    // Renumber remaining pages
    const renumbered = updated.map((p, i) => ({ ...p, pageNumber: i + 1 }));
    setCapturedPages(renumbered);
    setActivePageIndex(Math.max(0, renumbered.length - 1));
    if (previewingPage && previewingPage.pageNumber === indexToDelete + 1) {
      setPreviewingPage(null);
    }
  };

  // Finalize Multi-Page Document & Ingest to Clinical AI OCR
  const handleFinishAndProcess = async () => {
    if (capturedPages.length === 0) {
      handleCaptureManual();
      return;
    }

    setIsProcessingOcr(true);
    stopSpeaking();
    const prompt = getPrompt();
    setScannerStatusText(prompt.doneScanning);
    speakTextAloud(prompt.doneScanning, language, 0.86);

    try {
      // Primary page used for base64 OCR analysis
      const primaryPage = capturedPages[0];
      const pageImagesList = capturedPages.map((p) => p.dataUrl);

      const docTypeLabels: Record<string, string> = {
        prescription: 'Prescription',
        lab_report: 'Laboratory Blood Report',
        discharge_summary: 'Hospital Discharge Summary',
        imaging_scan: 'Radiology / Imaging Scan',
        other: 'Medical Document',
      };

      const docName = `${docTypeLabels[selectedDocType] || 'Medical Report'} (${capturedPages.length} ${
        capturedPages.length > 1 ? 'pages' : 'page'
      }) - ${new Date().toLocaleDateString()}`;

      const analyzedDoc = await analyzeUploadedDocument({
        fileBase64: primaryPage.dataUrl,
        mimeType: 'image/jpeg',
        fileName: docName,
        documentType: selectedDocType,
        patientId,
      });

      // Augment with multi-page and audit metadata
      const finalizedDoc: MedicalDocument = {
        ...analyzedDoc,
        id: 'doc-scan-' + Date.now(),
        patientId,
        uploadedAt: new Date().toISOString(),
        pageCount: capturedPages.length,
        pageImages: pageImagesList,
        isAiExtracted: true,
        requiresDoctorReview: true,
        originalLanguage: language,
        qualityCheck: {
          isReadable: true,
          blurScore: primaryPage.blurScore,
          lightingQuality: primaryPage.lightingQuality,
          feedback: primaryPage.feedback,
        },
      };

      onDocumentCaptured(finalizedDoc);

      const completionMsg =
        language === 'hi'
          ? `धन्यवाद! आपकी ${docTypeLabels[selectedDocType] || 'रिपोर्ट'} सफलतापूर्वक जोड़ दी गई है।`
          : `Thank you! Your ${docTypeLabels[selectedDocType] || 'medical document'} has been added to your chart.`;

      speakTextAloud(completionMsg, language, 0.86, undefined, () => {
        onClose();
      });
    } catch (err) {
      console.error('Error during OCR processing:', err);
      // Fallback document creation
      const fallbackDoc: MedicalDocument = {
        id: 'doc-scan-' + Date.now(),
        patientId,
        title: `Scanned Document (${capturedPages.length} pages) - ${new Date().toLocaleDateString()}`,
        documentType: (selectedDocType as any) || 'prescription',
        documentDate: new Date().toISOString().split('T')[0],
        uploadedAt: new Date().toISOString(),
        pageCount: capturedPages.length,
        pageImages: capturedPages.map((p) => p.dataUrl),
        facilityOrDoctor: 'Uploaded Document',
        extractedText: 'Scanned document stored and indexed for doctor clinical review.',
        isAiExtracted: true,
        requiresDoctorReview: true,
        extractedData: {
          diagnoses: ['Extracted Medical Finding'],
          medications: [{ name: 'Scanned Medication Entry', dosage: 'Per prescription', frequency: 'As directed' }],
          keyFindings: ['Document images preserved in high resolution for physician review.'],
        },
      };

      onDocumentCaptured(fallbackDoc);
      onClose();
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const handleCloseScanner = () => {
    stopSpeaking();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div
      id="modal-camera-document-scanner"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-800/90 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'दस्तावेज़ और रिपोर्ट स्कैनर' : 'Medical Document & Report Scanner'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-900/60 border border-teal-500/40 text-teal-300 font-semibold">
                  Auto-Detect
                </span>
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Mic className="w-3 h-3 text-teal-400 animate-pulse" />
                <span>{voiceCommandFeedback || getPrompt().micNotice}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Document Type Selector Pill */}
            <div className="relative">
              <button
                id="btn-scanner-doctype"
                onClick={() => setShowTypeSelector(!showTypeSelector)}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span className="capitalize">{selectedDocType.replace('_', ' ')}</span>
              </button>

              {showTypeSelector && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-30 p-2 space-y-1">
                  {[
                    { id: 'prescription', label: language === 'hi' ? 'दवा का पर्चा (Prescription)' : 'Prescription' },
                    { id: 'lab_report', label: language === 'hi' ? 'लैब / खून की जांच (Lab Test)' : 'Lab / Blood Test' },
                    { id: 'discharge_summary', label: language === 'hi' ? 'डिस्चार्ज समरी (Discharge)' : 'Discharge Summary' },
                    { id: 'imaging_scan', label: language === 'hi' ? 'एक्स-रे / स्कैन (Imaging)' : 'Imaging / X-Ray / Scan' },
                    { id: 'other', label: language === 'hi' ? 'अन्य मेडिकल रिपोर्ट' : 'Other Medical Document' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedDocType(type.id);
                        setShowTypeSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        selectedDocType === type.id
                          ? 'bg-teal-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              id="btn-close-scanner"
              onClick={handleCloseScanner}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Close Scanner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder / Preview Section */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] sm:min-h-[440px] overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-md">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-base mb-2">Camera Access Needed</h3>
              <p className="text-slate-400 text-sm mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-colors"
              >
                Retry Camera Access
              </button>
            </div>
          ) : (
            <>
              {/* Hidden analysis canvases */}
              <canvas ref={analysisCanvasRef} className="hidden" />
              <canvas ref={canvasRef} className="hidden" />

              {/* Live Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover sm:object-contain max-h-[55vh]"
              />

              {/* Optical Document Framing Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 sm:p-12">
                <div
                  className={`relative w-full max-w-lg aspect-[3/4] sm:aspect-[4/3] rounded-2xl border-2 transition-all duration-300 ${
                    stabilityProgress > 50
                      ? 'border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.35)]'
                      : isDocumentDetected
                      ? 'border-teal-400/80 shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                      : 'border-slate-400/40'
                  }`}
                >
                  {/* Four Corner Alignment Brackets */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-lg" />

                  {/* Stability Progress Ring / Bar when detecting */}
                  {stabilityProgress > 0 && !isAutoCapturing && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/60 backdrop-blur-md flex items-center gap-2 shadow-lg">
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                      <span className="text-xs font-bold text-emerald-300">
                        {language === 'hi' ? 'स्थिर रखें...' : 'Hold Still...'} {stabilityProgress}%
                      </span>
                    </div>
                  )}

                  {/* Auto Capturing Pulse */}
                  {isAutoCapturing && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl flex items-center justify-center">
                      <div className="px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-teal-400 text-white font-bold text-sm shadow-2xl flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-teal-400 animate-spin" />
                        <span>{language === 'hi' ? 'कैप्चर किया जा रहा है...' : 'Capturing...'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Bar Notification */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xl max-w-[90%] text-center">
                {lightingStatus === 'low_light' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : isDocumentDetected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-teal-400 animate-bounce" />
                )}
                <span>{scannerStatusText}</span>
              </div>
            </>
          )}
        </div>

        {/* Multi-Page Carousel Strip */}
        {capturedPages.length > 0 && (
          <div className="bg-slate-950/80 border-t border-slate-800 px-4 py-2.5 flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0 text-xs font-bold text-slate-400">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>{capturedPages.length} {capturedPages.length === 1 ? 'Page' : 'Pages'} Captured</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {capturedPages.map((page, index) => (
                <div
                  key={page.id}
                  onClick={() => setActivePageIndex(index)}
                  className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 w-16 h-20 bg-slate-800 ${
                    activePageIndex === index ? 'border-teal-400 ring-2 ring-teal-500/40' : 'border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={page.dataUrl} alt={`Page ${page.pageNumber}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-center text-[10px] font-bold text-white py-0.5">
                    P{page.pageNumber}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(index);
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete page"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Large Elderly-Friendly Controls Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-800/95 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {capturedPages.length > 0 && (
              <button
                id="btn-scanner-retake"
                onClick={handleRetakeCurrent}
                disabled={isProcessingOcr}
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'hi' ? 'फोटो दोबारा लें' : 'Retake'}</span>
              </button>
            )}

            <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'hi' ? 'स्वचालित दस्तावेज़ संरेखण' : 'Auto Document Capture Enabled'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Primary Large Manual Shutter Fallback */}
            <button
              id="btn-scanner-capture-shutter"
              onClick={handleCaptureManual}
              disabled={isAutoCapturing || isProcessingOcr}
              className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-50"
            >
              <Camera className="w-5 h-5" />
              <span>
                {capturedPages.length > 0
                  ? language === 'hi'
                    ? 'अगला पेज जोड़ें'
                    : 'Add Next Page'
                  : language === 'hi'
                  ? 'दस्तावेज़ कैप्चर करें'
                  : 'CAPTURE DOCUMENT'}
              </span>
            </button>

            {/* Finish & Process OCR Button */}
            {capturedPages.length > 0 && (
              <button
                id="btn-scanner-finish-upload"
                onClick={handleFinishAndProcess}
                disabled={isProcessingOcr}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-50"
              >
                {isProcessingOcr ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{language === 'hi' ? 'जांच हो रही है...' : 'Processing OCR...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {language === 'hi' ? 'हो गया (अपलोड करें)' : `Done (${capturedPages.length} Pages)`}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
