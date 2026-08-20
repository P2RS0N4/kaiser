import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  CheckCircle2,
  Database,
  Smartphone,
  BarChart3,
  Users,
  Bell,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  X
} from 'lucide-react';

export const WorkflowAutomationModal: React.FC = () => {
  const { isWorkflowModalOpen, setWorkflowModalOpen, showToast } = useApp();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedHighRisk, setSimulatedHighRisk] = useState<boolean>(false);

  if (!isWorkflowModalOpen) return null;

  const STEPS = [
    {
      num: 1,
      title: 'Site Input (Supervisor)',
      sub: 'Power Apps / Kaiser SmartSite Mobile',
      icon: Smartphone,
      color: 'text-amber-600',
      borderColor: 'border-amber-500',
      description:
        'Supervisor mengisi Daily Report, Manpower headcount, Pre-op checklist, dan Log Hazard terus dari telefon bimbit di tapak pembinaan (<10 min).',
      detailPayload: {
        timestamp: '14:22:15 MYT',
        submitter: 'Wan Ahmad (Site Lead)',
        project: 'FPG Oleochemicals Plant (KSR-2026-FPG)',
        findingLogged: 'Scaffolding missing guardrail at Zone B Level 2',
        riskCalculated: 'High Risk (Score 16/25)',
      },
    },
    {
      num: 2,
      title: 'Database (Single Source)',
      sub: 'SharePoint / Dataverse / Cloud DB',
      icon: Database,
      color: 'text-blue-600',
      borderColor: 'border-blue-500',
      description:
        'Semua input supervisor disatukan secara automatik ke dalam structured database berpusat. Tiada lagi borang kertas berasingan atau data bertindih.',
      detailPayload: {
        tablesUpdated: ['DailyReports', 'ManpowerLog', 'HSEHazards', 'PlantInspections'],
        dataIntegrity: '100% Validated',
        schema: 'Structured JKKP/DOSH Taxonomy',
      },
    },
    {
      num: 3,
      title: 'Automation & Alert Engine',
      sub: 'Power Automate / Event Triggers',
      icon: Bell,
      color: 'text-amber-600',
      borderColor: 'border-amber-500',
      description:
        'Sistem mengimbas data secara automatik. Jika ada hazard "High Risk" atau permit tamat tempoh, sistem menghantar notifikasi segera ke WhatsApp / Email / Teams.',
      detailPayload: {
        triggerStatus: 'High Risk Detected 🚨',
        recipientsNotified: [
          'Faizal Rahman (Safety Officer)',
          'Ir. Hafizudin (Project Manager)',
          'Datuk Razak (Exec Director)',
        ],
        channel: 'Instant Push & SMS Alert (Auto Escalation)',
      },
    },
    {
      num: 4,
      title: 'Live Executive Dashboard',
      sub: 'Power BI / Kaiser SmartSite 360',
      icon: BarChart3,
      color: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      description:
        'Visualisasi masa nyata (real-time) bagi S-Curve, produktiviti sub-kontraktor, taburan hazard mengikut kategori, dan status mesin berat.',
      detailPayload: {
        sCurveUpdated: '68% Actual vs 72% Planned',
        hazardBreakdownUpdated: 'Housekeeping (12), Height (7), Chemical (5)',
        dashboardRefresh: 'Instant (Live Sync)',
      },
    },
    {
      num: 5,
      title: 'Management Decision',
      sub: 'Executive & PM Actions',
      icon: Users,
      color: 'text-purple-600',
      borderColor: 'border-purple-500',
      description:
        'Pihak pengurusan membuat keputusan berasaskan data (data-driven decisions): kelulusan OT, campur tangan subcon, pengurusan risiko, dan laporan pelanggan.',
      detailPayload: {
        actionsApproved: 'Stop Work on Bay 4 scaffold issued within 3 minutes of site logging',
        outcome: 'Zero incidents recorded. 284 Safe Days maintained.',
      },
    },
  ];

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimulatedHighRisk(true);
    setActiveStep(1);

    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step <= 5) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        showToast('Full 5-Step Workflow Simulation completed!', 'success');
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-700 font-bold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                THE WORKFLOW
              </span>
              <span className="text-xs text-slate-500">One Site Input → One Source of Truth</span>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 mt-1">
              Automated Site-to-Management Data Pipeline
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg shadow-sm border border-amber-600/30 uppercase tracking-wider active:scale-95 transition-all"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating Pipeline...' : 'Run Live Workflow Demo'}</span>
            </button>

            <button
              onClick={() => setWorkflowModalOpen(false)}
              className="text-slate-600 hover:text-slate-900 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-STEP INTERACTIVE WORKFLOW TRACK */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.num;
            const isPassed = activeStep >= step.num;

            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-500/20'
                    : isPassed
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-slate-200 bg-white opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isPassed ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.num}
                  </span>
                  <Icon className={`w-4 h-4 ${step.color}`} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{step.title}</h4>
                  <span className="text-[10px] text-slate-500 block line-clamp-1">{step.sub}</span>
                </div>

                {isSelected && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45" />
                )}
              </button>
            );
          })}
        </div>

        {/* STEP DETAIL PAYLOAD CARD */}
        {(() => {
          const currentStepObj = STEPS.find((s) => s.num === activeStep) || STEPS[0];
          const StepIcon = currentStepObj.icon;

          return (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    <StepIcon className={`w-5 h-5 ${currentStepObj.color}`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                      STAGE 0{currentStepObj.num} / 05 • ARCHITECTURE FLOW
                    </span>
                    <h3 className="text-base font-heading font-black text-slate-900">
                      {currentStepObj.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 bg-white text-slate-700 border border-slate-200 font-mono font-bold rounded-lg shadow-2xs">
                  {currentStepObj.sub}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {currentStepObj.description}
              </p>

              {/* Live JSON telemetry */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-100 pb-1 mb-2">
                  <span className="font-bold uppercase tracking-wider">TELEMETRY PAYLOAD STREAM</span>
                  <span className="text-emerald-700 font-bold">STATE: ACTIVE</span>
                </div>
                {Object.entries(currentStepObj.detailPayload).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <span className="text-slate-500 font-bold">{k}:</span>
                    <span className="text-slate-900 font-medium">
                      {Array.isArray(v) ? v.join(', ') : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
          <span>
            Concept: <strong className="text-slate-800">"Bukan sekadar tukar borang kepada digital — tetapi menjadikan data site sebagai management intelligence."</strong>
          </span>
          <span className="text-slate-700 font-mono font-bold">Kaiser SmartSite 360 Engine</span>
        </div>

      </div>
    </div>
  );
};
