import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment } from '../types';
import {
  Truck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Wrench,
  CheckCircle2,
  AlertOctagon,
  FileCheck,
  Search,
  Plus
} from 'lucide-react';

export const EquipmentRegister: React.FC = () => {
  const { currentProject, equipment, updateEquipmentStatus, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEquipment = equipment.filter((eq) => {
    if (eq.projectId !== currentProject.id) return false;
    if (filterType !== 'ALL' && eq.type !== filterType) return false;
    if (searchTerm && !eq.name.toLowerCase().includes(searchTerm.toLowerCase()) && !eq.registrationNo.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              PLANT & EQUIPMENT
            </span>
            <span className="text-xs text-slate-500">Register • PMA / JKKP Certification • Pre-Op Checks</span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Heavy Machinery & Plant Asset Register
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">MACHINES ON SITE</span>
            <span className="text-lg font-heading font-black text-slate-900">
              {equipment.filter((e) => e.projectId === currentProject.id).length} Active Assets
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search machinery, reg no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 focus:border-amber-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none w-56 shadow-2xs"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Machinery Types</option>
            <option value="Mobile Crane">Mobile Crane</option>
            <option value="Excavator">Excavator</option>
            <option value="Scissor Lift">Scissor Lift</option>
            <option value="Generator">Generator</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredEquipment.length} machines in {currentProject.code}
        </span>
      </div>

      {/* EQUIPMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEquipment.map((eq) => {
          const isStopWork = eq.status === 'Grounded / Stop Work';
          const isMaintenance = eq.status === 'Requires Maintenance';

          return (
            <div
              key={eq.id}
              className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow ${
                isStopWork
                  ? 'border-l-4 border-l-rose-600 border-slate-200'
                  : isMaintenance
                  ? 'border-l-4 border-l-amber-500 border-slate-200'
                  : 'border-l-4 border-l-emerald-600 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-slate-700 font-bold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                    {eq.equipmentCode} • {eq.type}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase ${
                      eq.status === 'Operational'
                        ? 'bg-emerald-100 text-emerald-800'
                        : isMaintenance
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-wide">{eq.name}</h3>
                <span className="text-xs text-slate-500 font-mono">Reg: {eq.registrationNo}</span>

                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">DOSH / PMA Cert</span>
                    <span className="text-slate-900 font-mono font-bold">{eq.pmaCertNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">PMA Expiry Date</span>
                    <span className="text-emerald-700 font-mono font-bold">{eq.pmaExpiryDate}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Certified Operator</span>
                    <span className="text-slate-800 font-semibold">{eq.operatorName}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Hours Operated</span>
                    <span className="text-slate-800 font-mono font-bold">{eq.hoursOperatedTotal} Hrs</span>
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Last Pre-Op: <strong className="text-slate-800">{eq.lastInspectionDate}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Operational')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all uppercase ${
                      eq.status === 'Operational'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pass
                  </button>

                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Requires Maintenance')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all uppercase ${
                      eq.status === 'Requires Maintenance'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Service
                  </button>

                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Grounded / Stop Work')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all uppercase ${
                      eq.status === 'Grounded / Stop Work'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Stop Work
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
