import React, { useMemo, useState } from 'react';
import { Complaint, ComplaintStatus, RouteId } from '../types/civic';
import { ResilientImage } from '../components/ResilientImage';

interface AdminPortalViewProps {
  complaints: Complaint[];
  onUpdateDepartment: (id: string, department: string) => void;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
  onNavigate: (route: RouteId, ticketId?: string) => void;
  onShowToast: (msg: string) => void;
  onShowInfoModal: (title: string, body: string) => void;
}

type AdminFilter = 'all' | 'sla' | 'ward174' | 'high' | 'bwssb';

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  complaints,
  onUpdateDepartment,
  onUpdateStatus,
  onNavigate,
  onShowToast,
  onShowInfoModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AdminFilter>('all');
  const [selectedZone, setSelectedZone] = useState('East Bengaluru Zone (BBMP)');
  const [dispatchedIds, setDispatchedIds] = useState<Record<string, boolean>>({});
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Priority Monsoon Alert: Ward Engineers in Bellandur & HSR Layout requested to clear stormwater culverts before 18:00 IST.'
  );

  const feedTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return complaints.filter((t) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'sla' && (t.slaBadge.includes('SLA') || t.urgency === 'severe')) ||
        (activeFilter === 'ward174' && (t.ward.includes('174') || t.ward.includes('HSR'))) ||
        (activeFilter === 'high' && t.urgency === 'severe') ||
        (activeFilter === 'bwssb' && t.department.toUpperCase().includes('BWSSB'));

      const matchesQuery =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.ward.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [complaints, activeFilter, searchQuery]);

  const resolvedTodayCount = 664 + complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Command Center Header Summary */}
      <section className="px-4 md:px-6 py-4 bg-surface-container-low flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                Live Municipal Grid
              </span>
            </div>
            <h1 className="text-[20px] text-on-surface font-semibold tracking-tight">
              BBMP Civic Command Center
            </h1>
            <p className="text-[13px] text-on-surface-variant truncate">
              Centralised Grievance Redressal &amp; Field Engineer Dispatch
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1.5 rounded-lg shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <span className="text-[11px] font-semibold text-on-surface">Ward #174</span>
          </div>
        </div>

        {/* Officer Profile Pill */}
        <div className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-2.5 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-base flex-shrink-0">
              KN
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold text-on-surface truncate">
                Chief Engineer K. R. Nagaraj
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                {selectedZone}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Switch Zone"
            onClick={() => {
              const next =
                selectedZone === 'East Bengaluru Zone (BBMP)'
                  ? 'Mahadevapura Zone (BBMP)'
                  : selectedZone === 'Mahadevapura Zone (BBMP)'
                  ? 'Bommanahalli & HSR Zone (BBMP)'
                  : 'East Bengaluru Zone (BBMP)';
              setSelectedZone(next);
              onShowToast(`Switched command zone to ${next}`);
            }}
            className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </section>

      {/* Metric Highlights Grid + Live AI Core Banner */}
      <div className="px-4 md:px-6 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <section className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-variant">Active Total</span>
              <div className="w-6 h-6 rounded-md bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">inbox</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] text-primary font-bold tabular-nums">
                {(1414 + complaints.length).toLocaleString()}
              </span>
              <span className="text-[11px] text-secondary font-medium">East Div</span>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full w-[78%]" />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-error font-medium">Pending Action</span>
              <div className="w-6 h-6 rounded-md bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">emergency_home</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] text-error font-bold tabular-nums">215</span>
              <span className="text-[11px] text-error font-semibold flex items-center tabular-nums">
                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>12 SLA
              </span>
            </div>
            <div className="w-full bg-error-container h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-error h-full w-[65%]" />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-tertiary-container font-medium">Under Repair</span>
              <div className="w-6 h-6 rounded-md bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">engineering</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] text-on-tertiary-container font-bold tabular-nums">540</span>
              <span className="text-[11px] text-on-surface-variant">38 crews</span>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-on-tertiary-container h-full w-[52%]" />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-secondary font-medium">Resolved Today</span>
              <div className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] text-secondary font-bold tabular-nums">
                {resolvedTodayCount}
              </span>
              <span className="text-[11px] text-secondary font-semibold">+18%</span>
            </div>
            <div className="w-full bg-secondary-container h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-secondary h-full w-[90%]" />
            </div>
          </div>
        </section>

        {/* Live AI Worker & Deduplication Status Banner */}
        <section className="lg:col-span-5 flex flex-col">
          <div className="bg-primary-container text-on-primary rounded-xl p-4 shadow-sm relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping" />
                  <span className="text-[14px] text-white font-semibold">CivicSense AI Core</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-white font-semibold">
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-secondary-fixed tabular-nums">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>42ms Latency</span>
                </div>
              </div>
              <p className="text-[13px] text-surface-variant leading-relaxed">
                <strong className="text-white font-semibold">18 duplicates</strong> grouped into{' '}
                <strong className="text-secondary-fixed font-semibold">3 incident clusters</strong> today.{' '}
                <span className="text-white font-medium">94.8% auto-routed</span> across BBMP, BESCOM &amp; BWSSB triage lines.
              </p>
            </div>

            <div className="mt-3 pt-2.5 flex items-center justify-between text-surface-variant text-[11px] font-semibold bg-primary/40 -mx-4 -mb-4 px-4 py-2.5 rounded-b-xl">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary-fixed">hub</span>
                Yelahanka-Mahadevapura Sync
              </span>
              <button
                type="button"
                onClick={() =>
                  onShowInfoModal(
                    'Active Deduplication Clusters',
                    'Cluster #1: Sony World Signal Water Burst (42 reports merged). Cluster #2: Marathahalli Service Lane Debris (5 reports merged). Cluster #3: ORR Bellandur Crater (3 reports merged).'
                  )
                }
                className="text-secondary-fixed hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Cluster Map</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Search & Triage Filter Matrix */}
      <section className="px-4 md:px-6 pt-4 flex flex-col gap-2.5">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket #, ward, or keyword..."
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-lowest text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear Search"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>All Tickets</span>
            <span
              className={`px-1.5 rounded-full text-[10px] ${
                activeFilter === 'all' ? 'bg-on-primary/20' : 'bg-surface-container'
              }`}
            >
              1,420
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('sla')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm transition-colors cursor-pointer ${
              activeFilter === 'sla'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-error" />
            <span>SLA Breach Risk</span>
            <span className="bg-error-container text-on-error-container px-1.5 rounded-full text-[10px]">
              12
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('ward174')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm transition-colors cursor-pointer ${
              activeFilter === 'ward174'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-secondary">alt_route</span>
            <span>Ward 174 (HSR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('high')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm transition-colors cursor-pointer ${
              activeFilter === 'high'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">priority_high</span>
            <span>High Priority</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('bwssb')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm transition-colors cursor-pointer ${
              activeFilter === 'bwssb'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>BWSSB Only</span>
          </button>
        </div>
      </section>

      {/* Priority Incident Feed + Department Performance SLA */}
      <div className="px-4 md:px-6 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Incident Feed */}
        <section className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] text-on-surface font-semibold">Priority Incident Feed</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                {feedTickets.length} Shown
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onShowToast('Batch auto-triage confirmed for pending ward tickets')
              }
              className="text-[11px] text-secondary font-semibold hover:underline cursor-pointer"
            >
              Batch Actions
            </button>
          </div>

          {feedTickets.map((ticket) => {
            const isDispatched = !!dispatchedIds[ticket.id];
            return (
              <article
                key={ticket.id}
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2.5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onNavigate('issue-details', ticket.id)}
                      className="text-[12px] font-bold text-primary bg-surface-container px-2 py-0.5 rounded hover:bg-surface-container-high cursor-pointer"
                    >
                      #{ticket.id}
                    </button>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        ticket.urgency === 'severe'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-container text-on-secondary-fixed-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {ticket.categoryKey === 'drainage'
                          ? 'water_damage'
                          : ticket.categoryKey === 'garbage'
                          ? 'delete_sweep'
                          : 'warning'}
                      </span>
                      {ticket.severityLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-surface-variant shrink-0">
                    {ticket.timeAgo}
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onNavigate('issue-details', ticket.id)}
                    className="text-left text-[14px] text-on-surface font-semibold hover:text-primary transition-colors cursor-pointer"
                  >
                    {ticket.title}
                  </button>
                  <p className="text-[13px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span>
                    {ticket.location} • SLA: {ticket.slaRemaining}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 bg-surface-container-low p-2 rounded-lg">
                  <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-surface-container-high">
                    <ResilientImage
                      src={ticket.imageUrl}
                      alt={ticket.imageAlt}
                      className="w-full h-full object-cover"
                      fallbackIcon="photo"
                    />
                    <span className="absolute bottom-0 right-0 bg-primary/80 text-[9px] text-white px-1 font-mono">
                      IMG
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-on-secondary-container font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        {ticket.aiConfidence}% Vision Confidence
                      </span>
                      <span className="text-[11px] text-error font-medium">
                        {ticket.urgency === 'severe' ? 'Critical' : 'Standard'}
                      </span>
                    </div>
                    <span className="text-[13px] text-on-surface-variant truncate">
                      {ticket.dispatchNote}
                    </span>
                  </div>
                </div>

                {ticket.duplicateCount && ticket.duplicateCount > 1 && (
                  <div className="flex items-center justify-between bg-secondary-container/40 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-secondary-container">
                        content_copy
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-on-secondary-container font-semibold">
                          {ticket.duplicateCount} Citizen reports linked
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          AI Auto-Merged to avoid team duplication
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('issue-details', ticket.id)}
                      className="text-[11px] text-secondary font-semibold hover:underline cursor-pointer"
                    >
                      View Cluster
                    </button>
                  </div>
                )}

                {/* Triage Controls */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant">
                      Department Routing
                    </label>
                    <div className="relative">
                      <select
                        value={ticket.department}
                        onChange={(e) => {
                          onUpdateDepartment(ticket.id, e.target.value);
                          onShowToast(`Routed #${ticket.id} to ${e.target.value}`);
                        }}
                        className="w-full h-9 pl-2.5 pr-7 rounded-lg bg-surface-container text-[11px] text-on-surface font-medium appearance-none focus:outline-none cursor-pointer"
                      >
                        <option value="BWSSB Drainage Div">BWSSB Drainage Div</option>
                        <option value="BBMP Major Roads">BBMP Major Roads</option>
                        <option value="BBMP Road Infra">BBMP Road Infra</option>
                        <option value="BESCOM Sub-Station">BESCOM Sub-Station</option>
                        <option value="BESCOM South">BESCOM South</option>
                        <option value="Solid Waste Mgmt">Solid Waste Mgmt</option>
                        <option value="BBMP SWM">BBMP SWM</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-on-surface-variant">
                      Status Update
                    </label>
                    <div className="relative">
                      <select
                        value={ticket.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as ComplaintStatus;
                          onUpdateStatus(ticket.id, newStatus);
                          onShowToast(`Ticket #${ticket.id} updated to ${newStatus}`);
                        }}
                        className="w-full h-9 pl-2.5 pr-7 rounded-lg bg-tertiary-fixed/30 text-on-tertiary-fixed text-[11px] font-medium appearance-none focus:outline-none cursor-pointer"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDispatchedIds((prev) => ({ ...prev, [ticket.id]: true }));
                      onUpdateStatus(ticket.id, 'In Progress');
                      onShowToast(`Field unit dispatched for #${ticket.id}`);
                    }}
                    className={`flex-1 h-10 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer ${
                      isDispatched
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-primary text-on-primary hover:bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isDispatched ? 'check_circle' : 'send'}
                    </span>
                    <span>
                      {isDispatched
                        ? 'Dispatched #Crew-7'
                        : ticket.categoryKey === 'garbage'
                        ? 'Deploy Tipper Truck'
                        : 'Dispatch Field Unit'}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Open Issue Inspector"
                    onClick={() => onNavigate('issue-details', ticket.id)}
                    className="w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">map</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Right Sidebar on Desktop: Department Performance SLA + Escalation Broadcast */}
        <div className="lg:col-span-4 space-y-4">
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-secondary">leaderboard</span>
                <h2 className="text-[16px] text-on-surface font-semibold">Department Performance SLA</h2>
              </div>
              <span className="text-[11px] font-semibold text-on-surface-variant">Live Rolling 24h</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
              {/* 1. BESCOM */}
              <div className="flex flex-col gap-1.5 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary text-white font-bold text-[12px] flex items-center justify-center">
                      1
                    </div>
                    <span className="text-[14px] text-on-surface font-semibold">BESCOM Streetlight Cell</span>
                  </div>
                  <span className="text-[14px] text-secondary font-bold tabular-nums">98%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[98%]" />
                </div>
                <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
                  <span>Avg. turnaround: 1.4 hours</span>
                  <span className="text-secondary font-medium tabular-nums">94/96 Resolved</span>
                </div>
              </div>

              {/* 2. BBMP Road Infra */}
              <div className="flex flex-col gap-1.5 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-white font-bold text-[12px] flex items-center justify-center">
                      2
                    </div>
                    <span className="text-[14px] text-on-surface font-semibold">BBMP Road Infrastructure</span>
                  </div>
                  <span className="text-[14px] text-primary font-bold tabular-nums">91%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[91%]" />
                </div>
                <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
                  <span>Avg. turnaround: 4.8 hours</span>
                  <span className="text-primary font-medium tabular-nums">210/230 Resolved</span>
                </div>
              </div>

              {/* 3. BWSSB */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface font-bold text-[12px] flex items-center justify-center">
                      3
                    </div>
                    <span className="text-[14px] text-on-surface font-semibold">BWSSB Water Supply</span>
                  </div>
                  <span className="text-[14px] text-on-tertiary-container font-bold tabular-nums">87%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-on-tertiary-container h-full rounded-full w-[87%]" />
                </div>
                <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
                  <span>Avg. turnaround: 6.2 hours</span>
                  <span className="text-on-tertiary-container font-medium tabular-nums">142/163 Resolved</span>
                </div>
              </div>
            </div>
          </section>

          {/* Escalation Broadcast Card */}
          <section className="bg-surface-container-low rounded-xl p-4 shadow-sm flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed-variant shrink-0">
                <span className="material-symbols-outlined text-[22px]">quickreply</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] text-on-surface font-semibold">Escalation Broadcast</span>
                <span className="text-[13px] text-on-surface-variant truncate">
                  Notify all 198 Ward Engineers via SMS/App
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary text-[11px] font-semibold shadow-sm hover:bg-surface-container-high active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              Draft Alert
            </button>
          </section>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-primary">Ward Engineer Broadcast</h3>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-surface-container-low text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-[12px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBroadcastModal(false);
                  onShowToast('Broadcast alert transmitted to 198 BBMP Ward Engineers');
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[12px] font-semibold cursor-pointer"
              >
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
