import React from 'react';

// Hero Patient + Doctor Healthcare Interaction Illustration (Screen 1 & Screen 3)
export const HeroDoctorPatientIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-md' }) => {
  return (
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="bgBlob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Decorative organic background blobs */}
      <path
        d="M80,180 Q60,70 180,60 Q340,50 420,130 Q500,210 440,310 Q380,410 240,380 Q100,350 80,180 Z"
        fill="url(#bgBlob)"
      />

      {/* Floating Medical Cross / Plus signs */}
      <g opacity="0.6">
        <circle cx="80" cy="110" r="16" fill="#CCFBF1" />
        <path d="M80 102 V118 M72 110 H88" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
        <circle cx="430" cy="90" r="14" fill="#E0F2FE" />
        <path d="M430 83 V97 M423 90 H437" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="420" cy="320" r="12" fill="#FEF3C7" />
      </g>

      {/* Female Patient (Left) */}
      <g transform="translate(100, 110)">
        {/* Hair Back */}
        <path d="M45,30 C30,30 20,60 20,100 C20,130 35,140 45,140 C55,140 70,130 70,100 C70,60 60,30 45,30 Z" fill="#0F172A" />
        {/* Body/Shirt */}
        <path d="M15,160 C15,120 40,110 50,110 C60,110 85,120 85,160 L95,220 H5 L15,160 Z" fill="#0D9488" />
        {/* Neck */}
        <rect x="42" y="88" width="16" height="25" rx="5" fill="#FED7AA" />
        {/* Head/Face */}
        <circle cx="50" cy="65" r="32" fill="#FDBA74" />
        {/* Hair Front */}
        <path d="M22,55 C25,35 40,25 55,25 C70,25 80,38 78,55 C70,42 58,40 50,42 C40,44 30,50 22,55 Z" fill="#0F172A" />
        {/* Eye & Smile */}
        <circle cx="42" cy="65" r="2.5" fill="#0F172A" />
        <circle cx="58" cy="65" r="2.5" fill="#0F172A" />
        <path d="M44 76 Q50 82 56 76" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Smartphone in hand */}
        <rect x="68" y="130" width="24" height="42" rx="4" fill="#1E293B" />
        <rect x="71" y="133" width="18" height="34" rx="2" fill="#67E8F9" />
        {/* Hand */}
        <circle cx="70" cy="155" r="9" fill="#FDBA74" />
      </g>

      {/* Healthcare Professional / Doctor (Right) */}
      <g transform="translate(260, 80)">
        {/* Hair */}
        <path d="M60,20 C40,20 32,35 32,50 C32,55 45,45 60,45 C75,45 88,55 88,50 C88,35 80,20 60,20 Z" fill="#1E293B" />
        {/* Head */}
        <circle cx="60" cy="58" r="30" fill="#FED7AA" />
        {/* Eyes & Smile */}
        <circle cx="52" cy="56" r="2.5" fill="#0F172A" />
        <circle cx="68" cy="56" r="2.5" fill="#0F172A" />
        <path d="M54 68 Q60 74 66 68" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Neck */}
        <rect x="53" y="84" width="14" height="22" rx="4" fill="#FED7AA" />
        {/* Doctor Lab Coat */}
        <path d="M15,160 C15,115 45,105 60,105 C75,105 105,115 105,160 L115,250 H5 L15,160 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        {/* Teal Inner Shirt / Scrubs */}
        <polygon points="50,105 70,105 60,140" fill="#0D9488" />
        {/* Stethoscope */}
        <path d="M42,115 C42,150 78,150 78,115" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M60,143 V168" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="60" cy="172" r="7" fill="#0D9488" stroke="#334155" strokeWidth="3" />
        {/* Digital Tablet in Doctor Hand */}
        <rect x="18" y="170" width="46" height="62" rx="5" fill="#0F172A" transform="rotate(-10 18 170)" />
        <rect x="22" y="174" width="38" height="52" rx="3" fill="#E0F2FE" transform="rotate(-10 18 170)" />
        {/* Pulse waveform on tablet */}
        <path d="M26 198 L34 198 L38 188 L42 208 L46 195 L50 200 L56 200" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Floating Notification Badge: "Doctor verification required" */}
      <g transform="translate(240, 45)" filter="url(#softShadow)">
        <rect x="0" y="0" width="185" height="38" rx="19" fill="#0F766E" />
        <circle cx="20" cy="19" r="10" fill="#2DD4BF" />
        <path d="M16 19 L19 22 L24 16" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="38" y="23" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          Doctor review required
        </text>
      </g>

      {/* Audio Wave connecting them */}
      <g transform="translate(195, 210)">
        <circle cx="0" cy="0" r="18" fill="#FFFFFF" filter="url(#softShadow)" />
        <path d="M-6 0 C-6 -5 -2 -8 0 -8 C2 -8 6 -5 6 0 C6 5 2 8 0 8 C-2 8 -6 5 -6 0 Z" fill="#0D9488" />
        <rect x="-2" y="-4" width="4" height="8" rx="2" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

