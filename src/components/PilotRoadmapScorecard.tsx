import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flag,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Clock,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { PILOT_KPIS, ROADMAP_PHASES } from '../data/initialData';

export const PilotRoadmapScorecard: React.FC = () => {
  const { currentProject, setWorkflowModalOpen, setActiveTab } = useApp();

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              IMPLEMENTATION ROADMAP & PILOT SCORECARD
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Kaiser Engineering Digital Transformation
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            "FROM CONTRACTOR → DATA-DRIVEN CONTRACTOR" • Kaiser SmartSite 360 Pilot Rollout
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setWorkflowModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 border border-amber-600/30 rounded-lg shadow-sm uppercase tracking-wider transition-all"
          >
            <Zap className="w-4 h-4 text-slate-900" />
            <span>Interactive 5-Step Workflow</span>
          </button>
        </div>
      </div>

      {/* PILOT SUCCESS METRICS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold tracking-wider block">
              PILOT SUCCESS METRICS • {currentProject.code}
            </span>
            <h3 className="text-base font-heading font-bold text-slate-900">
              Executive Pilot Project KPI Performance
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono font-bold">
            Status: Meeting All Target Thresholds (100%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {PILOT_KPIS.map((kpi) => {
            const isPassing = kpi.status === 'PASS';

            return (
              <div
                key={kpi.metric}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{kpi.category}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {kpi.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{kpi.metric}</h4>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xl font-heading font-black text-slate-900">{kpi.current}</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Target: {kpi.target}</span>
                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPassing
                          ? 'bg-emerald-600'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, (parseFloat(kpi.current) / parseFloat(kpi.target.replace('>', ''))) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-PHASE IMPLEMENTATION ROADMAP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-heading font-bold text-slate-900">
              4-Phase Implementation Roadmap
            </h3>
            <p className="text-xs text-slate-500">Structured execution from single-site pilot to full corporate digital transformation.</p>
          </div>
          <span className="text-xs font-bold font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Phase 1 Active (Current)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_PHASES.map((phase) => {
            const isCurrent = phase.status === 'In Progress';
            const isCompleted = phase.status === 'Completed';

            return (
              <div
                key={phase.phase}
                className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow ${
                  isCurrent
                    ? 'border-l-4 border-l-amber-500 border-slate-200'
                    : isCompleted
                    ? 'border-l-4 border-l-emerald-600 border-slate-200'
                    : 'border-slate-200 opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-700 font-bold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                      {phase.phase}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        isCurrent
                          ? 'bg-amber-100 text-amber-800'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {phase.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-heading font-bold text-slate-900">{phase.title}</h4>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold block mt-0.5">{phase.duration}</span>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    {phase.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  {phase.focus}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY PILOT FIRST? */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Target className="w-5 h-5" />
            <h4 className="text-sm font-heading font-bold text-slate-900">1. Buktikan Nilai Cepat</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Management & site team terus nampak hasil sebenar dalam masa 2 minggu pertama tanpa gangguan operasi besar.
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Zap className="w-5 h-5" />
            <h4 className="text-sm font-heading font-bold text-slate-900">2. Belajar & Sempurnakan</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Kenalpasti cabaran di tapak (field habit, internet latency, subcon compliance) sebelum rollout ke semua projek Kaiser.
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Award className="w-5 h-5" />
            <h4 className="text-sm font-heading font-bold text-slate-900">3. Minimum Risk & Cost</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Fokus pada 1 projek (FPG Oleochemicals) untuk memastikan ketepatan data dan kepuasan pasukan pengurusan.
          </p>
        </div>
      </div>

    </div>
  );
};
