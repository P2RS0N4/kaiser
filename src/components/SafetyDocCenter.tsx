import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SafetyDocument } from '../types';
import {
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Tag,
  ExternalLink,
  BookOpen,
  Printer
} from 'lucide-react';

export const SafetyDocCenter: React.FC = () => {
  const { currentProject, documents, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocType, setFilterDocType] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<SafetyDocument | null>(null);

  const filteredDocs = documents.filter((doc) => {
    if (filterDocType !== 'ALL' && doc.docType !== filterDocType) return false;
    if (
      searchTerm &&
      !doc.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
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
              DOCUMENTS & SAFETY REPOSITORY
            </span>
            <span className="text-xs text-slate-500">HIRARC • SOP • SDS • Method Statements</span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Central Safety Documentation & Compliance Vault
          </h2>
        </div>

        <button
          onClick={() => showToast('Audit pack export generated for DOSH inspection.', 'success')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm border border-amber-600/30 uppercase tracking-wider active:scale-95 transition-all self-start md:self-center"
        >
          <Printer className="w-4 h-4" />
          <span>Export Audit Compliance Dossier</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search document title, ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 focus:border-amber-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none w-56 shadow-2xs"
            />
          </div>

          <select
            value={filterDocType}
            onChange={(e) => setFilterDocType(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Document Types</option>
            <option value="HIRARC">HIRARC Risk Registers</option>
            <option value="SOP">Safe Operating Procedures (SOP)</option>
            <option value="SDS">Safety Data Sheets (SDS)</option>
            <option value="Method Statement">Method Statements (MS)</option>
            <option value="Toolbox Talk">Toolbox Talk Modules</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {filteredDocs.length} Safety Documents Active
        </span>
      </div>

      {/* DOCUMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {doc.docType}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-bold">{doc.version}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {doc.title}
              </h3>
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">{doc.docNumber}</span>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {doc.summary}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                {doc.tags.map((tag) => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Rev: {doc.revisionDate}</span>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white p-6 rounded-xl border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase font-bold">
                  {selectedDoc.docType} • {selectedDoc.docNumber} ({selectedDoc.version})
                </span>
                <h3 className="text-lg font-heading font-black text-slate-900 mt-0.5">
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-600 hover:text-slate-900 text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Executive Summary:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedDoc.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase">Approved Authority:</span>
                  <p className="font-semibold text-slate-800">{selectedDoc.approvedBy}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase">Last Revision Date:</span>
                  <p className="font-mono font-bold text-slate-900">{selectedDoc.revisionDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4" /> DOSH / CIDB Compliant
              </span>

              <button
                onClick={() => {
                  showToast(`Downloaded ${selectedDoc.docNumber} PDF version.`, 'success');
                  setSelectedDoc(null);
                }}
                className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-sm uppercase tracking-wider active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Controlled Copy (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
