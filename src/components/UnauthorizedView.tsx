import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface UnauthorizedViewProps {
  userRole?: UserRole;
  requiredRole?: UserRole;
  onGoBack: () => void;
  onLogout: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  userRole,
  requiredRole,
  onGoBack,
  onLogout,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your current account role (<strong className="uppercase text-slate-800">{userRole || 'Guest'}</strong>) is not authorized to access clinical physician or administrative records.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Healthcare Data Protection Rule (DISHA/HIPAA):</span>
          </div>
          <p className="text-[11px]">
            Patient records are isolated to authorized consulting physicians and the verified patient.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onGoBack}
            className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
