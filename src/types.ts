export type ProjectId = 'proj-fpg' | 'proj-bb' | 'proj-kemaman';

export type UserRole = 'DIRECTOR' | 'PROJECT_MANAGER' | 'HSE_OFFICER' | 'SITE_SUPERVISOR';

export interface Project {
  id: ProjectId;
  code: string;
  name: string;
  client: string;
  location: string;
  plannedProgress: number;
  actualProgress: number;
  variance: number; // e.g. -4%
  contractValue: string;
  startDate: string;
  targetCompletion: string;
  totalManHours: number;
  safeDaysWithoutLTI: number;
  projectManager: string;
  safetyOfficer: string;
  leadSupervisor: string;
  status: 'Active' | 'Under Review' | 'Completed';
  currentPhase: string;
}

export type WeatherCondition = 'Sunny / Clear' | 'Cloudy' | 'Light Rain' | 'Heavy Downpour' | 'Hazy / Hot';

export type DelayReason = 
  | 'None'
  | 'Adverse Weather / Rain'
  | 'Material Delivery Delay'
  | 'Permit to Work (PTW) Pending'
  | 'Client / Consultant Variation'
  | 'Machinery Breakdown'
  | 'Safety Stand-Down';

export interface DailyReport {
  id: string;
  projectId: ProjectId;
  date: string;
  shift: 'Day Shift' | 'Night Shift';
  weather: WeatherCondition;
  temperature: string;
  delayHours: number;
  delayReason: DelayReason;
  workPackagesCompleted: {
    packageId: string;
    title: string;
    zone: string;
    percentageCompletedToday: number;
    cumulativeProgress: number;
    notes: string;
  }[];
  supervisorName: string;
  submittedAt: string;
  submissionDurationSeconds: number; // e.g. 280s (4.6 mins)
  verifiedBy?: string;
  status: 'Submitted' | 'Verified' | 'Requires Clarification';
  photos: {
    id: string;
    url: string;
    caption: string;
    timestamp: string;
  }[];
  keyMilestoneNotes: string;
}

export interface TradeCount {
  trade: string;
  category: 'Structural' | 'Architectural' | 'M&E' | 'Safety' | 'General';
  count: number;
  company: string;
}

export interface ManpowerEntry {
  id: string;
  projectId: ProjectId;
  date: string;
  totalHeadcount: number;
  totalManHours: number;
  overtimeHours: number;
  trades: TradeCount[];
  supervisor: string;
  notes?: string;
}

export type HazardCategory = 
  | 'Housekeeping'
  | 'Working at Height'
  | 'Chemical'
  | 'Electrical'
  | 'Scaffolding'
  | 'Excavation & Trenching'
  | 'Plant & Machinery'
  | 'Personal Protective Equipment (PPE)'
  | 'Fire Safety';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type HazardStatus = 'Open' | 'Under Action' | 'Resolved' | 'Closed';

export interface Hazard {
  id: string;
  projectId: ProjectId;
  date: string;
  time: string;
  reportedBy: string;
  reporterRole: string;
  category: HazardCategory;
  locationZone: string;
  riskLevel: RiskLevel;
  riskScore: number; // 1 - 25 matrix
  finding: string;
  immediateActionTaken: string;
  photoBeforeUrl?: string;
  photoAfterUrl?: string;
  status: HazardStatus;
  pic: string; // Person In Charge
  dueDate: string;
  resolvedDate?: string;
  escalatedToManagement: boolean;
  escalationTriggeredAt?: string;
  hirarcReference?: string;
  aiSuggestedAction?: string;
}

export interface CorrectiveAction {
  id: string;
  hazardId: string;
  projectId: ProjectId;
  title: string;
  finding: string;
  actionRequired: string;
  pic: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Pending Verification' | 'Closed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  verifiedBy?: string;
  evidenceUrl?: string;
  completionRemarks?: string;
  completedAt?: string;
}

export type InspectionCheckStatus = 'PASS' | 'ATTENTION' | 'FAIL' | 'N/A';

export interface InspectionItem {
  id: string;
  checkName: string;
  category: string;
  status: InspectionCheckStatus;
  defectNotes?: string;
  photoUrl?: string;
}

export interface Inspection {
  id: string;
  projectId: ProjectId;
  date: string;
  inspectorName: string;
  inspectorRole: string;
  inspectionType: 
    | 'Daily PPE & Site Order'
    | 'Scaffolding Tagging & Stability'
    | 'Heavy Plant & Lifting Gear'
    | 'Electrical DB & Power Tools'
    | 'Fire Extinguisher & First Aid'
    | 'Weekly Comprehensive HSE Audit';
  complianceScore: number; // e.g. 92%
  overallResult: 'PASS' | 'ATTENTION' | 'FAIL';
  items: InspectionItem[];
  remarks: string;
  signature: string;
}

export interface Equipment {
  id: string;
  projectId: ProjectId;
  equipmentCode: string;
  name: string;
  type: 'Excavator' | 'Tower Crane' | 'Mobile Crane' | 'Scissor Lift' | 'Generator' | 'Piling Rig' | 'Air Compressor';
  registrationNo: string;
  pmaCertNo: string; // DOSH / JKKP Certificate
  pmaExpiryDate: string;
  status: 'Operational' | 'Requires Maintenance' | 'Grounded / Stop Work' | 'Demobilized';
  lastInspectionDate: string;
  nextServiceDue: string;
  operatorName: string;
  hoursOperatedTotal: number;
}

export interface SafetyDocument {
  id: string;
  projectId: ProjectId;
  title: string;
  docType: 'HIRARC' | 'SOP' | 'SDS' | 'Method Statement' | 'Toolbox Talk' | 'Incident Report';
  docNumber: string;
  version: string;
  revisionDate: string;
  approvedBy: string;
  tags: string[];
  summary: string;
  fileUrl?: string;
  status: 'Active' | 'Under Review' | 'Archived';
  hazardCategoryLinked?: HazardCategory;
}

export interface AutomationAlert {
  id: string;
  timestamp: string;
  projectId: ProjectId;
  type: 'HIGH_RISK_HAZARD' | 'OVERDUE_ACTION' | 'SCHEDULE_VARIANCE' | 'INSPECTION_DEFECT' | 'WEATHER_HALT';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  recipients: string[];
  acknowledged: boolean;
  actionUrl?: string;
}

export interface PilotKPI {
  submissionRate: {
    target: number; // 95%
    actual: number; // 97.4%
    status: 'PASS' | 'OFF_TRACK';
  };
  inspectionCompletion: {
    target: number; // 95%
    actual: number; // 96.2%
    status: 'PASS' | 'OFF_TRACK';
  };
  dailyInputTimeMinutes: {
    target: number; // < 10 mins
    actual: number; // 4.8 mins
    status: 'PASS' | 'OFF_TRACK';
  };
  overdueActionRate: {
    target: number; // < 5%
    actual: number; // 3.8%
    status: 'PASS' | 'OFF_TRACK';
  };
  dashboardUptime: {
    target: number; // 99.5%
    actual: number; // 99.9%
    status: 'PASS' | 'OFF_TRACK';
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  metadata?: {
    confidenceScore?: number;
    sources?: string[];
    riskAssessmentLevel?: string;
  };
}
