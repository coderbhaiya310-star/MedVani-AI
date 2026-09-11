import React, { useState, useEffect } from 'react';
import { Mic, Brain } from 'lucide-react';

interface HologramVisualizationProps {
  isVoiceActive?: boolean;
}

export const HologramVisualization: React.FC<HologramVisualizationProps> = ({
  isVoiceActive = true,
}) => {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 12);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const waveformHeights = [6, 14, 24, 12, 30, 20, 10, 26, 34, 18, 22, 12, 28, 16, 8];

  return (
    <div className="relative w-full flex items-center justify-between select-none py-2">
      {/* 1. LEFT: Angled 3D Glass Microphone Terminal with Stand */}
      <div className="relative shrink-0 flex flex-col items-center group">
        {/* Floating Angled Glass Screen */}
        <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0a1628]/90 to-slate-950/90 backdrop-blur-xl border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(34,211,238,0.2)] flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
          {/* Glass Highlight Line */}
          <div className="absolute inset-x-2 top-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
          
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-500/30 to-cyan-500/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 animate-pulse" />
          </div>

          {/* Active Ping Indicator */}
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-2 ring-slate-950" />
          </span>
        </div>

        {/* Small 3D Stand Under the Glass Tablet */}
        <div className="w-10 h-2 bg-gradient-to-b from-cyan-400/60 to-slate-900 rounded-b-md shadow-md border-x border-b border-cyan-400/40 -mt-0.5" />
        <div className="w-14 h-1.5 bg-slate-950 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
      </div>

      {/* 2. CENTER-LEFT: Pulsating Audio Waveform (Connecting Mic to Brain) */}
      <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 h-12">
        {waveformHeights.map((baseH, i) => {
          const dynamicMultiplier = ((pulseIndex + i) % 6) + 1.5;
          const currentHeight = isVoiceActive
            ? Math.max(5, Math.min(36, (baseH * dynamicMultiplier) / 4))
            : 4;

          return (
            <div
              key={i}
              className="w-0.5 sm:w-1 rounded-full bg-gradient-to-t from-teal-500 via-cyan-400 to-cyan-200 transition-all duration-200 shadow-[0_0_8px_rgba(34,211,238,0.7)]"
              style={{
                height: `${currentHeight}px`,
              }}
            />
          );
        })}
      </div>

      {/* 3. CENTER: 3D Holographic Pedestal & Brain Sphere */}
      <div className="relative shrink-0 flex flex-col items-center justify-end h-44 sm:h-48">
        {/* Hologram Light Cone Glow */}
        <div className="absolute bottom-10 w-28 h-32 bg-gradient-to-t from-cyan-400/30 via-teal-400/15 to-transparent pointer-events-none [clip-path:polygon(30%_0%,70%_0%,100%_100%,0%_100%)] blur-xs" />

        {/* Floating Glowing Crystal Sphere with Brain */}
        <div className="relative mb-2 group cursor-pointer">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-teal-950/60 via-slate-900/60 to-cyan-900/40 backdrop-blur-md border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.6),inset_0_0_20px_rgba(45,212,191,0.4)] flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-300">
            
            {/* Hologram Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent w-full h-6 animate-scanline pointer-events-none" />

            {/* Glowing Brain Inside */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md animate-pulse" />
                <Brain className="w-12 h-12 sm:w-14 sm:h-14 text-cyan-200 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.9)] relative z-10 transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Holographic Synapse Dots */}
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_8px_#2dd4bf] animate-ping" />
              <div className="absolute bottom-0 -left-1 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Orbiting dashed ring inside */}
            <div className="absolute inset-1.5 rounded-full border border-teal-400/30 border-dashed animate-spin-slow pointer-events-none" />
          </div>
        </div>

        {/* 3D Tiered Pedestal Base */}
        <div className="relative w-40 sm:w-48 h-10 flex items-center justify-center">
          {/* Top glowing platform ring */}
          <div className="absolute top-0 w-28 sm:w-32 h-6 rounded-full bg-gradient-to-b from-cyan-400/50 via-teal-900/70 to-slate-950 border-2 border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.8)] flex items-center justify-center">
            <div className="w-16 h-3 rounded-full bg-cyan-300/50 blur-xs" />
          </div>

          {/* Middle tier */}
          <div className="absolute top-2 w-34 sm:w-40 h-6 rounded-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-teal-500/40 shadow-lg flex items-center justify-center">
            <div className="w-32 h-4 rounded-full border border-cyan-400/40 border-dashed animate-spin-slow pointer-events-none" />
          </div>

          {/* Bottom foundation base ring */}
          <div className="absolute top-4 w-40 sm:w-48 h-6 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-teal-500/50 shadow-[0_10px_25px_rgba(0,0,0,0.9),0_0_15px_rgba(20,184,166,0.3)]">
            <div className="absolute inset-x-4 top-0.5 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
};

