import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Users,
  Calendar,
  Clock,
  HardHat,
  ArrowUpRight,
  ArrowDownRight,
  CloudSun,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import { S_CURVE_DATA } from '../data/initialData';

export const ProjectManpowerControl: React.FC = () => {
  const { currentProject, dailyReports, manpowerEntries, setActiveTab } = useApp();

  const latestManpower = manpowerEntries.find((m) => m.projectId === currentProject.id) || manpowerEntries[0];
  const projectReports = dailyReports.filter((r) => r.projectId === currentProject.id);

  // Trade data for bar chart
  const tradeChartData = latestManpower.trades.map((t) => ({
    trade: t.trade.split(' ')[0], // short name
    fullTrade: t.trade,
    count: t.count,
    category: t.category,
    company: t.company,
  }));

  const tradeColors: Record<string, string> = {
    Structural: '#D97706', // amber-600
    'M&E': '#2563EB',     // blue-600
    Safety: '#059669',    // emerald-600
    General: '#475569',   // slate-600
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              PROGRESS & MANPOWER CONTROL
            </span>
            <span className="text-xs text-slate-500">Headcount • Man-hours • Planned vs Actual</span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Project Schedule & Labor Productivity Analytics
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">TOTAL SAFE MAN-HOURS</span>
            <span className="text-lg font-heading font-black text-emerald-700">
              {currentProject.totalManHours.toLocaleString()} Hrs
            </span>
          </div>
        </div>
      </div>

      {/* S-CURVE FULL VISUALIZER */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-heading font-bold text-slate-900">
              Cumulative Progress Baseline (S-Curve Curve Analysis)
            </h3>
            <p className="text-xs text-slate-500">
              Contract Value: <strong className="text-slate-800">{currentProject.contractValue}</strong> • Phase: <strong className="text-amber-700">{currentProject.currentPhase}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-400 rounded" />
              <span className="text-slate-600">Planned Target (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded" />
              <span className="text-slate-900 font-bold">Actual Progress (%)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={S_CURVE_DATA} margin={{ top: 10, right: 30, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '8px',
                  color: '#0F172A',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="planned"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="4 4"
                name="Planned Baseline"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#D97706"
                strokeWidth={3}
                dot={{ r: 4, fill: '#D97706', stroke: '#FFF', strokeWidth: 2 }}
                name="Actual Progress"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-bold uppercase">Start Date</span>
            <span className="text-slate-900 font-bold font-mono text-sm">{currentProject.startDate}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-bold uppercase">Target Completion</span>
            <span className="text-slate-900 font-bold font-mono text-sm">{currentProject.targetCompletion}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-bold uppercase">Planned Target</span>
            <span className="text-slate-900 font-bold font-mono text-sm">{currentProject.plannedProgress}%</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-rose-200 bg-rose-50/40">
            <span className="text-rose-700 block text-[11px] font-bold uppercase">Schedule Variance</span>
            <span className="text-rose-700 font-bold font-mono text-sm">{currentProject.variance}% (Variance -4%)</span>
          </div>
        </div>
      </div>

      {/* MANPOWER DISTRIBUTION & TRADE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trade Headcount Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">
                Manpower Distribution by Trade ({latestManpower.totalHeadcount} Total)
              </h3>
              <p className="text-xs text-slate-500">Headcount breakdown on site today.</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded">
              {latestManpower.date}
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tradeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="trade"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    color: '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val: any, name: any, item: any) => [
                    `${val} Pax (${item.payload.fullTrade})`,
                    item.payload.company,
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {tradeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={tradeColors[entry.category] || '#D97706'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-600 rounded-full" />
              <span>Structural</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
              <span>M&E</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
              <span>Safety</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
              <span>General</span>
            </div>
          </div>
        </div>

        {/* Daily Stoppage & Delay Log History */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-heading font-bold text-slate-900">
                Daily Work Packages & Delay Logs
              </h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Recent 3 Days</span>
            </div>

            <div className="space-y-3 mt-3">
              {projectReports.slice(0, 3).map((report) => (
                <div key={report.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{report.date}</span>
                    <span className="text-slate-500 font-mono">{report.weather} • {report.temperature}</span>
                  </div>

                  {report.delayHours > 0 ? (
                    <div className="text-[11px] text-rose-800 bg-rose-50 px-2 py-1 rounded border border-rose-200 font-bold">
                      Stoppage: {report.delayHours}h ({report.delayReason})
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-bold">
                      Zero delay stoppages
                    </div>
                  )}

                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    {report.keyMilestoneNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Lead Supervisor: <strong className="text-slate-800">{currentProject.leadSupervisor}</strong></span>
            <span className="text-slate-900 font-mono font-bold">Safe Days: {currentProject.safeDaysWithoutLTI}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
