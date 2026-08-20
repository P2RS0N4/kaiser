import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardPenLine,
  Users,
  AlertTriangle,
  CheckSquare,
  Truck,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Send,
  Plus,
  Minus,
  Save,
  ShieldAlert,
  ArrowRight,
  Flame,
  HardHat
} from 'lucide-react';
import { WeatherCondition, DelayReason, HazardCategory, RiskLevel, InspectionCheckStatus } from '../types';

export const SiteInputPortal: React.FC = () => {
  const {
    currentProject,
    addDailyReport,
    addManpowerEntry,
    addHazard,
    addInspection,
    updateEquipmentStatus,
    equipment,
    activeSubmissionSubTab,
    setActiveSubmissionSubTab,
    showToast
  } = useApp();

  // Speed timer tracking (<10 min pilot KPI)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- FORM STATE 1: Daily Report ---
  const [weather, setWeather] = useState<WeatherCondition>('Sunny / Clear');
  const [temperature, setTemperature] = useState('32°C');
  const [delayHours, setDelayHours] = useState(0);
  const [delayReason, setDelayReason] = useState<DelayReason>('None');
  const [activityTitle, setActivityTitle] = useState('Main Pipe Rack Structural Bolting & Alignment');
  const [activityZone, setActivityZone] = useState('Zone B - Tank Farm Area');
  const [percentCompleted, setPercentCompleted] = useState(4.0);
  const [activityNotes, setActivityNotes] = useState('HSFG bolting 100% checked. Alignment within ±2mm tolerance.');
  const [keyMilestones, setKeyMilestones] = useState('Hot Work PTW closed. Pre-pour inspection scheduled tomorrow 9 AM.');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=800&q=80'
  ]);

  // --- FORM STATE 2: Manpower Headcount ---
  const [tradesState, setTradesState] = useState([
    { trade: 'Steel Erectors / Riggers', category: 'Structural' as const, count: 6, company: 'Kaiser Direct' },
    { trade: '6G / 4G Certified Welders', category: 'M&E' as const, count: 5, company: 'Mega Weld Engineering' },
    { trade: 'Pipe Fitters', category: 'M&E' as const, count: 4, company: 'Mega Weld Engineering' },
    { trade: 'Scaffolders (Level 3 DOSH)', category: 'Safety' as const, count: 4, company: 'SafeAccess Scaffolding' },
    { trade: 'Bar Benders & Concreters', category: 'Structural' as const, count: 4, company: 'Kaiser Civil' },
    { trade: 'General Workers / Housekeeping', category: 'General' as const, count: 2, company: 'Kaiser Direct' },
    { trade: 'HSE Safety Supervisor & Officer', category: 'Safety' as const, count: 2, company: 'Kaiser Safety Team' },
  ]);
  const [overtimeHours, setOvertimeHours] = useState(24);

  const totalHeadcount = tradesState.reduce((acc, t) => acc + t.count, 0);

  const handleTradeCountChange = (index: number, delta: number) => {
    setTradesState((prev) => {
      const copy = [...prev];
      const newCount = Math.max(0, copy[index].count + delta);
      copy[index] = { ...copy[index], count: newCount };
      return copy;
    });
  };

  // --- FORM STATE 3: Hazard Reporter & AI Triage ---
  const [hazardCategory, setHazardCategory] = useState<HazardCategory>('Working at Height');
  const [hazardLocation, setHazardLocation] = useState('Zone B - Pipe Rack Gridline 9, Level 2');
  const [hazardFinding, setHazardFinding] = useState('Scaffolding platform missing mid-rail & toe-board. Worker observed without 100% tie-off hook to lifeline.');
  const [hazardRiskLevel, setHazardRiskLevel] = useState<RiskLevel>('High');
  const [hazardPic, setHazardPic] = useState('Ramasamy (SafeAccess Scaffolding PIC)');
  const [hazardDueDate, setHazardDueDate] = useState('2026-08-21');
  const [hazardImmediateAction, setHazardImmediateAction] = useState('Red tagged scaffold and instructed workers to step down immediately.');
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState<any>(null);

  // Trigger server-side AI Hazard triage
  const handleAiEvaluateHazard = async () => {
    if (!hazardFinding.trim()) {
      showToast('Please enter a hazard finding description first.', 'alert');
      return;
    }
    setIsAiEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate-hazard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finding: hazardFinding,
          category: hazardCategory,
          location: hazardLocation,
        }),
      });
      const data = await res.json();
      setAiEvaluationResult(data);
      if (data.riskLevel) {
        setHazardRiskLevel(data.riskLevel);
      }
      if (data.immediateAction) {
        setHazardImmediateAction(data.immediateAction);
      }
      showToast(`AI evaluated: ${data.riskLevel} Risk (Score ${data.riskScore || 16}/25)`, 'info');
    } catch (err) {
      console.error(err);
      setHazardRiskLevel('High');
      setHazardImmediateAction('Cordon off area and install red STOP WORK tag.');
    } finally {
      setIsAiEvaluating(false);
    }
  };

  // --- FORM STATE 4: Inspection Quick Audit ---
  const [inspectionScores, setInspectionScores] = useState<Record<string, InspectionCheckStatus>>({
    ppe: 'PASS',
    housekeeping: 'PASS',
    equipment: 'ATTENTION',
    fireExt: 'PASS',
    scaffolding: 'ATTENTION',
    ptw: 'PASS',
  });
  const [inspectionNotes, setInspectionNotes] = useState('Bay 4 scaffolding and crane sling require closeout before evening shift.');

  // --- FORM SUBMISSIONS ---
  const handleSubmitDailyReport = (e: React.FormEvent) => {
    e.preventDefault();
    addDailyReport({
      projectId: currentProject.id,
      date: new Date().toISOString().split('T')[0],
      shift: 'Day Shift',
      weather,
      temperature,
      delayHours: Number(delayHours),
      delayReason,
      workPackagesCompleted: [
        {
          packageId: 'WP-04-ST',
          title: activityTitle,
          zone: activityZone,
          percentageCompletedToday: Number(percentCompleted),
          cumulativeProgress: 78,
          notes: activityNotes,
        },
      ],
      supervisorName: 'Wan Ahmad (Site Lead)',
      submissionDurationSeconds: secondsElapsed,
      status: 'Submitted',
      photos: uploadedPhotos.map((url, i) => ({
        id: `p-${Date.now()}-${i}`,
        url,
        caption: `${activityZone} - Progress Evidence`,
        timestamp: new Date().toTimeString().slice(0, 5),
      })),
      keyMilestoneNotes: keyMilestones,
    });
  };

  const handleSubmitManpower = (e: React.FormEvent) => {
    e.preventDefault();
    addManpowerEntry({
      projectId: currentProject.id,
      date: new Date().toISOString().split('T')[0],
      totalHeadcount,
      totalManHours: totalHeadcount * 9,
      overtimeHours: Number(overtimeHours),
      trades: tradesState,
      supervisor: 'Wan Ahmad (Site Lead)',
      notes: `Submitted via Kaiser Mobile Portal in ${formatTimer(secondsElapsed)}. 100% verified on site.`,
    });
  };

  const handleSubmitHazard = (e: React.FormEvent) => {
    e.preventDefault();
    addHazard({
      projectId: currentProject.id,
      reportedBy: 'Wan Ahmad',
      reporterRole: 'Site Supervisor',
      category: hazardCategory,
      locationZone: hazardLocation,
      riskLevel: hazardRiskLevel,
      riskScore: hazardRiskLevel === 'Critical' ? 25 : hazardRiskLevel === 'High' ? 16 : hazardRiskLevel === 'Medium' ? 9 : 4,
      finding: hazardFinding,
      immediateActionTaken: hazardImmediateAction,
      photoBeforeUrl: uploadedPhotos[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      status: 'Open',
      pic: hazardPic,
      dueDate: hazardDueDate,
      hirarcReference: `HIRARC-${currentProject.code}-${hazardCategory.slice(0, 3).toUpperCase()}`,
      aiSuggestedAction: aiEvaluationResult?.preventiveAction,
    });
  };

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const items = [
      { id: 'i-1', checkName: 'Personal Protective Equipment (PPE)', category: 'General', status: inspectionScores.ppe },
      { id: 'i-2', checkName: 'Housekeeping & Clear Walkways', category: 'Site Condition', status: inspectionScores.housekeeping },
      { id: 'i-3', checkName: 'Heavy Plant & Lifting Gear', category: 'Machinery', status: inspectionScores.equipment, defectNotes: 'Crane sling tagged out.' },
      { id: 'i-4', checkName: 'Fire Extinguisher & First Aid', category: 'Emergency', status: inspectionScores.fireExt },
      { id: 'i-5', checkName: 'Scaffolding & Work at Height', category: 'Height Safety', status: inspectionScores.scaffolding, defectNotes: 'Bay 4 missing mid rail.' },
      { id: 'i-6', checkName: 'Permit to Work (PTW) Compliance', category: 'Permits', status: inspectionScores.ptw },
    ];

    const passCount = Object.values(inspectionScores).filter((v) => v === 'PASS').length;
    const score = Math.round((passCount / Object.values(inspectionScores).length) * 100);

    addInspection({
      projectId: currentProject.id,
      inspectorName: 'Wan Ahmad (Verified by Faizal Rahman)',
      inspectorRole: 'Site Supervisor / HSE',
      inspectionType: 'Daily PPE & Site Order',
      complianceScore: score,
      overallResult: score >= 90 ? 'PASS' : score >= 75 ? 'ATTENTION' : 'FAIL',
      items,
      remarks: inspectionNotes,
      signature: 'Wan Ahmad (Site Lead)',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner: Vision & Speed Timer */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              SITE INPUT • ONE SOURCE OF TRUTH
            </span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded">
              Field Ready
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Supervisor Daily Submission Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit data sekali sahaja. Management terus nampak keadaan projek secara live.
          </p>
        </div>

        {/* Speedometer pill */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Session Time</span>
              <span className="text-sm font-mono font-extrabold text-slate-900">{formatTimer(secondsElapsed)}</span>
            </div>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">KPI Target</span>
            <span className="text-xs font-mono font-bold text-emerald-700">&lt; 10 min (Pass)</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS (Clean high-contrast tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveSubmissionSubTab('daily-report')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeSubmissionSubTab === 'daily-report'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ClipboardPenLine className="w-4 h-4 text-amber-600" />
          <span>DR: Daily Report</span>
        </button>

        <button
          onClick={() => setActiveSubmissionSubTab('manpower')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeSubmissionSubTab === 'manpower'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>MP: Manpower</span>
        </button>

        <button
          onClick={() => setActiveSubmissionSubTab('hazard')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeSubmissionSubTab === 'hazard'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>HZ: Hazard & Risk</span>
        </button>

        <button
          onClick={() => setActiveSubmissionSubTab('inspection')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeSubmissionSubTab === 'inspection'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          <span>IN: Inspection</span>
        </button>

        <button
          onClick={() => setActiveSubmissionSubTab('equipment')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold col-span-2 sm:col-span-1 transition-all ${
            activeSubmissionSubTab === 'equipment'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Truck className="w-4 h-4 text-slate-700" />
          <span>EQ: Equipment</span>
        </button>
      </div>

      {/* SUB-FORM 1: DAILY REPORT */}
      {activeSubmissionSubTab === 'daily-report' && (
        <form onSubmit={handleSubmitDailyReport} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">Daily Site Progress & Weather Report</h3>
              <p className="text-xs text-slate-500">Log activity, site weather conditions, delay hours, and photo evidence.</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded">
              Project: {currentProject.code}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Weather Condition</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value as WeatherCondition)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
              >
                <option value="Sunny / Clear">☀️ Sunny / Clear</option>
                <option value="Cloudy">⛅ Cloudy</option>
                <option value="Light Rain">🌦️ Light Rain (Minor Delay)</option>
                <option value="Heavy Downpour">🌧️ Heavy Downpour (Work Stoppage)</option>
                <option value="Hazy / Hot">🔥 Hazy / Extreme Heat</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Temperature</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 32°C"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Delay Stoppage Hours</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="12"
                  value={delayHours}
                  onChange={(e) => setDelayHours(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-bold font-mono focus:outline-none"
                />
                <select
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value as DelayReason)}
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="None">No Stoppage</option>
                  <option value="Adverse Weather / Rain">Adverse Weather / Rain</option>
                  <option value="Material Delivery Delay">Material Delivery Delay</option>
                  <option value="Permit to Work (PTW) Pending">Permit to Work (PTW) Pending</option>
                  <option value="Client / Consultant Variation">Client / Consultant Variation</option>
                  <option value="Machinery Breakdown">Machinery Breakdown</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Work Package Progress Completed Today</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Package Title / Activity</label>
                <input
                  type="text"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Location / Zone</label>
                <input
                  type="text"
                  value={activityZone}
                  onChange={(e) => setActivityZone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">% Progress Achieved Today</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="100"
                  value={percentCompleted}
                  onChange={(e) => setPercentCompleted(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-amber-700 font-bold font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Activity Detail & Quality Inspection Notes</label>
                <input
                  type="text"
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Photo uploads */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Site Progress Photos (Geotagged Evidence)</label>
            <div className="flex flex-wrap items-center gap-3">
              {uploadedPhotos.map((url, i) => (
                <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                  <img src={url} alt="Site" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-center text-white font-mono py-0.5">
                    Zone B
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const samplePhotos = [
                    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
                  ];
                  setUploadedPhotos((prev) => [...prev, samplePhotos[prev.length % samplePhotos.length]]);
                  showToast('Photo captured and attached with GPS coordinates.', 'info');
                }}
                className="h-20 px-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-500 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-900 text-xs transition-colors bg-slate-50"
              >
                <Camera className="w-5 h-5 text-amber-600" />
                <span className="font-bold">+ Snap Photo</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm border border-amber-600/30 uppercase tracking-wider active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Daily Report to Cloud</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-FORM 2: MANPOWER HEADCOUNT */}
      {activeSubmissionSubTab === 'manpower' && (
        <form onSubmit={handleSubmitManpower} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">Daily Manpower & Trade Headcount</h3>
              <p className="text-xs text-slate-500">Track headcount across sub-contractors and compute cumulative safe man-hours.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Headcount</span>
              <span className="text-2xl font-heading font-black text-slate-900">{totalHeadcount} On Site</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {tradesState.map((trade, idx) => (
              <div
                key={trade.trade}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{trade.trade}</h4>
                  <span className="text-[11px] text-slate-500">{trade.company} • <strong className="text-slate-800">{trade.category}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTradeCountChange(idx, -1)}
                    className="w-8 h-8 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center font-bold shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center font-mono font-bold text-base text-slate-900">
                    {trade.count}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleTradeCountChange(idx, 1)}
                    className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Overtime (OT) Hours (Total Site)</label>
              <input
                type="number"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold font-mono"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Total Man-Hours Computed Today:</span>
              <span className="text-lg font-mono font-black text-emerald-700">
                {totalHeadcount * 9 + overtimeHours} Man-Hours
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm border border-amber-600/30 uppercase tracking-wider active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Manpower to Database</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-FORM 3: HAZARD QUICK-LOG & AI RISK TRIAGE */}
      {activeSubmissionSubTab === 'hazard' && (
        <form onSubmit={handleSubmitHazard} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-heading font-bold text-slate-900">Hazard Report & Risk Assessment</h3>
                <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold uppercase">
                  Auto-Escalation Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">High Risk hazards automatically trigger instant notification to PM & Safety Officer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Hazard Category</label>
              <select
                value={hazardCategory}
                onChange={(e) => setHazardCategory(e.target.value as HazardCategory)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
              >
                <option value="Working at Height">Working at Height (Scaffold / Lifeline)</option>
                <option value="Housekeeping">Housekeeping & Walkway Obstruction</option>
                <option value="Chemical">Chemical & Spill Containment</option>
                <option value="Electrical">Electrical DB & Cable Management</option>
                <option value="Scaffolding">Scaffolding Stability & Tagging</option>
                <option value="Excavation & Trenching">Excavation & Trenching (Shoring)</option>
                <option value="Plant & Machinery">Plant & Machinery / Lifting Gear</option>
                <option value="Personal Protective Equipment (PPE)">Personal Protective Equipment (PPE)</option>
                <option value="Fire Safety">Fire Safety & Flammables</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Location / Work Zone</label>
              <input
                type="text"
                value={hazardLocation}
                onChange={(e) => setHazardLocation(e.target.value)}
                placeholder="e.g. Zone B - Pipe Rack Gridline 9"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Hazard Finding Description</label>
              <button
                type="button"
                onClick={handleAiEvaluateHazard}
                disabled={isAiEvaluating}
                className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isAiEvaluating ? 'animate-spin' : ''}`} />
                <span>{isAiEvaluating ? 'Analyzing with Gemini...' : 'AI Risk Triage'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={hazardFinding}
              onChange={(e) => setHazardFinding(e.target.value)}
              placeholder="Describe the unsafe act or condition observed..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg p-3 text-xs text-slate-900 font-semibold focus:outline-none"
            />
          </div>

          {/* AI Guidance Box if triggered */}
          {aiEvaluationResult && (
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Kaiser AI Safety Recommendation (DOSH Standards)
                </span>
                <span className="text-xs font-mono font-bold text-rose-700">
                  Risk Score: {aiEvaluationResult.riskScore}/25 ({aiEvaluationResult.riskLevel})
                </span>
              </div>
              <p className="text-xs text-slate-700"><strong>Immediate Action:</strong> {aiEvaluationResult.immediateAction}</p>
              <p className="text-xs text-slate-600"><strong>HIRARC Control:</strong> {aiEvaluationResult.hirarcControlHierarchy}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Risk Rating</label>
              <select
                value={hazardRiskLevel}
                onChange={(e) => setHazardRiskLevel(e.target.value as RiskLevel)}
                className={`w-full border rounded-lg px-3 py-2.5 text-xs font-bold focus:outline-none ${
                  hazardRiskLevel === 'Critical' || hazardRiskLevel === 'High'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : hazardRiskLevel === 'Medium'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                <option value="Low">Low Risk (Score 1-4)</option>
                <option value="Medium">Medium Risk (Score 5-12)</option>
                <option value="High">High Risk (Score 15-20) 🚨 Auto-Alert</option>
                <option value="Critical">Critical Risk (Score 25) 🚨 Stop Work</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Person In Charge (PIC)</label>
              <input
                type="text"
                value={hazardPic}
                onChange={(e) => setHazardPic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Closeout Due Date</label>
              <input
                type="date"
                value={hazardDueDate}
                onChange={(e) => setHazardDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Immediate Containment Action Taken</label>
            <input
              type="text"
              value={hazardImmediateAction}
              onChange={(e) => setHazardImmediateAction(e.target.value)}
              placeholder="e.g. Red tagged scaffold and cordoned off perimeter"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm border border-amber-600/30 uppercase tracking-wider active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-slate-900" />
              <span>Log Hazard & Dispatch Actions</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-FORM 4: INSPECTION AUDIT */}
      {activeSubmissionSubTab === 'inspection' && (
        <form onSubmit={handleSubmitInspection} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">Daily Site Safety Inspection</h3>
              <p className="text-xs text-slate-500">Fast 1-tap pass/fail checklists for site safety compliance.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'ppe', name: 'PPE Compliance (Helmets, Glasses, Boots, Harnesses)' },
              { id: 'housekeeping', name: 'Housekeeping & Site Walkways Clear' },
              { id: 'equipment', name: 'Heavy Equipment Pre-Op & PMA Validation' },
              { id: 'fireExt', name: 'Fire Extinguishers Charged & First Aid Kit Stocked' },
              { id: 'scaffolding', name: 'Scaffolding Tagging & Guardrail Inspection' },
              { id: 'ptw', name: 'Permit to Work (PTW) Signed & Validated' },
            ].map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200"
              >
                <span className="text-xs font-bold text-slate-800">{check.name}</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectionScores((prev) => ({ ...prev, [check.id]: 'PASS' }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      inspectionScores[check.id] === 'PASS'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    PASS
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectionScores((prev) => ({ ...prev, [check.id]: 'ATTENTION' }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      inspectionScores[check.id] === 'ATTENTION'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    ATTENTION
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectionScores((prev) => ({ ...prev, [check.id]: 'FAIL' }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      inspectionScores[check.id] === 'FAIL'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    FAIL
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Inspection Remarks & Action Items</label>
            <input
              type="text"
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm uppercase tracking-wider active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Submit Safety Audit Endorsement</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-FORM 5: EQUIPMENT PRE-OP CHECK */}
      {activeSubmissionSubTab === 'equipment' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">Daily Plant & Heavy Equipment Status</h3>
              <p className="text-xs text-slate-500">Log pre-operation walkaround inspection for cranes, excavators, and generators.</p>
            </div>
          </div>

          <div className="space-y-3">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{eq.name} ({eq.equipmentCode})</h4>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-800 font-mono font-bold rounded">
                      {eq.registrationNo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Operator: {eq.operatorName} • PMA Cert: <strong className="text-slate-800 font-mono">{eq.pmaCertNo}</strong> (Exp: {eq.pmaExpiryDate})
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Operational')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      eq.status === 'Operational'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    Operational
                  </button>

                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Requires Maintenance')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      eq.status === 'Requires Maintenance'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    Maintenance
                  </button>

                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Grounded / Stop Work')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      eq.status === 'Grounded / Stop Work'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    Stop Work
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
