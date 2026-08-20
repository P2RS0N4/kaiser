import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  LayoutDashboard,
  ClipboardPenLine,
  AlertOctagon,
  TrendingUp,
  Truck,
  FileSpreadsheet,
  Sparkles,
  Target,
  BadgeAlert
} from 'lucide-react';

interface TabItem {
  id: NavTab;
  label: string;
  badge?: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, hazards, correctiveActions, alerts } = useApp();

  const openHazardsCount = hazards.filter((h) => h.status === 'Open' || h.status === 'Under Action').length;
  const overdueActionsCount = correctiveActions.filter((ca) => ca.status === 'Overdue').length;
  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      tag: 'Overview',
    },
    {
      id: 'site-input',
      label: 'Site Input Portal',
      icon: ClipboardPenLine,
      tag: 'Power App',
    },
    {
      id: 'hse-hazards',
      label: 'HSE & Hazard Central',
      icon: AlertOctagon,
      badge: openHazardsCount > 0 ? `${openHazardsCount}` : undefined,
    },
    {
      id: 'progress-manpower',
      label: 'Schedule & Manpower',
      icon: TrendingUp,
    },
    {
      id: 'equipment',
      label: 'Plant & Equipment',
      icon: Truck,
    },
    {
      id: 'documents',
      label: 'HIRARC & Documents',
      icon: FileSpreadsheet,
    },
    {
      id: 'ai-advisor',
      label: 'Kaiser AI Advisor',
      icon: Sparkles,
      tag: 'AI Layer',
    },
    {
      id: 'pilot-roadmap',
      label: 'Pilot KPIs & Roadmap',
      icon: Target,
      tag: 'Phase 1-4',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 sticky top-[57px] z-30 overflow-x-auto no-scrollbar shadow-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-2 py-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-all select-none relative whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              )}
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>

              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white rounded text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}

              {tab.tag && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider font-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
