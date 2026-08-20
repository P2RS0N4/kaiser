import React from 'react';
import { useApp } from '../context/AppContext';
import { SiteInputPortal } from './SiteInputPortal';
import { X } from 'lucide-react';

export const SiteSubmissionModal: React.FC = () => {
  const { isSiteSubmissionModalOpen, setSiteSubmissionModalOpen } = useApp();

  if (!isSiteSubmissionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <div className="relative max-w-4xl w-full bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Modal Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div>
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
              QUICK SITE INPUT MODAL • SITE INPUT
            </span>
            <h3 className="text-base font-heading font-black text-slate-900">
              Kaiser Mobile Site Input Center
            </h3>
          </div>

          <button
            onClick={() => setSiteSubmissionModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-slate-50">
          <SiteInputPortal />
        </div>
      </div>
    </div>
  );
};
