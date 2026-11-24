export type RouteId =
  | 'home-overview'
  | 'citizen-tracker'
  | 'report-issue'
  | 'ai-analytics'
  | 'admin-portal'
  | 'issue-details';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved';

export type IssueCategoryKey =
  | 'roads'
  | 'garbage'
  | 'water'
  | 'streetlights'
  | 'drainage'
  | 'animals';

export type UrgencyLevel = 'low' | 'moderate' | 'severe';

export type TimeframeKey = '24h' | '7d' | 'month' | 'q3';

export interface TimelineStep {
  title: string;
  time: string;
  description: string;
  state: 'completed' | 'active' | 'pending';
  badge?: string;
  crewNote?: string;
  etaNote?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  categoryKey: IssueCategoryKey;
  categoryLabel: string;
  department: string;
  ward: string;
  location: string;
  landmark: string;
  coordinates: string;
  status: ComplaintStatus;
  urgency: UrgencyLevel;
  severityLabel: string;
  aiConfidence: number;
  detectionLabel: string;
  aiDepthNote?: string;
  reportedBy: string;
  reportedAt: string;
  timeAgo: string;
  slaRemaining: string;
  slaBadge: string;
  assignedCrew: string;
  assignedEngineer: string;
  dispatchNote: string;
  imageUrl: string;
  imageAlt: string;
  mapPreviewUrl: string;
  duplicateCount?: number;
  feedback?: 'up' | 'down' | null;
  subscribed?: boolean;
  timeline: TimelineStep[];
}

export interface ResolvedSpotlight {
  id: string;
  department: string;
  resolvedIn: string;
  title: string;
  wardAndTicket: string;
  beforeImage: string;
  beforeAlt: string;
  afterImage: string;
  afterAlt: string;
  afterTag: string;
  approvals: number;
  approvedByUser?: boolean;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  ticketId?: string;
  unread: boolean;
}
