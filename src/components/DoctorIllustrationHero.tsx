import React, { useState } from 'react';
import doctorHeroImg from '../assets/images/swasthya_doctor_hero_1789113702806.jpg';

interface DoctorIllustrationProps {
  className?: string;
  onClick?: () => void;
}

export const DoctorIllustrationHero: React.FC<DoctorIllustrationProps> = ({
  className = 'w-full max-w-lg h-auto',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none transition-all duration-300 ${className}`}
    >
      {!imgError ? (
        <div className="relative w-full group rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(37,99,235,0.08)] border border-blue-100/70 bg-gradient-to-b from-blue-50/50 to-white">
          <img
            src={doctorHeroImg}
            alt="Swasthya AI Doctor Voice Healthcare"
            onError={() => setImgError(true)}
            className="w-full h-auto object-cover rounded-3xl transition-transform duration-500 group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle hover overlay hint */}
          <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300 pointer-events-none rounded-3xl" />
        </div>
      ) : (
        /* Vector Fallback without any pigtails */
        <svg
          viewBox="0 0 520 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-xs"
        >
          <defs>
            <radialGradient id="fallbackGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D9ECFE" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#E6F2FE" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EFF6FE" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fallbackMicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="fallbackScrubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <filter id="fallbackShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1E3A8A" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Ambient Glow */}
          <ellipse cx="260" cy="220" rx="230" ry="190" fill="url(#fallbackGlow)" />

          {/* Leaves */}
          <g opacity="0.75">
            <path d="M110 240 C95 190 135 150 165 170 C155 210 130 235 110 240 Z" fill="#BFDBFE" />
            <path d="M90 280 C80 230 115 200 145 220 C135 255 110 275 90 280 Z" fill="#93C5FD" />
          </g>

          {/* Crosses */}
          <path d="M125 125 H135 V115 H145 V125 H155 V135 H145 V145 H135 V135 H125 Z" fill="#93C5FD" opacity="0.6" />
          <path d="M430 160 H438 V152 H446 V160 H454 V168 H446 V176 H438 V168 H430 Z" fill="#93C5FD" opacity="0.6" />

          {/* Speech Bubble with Sound Wave */}
          <g filter="url(#fallbackShadow)">
            <rect x="330" y="90" width="120" height="70" rx="20" fill="#DCEBFA" />
            <polygon points="350,160 365,160 345,176" fill="#DCEBFA" />
            {/* Equalizer bars */}
            <rect x="345" y="116" width="3" height="18" rx="1.5" fill="#2563EB" />
            <circle cx="355" cy="125" r="2.5" fill="#2563EB" />
            <rect x="363" y="112" width="3" height="26" rx="1.5" fill="#2563EB" />
            <line x1="375" y1="125" x2="400" y2="125" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Sound wave arcs around mic */}
          <path d="M428 140 C436 150 436 166 428 176" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M438 132 C450 148 450 170 438 184" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M366 182 C356 194 356 210 366 220" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Circular Microphone button */}
          <g filter="url(#fallbackShadow)">
            <circle cx="400" cy="160" r="30" fill="url(#fallbackMicGrad)" />
            {/* Mic icon */}
            <rect x="395" y="148" width="10" height="15" rx="5" fill="#FFFFFF" />
            <path d="M391 157 C391 165 409 165 409 157" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="400" y1="165" x2="400" y2="173" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="394" y1="173" x2="406" y2="173" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Doctor Body */}
          {/* Hair behind */}
          <path d="M190 140 C175 160 170 210 175 250 C185 240 195 230 205 220 Z" fill="#0F172A" />
          <path d="M260 140 C275 160 280 210 275 250 C265 240 255 230 245 220 Z" fill="#0F172A" />

          {/* White Coat */}
          <path d="M160 380 C160 290 185 245 210 238 L240 238 C265 245 290 290 290 380 Z" fill="#FFFFFF" filter="url(#fallbackShadow)" />
          {/* Inner Scrub */}
          <polygon points="212,238 238,238 225,275" fill="url(#fallbackScrubGrad)" />
          {/* Lapels */}
          <path d="M205 238 L220 290 L205 380" stroke="#CBD5E1" strokeWidth="2" fill="#FFFFFF" />
          <path d="M245 238 L230 290 L245 380" stroke="#CBD5E1" strokeWidth="2" fill="#FFFFFF" />

          {/* Stethoscope */}
          <path d="M208 245 C208 280 220 300 238 290" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="238" cy="290" r="5" fill="#64748B" />

          {/* Neck & Head */}
          <rect x="216" y="215" width="18" height="26" rx="4" fill="#FEE3D0" />
          <ellipse cx="225" cy="185" rx="32" ry="36" fill="#FEE3D0" />

          {/* Hair Front */}
          <path d="M194 185 C194 150 210 142 225 142 C245 142 258 152 258 185 C248 175 235 172 225 174 C212 176 202 182 194 185 Z" fill="#0F172A" />

          {/* Face details */}
          <ellipse cx="216" cy="182" rx="3" ry="4.5" fill="#0F172A" />
          <ellipse cx="234" cy="182" rx="3" ry="4.5" fill="#0F172A" />
          <circle cx="217" cy="180.5" r="1" fill="#FFFFFF" />
          <circle cx="235" cy="180.5" r="1" fill="#FFFFFF" />
          <path d="M212 174 C215 171 219 171 221 174" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M230 174 C233 171 237 171 239 174" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M221 192 C223 195 227 195 229 192" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Left Arm gesturing to Mic */}
          <path d="M270 270 C290 265 315 240 335 220" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />
          <path d="M270 270 C290 265 315 240 335 220" stroke="#E2E8F0" strokeWidth="2" fill="none" />
          <circle cx="338" cy="216" r="7" fill="#FEE3D0" />

          {/* Right Arm holding Clipboard */}
          <rect x="180" y="280" width="34" height="46" rx="4" fill="#1E293B" filter="url(#fallbackShadow)" />
          <rect x="184" y="286" width="26" height="36" rx="2" fill="#FFFFFF" />
          <rect x="188" y="292" width="18" height="2" fill="#93C5FD" />
          <rect x="188" y="297" width="14" height="2" fill="#CBD5E1" />
          <rect x="188" y="302" width="16" height="2" fill="#CBD5E1" />
          <circle cx="192" cy="316" r="6" fill="#FEE3D0" />
        </svg>
      )}
    </div>
  );
};
