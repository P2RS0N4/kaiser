import React from 'react';
import { useApp } from '../context/AppContext';
import { ProjectId, UserRole } from '../types';
import {
  Building2,
  ShieldCheck,
  Zap,
  PlusCircle,
  Sparkles,
  ChevronDown,
  Clock,
  Radio,
  Workflow,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    currentProject,
    projects,
    userRole,
    setUserRole,
    setWorkflowModalOpen,
    setSiteSubmissionModalOpen,
    setActiveTab,
    alerts
  } = useApp();

  const unreadCriticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3.5">
          {/* Kaiser Industrial Amber Emblem */}
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-amber-500 p-0.5 shadow-sm flex items-center justify-center">
              <span className="font-heading font-extrabold text-2xl text-slate-950 tracking-tighter group-hover:scale-105 transition-transform">K</span>
            </div>
            {/* Live operational dot */}
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                KAISER ENGINEERING SDN. BHD.
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline-flex items-center gap-1 font-mono">
                <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" /> Live Central Sync
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-2">
              KAISER <span className="text-slate-800 uppercase">SMARTSITE 360</span>
            </h1>
          </div>
        </div>

        {/* Middle & Right: Project Switcher, Role Persona, Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Project Switcher */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-colors shadow-xs">
              <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value as ProjectId)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-3"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-slate-800">
                    {p.name.length > 32 ? p.name.slice(0, 32) + '...' : p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Persona Role Switcher */}
          <div className="relative hidden sm:block">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Role:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="DIRECTOR">Boss / Director</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="HSE_OFFICER">HSE Officer</option>
                <option value="SITE_SUPERVISOR">Site Supervisor</option>
              </select>
            </div>
          </div>

          {/* Workflow Architecture Button */}
          <button
            onClick={() => setWorkflowModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all shadow-xs"
            title="System Workflow & Ecosystem Blueprint"
          >
            <Workflow className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden lg:inline uppercase tracking-wider text-[11px]">Ecosystem Flow</span>
          </button>

          {/* Kaiser AI Advisor Fast Button */}
          <button
            onClick={() => setActiveTab('ai-advisor')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline uppercase tracking-wider text-[11px]">AI Advisor</span>
          </button>

          {/* New Site Submission Primary CTA */}
          <button
            onClick={() => setSiteSubmissionModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm border border-amber-600/30 active:scale-95 transition-all uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Site Input</span>
          </button>

        </div>
      </div>
    </header>
  );
};
