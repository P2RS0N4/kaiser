import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  Copy,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { ChatMessage } from '../types';

export const KaiserAiAdvisor: React.FC = () => {
  const {
    currentProject,
    dailyReports,
    manpowerEntries,
    hazards,
    correctiveActions,
    inspections,
    showToast
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Selamat sejahtera. Saya adalah **Kaiser SmartSite 360 AI Assistant**, penasihat pintar pengurusan projek & HSE untuk **KAISER ENGINEERING SDN. BHD.**

Saya telah memuatkan rekod data struktur terkini bagi projek **${currentProject.name}**:
• **Kemajuan Projek**: ${currentProject.actualProgress}% (Planned ${currentProject.plannedProgress}%, Variance ${currentProject.variance}%)
• **Tenaga Kerja Hari Ini**: 27 Pekerja di tapak (7 Trades)
• **Skor HSE**: 94% (284 Hari Selamat Tanpa LTI)
• **Hazard Terbuka**: ${hazards.filter(h => h.projectId === currentProject.id && h.status !== 'Resolved').length} Hazard (${hazards.filter(h => h.projectId === currentProject.id && (h.riskLevel === 'High' || h.riskLevel === 'Critical')).length} High Risk)
• **Tindakan Tertunggak**: 2 Overdue Corrective Actions

Anda boleh memilih soalan pantas di bawah atau bertanya apa-apa soalan analisis dalam Bahasa Melayu atau Bahasa Inggeris.`,
      timestamp: new Date().toLocaleTimeString(),
      suggestedActions: [
        'Apa masalah utama FPG project minggu ini?',
        'Summarise today’s HSE risks & schedule delay',
        'Analisis corak recurring hazard (Housekeeping & Height)',
        'Draft executive management brief for Director',
      ],
    },
  ]);

  // Quick prompt buttons matching Slide 13
  const QUICK_PROMPTS = [
    {
      label: 'Apa masalah utama FPG project minggu ini?',
      category: 'Management Brief',
      icon: AlertTriangle,
    },
    {
      label: 'Summarise today’s site progress, weather delay & manpower allocation.',
      category: 'Daily Brief',
      icon: FileText,
    },
    {
      label: 'Analyze recurring hazards in Working at Height and suggest engineering controls.',
      category: 'Trend Detection',
      icon: TrendingUp,
    },
    {
      label: 'What overdue corrective actions require executive management intervention?',
      category: 'Management Alert',
      icon: Clock,
    },
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const queryToSend = customPrompt || inputQuery;
    if (!queryToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    // Build rich project context
    const projectContext = {
      project: {
        code: currentProject.code,
        name: currentProject.name,
        plannedProgress: currentProject.plannedProgress,
        actualProgress: currentProject.actualProgress,
        variance: currentProject.variance,
        safeDaysWithoutLTI: currentProject.safeDaysWithoutLTI,
        currentPhase: currentProject.currentPhase,
        projectManager: currentProject.projectManager,
        safetyOfficer: currentProject.safetyOfficer,
      },
      latestSiteReport: dailyReports.find((r) => r.projectId === currentProject.id),
      manpower: manpowerEntries.find((m) => m.projectId === currentProject.id),
      openHazards: hazards.filter((h) => h.projectId === currentProject.id && h.status !== 'Resolved'),
      overdueCorrectiveActions: correctiveActions.filter((ca) => ca.projectId === currentProject.id && ca.status === 'Overdue'),
      latestInspection: inspections.find((i) => i.projectId === currentProject.id),
      hazardDistribution: [
        { category: 'Housekeeping', count: 12 },
        { category: 'Working at Height', count: 7 },
        { category: 'Chemical', count: 5 },
        { category: 'Electrical', count: 3 },
      ],
    };

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToSend,
          projectContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.text || data.fallbackText || 'Kaiser AI generated response.';

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.warn('Backend endpoint unavailable, generating client-side executive analysis:', err);
      
      let dynamicResponse = '';
      const lowerQuery = queryToSend.toLowerCase();

      if (lowerQuery.includes('masalah') || lowerQuery.includes('delay') || lowerQuery.includes('isu') || lowerQuery.includes('problem')) {
        dynamicResponse = `### 📊 Analisis Isu Utama & Status Kemajuan (${currentProject.code}):
1. **Status Jadual & Kemajuan**:
   - **Kemajuan Sebenar**: **${currentProject.actualProgress}%** berbanding sasaran **${currentProject.plannedProgress}%** (Jurang / Variance: **${currentProject.variance}%**).
   - **Faktor Kelewatan**: Pemberhentian kerja akibat hujan lebat 2.0 jam pada sebelah petang dan masa menunggu kelulusan NDT bagi kimpalan piping.
2. **Isu HSE & Keselamatan**:
   - **Scaffolding Tagging**: 1 unit perancah di Zone B Pipe Rack Level 2 ditanda *Red Tag (Stop Work)* kerana ketiadaan mid-rail dan toe-board.
   - **Tindakan Pembetulan**: 2 tindakan pembetulan berstatus *Overdue* memerlukan pembersihan sisa binaan di Laydown Area 1.
3. **Cadangan Pengurusan Eksekutif**:
   - Luluskan 2 jam kerja lebih masa (OT) terancang untuk sub-kontraktor Mekanikal pada hari Sabtu bagi mengejar kemajuan kritikal.`;
      } else if (lowerQuery.includes('hazard') || lowerQuery.includes('height') || lowerQuery.includes('hse') || lowerQuery.includes('safety') || lowerQuery.includes('risiko')) {
        dynamicResponse = `### 🛡️ Analisis Trend Hazard & Kawalan Kejuruteraan HSE:
1. **Corak Hazard Berulang**:
   - **Housekeeping (12 kes)**: Sisa kabel, pallet kayu dan lebihan bahan binaan menyumbang kepada 44% daripada keseluruhan pemerhatian tapak.
   - **Working at Height (7 kes)**: Pemerhatian utama membabitkan penggunaan perancah yang belum disahkan (tanpa Green Tag) dan kegagalan mencangkuk *double lanyard* 100% tie-off.
2. **Pelan Kawalan Segera**:
   - Wajibkan *Daily 10-Minute Toolbox Talk* khusus tentang 100% Tie-Off di kawasan aras tinggi sebelum memulakan syif.
   - Laksanakan program *Clean As You Go (CAYG)* berjadual pada jam 4:30 petang setiap hari bersama semua sub-kontraktor.`;
      } else if (lowerQuery.includes('manpower') || lowerQuery.includes('pekerja') || lowerQuery.includes('headcount')) {
        dynamicResponse = `### 👷 Ringkasan Tenaga Kerja & Alokasi Tapak (${currentProject.name}):
- **Jumlah Tenaga Kerja**: **27 Pekerja** merangkumi 7 sub-bidang kemahiran.
- **Pecahan**: Mekanikal & Fitter (6), Kimpalan / Welders 6G (4), Pemasang Perancah (5), Elektrik & Instrumen (3), Sivil & Struktur (4), General Workers (3), Pasukan Keselamatan & Penyeliaan (2).
- **Status Kehadiran**: 100% pekerja memiliki Kad Hijau CIDB dan telah melengkapkan induksi keselamatan tapak.`;
      } else {
        dynamicResponse = `### 📋 Kaiser SmartSite 360 AI Brief (${currentProject.name}):
1. **Prestasi Projek**: Kemajuan semasa mencatat **${currentProject.actualProgress}%** (Sasaran: ${currentProject.plannedProgress}%). Skor keselamatan berada pada **94%** dengan **${currentProject.safeDaysWithoutLTI} Hari Selamat Tanpa LTI**.
2. **Status Hazard Tapak**: ${hazards.filter(h => h.projectId === currentProject.id && h.status !== 'Resolved').length} hazard terbuka sedang dipantau di mana langkah pencegahan telah diambil oleh Safety Officer (${currentProject.safetyOfficer}).
3. **Peringatan Pematuhan**: Pastikan semua perakuan PMA jentera berat dan permit kerja panas (PTW) diperbaharui mengikut jadual DOSH/JKKP.`;
      }

      const fallbackAiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai-fallback`,
        sender: 'ai',
        text: dynamicResponse,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, fallbackAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('AI Executive Brief copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              AI ADVISORY LAYER
            </span>
            <span className="text-xs text-slate-500">
              Powered by Gemini 3.7 Flash & Structured Site Database
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Kaiser AI Assistant & Management Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Do not let AI approve safety-critical decisions; use it to summarize, detect patterns and highlight attention areas.
          </p>
        </div>

        <div className="px-3.5 py-2 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2.5 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">AI ENGINE STATUS</span>
            <span className="text-xs font-bold text-slate-900 font-mono">Gemini 3.7 Flash Active</span>
          </div>
        </div>
      </div>

      {/* 4 CORE CAPABILITY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_PROMPTS.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.label)}
              className="bg-white hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow hover:border-amber-500 text-left transition-all group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                  {idx + 1}. {qp.category}
                </span>
                <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-slate-900 line-clamp-2">
                "{qp.label}"
              </p>
            </button>
          );
        })}
      </div>

      {/* CHAT INTERFACE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-none shadow-sm font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-slate-100 text-[10px]">
                    <span className="font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {isUser ? 'Management User' : 'Kaiser SmartSite 360 AI'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => copyToClipboard(msg.text)}
                          className="hover:text-slate-900 text-slate-400 p-0.5"
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message body with Markdown style rendering */}
                  <div className="whitespace-pre-line space-y-2 font-normal">
                    {msg.text}
                  </div>

                  {/* Suggested follow-up buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Cadangan Soalan Eksekutif:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(action)}
                            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-amber-500 text-slate-700 font-semibold rounded-lg text-[11px] transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-700 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span>Analyzing structured site records, S-curve trends, and HSE data...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Tanya soalan (e.g. 'Apa masalah utama FPG minggu ini?', 'Summarise high risk hazards')..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold uppercase tracking-wider rounded-xl text-xs flex items-center gap-1.5 shadow-sm border border-amber-600/30 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
