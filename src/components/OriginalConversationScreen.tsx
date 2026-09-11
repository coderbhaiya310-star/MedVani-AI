import React from 'react';
import { Stethoscope, ArrowLeft, Bot, User, Clock, FileText, Download } from 'lucide-react';
import { ChatMessage } from '../types';

interface OriginalConversationScreenProps {
  patientName?: string;
  messages?: ChatMessage[];
  onBack: () => void;
}

export const OriginalConversationScreen: React.FC<OriginalConversationScreenProps> = ({
  patientName = 'Priya Sharma (28y, Female)',
  messages,
  onBack,
}) => {
  const sampleTranscript: ChatMessage[] = [
    {
      id: 'm-1',
      sender: 'ai',
      text: 'नमस्ते! मैं स्वास्थ्या एआई हूँ। कृपया बताइए कि आपको क्या परेशानी हो रही है?',
      timestamp: '11:28 AM',
    },
    {
      id: 'm-2',
      sender: 'patient',
      text: 'मुझे पेट में बहुत तेज़ दर्द हो रहा है।',
      timestamp: '11:28 AM',
    },
    {
      id: 'm-3',
      sender: 'ai',
      text: 'पेट के किस हिस्से में दर्द हो रहा है? और क्या यह दर्द कहीं और भी फैल रहा है?',
      timestamp: '11:29 AM',
    },
    {
      id: 'm-4',
      sender: 'patient',
      text: 'नाभि के ठीक बीच में हो रहा है, एकदम सेंटर में।',
      timestamp: '11:29 AM',
    },
    {
      id: 'm-5',
      sender: 'ai',
      text: 'यह दर्द कब से शुरू हुआ है? क्या उल्टी, जी मिचलाना या बुखार जैसी कोई और समस्या है?',
      timestamp: '11:30 AM',
    },
    {
      id: 'm-6',
      sender: 'patient',
      text: 'कल सुबह से है। हल्का जी मिचला रहा है पर उल्टी या बुखार नहीं है।',
      timestamp: '11:30 AM',
    },
    {
      id: 'm-7',
      sender: 'ai',
      text: 'क्या आपने इसके लिए कोई दवा ली है?',
      timestamp: '11:31 AM',
    },
    {
      id: 'm-8',
      sender: 'patient',
      text: 'हाँ, रात को एक पैरासिटामोल ली थी, थोड़ी देर आराम मिला फिर दर्द बढ़ गया।',
      timestamp: '11:31 AM',
    },
  ];

  const transcript = messages && messages.length > 0 ? messages : sampleTranscript;

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

      {/* Main Transcript Content */}
      <main className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6 flex-1 text-left">
        {/* Patient Case Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Original Voice Intake Transcript
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified audio transcription and patient-AI dialogue for {patientName}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Transcript</span>
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          {transcript.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAi
                    ? 'bg-[#F0F7FF] border-sky-100 mr-8'
                    : 'bg-teal-50/50 border-teal-100 ml-8'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isAi ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold text-[11px]">
                        <Bot className="w-3 h-3" />
                        <span>Swasthya AI Assistant</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold text-[11px]">
                        <User className="w-3 h-3" />
                        <span>Patient Response</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-normal pl-1">
                  {msg.text}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
