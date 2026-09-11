import React, { useState, useEffect } from 'react';
import { Mic, Activity, Sparkles, Volume2 } from 'lucide-react';
import doctorAvatarImage from '../assets/images/doctor_3d_avatar_1788689939461.jpg';

interface ThreeDHoloDoctorHeroProps {
  onMicClick?: () => void;
  className?: string;
}

export const ThreeDHoloDoctorHero: React.FC<ThreeDHoloDoctorHeroProps> = ({
  onMicClick,
  className = '',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax mouse follow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-lg mx-auto h-[480px] sm:h-[540px] flex items-center justify-center select-none ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* 1. Volumetric Ambient Backlight Glow */}
      <div
        className="absolute w-72 h-72 rounded-full bg-cyan-400/25 blur-3xl pointer-events-none transition-transform duration-700 ease-out -z-10"
        style={{
          transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`,
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none transition-transform duration-700 ease-out -z-10"
        style={{
          transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
        }}
      />

      {/* 2. Floating Multilingual 3D Language Speech Bubbles around head */}
      <div
        className="absolute top-4 left-6 z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
        }}
      >
        <div className="px-3 py-1 rounded-full bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 animate-bounce duration-1000 border border-blue-400/50">
          हिंदी
        </div>
      </div>

      <div
        className="absolute top-12 right-10 z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * -0.9}px, ${mousePos.y * -0.9}px)`,
        }}
      >
        <div className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 border border-emerald-400/50 animate-pulse">
          தமிழ்
        </div>
      </div>

      <div
        className="absolute top-28 right-4 z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * -1.2}px, ${mousePos.y * -1.2}px)`,
        }}
      >
        <div className="px-3 py-1 rounded-full bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 border border-purple-400/50">
          తెలుగు
        </div>
      </div>

      <div
        className="absolute top-36 right-0 z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)`,
        }}
      >
        <div className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-500/30 border border-amber-400/50">
          বাংলা
        </div>
      </div>

      <div
        className="absolute top-24 left-2 z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * 1.1}px, ${mousePos.y * 1.1}px)`,
        }}
      >
        <div className="px-2.5 py-1 rounded-full bg-cyan-500 text-white font-extrabold text-[11px] shadow-lg shadow-cyan-500/30 border border-cyan-300/50">
          •••
        </div>
      </div>

      {/* 3. Central 3D Doctor Character Avatar */}
      <div
        className="relative z-10 w-64 h-80 sm:w-72 sm:h-92 flex items-center justify-center transition-transform duration-500 ease-out animate-float-gentle"
        style={{
          transform: `rotateY(${mousePos.x * 0.6}deg) rotateX(${-mousePos.y * 0.6}deg) translateZ(20px)`,
        }}
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/15 border-2 border-white/60 bg-gradient-to-b from-blue-50/50 to-white/90">
          <img
            src={doctorAvatarImage}
            alt="3D AI Clinical Doctor"
            className="w-full h-full object-cover object-top scale-105"
            onError={(e) => {
              // Fallback to stylized SVG doctor if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Subtle clinical gradient reflection on doctor */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/15 via-transparent to-white/20 pointer-events-none" />
        </div>
      </div>

      {/* 4. Floating Holographic Speech Bubble */}
      <div
        className="absolute bottom-28 right-0 sm:-right-4 z-30 transition-transform duration-300 ease-out cursor-pointer group"
        style={{
          transform: `translate(${mousePos.x * -0.7}px, ${mousePos.y * -0.7}px)`,
        }}
        onClick={onMicClick}
      >
        <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white shadow-xl shadow-cyan-500/30 border border-cyan-300/40 flex flex-col gap-1.5 backdrop-blur-md group-hover:scale-105 transition-transform">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-tight">Hello! How can I help you today?</span>
          </div>
          {/* Live Audio Equalizer Waveform */}
          <div className="flex items-center gap-1 h-3 self-start">
            <span className="w-1 bg-white rounded-full animate-wave-bar-1" />
            <span className="w-1 bg-white rounded-full animate-wave-bar-2" />
            <span className="w-1 bg-white rounded-full animate-wave-bar-3" />
            <span className="w-1 bg-white rounded-full animate-wave-bar-4" />
            <span className="w-1 bg-white rounded-full animate-wave-bar-5" />
            <span className="w-1 bg-white rounded-full animate-wave-bar-2" />
            <span className="w-1 bg-white rounded-full animate-wave-bar-3" />
            <span className="w-1 bg-white rounded-full animate-wave-bar-1" />
          </div>
        </div>
      </div>

      {/* 5. Glowing 3D Holographic Dais / Pedestal */}
      <div
        className="absolute bottom-2 z-20 w-80 h-44 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-auto cursor-pointer"
        onClick={onMicClick}
        style={{
          transform: `rotateY(${mousePos.x * 0.4}deg) translateZ(40px)`,
        }}
      >
        {/* Holographic Base Rings (Perspectival Oval) */}
        <div className="relative w-72 h-28 flex items-center justify-center">
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-[100%] border-4 border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-spin-slow" />
          {/* Middle holographic dashed ring */}
          <div className="absolute inset-3 rounded-[100%] border-2 border-dashed border-cyan-300/80 animate-spin-reverse-slow" />
          {/* Inner solid ring */}
          <div className="absolute inset-6 rounded-[100%] border-2 border-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.9)] bg-gradient-to-b from-cyan-400/30 to-blue-600/30 backdrop-blur-xs" />

          {/* Vertical Cyan Holographic Beam of Light */}
          <div className="absolute -top-16 w-36 h-28 bg-gradient-to-t from-cyan-400/40 via-cyan-300/20 to-transparent blur-md rounded-t-full pointer-events-none" />

          {/* Central Glowing 3D Holographic Microphone Sphere */}
          <div className="relative z-30 w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-0.5 shadow-[0_0_35px_rgba(6,182,212,0.9)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 group">
            <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/60">
              <Mic className="w-8 h-8 text-white stroke-[2.5] drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] group-hover:scale-110 transition-transform" />
            </div>
            {/* Pulsing Aura Rings */}
            <div className="absolute -inset-2 rounded-full border border-cyan-300/60 animate-ping pointer-events-none opacity-60" />
          </div>
        </div>
      </div>

      {/* 6. Medical Clinic Desk Tablet on Bottom Left */}
      <div
        className="absolute bottom-6 left-0 sm:-left-6 z-25 transition-transform duration-300 ease-out hidden sm:block"
        style={{
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
        }}
      >
        <div className="w-32 p-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-blue-100 shadow-xl shadow-blue-500/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
            <span className="flex items-center gap-1 text-teal-600">
              <Activity className="w-3 h-3 text-teal-500 animate-pulse" />
              <span>Vitals</span>
            </span>
            <span className="text-[9px] text-slate-400">72 bpm</span>
          </div>
          {/* Animated Heartbeat Line */}
          <svg viewBox="0 0 100 24" className="w-full h-5 stroke-teal-500 fill-none stroke-2">
            <path
              d="M0 12 H30 L35 4 L42 20 L48 8 L54 16 L58 12 H100"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
