import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hazard, CorrectiveAction, HazardCategory, RiskLevel } from '../types';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ChevronDown,
  User,
  Calendar,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldAlert,
  Camera,
  Check
} from 'lucide-react';

export const HseHazardCenter: React.FC = () => {
  const {
    currentProject,
    hazards,
    correctiveActions,
    resolveHazard,
    updateCorrectiveActionStatus,
    setSiteSubmissionModalOpen,
    setActiveSubmissionSubTab,
    setActiveTab
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveSection] = useState<'hazards' | 'corrective-actions'>('hazards');
  
  // Selected Hazard for Modal
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);

  // Filtering
  const projectHazards = hazards.filter((h) => h.projectId === currentProject.id);
  const filteredHazards = projectHazards.filter((h) => {
    if (filterCategory !== 'ALL' && h.category !== filterCategory) return false;
    if (filterRisk !== 'ALL' && h.riskLevel !== filterRisk) return false;
    if (filterStatus !== 'ALL' && h.status !== filterStatus) return false;
    if (searchTerm && !h.finding.toLowerCase().includes(searchTerm.toLowerCase()) && !h.locationZone.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const projectActions = correctiveActions.filter((ca) => ca.projectId === currentProject.id);
  const filteredActions = projectActions.filter((ca) => {
    if (filterStatus !== 'ALL' && ca.status !== filterStatus) return false;
    if (searchTerm && !ca.title.toLowerCase().includes(searchTerm.toLowerCase()) && !ca.pic.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              HSE & HAZARDS CENTRAL
            </span>
            <span className="text-xs text-slate-500">Finding • Risk • Action • Closeout</span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Hazard Register & Corrective Action Tracking
          </h2>
        </div>

        <button
          onClick={() => {
            setActiveSubmissionSubTab('hazard');
            setSiteSubmissionModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm border border-amber-600/30 uppercase tracking-wider active:scale-95 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Hazard</span>
        </button>
      </div>

      {/* TABS: Hazards vs Corrective Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('hazards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'hazards'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Hazard Findings ({projectHazards.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('corrective-actions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'corrective-actions'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Corrective Actions / CAPA ({projectActions.length})</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search finding, zone, PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 focus:border-amber-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none w-48 shadow-2xs"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Categories</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Working at Height">Working at Height</option>
            <option value="Chemical">Chemical</option>
            <option value="Electrical">Electrical</option>
            <option value="Scaffolding">Scaffolding</option>
            <option value="Plant & Machinery">Plant & Machinery</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* SECTION 1: HAZARDS LIST */}
      {activeTab === 'hazards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHazards.map((hazard) => {
            const isHighOrCritical = hazard.riskLevel === 'High' || hazard.riskLevel === 'Critical';

            return (
              <div
                key={hazard.id}
                onClick={() => setSelectedHazard(hazard)}
                className={`bg-white p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm hover:shadow ${
                  isHighOrCritical ? 'border-l-4 border-l-rose-600 border-slate-200' : 'border-l-4 border-l-amber-500 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                      {hazard.id} • {hazard.date}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        hazard.riskLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : hazard.riskLevel === 'High'
                          ? 'bg-rose-50 text-rose-700'
                          : hazard.riskLevel === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {hazard.riskLevel} (Score {hazard.riskScore})
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {hazard.finding}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{hazard.category}</span>
                    <span>•</span>
                    <span className="truncate">{hazard.locationZone}</span>
                  </div>

                  {hazard.escalatedToManagement && (
                    <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 flex items-center gap-1.5 font-bold">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Auto-escalated to Safety Officer & PM</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>PIC: {hazard.pic}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-700 font-bold">Due: {hazard.dueDate}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        hazard.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : hazard.status === 'Under Action'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hazard.status}
                    </span>

                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider">
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 2: CORRECTIVE ACTIONS (CAPA) */}
      {activeTab === 'corrective-actions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Action ID & Title</th>
                  <th className="p-3.5">Linked Finding</th>
                  <th className="p-3.5">PIC / Assigned Subcon</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActions.map((ca) => (
                  <tr key={ca.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <span className="text-[10px] font-mono text-slate-500 block">{ca.id}</span>
                      {ca.title}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">{ca.finding}</td>
                    <td className="p-3.5 text-slate-800 font-semibold">{ca.pic}</td>
                    <td className="p-3.5 font-mono text-slate-800 font-bold">{ca.dueDate}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          ca.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : ca.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ca.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                          ca.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ca.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ca.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {ca.status !== 'Closed' ? (
                        <button
                          onClick={() => updateCorrectiveActionStatus(ca.id, 'Closed', undefined, 'Closed by Safety Officer.')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-all uppercase tracking-wider"
                        >
                          Mark Closed
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5" /> Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HAZARD DETAIL & CLOSEOUT MODAL */}
      {selectedHazard && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white p-6 rounded-xl border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase font-bold">
                  {selectedHazard.id} • {selectedHazard.category}
                </span>
                <h3 className="text-lg font-heading font-black text-slate-900 mt-0.5">
                  Hazard Finding & Mitigation Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedHazard(null)}
                className="text-slate-600 hover:text-slate-900 text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block font-bold uppercase text-[10px]">Observed Unsafe Condition:</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{selectedHazard.finding}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase">Location Zone</span>
                  <p className="font-semibold text-slate-800">{selectedHazard.locationZone}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase">Risk Level</span>
                  <p className="font-bold text-rose-700">{selectedHazard.riskLevel} (Score {selectedHazard.riskScore}/25)</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase">Reported By</span>
                  <p className="font-semibold text-slate-800">{selectedHazard.reportedBy}</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Immediate Containment Action:</span>
              <p className="text-xs text-slate-800 p-3 bg-slate-50 rounded-lg border border-slate-200">
                {selectedHazard.immediateActionTaken}
              </p>
            </div>

            {/* Photo comparison */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">Evidence Photos:</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-rose-700 font-bold block uppercase">BEFORE RECTIFICATION:</span>
                  <div className="h-32 rounded-lg overflow-hidden border border-rose-200 bg-slate-100">
                    <img
                      src={selectedHazard.photoBeforeUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'}
                      alt="Before"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold block uppercase">AFTER CLOSEOUT PROOF:</span>
                  {selectedHazard.photoAfterUrl ? (
                    <div className="h-32 rounded-lg overflow-hidden border border-emerald-300 bg-slate-100">
                      <img
                        src={selectedHazard.photoAfterUrl}
                        alt="After"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center bg-slate-50">
                      <span>Pending closeout verification</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {selectedHazard.status !== 'Resolved' && (
                <button
                  onClick={() => {
                    resolveHazard(
                      selectedHazard.id,
                      'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=600&q=80'
                    );
                    setSelectedHazard(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm uppercase tracking-wider active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Rectification & Resolve Hazard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
