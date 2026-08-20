import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  ProjectId,
  UserRole,
  DailyReport,
  ManpowerEntry,
  Hazard,
  CorrectiveAction,
  Inspection,
  Equipment,
  SafetyDocument,
  AutomationAlert,
  PilotKPI,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_DAILY_REPORTS,
  INITIAL_MANPOWER,
  INITIAL_HAZARDS,
  INITIAL_CORRECTIVE_ACTIONS,
  INITIAL_INSPECTIONS,
  INITIAL_EQUIPMENT,
  INITIAL_DOCUMENTS,
  INITIAL_ALERTS,
  INITIAL_PILOT_KPI,
} from '../data/initialData';

export type NavTab = 
  | 'dashboard' 
  | 'site-input' 
  | 'hse-hazards' 
  | 'progress-manpower' 
  | 'equipment' 
  | 'documents' 
  | 'ai-advisor' 
  | 'pilot-roadmap';

interface AppContextType {
  selectedProjectId: ProjectId;
  setSelectedProjectId: (id: ProjectId) => void;
  currentProject: Project;
  projects: Project[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Data entities
  dailyReports: DailyReport[];
  manpowerEntries: ManpowerEntry[];
  hazards: Hazard[];
  correctiveActions: CorrectiveAction[];
  inspections: Inspection[];
  equipment: Equipment[];
  documents: SafetyDocument[];
  alerts: AutomationAlert[];
  pilotKPI: PilotKPI;
  
  // Actions
  addDailyReport: (report: Omit<DailyReport, 'id' | 'submittedAt'>) => void;
  addManpowerEntry: (entry: Omit<ManpowerEntry, 'id'>) => void;
  addHazard: (hazard: Omit<Hazard, 'id' | 'date' | 'time' | 'escalatedToManagement'>) => void;
  resolveHazard: (hazardId: string, afterPhotoUrl?: string) => void;
  updateCorrectiveActionStatus: (id: string, status: CorrectiveAction['status'], evidenceUrl?: string, remarks?: string) => void;
  addInspection: (inspection: Omit<Inspection, 'id' | 'date'>) => void;
  updateEquipmentStatus: (id: string, status: Equipment['status']) => void;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  
  // UI & Modals
  workflowModalOpen: boolean;
  setWorkflowModalOpen: (open: boolean) => void;
  siteSubmissionModalOpen: boolean;
  setSiteSubmissionModalOpen: (open: boolean) => void;
  activeSubmissionSubTab: 'daily-report' | 'manpower' | 'hazard' | 'inspection' | 'equipment';
  setActiveSubmissionSubTab: (tab: 'daily-report' | 'manpower' | 'hazard' | 'inspection' | 'equipment') => void;
  
  // Toast notification
  toastMessage: { text: string; type: 'success' | 'alert' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'alert' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId>('proj-fpg');
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [userRole, setUserRole] = useState<UserRole>('DIRECTOR');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const [dailyReports, setDailyReports] = useState<DailyReport[]>(() => {
    const saved = localStorage.getItem('kaiser_daily_reports');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_REPORTS;
  });

  const [manpowerEntries, setManpowerEntries] = useState<ManpowerEntry[]>(() => {
    const saved = localStorage.getItem('kaiser_manpower');
    return saved ? JSON.parse(saved) : INITIAL_MANPOWER;
  });

  const [hazards, setHazards] = useState<Hazard[]>(() => {
    const saved = localStorage.getItem('kaiser_hazards');
    return saved ? JSON.parse(saved) : INITIAL_HAZARDS;
  });

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(() => {
    const saved = localStorage.getItem('kaiser_corrective_actions');
    return saved ? JSON.parse(saved) : INITIAL_CORRECTIVE_ACTIONS;
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const saved = localStorage.getItem('kaiser_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('kaiser_equipment');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [documents] = useState<SafetyDocument[]>(INITIAL_DOCUMENTS);
  const [alerts, setAlerts] = useState<AutomationAlert[]>(INITIAL_ALERTS);
  const [pilotKPI] = useState<PilotKPI>(INITIAL_PILOT_KPI);

  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [siteSubmissionModalOpen, setSiteSubmissionModalOpen] = useState(false);
  const [activeSubmissionSubTab, setActiveSubmissionSubTab] = useState<'daily-report' | 'manpower' | 'hazard' | 'inspection' | 'equipment'>('daily-report');
  
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'alert' | 'info' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kaiser_daily_reports', JSON.stringify(dailyReports));
  }, [dailyReports]);

  useEffect(() => {
    localStorage.setItem('kaiser_hazards', JSON.stringify(hazards));
  }, [hazards]);

  useEffect(() => {
    localStorage.setItem('kaiser_corrective_actions', JSON.stringify(correctiveActions));
  }, [correctiveActions]);

  const showToast = (text: string, type: 'success' | 'alert' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Daily Report addition
  const addDailyReport = (reportData: Omit<DailyReport, 'id' | 'submittedAt'>) => {
    const newReport: DailyReport = {
      ...reportData,
      id: `dr-${Date.now().toString().slice(-6)}`,
      submittedAt: new Date().toISOString(),
    };
    setDailyReports((prev) => [newReport, ...prev]);
    showToast('Daily Site Report successfully logged to central database!', 'success');
  };

  // Manpower addition
  const addManpowerEntry = (entryData: Omit<ManpowerEntry, 'id'>) => {
    const newEntry: ManpowerEntry = {
      ...entryData,
      id: `mp-${Date.now().toString().slice(-6)}`,
    };
    setManpowerEntries((prev) => [newEntry, ...prev]);
    showToast(`Manpower logged: ${entryData.totalHeadcount} workers on site.`, 'success');
  };

  // Hazard addition with automatic automation trigger for High/Critical hazards!
  const addHazard = (hazardData: Omit<Hazard, 'id' | 'date' | 'time' | 'escalatedToManagement'>) => {
    const isHighOrCritical = hazardData.riskLevel === 'High' || hazardData.riskLevel === 'Critical';
    const newHazardId = `hz-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();

    const newHazard: Hazard = {
      ...hazardData,
      id: newHazardId,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      escalatedToManagement: isHighOrCritical,
      escalationTriggeredAt: isHighOrCritical ? now.toISOString() : undefined,
    };

    setHazards((prev) => [newHazard, ...prev]);

    // Automatically create a corresponding corrective action
    const newCA: CorrectiveAction = {
      id: `ca-${Date.now().toString().slice(-4)}`,
      hazardId: newHazardId,
      projectId: hazardData.projectId,
      title: `Containment for ${hazardData.category}: ${hazardData.locationZone}`,
      finding: hazardData.finding,
      actionRequired: hazardData.immediateActionTaken || 'Conduct immediate hazard elimination / engineering control.',
      pic: hazardData.pic || 'Safety Supervisor',
      dueDate: hazardData.dueDate || now.toISOString().split('T')[0],
      status: 'Open',
      priority: isHighOrCritical ? 'Urgent' : hazardData.riskLevel === 'Medium' ? 'High' : 'Medium',
    };
    setCorrectiveActions((prev) => [newCA, ...prev]);

    // If High or Critical risk, trigger automatic system escalation alert (matching Slide 6 trigger)
    if (isHighOrCritical) {
      const newAlert: AutomationAlert = {
        id: `alt-${Date.now().toString().slice(-5)}`,
        timestamp: now.toISOString(),
        projectId: hazardData.projectId,
        type: 'HIGH_RISK_HAZARD',
        title: `🚨 AUTOMATED ESCALATION: ${hazardData.riskLevel.toUpperCase()} RISK HAZARD in ${hazardData.locationZone}`,
        message: `Finding: "${hazardData.finding}". Immediate notification dispatched to PM (${currentProject.projectManager}), Safety Officer (${currentProject.safetyOfficer}), and Executive Management.`,
        severity: 'critical',
        recipients: [currentProject.safetyOfficer, currentProject.projectManager, 'Executive Director'],
        acknowledged: false,
        actionUrl: 'hse-hazards',
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`HIGH RISK ALERT TRIGGERED! Instant notification dispatched to Project Management.`, 'alert');
    } else {
      showToast(`Hazard logged and Corrective Action assigned to ${newCA.pic}.`, 'success');
    }
  };

  const resolveHazard = (hazardId: string, afterPhotoUrl?: string) => {
    const now = new Date();
    setHazards((prev) =>
      prev.map((h) =>
        h.id === hazardId
          ? {
              ...h,
              status: 'Resolved',
              resolvedDate: now.toISOString().split('T')[0],
              photoAfterUrl: afterPhotoUrl || h.photoAfterUrl,
            }
          : h
      )
    );
    // Also close linked CA
    setCorrectiveActions((prev) =>
      prev.map((ca) =>
        ca.hazardId === hazardId
          ? { ...ca, status: 'Closed', completedAt: now.toISOString() }
          : ca
      )
    );
    showToast('Hazard marked as Resolved and Corrective Action closed.', 'success');
  };

  const updateCorrectiveActionStatus = (
    id: string,
    status: CorrectiveAction['status'],
    evidenceUrl?: string,
    remarks?: string
  ) => {
    setCorrectiveActions((prev) =>
      prev.map((ca) =>
        ca.id === id
          ? {
              ...ca,
              status,
              evidenceUrl: evidenceUrl || ca.evidenceUrl,
              completionRemarks: remarks || ca.completionRemarks,
              completedAt: status === 'Closed' ? new Date().toISOString() : ca.completedAt,
            }
          : ca
      )
    );
    showToast(`Corrective Action status updated to ${status}.`, 'info');
  };

  const addInspection = (inspectionData: Omit<Inspection, 'id' | 'date'>) => {
    const newInspection: Inspection = {
      ...inspectionData,
      id: `insp-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setInspections((prev) => [newInspection, ...prev]);
    showToast(`Inspection logged with compliance score: ${inspectionData.complianceScore}% (${inspectionData.overallResult})`, 'success');
  };

  const updateEquipmentStatus = (id: string, status: Equipment['status']) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, status, lastInspectionDate: new Date().toISOString().split('T')[0] } : eq))
    );
    showToast(`Equipment operational status updated to ${status}.`, 'info');
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return (
    <AppContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        currentProject,
        projects,
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        dailyReports,
        manpowerEntries,
        hazards,
        correctiveActions,
        inspections,
        equipment,
        documents,
        alerts,
        pilotKPI,
        addDailyReport,
        addManpowerEntry,
        addHazard,
        resolveHazard,
        updateCorrectiveActionStatus,
        addInspection,
        updateEquipmentStatus,
        acknowledgeAlert,
        dismissAlert,
        workflowModalOpen,
        setWorkflowModalOpen,
        siteSubmissionModalOpen,
        setSiteSubmissionModalOpen,
        activeSubmissionSubTab,
        setActiveSubmissionSubTab,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
