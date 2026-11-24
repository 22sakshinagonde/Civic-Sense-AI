import { useCallback, useMemo, useState } from 'react';
import { AppShell } from './components/AppShell';
import {
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SPOTLIGHTS,
} from './data/civicData';
import {
  Complaint,
  ComplaintStatus,
  NotificationItem,
  ResolvedSpotlight,
  RouteId,
} from './types/civic';
import { AdminPortalView } from './views/AdminPortalView';
import { AiAnalyticsView } from './views/AiAnalyticsView';
import { CitizenTrackerView } from './views/CitizenTrackerView';
import { HomeOverviewView } from './views/HomeOverviewView';
import { IssueDetailsView } from './views/IssueDetailsView';
import { ReportIssueView } from './views/ReportIssueView';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteId>('home-overview');
  const [previousRoute, setPreviousRoute] = useState<RouteId>('citizen-tracker');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(INITIAL_COMPLAINTS[0].id);
  const [spotlights, setSpotlights] = useState<ResolvedSpotlight[]>(INITIAL_SPOTLIGHTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [karma, setKarma] = useState<number>(850);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; body: string } | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const handleNavigate = useCallback(
    (route: RouteId, ticketId?: string) => {
      if (route === 'issue-details') {
        if (currentRoute !== 'issue-details') {
          setPreviousRoute(currentRoute);
        }
        if (ticketId) {
          setSelectedTicketId(ticketId);
        }
      }
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentRoute]
  );

  const handleBack = useCallback(() => {
    setCurrentRoute(previousRoute === 'issue-details' ? 'citizen-tracker' : previousRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [previousRoute]);

  const selectedComplaint = useMemo(() => {
    return complaints.find((c) => c.id === selectedTicketId) ?? complaints[0];
  }, [complaints, selectedTicketId]);

  const handleApproveSpotlight = (id: string) => {
    setSpotlights((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextApproved = !s.approvedByUser;
        return {
          ...s,
          approvedByUser: nextApproved,
          approvals: nextApproved ? s.approvals + 1 : s.approvals - 1,
        };
      })
    );
  };

  const handleFeedback = (id: string, vote: 'up' | 'down') => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, feedback: c.feedback === vote ? null : vote } : c))
    );
    showToast(vote === 'up' ? 'Thank you! Cleanup verification logged.' : 'Re-inspection request logged for Ward Inspector.');
  };

  const handleSubmitComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    setKarma((k) => k + 25);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: `Ticket #${newComplaint.id} Registered`,
        body: `Routed to ${newComplaint.department}. +25 Civic Karma earned.`,
        time: 'Just now',
        ticketId: newComplaint.id,
        unread: true,
      },
      ...prev,
    ]);
    setSelectedTicketId(newComplaint.id);
    setPreviousRoute('citizen-tracker');
    setCurrentRoute('issue-details');
    showToast(`Registered Ticket #${newComplaint.id} (+25 Karma)`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateDepartment = (id: string, department: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              department,
              dispatchNote: `Re-routed to ${department}`,
            }
          : c
      )
    );
  };

  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updatedTimeline = c.timeline.map((step) => {
          const order = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
          const targetIdx = order.indexOf(status);
          const stepTitleMap: Record<string, number> = {
            Submitted: 0,
            'Under AI Review': 1,
            Assigned: 2,
            'In Progress': 3,
            'Resolved & Verified': 4,
          };
          const stepIdx = stepTitleMap[step.title] ?? 0;
          if (stepIdx < targetIdx) return { ...step, state: 'completed' as const };
          if (stepIdx === targetIdx) {
            return {
              ...step,
              state: status === 'Resolved' ? ('completed' as const) : ('active' as const),
              time: step.time === 'Pending' ? 'Just now' : step.time,
            };
          }
          return { ...step, state: 'pending' as const };
        });

        return {
          ...c,
          status,
          slaBadge: status === 'Resolved' ? 'SLA Met' : c.slaBadge,
          slaRemaining: status === 'Resolved' ? 'Closed Today' : c.slaRemaining,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const handleToggleSubscribe = (ticketId: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === ticketId ? { ...c, subscribed: !c.subscribed } : c))
    );
  };

  const handleAddNote = (ticketId: string, note: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === ticketId
          ? {
              ...c,
              description: `${c.description} [Citizen Update: ${note}]`,
              timeline: [
                ...c.timeline.slice(0, -1),
                {
                  title: 'Citizen Update Added',
                  time: 'Just now',
                  description: note,
                  state: 'completed' as const,
                },
                c.timeline[c.timeline.length - 1],
              ],
            }
          : c
      )
    );
  };

  const handleEscalate = (ticketId: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === ticketId
          ? {
              ...c,
              urgency: 'severe',
              slaBadge: 'Escalated P0',
              severityLabel: 'Escalated to Ward Executive Engineer',
            }
          : c
      )
    );
  };

  return (
    <AppShell
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      onBack={handleBack}
      notifications={notifications}
      onMarkAllRead={() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
      }
      karma={karma}
    >
      {currentRoute === 'home-overview' && (
        <HomeOverviewView
          onNavigate={handleNavigate}
          spotlights={spotlights}
          onApproveSpotlight={handleApproveSpotlight}
          totalComplaintsCount={complaints.length}
          onShowInfoModal={(title, body) => setInfoModal({ title, body })}
        />
      )}

      {currentRoute === 'citizen-tracker' && (
        <CitizenTrackerView
          complaints={complaints}
          karma={karma}
          onNavigate={handleNavigate}
          onFeedback={handleFeedback}
          onShowInfoModal={(title, body) => setInfoModal({ title, body })}
        />
      )}

      {currentRoute === 'report-issue' && (
        <ReportIssueView
          onSubmitComplaint={handleSubmitComplaint}
          onViewMasterCluster={() => handleNavigate('issue-details', 'BLR-2024-8891')}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'ai-analytics' && (
        <AiAnalyticsView
          onShowToast={showToast}
          onShowInfoModal={(title, body) => setInfoModal({ title, body })}
        />
      )}

      {currentRoute === 'admin-portal' && (
        <AdminPortalView
          complaints={complaints}
          onUpdateDepartment={handleUpdateDepartment}
          onUpdateStatus={handleUpdateStatus}
          onNavigate={handleNavigate}
          onShowToast={showToast}
          onShowInfoModal={(title, body) => setInfoModal({ title, body })}
        />
      )}

      {currentRoute === 'issue-details' && selectedComplaint && (
        <IssueDetailsView
          complaint={selectedComplaint}
          allComplaints={complaints}
          onSelectTicket={(id) => setSelectedTicketId(id)}
          onToggleSubscribe={handleToggleSubscribe}
          onAddNote={handleAddNote}
          onEscalate={handleEscalate}
          onShowToast={showToast}
        />
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-[13px] font-medium max-w-[90vw]"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary-fixed">check_circle</span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Clean Info Modal */}
      {infoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-primary">{infoModal.title}</h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">{infoModal.body}</p>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[12px] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
