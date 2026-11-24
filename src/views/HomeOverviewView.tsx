import React from 'react';
import { HOW_IT_WORKS_IMAGES } from '../data/civicData';
import { ResolvedSpotlight, RouteId } from '../types/civic';
import { ResilientImage } from '../components/ResilientImage';

interface HomeOverviewViewProps {
  onNavigate: (route: RouteId, ticketId?: string) => void;
  spotlights: ResolvedSpotlight[];
  onApproveSpotlight: (id: string) => void;
  totalComplaintsCount: number;
  onShowInfoModal: (title: string, body: string) => void;
}

export const HomeOverviewView: React.FC<HomeOverviewViewProps> = ({
  onNavigate,
  spotlights,
  onApproveSpotlight,
  totalComplaintsCount,
  onShowInfoModal,
}) => {
  const displayTotal = 18423 + totalComplaintsCount;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Hero + Impact + AI Pipeline Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 px-4 md:px-6 pt-4 pb-6 items-start">
        {/* Left Hero Column */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-surface-container text-on-surface-variant shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
            <span className="text-[11px] font-semibold tracking-normal">
              BBMP &amp; Smart Cities Mission • Bengaluru Ward 150
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] md:text-[32px] leading-[1.3] text-primary font-bold tracking-tight [text-wrap:balance]">
              Building Better Cities, <span className="text-secondary font-bold">Together.</span>
            </h1>
            <p className="text-[14px] md:text-[15px] text-on-surface-variant leading-relaxed">
              Report civic grievances in 10 seconds. AI automatically detects potholes, garbage piles, and non-functional streetlights, auto-routes to BBMP, BESCOM, or BWSSB, and tracks resolution with verifiable proof.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('report-issue')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary text-[14px] font-semibold shadow-md shadow-primary/20 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
              <span>Report an Issue</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('citizen-tracker')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary-container text-on-secondary-container text-[14px] font-semibold shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">search_check</span>
              <span>Track Complaint</span>
            </button>
          </div>

          {/* Detected Civic GPS */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low">
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-on-surface-variant">Detected Civic GPS</span>
              <span className="text-[14px] font-semibold text-on-surface truncate">
                Bellandur Outer Ring Road, Ward 150 (Zone: Mahadevapura)
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-on-secondary flex-shrink-0">
              Live
            </span>
          </div>
        </section>

        {/* Right Impact & Pipeline Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Live Municipal Impact */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <h2 className="text-[14px] font-semibold text-on-surface uppercase tracking-wide">
                  Live Municipal Impact
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-on-surface-variant">Sync: 2m ago</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-1">
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                </div>
                <div className="text-[20px] leading-7 text-primary font-bold tabular-nums">
                  {displayTotal.toLocaleString()}+
                </div>
                <div className="text-[11px] font-semibold text-on-surface-variant leading-tight mt-0.5">
                  Issues Reported
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container mb-1">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div className="text-[20px] leading-7 text-secondary font-bold tabular-nums">94.2%</div>
                <div className="text-[11px] font-semibold text-on-surface-variant leading-tight mt-0.5">
                  Resolved on SLA
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container mb-1">
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                </div>
                <div className="text-[20px] leading-7 text-primary font-bold tabular-nums">342</div>
                <div className="text-[11px] font-semibold text-on-surface-variant leading-tight mt-0.5">
                  Active Wards
                </div>
              </div>
            </div>
          </section>

          {/* CivicSense AI Pipeline Banner */}
          <section>
            <div className="p-4 rounded-xl bg-primary-container text-on-primary shadow-md flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  </div>
                  <span className="text-[14px] font-semibold text-on-primary">CivicSense AI Pipeline</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-on-primary/10 text-on-primary-container">
                  YOLOv8 Civic Model
                </span>
              </div>
              <p className="text-[13px] text-on-primary-container z-10 leading-snug">
                Real-time multi-agent edge perception tags hazards, filters duplicate citizen reports, and assigns official SLA priority automatically.
              </p>

              <div className="grid grid-cols-4 gap-1 pt-2 z-10">
                <button
                  type="button"
                  onClick={() => onNavigate('report-issue')}
                  className="flex flex-col items-center text-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/15 group-hover:bg-surface-container-lowest/25 flex items-center justify-center text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-primary-container">1. Snap</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-analytics')}
                  className="flex flex-col items-center text-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-primary">2. Edge Vision</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-portal')}
                  className="flex flex-col items-center text-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/15 group-hover:bg-surface-container-lowest/25 flex items-center justify-center text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">alt_route</span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-primary-container">3. Auto Route</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('citizen-tracker')}
                  className="flex flex-col items-center text-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/15 group-hover:bg-surface-container-lowest/25 flex items-center justify-center text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-primary-container">4. Verified</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest/10 z-10 text-on-primary mt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">hub</span>
                  <span className="text-[11px] font-semibold truncate">BBMP • BESCOM • BWSSB Shared Protocol</span>
                </div>
                <span className="text-[12px] font-medium text-secondary-fixed shrink-0 tabular-nums">
                  &lt; 0.4s triage
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* How CivicSense Works */}
      <section className="px-4 md:px-6 py-4 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-secondary uppercase font-semibold tracking-wider">
            Effortless Civic Governance
          </span>
          <h2 className="text-[20px] font-semibold text-primary">How CivicSense Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-primary font-bold">
                STEP 01
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">pin_drop</span>
            </div>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                <ResilientImage
                  src={HOW_IT_WORKS_IMAGES.step1}
                  alt="Citizen holding smartphone taking geotagged photo of road pothole"
                  className="w-full h-full object-cover"
                  fallbackIcon="photo_camera"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[14px] font-semibold text-on-surface">Snap &amp; Geotag in Seconds</h3>
                <p className="text-[13px] text-on-surface-variant mt-1 leading-snug">
                  Capture a photo. The app auto-attaches GPS lat-long, address reverse-lookup, and ward boundaries instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-secondary font-bold">
                STEP 02
              </span>
              <div className="flex items-center gap-1 text-secondary text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[16px]">model_training</span>
                <span>99.1% Confidence</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                <ResilientImage
                  src={HOW_IT_WORKS_IMAGES.step2}
                  alt="AI computer vision interface analyzing municipal street issue"
                  className="w-full h-full object-cover"
                  fallbackIcon="psychology"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[14px] font-semibold text-on-surface">AI Detection &amp; Clustering</h3>
                <p className="text-[13px] text-on-surface-variant mt-1 leading-snug">
                  Our vision neural net classifies severity, flags safety hazards, and merges repeated resident complaints into single incident clusters.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-primary font-bold">
                STEP 03
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">engineering</span>
            </div>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                <ResilientImage
                  src={HOW_IT_WORKS_IMAGES.step3}
                  alt="Municipal road maintenance crew repairing civic road"
                  className="w-full h-full object-cover"
                  fallbackIcon="engineering"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[14px] font-semibold text-on-surface">Dispatched &amp; Resolved</h3>
                <p className="text-[13px] text-on-surface-variant mt-1 leading-snug">
                  Ward engineers receive automated work orders with countdown SLAs. Citizens receive before/after photographic verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Resolved Spotlights */}
      <section className="px-4 md:px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-secondary uppercase font-semibold tracking-wider">
              Accountability In Action
            </span>
            <h2 className="text-[20px] font-semibold text-primary">Recent Resolved Spotlights</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('citizen-tracker')}
            className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {spotlights.map((spot) => (
            <div key={spot.id} className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span className="text-[11px] text-on-surface-variant font-medium truncate">
                    {spot.department}
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold shrink-0">
                  {spot.resolvedIn}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <h3 className="text-[14px] font-semibold text-on-surface">{spot.title}</h3>
                <p className="text-[13px] text-on-surface-variant">{spot.wardAndTicket}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative rounded-lg overflow-hidden h-28 md:h-36 bg-surface-container">
                  <ResilientImage
                    src={spot.beforeImage}
                    alt={spot.beforeAlt}
                    className="w-full h-full object-cover"
                    fallbackIcon="report_problem"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface text-[11px] font-semibold">
                    Before (Reported)
                  </span>
                </div>
                <div className="relative rounded-lg overflow-hidden h-28 md:h-36 bg-surface-container">
                  <ResilientImage
                    src={spot.afterImage}
                    alt={spot.afterAlt}
                    className="w-full h-full object-cover"
                    fallbackIcon="verified"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-secondary text-on-secondary text-[11px] font-semibold">
                    {spot.afterTag}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => onApproveSpotlight(spot.id)}
                  className={`flex items-center gap-1.5 text-[13px] transition-colors cursor-pointer ${
                    spot.approvedByUser ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-secondary'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[16px] text-secondary ${
                      spot.approvedByUser ? 'material-symbols-filled' : ''
                    }`}
                  >
                    thumb_up
                  </span>
                  <span className="tabular-nums">{spot.approvals} verified residents approved</span>
                </button>
                <span className="text-[11px] font-semibold text-on-surface-variant">{spot.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Civic Helpline & Trust Banner */}
      <section className="px-4 md:px-6 py-4">
        <div className="p-4 rounded-xl bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-on-surface-variant uppercase font-semibold">
                Immediate Emergency Line
              </span>
              <a href="tel:1533" className="text-[18px] text-primary font-bold hover:underline">
                1533 BBMP Sahaaya 24x7
              </a>
            </div>
          </div>
          <p className="text-[13px] text-on-surface-variant md:max-w-xl">
            For severe waterlogging, fallen trees across arterial transit corridors, or live electrical hazard wire snaps, dial Sahaaya immediately for instant emergency squad dispatch.
          </p>
        </div>
      </section>

      {/* Municipal Footer & Project Credit */}
      <footer className="px-4 md:px-6 pt-2 pb-6 flex flex-col gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-on-surface">B.Tech AIML Capstone Project</span>
            <span className="text-[11px] font-semibold text-on-surface-variant">
              Intelligent Multi-Agent Civic Perception &amp; Automated Redressal
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-on-surface-variant">
            <button
              type="button"
              onClick={() =>
                onShowInfoModal(
                  'Privacy Policy',
                  'Citizen photos and GPS coordinates are encrypted in transit and used exclusively for BBMP, BESCOM, and BWSSB civic triage and resolution verification.'
                )
              }
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() =>
                onShowInfoModal(
                  'Citizen Charter (BBMP)',
                  'Severe safety hazards carry a 24-hour SLA. Standard road, waste, and streetlight grievances carry a 48-hour to 7-day guaranteed turnaround.'
                )
              }
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Citizen Charter
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() =>
                onShowInfoModal(
                  'BBMP API Terms',
                  'Integrated with Bengaluru Smart City Sahaya 1533 telemetry and multi-agency work-order routing endpoints.'
                )
              }
              className="hover:text-primary transition-colors cursor-pointer"
            >
              BBMP API Terms
            </button>
          </div>
          <span className="text-[11px] font-semibold text-on-surface-variant">CivicSense v2.4</span>
        </div>
      </footer>
    </div>
  );
};
