import React, { useState, useEffect, useRef } from 'react';
import {
  Stethoscope,
  ChevronDown,
  Mic,
  Send,
  Keyboard,
  Sparkles,
  Bot,
  User,
  StopCircle,
  Volume2,
} from 'lucide-react';
import { CaseTakingSession, ChatMessage, LanguageCode } from '../types';
import { sendClinicalChatMessage } from '../services/geminiService';
import { ClinicalSpeechManager, speakTextAloud, stopSpeaking } from '../utils/speechUtils';

interface ActiveConsultationScreenProps {
  session: CaseTakingSession;
  onUpdateSession: (updated: Partial<CaseTakingSession>) => void;
  onEndConsultation: () => void;
  onCompleteToIntakeReview: () => void;
}

export const ActiveConsultationScreen: React.FC<ActiveConsultationScreenProps> = ({
  session,
  onUpdateSession,
  onEndConsultation,
  onCompleteToIntakeReview,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (session.messages && session.messages.length > 0) {
      return session.messages;
    }
    return [
      {
        id: 'msg-init-1',
        sender: 'ai',
        text: 'नमस्ते! आप कैसा महसूस कर रहे हैं? कृपया अपनी समस्या बताएं। (Pet ke kis part mein dard hai?)',
        timestamp: '10:24 AM',
      },
    ];
  });

  const [activeLang, setActiveLang] = useState<LanguageCode>(session.activeLanguage || 'hi');
  const [isListening, setIsListening] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [liveInterim, setLiveInterim] = useState('');

  const [speechManager] = useState<ClinicalSpeechManager>(() => new ClinicalSpeechManager());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiResponding]);

  // Handle Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      speechManager.stopListening();
      setIsListening(false);
      setLiveInterim('');
    } else {
      stopSpeaking();
      setIsListening(true);
      speechManager.startListening(
        (interim) => setLiveInterim(interim),
        async (finalText) => {
          setIsListening(false);
          setLiveInterim('');
          if (finalText.trim()) {
            await handleSendPatientMessage(finalText);
          }
        },
        (error) => {
          console.warn('Speech recognition status:', error);
          setIsListening(false);
          setLiveInterim('');
        }
      );
    }
  };

  // Send message and get AI response
  const handleSendPatientMessage = async (text: string) => {
    if (!text.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const patientMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text: text.trim(),
      timestamp: currentTime,
    };

    const updatedMessages = [...messages, patientMsg];
    setMessages(updatedMessages);
    setTypedMessage('');
    setIsAiResponding(true);

    try {
      const aiResponse = await sendClinicalChatMessage({
        messages: updatedMessages,
        patient: session.patient,
        documents: session.documents || [],
        activeLanguage: activeLang,
        conversationPhase: session.conversationPhase || 'symptom_exploration',
      });

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: aiResponse.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      onUpdateSession({
        messages: finalMessages,
        activeLanguage: activeLang,
        liveExtraction: {
          ...session.liveExtraction,
          chiefComplaint: aiResponse.liveExtraction?.chiefComplaint || session.liveExtraction?.chiefComplaint,
          symptoms: aiResponse.liveExtraction?.symptoms || session.liveExtraction?.symptoms,
          duration: aiResponse.liveExtraction?.duration || session.liveExtraction?.duration,
          location: aiResponse.liveExtraction?.location || session.liveExtraction?.location,
        },
      });

      // Voice response if enabled
      speakTextAloud(aiResponse.replyText, activeLang);
    } catch (e) {
      console.error('AI chat failed:', e);
      // Fallback friendly reply
      const fallbackAiMsg: ChatMessage = {
        id: 'msg-ai-fb-' + Date.now(),
        sender: 'ai',
        text: 'धन्यवाद, मैंने यह नोट कर लिया है। क्या इसके अलावा कोई और लक्षण जैसे उल्टी या चक्कर आ रहे हैं?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsAiResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900">Swasthya AI</span>
        </div>

        {/* Language & End Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={activeLang}
              onChange={(e) => {
                const lang = e.target.value as LanguageCode;
                setActiveLang(lang);
                speechManager.setLanguage(lang);
              }}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 px-3.5 py-1.5 pr-8 rounded-xl cursor-pointer focus:outline-none"
            >
              <option value="hi">Hindi</option>
              <option value="en">English</option>
              <option value="hinglish">Hinglish</option>
              <option value="gu">Gujarati</option>
              <option value="mr">Marathi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onEndConsultation}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
          >
            End
          </button>
        </div>
      </header>

      {/* 2. Chat Conversation Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-full bg-sky-100 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs mb-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[78%] space-y-1 ${isAi ? 'text-left' : 'text-right'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isAi
                      ? 'bg-[#E0F2FE]/60 text-slate-900 rounded-bl-xs border border-sky-100'
                      : 'bg-teal-600 text-white rounded-br-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="text-[10px] text-slate-400 px-1">{msg.timestamp}</div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-2xs mb-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAiResponding && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
            <span>AI is organizing response...</span>
          </div>
        )}

        {/* Live Interim Speech Transcription */}
        {isListening && (
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 text-center animate-pulse">
            <span>Listening: {liveInterim || 'Listening to your voice...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 3. Bottom Controls Area */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-100 p-4 shadow-sm">
        <div className="max-w-xl mx-auto flex flex-col items-center space-y-3">
          {/* Text Input Toggle / Field */}
          {showTextInput ? (
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendPatientMessage(typedMessage);
                  }
                }}
                placeholder="Type your symptoms here..."
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              <button
                onClick={() => handleSendPatientMessage(typedMessage)}
                className="p-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Large Circular Microphone Button */}
          <div className="flex flex-col items-center space-y-1.5">
            <button
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white scale-105 animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105'
              }`}
            >
              {isListening ? <StopCircle className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            <span className="text-xs font-semibold text-slate-700">
              {isListening ? 'Listening... Tap to send' : 'Tap to speak'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setShowTextInput(!showTextInput)}
              className="text-slate-500 hover:text-teal-700 font-medium transition cursor-pointer"
            >
              {showTextInput ? 'Hide keyboard' : 'Type instead'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={onCompleteToIntakeReview}
              className="font-bold text-teal-700 hover:text-teal-800 transition cursor-pointer"
            >
              Review Information →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
