import React, { useEffect, useState } from 'react';
import { Complaint } from '../types/civic';
import { ResilientImage } from '../components/ResilientImage';

interface IssueDetailsViewProps {
  complaint: Complaint;
  allComplaints: Complaint[];
  onSelectTicket: (ticketId: string) => void;
  onToggleSubscribe: (ticketId: string) => void;
  onAddNote: (ticketId: string, note: string) => void;
  onEscalate: (ticketId: string) => void;
  onShowToast: (msg: string) => void;
}

export const IssueDetailsView: React.FC<IssueDetailsViewProps> = ({
  complaint,
  allComplaints,
  onSelectTicket,
  onToggleSubscribe,
  onAddNote,
  onEscalate,
  onShowToast,
}) => {
  const [searchValue, setSearchValue] = useState(complaint.id);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    setSearchValue(complaint.id);
  }, [complaint.id]);

  const handleTrackLookup = () => {
    const clean = searchValue.trim().replace(/^#/, '').toLowerCase();
    const matched = allComplaints.find(
      (c) => c.id.toLowerCase() === clean || c.id.toLowerCase().includes(clean)
    );
    if (matched) {
      onSelectTicket(matched.id);
      onShowToast(`Loaded ticket #${matched.id}`);
    } else {
      onShowToast(`No ticket found matching "${searchValue}"`);
    }
  };

  const completedSteps = complaint.timeline.filter((s) => s.state !== 'pending').length;

  return (
    <div className="flex flex-col w-full p-4 md:p-6 gap-4">
      {/* Search / Ticket Selector */}
      <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-sm flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <label
            htmlFor="ticket-search"
            className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px] text-secondary">manage_search</span>
            TRACK COMPLAINT STATUS
          </label>
          <span className="text-[11px] font-semibold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Live Sync
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <input
              id="ticket-search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTrackLookup();
              }}
              placeholder="e.g. BLR-2024-8891"
              className="w-full h-11 bg-surface-container-low text-on-surface text-[14px] font-semibold pl-3 pr-10 rounded-lg outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 transition-all"
            />
            <button
              type="button"
              aria-label="Scan QR Code"
              onClick={() => {
                const next = allComplaints[(allComplaints.findIndex((c) => c.id === complaint.id) + 1) % allComplaints.length];
                if (next) {
                  onSelectTicket(next.id);
                  onShowToast(`QR Scanned: Loaded #${next.id}`);
                }
              }}
              className="absolute right-2 w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </button>
          </div>
          <button
            type="button"
            onClick={handleTrackLookup}
            className="h-11 px-4 bg-primary text-on-primary text-[14px] font-semibold rounded-lg flex items-center gap-1 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span>Track</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: SLA Banner, Master Card, Stepper */}
        <div className="lg:col-span-7 space-y-4">
          {/* ETA SLA Banner */}
          <div className="bg-secondary-container/40 rounded-xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-secondary-container uppercase tracking-wider">
                  Citizen SLA Countdown
                </span>
                <span className="text-[18px] font-semibold text-on-surface tabular-nums">
                  {complaint.slaRemaining}
                </span>
                <span className="text-[12px] text-on-surface-variant">
                  Guaranteed turnaround under BBMP Citizen Charter
                </span>
              </div>
            </div>
            <div className="hidden xs:flex flex-col items-end z-10">
              <span className="text-[11px] font-semibold text-secondary bg-surface-container-lowest/80 px-2.5 py-1 rounded-full">
                {complaint.slaBadge}
              </span>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary/10 pointer-events-none" />
          </div>

          {/* Complaint Master Card */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] bg-surface-container text-primary font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">apartment</span>
                {complaint.ward}
              </span>
              <span className="text-[11px] bg-tertiary-fixed text-on-tertiary-fixed font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                {complaint.severityLabel}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[12px] text-secondary font-bold">#{complaint.id}</span>
                <span className="text-outline-variant text-[12px]">•</span>
                <span className="text-[13px] text-on-surface-variant">{complaint.categoryLabel}</span>
              </div>
              <h1 className="text-[18px] font-semibold text-primary mt-0.5">{complaint.title}</h1>
            </div>

            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[13px] gap-2">
                <span className="text-on-surface-variant flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  Reported By
                </span>
                <span className="text-[14px] font-semibold text-on-surface text-right">
                  {complaint.reportedBy}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] gap-2">
                <span className="text-on-surface-variant flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">domain_verification</span>
                  Authority
                </span>
                <span className="text-[14px] font-semibold text-on-surface text-right truncate max-w-[240px]">
                  {complaint.department}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] gap-2">
                <span className="text-on-surface-variant flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">shield_person</span>
                  Assigned Engineer
                </span>
                <span className="text-[14px] text-secondary font-semibold text-right">
                  {complaint.assignedEngineer}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Status Timeline */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
                <h2 className="text-[16px] font-semibold text-primary">Resolution Progression</h2>
              </div>
              <span className="text-[11px] font-semibold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">
                Phase {completedSteps} of {complaint.timeline.length}
              </span>
            </div>

            <div className="relative pl-7 flex flex-col gap-5 before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-high">
              {complaint.timeline.map((step, idx) => {
                if (step.state === 'active') {
                  return (
                    <div
                      key={`${step.title}-${idx}`}
                      className="relative flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg -ml-2"
                    >
                      <div className="absolute -left-5 top-2.5 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center ring-4 ring-surface-container-lowest shadow-md animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-[14px] text-primary font-bold">{step.title}</h3>
                          {step.badge && (
                            <span className="text-[11px] bg-surface-variant text-primary px-2 py-0.5 rounded-full font-bold">
                              {step.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-primary font-bold">{step.time}</span>
                      </div>
                      <p className="text-[13px] text-on-surface">{step.description}</p>
                      {step.etaNote && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="material-symbols-outlined text-secondary text-[16px]">
                            navigation
                          </span>
                          <span className="text-[12px] text-secondary font-medium">{step.etaNote}</span>
                        </div>
                      )}
                    </div>
                  );
                }

                const isPending = step.state === 'pending';
                return (
                  <div
                    key={`${step.title}-${idx}`}
                    className={`relative flex flex-col gap-0.5 ${isPending ? 'opacity-60' : ''}`}
                  >
                    <div
                      className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest ${
                        isPending
                          ? 'bg-surface-container text-outline'
                          : 'bg-secondary text-on-secondary shadow-sm'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isPending
                          ? 'pending_actions'
                          : step.title.includes('AI')
                          ? 'smart_toy'
                          : 'check'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-[14px] font-semibold text-on-surface">{step.title}</h3>
                        {step.badge && (
                          <span className="text-[11px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-semibold">
                            {step.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-on-surface-variant shrink-0">{step.time}</span>
                    </div>
                    <p className="text-[13px] text-on-surface-variant">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence, Geolocation, Operational Actions */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Computer Vision & Location Evidence Panel */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  center_focus_strong
                </span>
                Evidence &amp; Geolocation
              </h2>
              <span className="text-[12px] text-on-surface-variant font-medium">GPS Verified</span>
            </div>

            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm">
              <ResilientImage
                src={complaint.imageUrl}
                alt={complaint.imageAlt}
                className="w-full h-full object-cover"
                fallbackIcon="photo"
              />
              <div className="absolute inset-x-8 top-8 bottom-8 rounded-lg bg-secondary/15 flex flex-col justify-between p-2 pointer-events-none shadow-[0_0_0_2px_#006a66]">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="bg-secondary text-on-secondary text-[11px] font-medium px-1.5 py-0.5 rounded shadow">
                    {complaint.detectionLabel}
                  </span>
                  <span className="bg-primary text-on-primary text-[11px] font-medium px-1.5 py-0.5 rounded shadow tabular-nums">
                    Conf: {complaint.aiConfidence}%
                  </span>
                </div>
                {complaint.aiDepthNote && (
                  <div className="flex items-center gap-1 text-on-secondary text-[11px] font-semibold drop-shadow">
                    <span className="material-symbols-outlined text-[14px]">straighten</span>
                    {complaint.aiDepthNote}
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2 bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[12px] font-medium">
                <span className="material-symbols-outlined text-[15px] text-secondary-fixed">
                  photo_camera
                </span>
                Submitted Photo
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-on-surface truncate">
                    {complaint.location}
                  </span>
                  <span className="text-[13px] text-on-surface-variant">{complaint.landmark}</span>
                  <span className="text-[12px] text-secondary font-semibold mt-0.5 tabular-nums">
                    {complaint.coordinates}
                  </span>
                </div>
              </div>

              <div
                className="w-full h-28 bg-cover bg-center rounded-lg mt-1 relative overflow-hidden"
                style={{ backgroundImage: `url('${complaint.mapPreviewUrl}')` }}
              >
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="bg-primary text-on-primary px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                    <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                      pin_drop
                    </span>
                    Incident Geopoint
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Operational Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                onToggleSubscribe(complaint.id);
                onShowToast(
                  complaint.subscribed
                    ? 'Unsubscribed from SMS / WhatsApp alerts'
                    : `Subscribed to live SMS & WhatsApp updates for #${complaint.id}`
                );
              }}
              className={`w-full h-12 text-[14px] font-semibold rounded-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm cursor-pointer ${
                complaint.subscribed
                  ? 'bg-surface-container-high text-on-surface'
                  : 'bg-secondary text-on-secondary hover:bg-on-secondary-container'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  complaint.subscribed ? 'text-secondary' : ''
                }`}
              >
                {complaint.subscribed ? 'check_circle' : 'notifications_active'}
              </span>
              <span>
                {complaint.subscribed
                  ? 'Subscribed for SMS & WhatsApp'
                  : 'Subscribe to SMS / WhatsApp Updates'}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onEscalate(complaint.id);
                  onShowToast(`Escalation dispatched to ${complaint.ward} Executive Engineer`);
                }}
                className="h-11 bg-surface-container text-primary text-[14px] font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-error">campaign</span>
                <span className="truncate">Escalate Issue</span>
              </button>
              <button
                type="button"
                onClick={() => setShowNoteModal(true)}
                className="h-11 bg-surface-container text-primary text-[14px] font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                <span className="truncate">Add Note/Photo</span>
              </button>
            </div>

            <div className="mt-1 p-3 rounded-lg bg-surface-container-low flex items-center justify-between text-[13px]">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">headset_mic</span>
                Need direct ward officer assistance?
              </span>
              <a href="tel:1533" className="text-[14px] text-primary font-semibold hover:underline">
                BBMP 1533
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-primary">
                Add Citizen Update to #{complaint.id}
              </h3>
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add field observations, landmark updates, or traffic impact notes..."
              className="w-full p-3 rounded-lg bg-surface-container-low text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-[12px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!noteInput.trim()) return;
                  onAddNote(complaint.id, noteInput.trim());
                  setNoteInput('');
                  setShowNoteModal(false);
                  onShowToast(`Note appended to ticket #${complaint.id}`);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[12px] font-semibold cursor-pointer"
              >
                Append Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
