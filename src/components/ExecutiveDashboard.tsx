import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Calendar,
  CloudSun,
  Eye,
  ChevronRight,
  Send,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { S_CURVE_DATA, HAZARD_DISTRIBUTION_DATA } from '../data/initialData';

export const ExecutiveDashboard: React.FC = () => {
  const {
    currentProject,
    dailyReports,
    manpowerEntries,
    hazards,
    correctiveActions,
    inspections,
    alerts,
    setActiveTab,
    setSiteSubmissionModalOpen,
    setActiveSubmissionSubTab,
    setWorkflowModalOpen,
    acknowledgeAlert
  } = useApp();

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Latest site report for this project
  const latestReport = dailyReports.find((r) => r.projectId === currentProject.id) || dailyReports[0];
  const latestManpower = manpowerEntries.find((m) => m.projectId === currentProject.id) || manpowerEntries[0];
  const latestInspection = inspections.find((i) => i.projectId === currentProject.id) || inspections[0];

  const projectHazards = hazards.filter((h) => h.projectId === currentProject.id);
  const openHazards = projectHazards.filter((h) => h.status === 'Open' || h.status === 'Under Action');
  const highRiskCount = openHazards.filter((h) => h.riskLevel === 'High' || h.riskLevel === 'Critical').length;
  
  const projectActions = correctiveActions.filter((ca) => ca.projectId === currentProject.id);
  const overdueActions = projectActions.filter((ca) => ca.status === 'Overdue');

  const unacknowledgedAlerts = alerts.filter((a) => a.projectId === currentProject.id && !a.acknowledged);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header / Project Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              EXECUTIVE OVERVIEW
            </span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded">
              Active Project Site
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            {currentProject.name}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
            <span>{currentProject.location}</span>
            <span>•</span>
            <span className="text-slate-700 font-mono font-bold">Ref: KS-2026-FPG</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('ai-advisor')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all shadow-xs uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Executive Brief</span>
          </button>
          
          <button
            onClick={() => setWorkflowModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all uppercase tracking-wider shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>System Workflow</span>
          </button>
        </div>
      </div>

      {/* Critical Trigger Alert Banner */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="space-y-2">
          {unacknowledgedAlerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white shadow-sm ${
                alert.severity === 'critical'
                  ? 'border-l-rose-600 border border-slate-200'
                  : 'border-l-amber-500 border border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertOctagon className={`w-5 h-5 mt-0.5 shrink-0 ${alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`} />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">{alert.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                    <span>Recipients: {alert.recipients.join(' • ')}</span>
                    <span>•</span>
                    <span className="text-slate-700 font-bold">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setActiveTab('hse-hazards')}
                  className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-all uppercase tracking-wider"
                >
                  View Hazard Action
                </button>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-all"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5 CORE MANAGEMENT KPI CARDS (Professional Polish - border-l-4 theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. PROJECT PROGRESS */}
        <div 
          onClick={() => setActiveTab('progress-manpower')}
          className="bg-white p-5 border-l-4 border-amber-500 border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Progress</p>
            <TrendingUp className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            {currentProject.actualProgress}% <span className="text-xs font-normal text-slate-400">/ {currentProject.plannedProgress}%</span>
          </h2>
          <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${currentProject.actualProgress}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] flex items-center justify-between font-semibold">
            <span className="text-slate-500">Target: {currentProject.plannedProgress}%</span>
            <span className={currentProject.variance < 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
              Var: {currentProject.variance}%
            </span>
          </div>
        </div>

        {/* 2. MANPOWER */}
        <div 
          onClick={() => setActiveTab('progress-manpower')}
          className="bg-white p-5 border-l-4 border-slate-900 border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Workforce Active</p>
            <Users className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            {latestManpower?.totalHeadcount || 27} <span className="text-xs font-normal text-slate-400">/ 30 Planned</span>
          </h2>
          <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full"
              style={{ width: '90%' }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-bold">7 Trades • 216 Man-Hours</p>
        </div>

        {/* 3. SAFETY COMPLIANCE SCORE */}
        <div 
          onClick={() => setActiveTab('hse-hazards')}
          className="bg-white p-5 border-l-4 border-emerald-600 border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Safety Score</p>
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            94% <span className="text-xs font-bold text-emerald-600">PASS</span>
          </h2>
          <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '94%' }} />
          </div>
          <p className="text-[10px] text-emerald-700 mt-2 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
            {currentProject.safeDaysWithoutLTI} Days Zero LTI
          </p>
        </div>

        {/* 4. OPEN HAZARDS */}
        <div 
          onClick={() => setActiveTab('hse-hazards')}
          className="bg-white p-5 border-l-4 border-amber-600 border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Open Hazards</p>
            <AlertTriangle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            {openHazards.length} <span className="text-xs font-normal text-slate-400">Total</span>
          </h2>
          <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(openHazards.length * 20, 100)}%` }} />
          </div>
          <p className="text-[10px] text-rose-600 mt-2 font-bold">
            {highRiskCount} High Risk Containment
          </p>
        </div>

        {/* 5. OVERDUE ACTIONS */}
        <div 
          onClick={() => setActiveTab('hse-hazards')}
          className="bg-white p-5 border-l-4 border-rose-600 border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Overdue Actions</p>
            <Clock className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            {overdueActions.length} <span className="text-xs font-bold text-rose-600">ALERT</span>
          </h2>
          <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-600 rounded-full" style={{ width: `${Math.min(overdueActions.length * 35, 100)}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-bold">Management Attention</p>
        </div>

      </div>

      {/* TWO CORE VISUAL PANELS: HAZARD DISTRIBUTION & INSPECTION COMPLIANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: HAZARD DISTRIBUTION */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HSE Analytics</p>
              <h3 className="text-sm font-bold uppercase text-slate-800">Hazard Distribution</h3>
            </div>
            <button
              onClick={() => setActiveTab('hse-hazards')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1"
            >
              <span>View Registry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 space-y-4 flex-1">
            {HAZARD_DISTRIBUTION_DATA.map((item) => {
              const maxCount = 14;
              const percentage = (item.count / maxCount) * 100;

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.category}</span>
                    <span className="text-slate-900 font-mono font-bold">{item.count} items</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Total Recorded Hazards: <strong className="text-slate-900 font-mono">30</strong></span>
              <span className="text-amber-700 font-bold">Top: Housekeeping & Work at Height</span>
            </div>
          </div>
        </div>

        {/* Right: INSPECTION COMPLIANCE */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit & Compliance</p>
                <h3 className="text-sm font-bold uppercase text-slate-800">Inspection Compliance</h3>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold uppercase rounded">
                Audit Ready
              </span>
            </div>

            <div className="p-5">
              {/* Compliance Score */}
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-heading font-black text-slate-900">
                  92%
                </span>
                <span className="text-xs text-slate-500 max-w-[220px]">
                  Site compliance score based on DOSH/CIDB standards and daily supervisor checklist.
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: '92%' }}
                />
              </div>

              {/* Checkpoint Status Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">PPE</span>
                  <span className="text-xs font-black text-emerald-700 font-mono mt-0.5 inline-block">PASS</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Housekeeping</span>
                  <span className="text-xs font-black text-emerald-700 font-mono mt-0.5 inline-block">PASS</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Equipment</span>
                  <span className="text-xs font-black text-amber-700 font-mono mt-0.5 inline-block">ATTENTION</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Fire Ext.</span>
                  <span className="text-xs font-black text-emerald-700 font-mono mt-0.5 inline-block">PASS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs text-slate-500">
            <span>Last Site Audit: <strong className="text-slate-800">20 Aug 2026</strong></span>
            <span>Inspector: <strong className="text-slate-800">{latestInspection.inspectorName}</strong></span>
          </div>
        </div>

      </div>

      {/* S-CURVE PROJECT PROGRESS & LIVE SITE REPORT SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Planned vs Actual S-Curve Chart */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Control</p>
              <h3 className="text-sm font-bold uppercase text-slate-800">
                S-CURVE: Planned vs Actual Cumulative Progress
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-600" />
                <span className="text-slate-600">Planned (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-600" />
                <span className="text-slate-600">Actual (%)</span>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={S_CURVE_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any, name: any) => [`${value}%`, name === 'planned' ? 'Planned Target' : 'Actual Site Progress']}
                  />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#2563eb' }}
                    name="planned"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#059669', stroke: '#064e3b', strokeWidth: 2 }}
                    name="actual"
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">Current Target</span>
                <span className="text-blue-700 font-bold font-mono text-sm">72.0% (Jun 26)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">Actual Achieved</span>
                <span className="text-emerald-700 font-bold font-mono text-sm">68.0%</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="text-rose-700 block text-[11px] font-bold uppercase">Cumulative Variance</span>
                <span className="text-rose-700 font-bold font-mono text-sm">-4.0% (Behind)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Site Feed & Supervisor Submission Stream */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Daily Site Log</p>
                <h3 className="text-sm font-bold uppercase text-slate-800">
                  Latest Site Input
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-800 font-bold rounded font-mono">
                {latestReport.date}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-amber-600" />
                  <span className="text-slate-800 font-medium">{latestReport.weather}</span>
                </div>
                <span className="text-slate-600 font-mono font-bold">{latestReport.temperature}</span>
              </div>

              {latestReport.delayHours > 0 && (
                <div className="flex items-center justify-between text-xs p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
                  <span className="font-bold">Weather Delay:</span>
                  <span className="font-mono font-bold text-rose-700">{latestReport.delayHours} hrs ({latestReport.delayReason})</span>
                </div>
              )}

              {/* Work packages snippet */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Active Work Packages:</span>
                {latestReport.workPackagesCompleted.slice(0, 2).map((wp) => (
                  <div key={wp.packageId} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate max-w-[180px]">{wp.title}</span>
                      <span className="text-amber-700 font-mono">+{wp.percentageCompletedToday}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{wp.notes}</p>
                  </div>
                ))}
              </div>

              {/* Photos snapshot */}
              {latestReport.photos && latestReport.photos.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Site Evidence:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {latestReport.photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo.url)}
                        className="relative h-20 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group shadow-xs"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[9px] text-white font-medium truncate">{photo.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between">
            <div className="text-[11px] text-slate-500 font-medium">
              Supervisor: <strong className="text-slate-800">{latestReport.supervisorName}</strong>
            </div>
            <button
              onClick={() => {
                setActiveSubmissionSubTab('daily-report');
                setSiteSubmissionModalOpen(true);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Submit Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* PHOTO PREVIEW MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-2xl w-full bg-white p-2 rounded-xl border border-slate-200 shadow-2xl">
            <img
              src={selectedPhoto}
              alt="Enlarged site evidence"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
