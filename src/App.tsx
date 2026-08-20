import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { SiteInputPortal } from './components/SiteInputPortal';
import { HseHazardCenter } from './components/HseHazardCenter';
import { ProjectManpowerControl } from './components/ProjectManpowerControl';
import { EquipmentRegister } from './components/EquipmentRegister';
import { SafetyDocCenter } from './components/SafetyDocCenter';
import { KaiserAiAdvisor } from './components/KaiserAiAdvisor';
import { PilotRoadmapScorecard } from './components/PilotRoadmapScorecard';
import { WorkflowAutomationModal } from './components/WorkflowAutomationModal';
import { SiteSubmissionModal } from './components/SiteSubmissionModal';
import { Sparkles, AlertTriangle, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    toastMessage,
    setSiteSubmissionModalOpen,
    setActiveSubmissionSubTab,
    setActiveTab
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-900">
      {/* Background Blueprint Grid Pattern */}
      <div className="fixed inset-0 bg-blueprint-grid pointer-events-none opacity-60" />

      {/* Main Top Header */}
      <Header />

      {/* Secondary Sticky Navigation Bar */}
      <Navigation />

      {/* Main Workspace Container */}
      <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        {activeTab === 'dashboard' && <ExecutiveDashboard />}
        {activeTab === 'site-input' && <SiteInputPortal />}
        {activeTab === 'hse-hazards' && <HseHazardCenter />}
        {activeTab === 'progress-manpower' && <ProjectManpowerControl />}
        {activeTab === 'equipment' && <EquipmentRegister />}
        {activeTab === 'documents' && <SafetyDocCenter />}
        {activeTab === 'ai-advisor' && <KaiserAiAdvisor />}
        {activeTab === 'pilot-roadmap' && <PilotRoadmapScorecard />}
      </main>

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 bg-white ${
              toastMessage.type === 'success'
                ? 'border-emerald-500 text-emerald-800'
                : toastMessage.type === 'alert'
                ? 'border-rose-500 text-rose-800'
                : 'border-blue-500 text-blue-800'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : toastMessage.type === 'alert' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span className="text-xs font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Quick Action Floating Bar */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2">
        <button
          onClick={() => {
            setActiveSubmissionSubTab('hazard');
            setSiteSubmissionModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg text-xs shadow-md border border-amber-600/30 active:scale-95 transition-all uppercase tracking-wider"
        >
          <AlertTriangle className="w-4 h-4 text-slate-900" />
          <span>Quick Hazard Log</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-advisor')}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-md border border-slate-700 active:scale-95 transition-all uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ask Kaiser AI</span>
        </button>
      </div>

      {/* Modals */}
      <WorkflowAutomationModal />
      <SiteSubmissionModal />

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 z-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-[10px]">K</div>
            <span className="font-heading font-bold tracking-wider text-slate-800">KAISER ENGINEERING SDN. BHD.</span>
            <span>•</span>
            <span className="text-slate-500">SmartSite 360 v2.4</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            From Contractor → Data-Driven Contractor • FPG Oleochemicals Pilot Project
          </span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