// Patient Avatar (Female)
export const PatientAvatarIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="48" fill="#E0F2FE" />
      <circle cx="50" cy="45" r="20" fill="#FDBA74" />
      {/* Hair */}
      <path d="M30,42 C30,22 40,16 50,16 C60,16 70,22 70,42 C64,28 55,26 50,27 C42,28 35,32 30,42 Z" fill="#0F172A" />
      {/* Eyes & Smile */}
      <circle cx="44" cy="43" r="2" fill="#0F172A" />
      <circle cx="56" cy="43" r="2" fill="#0F172A" />
      <path d="M46 51 Q50 55 54 51" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Clothes */}
      <path d="M22,92 C22,72 38,66 50,66 C62,66 78,72 78,92 Z" fill="#0D9488" />
    </svg>
  );
};

// Doctor Avatar (Male with Stethoscope)
export const DoctorAvatarIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="48" fill="#CCFBF1" />
      <circle cx="50" cy="44" r="20" fill="#FED7AA" />
      {/* Hair */}
      <path d="M32,36 C32,22 42,16 50,16 C58,16 68,22 68,36 C64,28 56,26 50,26 C44,26 36,28 32,36 Z" fill="#1E293B" />
      {/* Eyes & Smile */}
      <circle cx="44" cy="43" r="2" fill="#0F172A" />
      <circle cx="56" cy="43" r="2" fill="#0F172A" />
      <path d="M45 51 Q50 55 55 51" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Lab coat */}
      <path d="M22,92 C22,72 36,66 50,66 C64,66 78,72 78,92 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <polygon points="45,66 55,66 50,82" fill="#0D9488" />
      {/* Stethoscope around neck */}
      <path d="M40,68 C40,80 60,80 60,68" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="85" r="3.5" fill="#0D9488" stroke="#334155" strokeWidth="1.5" />
    </svg>
  );
};

// 404 Medical Document Search Illustration (Screen 19 / 20)
export const NotFoundIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="120" cy="120" r="100" fill="#F0F9FF" />
      {/* Medical Document Folder */}
      <rect x="60" y="60" width="100" height="120" rx="12" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
      <path d="M60 84 H160" stroke="#E0F2FE" strokeWidth="2" />
      {/* Document text lines */}
      <rect x="76" y="100" width="60" height="6" rx="3" fill="#BAE6FD" />
      <rect x="76" y="116" width="70" height="6" rx="3" fill="#BAE6FD" />
      <rect x="76" y="132" width="45" height="6" rx="3" fill="#BAE6FD" />
      {/* Magnifying Glass */}
      <circle cx="150" cy="150" r="34" fill="#FFFFFF" stroke="#0D9488" strokeWidth="6" />
      <line x1="174" y1="174" x2="204" y2="204" stroke="#0D9488" strokeWidth="8" strokeLinecap="round" />
      {/* Small medical cross inside magnifying glass */}
      <path d="M150 138 V162 M138 150 H162" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
      {/* Sparkles */}
      <circle cx="50" cy="60" r="4" fill="#0D9488" />
      <circle cx="190" cy="80" r="6" fill="#38BDF8" />
      <circle cx="80" cy="200" r="5" fill="#FBBF24" />
    </svg>
  );
};

// Success Circular Checkmark Illustration (Screen 10)
export const SuccessCheckmarkIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center border-4 border-teal-100 shadow-sm animate-pulse">
        <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center shadow-md">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
