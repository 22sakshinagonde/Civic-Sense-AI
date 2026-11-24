import React, { useMemo, useState } from 'react';
import { Complaint, RouteId } from '../types/civic';
import { ResilientImage } from '../components/ResilientImage';

interface CitizenTrackerViewProps {
  complaints: Complaint[];
  karma: number;
  onNavigate: (route: RouteId, ticketId?: string) => void;
  onFeedback: (id: string, vote: 'up' | 'down') => void;
  onShowInfoModal: (title: string, body: string) => void;
}

export const CitizenTrackerView: React.FC<CitizenTrackerViewProps> = ({
  complaints,
  karma,
  onNavigate,
  onFeedback,
  onShowInfoModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  // Citizen's primary tracked tickets (first 3 default + any user-submitted tickets)
  const citizenComplaints = useMemo(() => {
    return complaints.filter(
      (c) =>
        c.reportedBy.includes('Rahul') ||
        c.id.startsWith('BLR-2024-8891') ||
        c.id.startsWith('BLR-2024-7620') ||
        c.id.startsWith('BLR-2024-6512') ||
        c.id.startsWith('BLR-2026-')
    );
  }, [complaints]);

  const counts = useMemo(() => {
    const extraCount = Math.max(0, citizenComplaints.length - 3);
    const activeExtra = citizenComplaints
      .slice(3)
      .filter((c) => c.status !== 'Resolved').length;
    const resolvedExtra = citizenComplaints
      .slice(3)
      .filter((c) => c.status === 'Resolved').length;

    return {
      total: 14 + extraCount,
      inProgress: 3 + activeExtra,
      resolved: 10 + resolvedExtra,
      underReview: 1,
      activeTab: 4 + activeExtra,
    };
  }, [citizenComplaints]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return citizenComplaints.filter((c) => {
      const isResolved = c.status === 'Resolved';
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !isResolved) ||
        (filter === 'resolved' && isResolved);

      const matchesQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [citizenComplaints, filter, searchQuery]);

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-4 space-y-4">
      {/* Top Row: Welcome Banner & Instant Reporter CTA on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Welcome & Citizen Karma Banner */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-xl bg-primary text-on-primary p-4 shadow-md flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-secondary/15 blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-fixed-dim flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary-fixed">verified_user</span>
                Citizen Portal
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant shadow-sm">
                <span className="material-symbols-outlined material-symbols-filled text-[15px]">
                  workspace_premium
                </span>
                <span className="text-[11px] font-semibold tabular-nums">{karma} Karma</span>
              </div>
            </div>
            <div className="mt-1">
              <h1 className="text-[20px] font-semibold tracking-tight text-surface-container-lowest">
                Welcome back, Rahul Sharma!
              </h1>
              <p className="text-[13px] text-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-secondary-fixed shrink-0">
                  pin_drop
                </span>
                Ward 150, Bellandur South • <span className="text-secondary-fixed font-semibold">Civic Champion</span>
              </p>
            </div>
          </div>
        </div>

        {/* Instant Issue Reporter CTA */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[26px]">photo_camera</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[14px] font-semibold text-on-surface truncate">
                  Instant Issue Reporter
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant">
                  AI Auto-Geotag
                </span>
              </div>
              <p className="text-[13px] text-on-surface-variant truncate">
                Snap road defects or sanitation anomalies
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('report-issue')}
            className="shrink-0 h-10 px-4 rounded-lg bg-primary text-on-primary text-[14px] font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Track by Reference Number Search Bar */}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Track by Ticket ID (e.g. BLR-2024-8891)..."
            className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface text-[14px] placeholder:text-outline shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear Search"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Metric Cards + Ward Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 2x2 Summary Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-2.5">
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Total Filed
              </span>
              <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-primary tabular-nums">{counts.total}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Lifetime</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-tertiary-fixed-variant uppercase tracking-wider">
                In Progress
              </span>
              <div className="w-7 h-7 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">pending_actions</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-on-tertiary-container tabular-nums">
                {String(counts.inProgress).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-semibold text-on-tertiary-fixed-variant">Active Crews</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                Resolved
              </span>
              <div className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-secondary tabular-nums">{counts.resolved}</span>
              <span className="text-[11px] text-secondary font-medium tabular-nums">
                {Math.round((counts.resolved / counts.total) * 1000) / 10}% Rate
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-primary-fixed-variant uppercase tracking-wider">
                Under Review
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">troubleshoot</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-primary-container tabular-nums">
                {String(counts.underReview).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-semibold text-on-primary-fixed-variant">AI Triage</span>
            </div>
          </div>
        </div>

        {/* Ward Issue Breakdown */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">donut_small</span>
              <h2 className="text-[14px] font-semibold text-on-surface">Ward Issue Breakdown</h2>
            </div>
            <span className="text-[11px] font-semibold text-on-surface-variant">Past 30 Days</span>
          </div>

          <div className="w-full h-3 rounded-full bg-surface-container flex overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '45%' }} title="Potholes (45%)" />
            <div className="h-full bg-secondary" style={{ width: '30%' }} title="Waste & Sanitation (30%)" />
            <div className="h-full bg-tertiary-fixed-dim" style={{ width: '15%' }} title="Streetlights (15%)" />
            <div className="h-full bg-secondary-fixed-dim" style={{ width: '10%' }} title="Drainage (10%)" />
          </div>

          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 pt-1">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                <span className="text-[13px] text-on-surface truncate">Potholes</span>
              </div>
              <span className="text-[11px] font-semibold text-primary tabular-nums">45%</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
                <span className="text-[13px] text-on-surface truncate">Waste / Garbage</span>
              </div>
              <span className="text-[11px] font-semibold text-secondary tabular-nums">30%</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim shrink-0" />
                <span className="text-[13px] text-on-surface truncate">Streetlights</span>
              </div>
              <span className="text-[11px] font-semibold text-on-tertiary-container tabular-nums">15%</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim shrink-0" />
                <span className="text-[13px] text-on-surface truncate">Drainage</span>
              </div>
              <span className="text-[11px] font-semibold text-secondary tabular-nums">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Grievances Header & Filter Chips */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-on-surface">Recent Reports</h2>
          <span className="text-[11px] text-secondary font-medium">Real-time BBMP Sync</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`h-8 px-3.5 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            All ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`h-8 px-3.5 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
              filter === 'active'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Active ({counts.activeTab})
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`h-8 px-3.5 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
              filter === 'resolved'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Resolved ({counts.resolved})
          </button>
        </div>
      </div>

      {/* Issue Cards Container */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredList.map((item) => {
            const isInProgress = item.status === 'In Progress';
            const isResolved = item.status === 'Resolved';
            return (
              <article
                key={item.id}
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onNavigate('issue-details', item.id)}
                          className="text-[12px] font-semibold text-primary hover:underline cursor-pointer"
                        >
                          #{item.id}
                        </button>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                          {item.department}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('issue-details', item.id)}
                        className="text-left text-[14px] text-on-surface font-semibold mt-1 hover:text-primary transition-colors cursor-pointer"
                      >
                        {item.title}
                      </button>
                    </div>

                    {isInProgress ? (
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-container text-[11px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
                        IN PROGRESS
                      </span>
                    ) : isResolved ? (
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        RESOLVED
                      </span>
                    ) : (
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-surface-variant text-primary text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">assignment_ind</span>
                        {item.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Photo & Context */}
                  <div
                    onClick={() => onNavigate('issue-details', item.id)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container shrink-0">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        fallbackIcon="photo"
                      />
                    </div>
                    <div className="flex flex-col justify-between h-20 py-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isResolved ? (
                          <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-medium">
                            Verified by {item.assignedEngineer}
                          </span>
                        ) : item.urgency === 'severe' && item.status === 'Assigned' ? (
                          <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold">
                            {item.severityLabel}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-[11px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">psychology</span>
                            AI: {item.aiConfidence}% Severe Damage
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-on-surface-variant truncate">
                        {isResolved ? 'Status: ' : 'Assigned: '}
                        <span className={`font-medium ${isResolved ? 'text-secondary' : 'text-on-surface'}`}>
                          {isResolved ? 'Cleared & Sanitized' : item.assignedCrew}
                        </span>
                      </p>
                      <div
                        className={`flex items-center gap-1 text-[11px] font-semibold ${
                          isInProgress
                            ? 'text-on-tertiary-container'
                            : isResolved
                            ? 'text-outline'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isInProgress ? 'schedule' : isResolved ? 'event_available' : 'build'}
                        </span>
                        <span className="truncate">
                          {isInProgress
                            ? `Est. Repair: ${item.slaRemaining}`
                            : isResolved
                            ? 'Closed 2 days ago • +50 Karma earned'
                            : item.dispatchNote}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                {isInProgress && (
                  <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                        fire_truck
                      </span>
                      <span className="text-[13px] text-on-surface truncate">{item.dispatchNote}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('issue-details', item.id)}
                      className="text-secondary text-[11px] font-semibold hover:underline shrink-0 cursor-pointer"
                    >
                      Live Track
                    </button>
                  </div>
                )}

                {isResolved && (
                  <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between">
                    <span className="text-[13px] text-on-surface">Satisfied with the cleanup quality?</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Satisfied"
                        onClick={() => onFeedback(item.id, 'up')}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          item.feedback === 'up'
                            ? 'bg-secondary text-on-secondary'
                            : 'text-secondary hover:bg-secondary-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                      </button>
                      <button
                        type="button"
                        title="Not satisfied"
                        onClick={() => onFeedback(item.id, 'down')}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          item.feedback === 'down'
                            ? 'bg-error text-on-error'
                            : 'text-outline hover:text-error'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-center p-4 bg-surface-container-lowest rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mb-2">
            <span className="material-symbols-outlined text-[24px]">search_off</span>
          </div>
          <h3 className="text-[16px] text-on-surface font-medium">No complaints match your query</h3>
          <p className="text-[13px] text-on-surface-variant mt-1">
            Double check reference ticket number or try clearing filters.
          </p>
        </div>
      )}

      {/* Ward Community Assistance Widget */}
      <div className="bg-surface-container-high/60 rounded-xl p-4 flex items-center justify-between gap-2.5 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">forum</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] text-primary font-semibold truncate">Ward 150 Citizens Forum</span>
            <span className="text-[13px] text-on-surface-variant truncate">
              Discuss community resolutions &amp; park upkeep
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            onShowInfoModal(
              'Ward 150 Citizens Forum (Bellandur)',
              'Next RWA & BBMP Ward Committee Sync: Saturday 10:00 AM at Bellandur Lake Promenade. 14 active resident threads on Bellandur stormwater desilting and ORR streetlight audits.'
            )
          }
          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary text-[11px] font-semibold shadow-sm hover:bg-surface-container-low transition-colors shrink-0 cursor-pointer"
        >
          Join Discussion
        </button>
      </div>
    </div>
  );
};
