import React, { useState } from 'react';
import { ANALYTICS_DATA, BENGALURU_HOTSPOT_MAP_URL } from '../data/civicData';
import { TimeframeKey } from '../types/civic';

interface AiAnalyticsViewProps {
  onShowToast: (msg: string) => void;
  onShowInfoModal: (title: string, body: string) => void;
}

const TIMEFRAMES: Array<{ key: TimeframeKey; label: string }> = [
  { key: '24h', label: 'Last 24h' },
  { key: '7d', label: 'Last 7 Days' },
  { key: 'month', label: 'This Month' },
  { key: 'q3', label: 'Q3 2024' },
];

export const AiAnalyticsView: React.FC<AiAnalyticsViewProps> = ({
  onShowToast,
  onShowInfoModal,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('7d');
  const [crewDispatched, setCrewDispatched] = useState(false);

  const snapshot = ANALYTICS_DATA[timeframe];

  const handleExportPdf = () => {
    const csvRows = [
      ['Metric', 'Value', 'Timeframe'],
      ['Total Complaints', snapshot.totalComplaints, snapshot.label],
      ['Vision AI Accuracy', snapshot.aiAccuracy, snapshot.label],
      ['Avg Resolution Time', snapshot.resolutionTime, snapshot.label],
      ['Engineer Time Saved', snapshot.hoursSaved, snapshot.label],
      ...snapshot.categories.map((c) => [c.name, `${c.pct}% (${c.count})`, snapshot.label]),
    ];
    const csvContent = csvRows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bbmp-triage-report-${timeframe}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Exported BBMP Triage Report (${snapshot.label})`);
  };

  const handleShare = async () => {
    const summary = `CivicSense AI (${snapshot.label}): ${snapshot.totalComplaints} complaints, ${snapshot.aiAccuracy} Vision AI accuracy, ${snapshot.resolutionTime} avg resolution.`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      onShowToast('Analytics summary copied to clipboard');
    } else {
      onShowInfoModal('Share Analytics Summary', summary);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-4 space-y-4">
      {/* Title & Scope Header */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Predictive Engine Online
            </span>
          </div>
          <span className="text-[12px] font-medium text-on-surface-variant flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-ping" />
            Live BBMP Synced
          </span>
        </div>

        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold text-primary tracking-tight">
            Civic AI Analytics &amp; Intelligence
          </h1>
          <p className="text-[13px] text-on-surface-variant mt-0.5">
            Citywide Real-time Prediction &amp; Issue Hotspots • Bengaluru Metro Area
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {TIMEFRAMES.map((tf) => {
            const active = timeframe === tf.key;
            return (
              <button
                key={tf.key}
                type="button"
                onClick={() => setTimeframe(tf.key)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  active
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high active:scale-95'
                }`}
              >
                {active && <span className="material-symbols-outlined text-[14px]">check</span>}
                <span>{tf.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            aria-label="Filter Options"
            onClick={() =>
              onShowInfoModal(
                'Analytics Scope Filters',
                'Currently aggregating live telemetry across all 8 BBMP Zones, 198 Wards, BESCOM South/East feeders, and BWSSB stormwater sensors.'
              )
            }
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center flex-shrink-0 hover:bg-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>
      </section>

      {/* Key Performance Metrics Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
        {/* Total Complaints */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">assignment_late</span>
            </div>
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container flex items-center gap-0.5 tabular-nums">
              <span className="material-symbols-outlined text-[11px]">arrow_upward</span>
              {snapshot.complaintsDelta}
            </span>
          </div>
          <div>
            <span className="text-[20px] font-semibold text-primary block tracking-tight tabular-nums">
              {snapshot.totalComplaints}
            </span>
            <span className="text-[11px] font-semibold text-on-surface-variant">Total Complaints</span>
          </div>
          <div className="mt-2 bg-surface-container-low px-2 py-1 rounded">
            <span className="text-[10px] text-on-surface-variant leading-tight block">
              {snapshot.complaintsCompare}
            </span>
          </div>
        </div>

        {/* AI Accuracy */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">neurology</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-semibold">
              High Trust
            </span>
          </div>
          <div>
            <span className="text-[20px] font-semibold text-secondary block tracking-tight tabular-nums">
              {snapshot.aiAccuracy}
            </span>
            <span className="text-[11px] font-semibold text-on-surface-variant">Vision AI Accuracy</span>
          </div>
          <div className="mt-2 bg-surface-container-low px-2 py-1 rounded">
            <span className="text-[10px] text-on-surface-variant leading-tight block">
              Trained on 250k+ civic imgs
            </span>
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant flex items-center gap-0.5 tabular-nums">
              <span className="material-symbols-outlined text-[11px]">arrow_downward</span>
              {snapshot.resolutionDelta}
            </span>
          </div>
          <div>
            <span className="text-[20px] font-semibold text-primary block tracking-tight tabular-nums">
              {snapshot.resolutionTime}
            </span>
            <span className="text-[11px] font-semibold text-on-surface-variant">Avg Resolution Time</span>
          </div>
          <div className="mt-2 bg-surface-container-low px-2 py-1 rounded">
            <span className="text-[10px] text-secondary font-semibold leading-tight block">
              SLA Target &lt; 36 hrs
            </span>
          </div>
        </div>

        {/* Engineer Time Saved */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-surface-variant text-primary font-semibold">
              Auto Merge
            </span>
          </div>
          <div>
            <span className="text-[20px] font-semibold text-primary block tracking-tight tabular-nums">
              {snapshot.hoursSaved}
            </span>
            <span className="text-[11px] font-semibold text-on-surface-variant">Engineer Time Saved</span>
          </div>
          <div className="mt-2 bg-surface-container-low px-2 py-1 rounded">
            <span className="text-[10px] text-on-surface-variant leading-tight block">
              {snapshot.duplicateCount}
            </span>
          </div>
        </div>
      </section>

      {/* High Priority Predictive AI Insights */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">psychology</span>
            <h2 className="text-[16px] font-semibold text-primary">Autonomous Civic Alerts</h2>
          </div>
          <span className="text-[11px] text-secondary font-semibold">
            {crewDispatched ? '1 Actionable' : '2 Actionable'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Alert 1 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-fixed-dim" />
            <div className="pl-2 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">water_drop</span>
                    Predictive Flood Alert
                  </span>
                  <span className="text-[12px] font-medium text-on-surface-variant">Ward 150</span>
                </div>
                <p className="text-[14px] font-semibold text-on-surface mb-1">
                  4 drainage choke points detected in Bellandur basin
                </p>
                <p className="text-[13px] text-on-surface-variant mb-3">
                  Heavy monsoon forecast trigger (+45mm expected). Silt deposition patterns indicate imminent stormwater backflow onto Outer Ring Road.
                </p>
              </div>
              <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-lg gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                    BBMP
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface truncate">
                    Auto-escalated to Stormwater Div
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCrewDispatched(true);
                    onShowToast('Stormwater desilting crew #SWD-4 dispatched to Ward 150');
                  }}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold active:scale-95 transition-all shrink-0 cursor-pointer ${
                    crewDispatched
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary hover:bg-primary-container'
                  }`}
                >
                  {crewDispatched ? 'Crew Dispatched ✓' : 'Dispatch Crew'}
                </button>
              </div>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary" />
            <div className="pl-2 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">join_inner</span>
                    Spatial Duplicate Cluster
                  </span>
                  <span className="text-[12px] text-secondary font-semibold">BWSSB South</span>
                </div>
                <p className="text-[14px] font-semibold text-on-surface mb-1">
                  Sony World Signal: 42 citizen reports grouped
                </p>
                <p className="text-[13px] text-on-surface-variant mb-3">
                  Major water main rupture reported across Koramangala 4th Block within 2 hours. Vision model validated geotagged pipeline burst with 99.2% intersection match.
                </p>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant pt-1 gap-2 flex-wrap">
                <span className="text-[11px] text-secondary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                  Master Ticket #BW-8902 Created
                </span>
                <span className="text-[12px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium">
                  42 Notifications Synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Analytics Grid: Map/Zones + Category Breakdown & Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Geographic Issue Heatmap & Ward Ranking */}
        <section className="lg:col-span-6 bg-surface-container-lowest p-4 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-[16px] font-semibold text-primary">Ward Density &amp; Hotspots</h2>
              <p className="text-[13px] text-on-surface-variant">Incident clusters across Bengaluru Urban</p>
            </div>
            <span className="px-2 py-1 rounded bg-error-container text-on-error-container text-[11px] font-semibold flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
              3 Critical Wards
            </span>
          </div>

          <div
            className="w-full h-48 rounded-xl bg-surface-container-high bg-cover bg-center relative overflow-hidden flex flex-col justify-end p-3 shadow-inner"
            style={{ backgroundImage: `url('${BENGALURU_HOTSPOT_MAP_URL}')` }}
          >
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[0.5px]" />
            <div className="absolute top-1/4 left-1/3 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-error/30 animate-ping absolute" />
              <span className="w-5 h-5 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-[9px] shadow-md">
                94
              </span>
            </div>
            <div className="absolute top-1/2 right-1/4 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-tertiary-fixed-dim/40 animate-ping absolute" />
              <span className="w-4 h-4 rounded-full bg-on-tertiary-container text-surface flex items-center justify-center font-bold text-[8px] shadow-md">
                68
              </span>
            </div>
            <div className="relative z-10 bg-surface/95 backdrop-blur-md p-2.5 rounded-lg flex items-center justify-between text-on-surface shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">radar</span>
                <div>
                  <span className="text-[11px] font-bold block leading-tight text-primary">
                    Live Geofence Radar
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Updating telemetry every 15s</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onShowInfoModal(
                    'Bengaluru GIS Hotspot Telemetry',
                    'Mahadevapura (Zone 4): 94 active clusters along ORR & Whitefield. Bommanahalli (Zone 7): 68 active clusters along Hosur Rd. Koramangala (Ward 151): 39 BWSSB pipeline interventions.'
                  )
                }
                className="px-2.5 py-1 bg-surface-container text-primary rounded font-semibold text-[11px] hover:bg-surface-container-high cursor-pointer"
              >
                Expand GIS
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
              Top Impacted Zones
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-primary text-on-primary font-bold text-[11px] flex items-center justify-center">
                  1
                </span>
                <div>
                  <span className="text-[14px] font-semibold text-primary block leading-snug">
                    Mahadevapura (Zone 4)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    IT Corridor • Potholes &amp; Flooding
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[14px] text-error block font-bold tabular-nums">4,128</span>
                <span className="text-[10px] text-error">+18% spike</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-surface-container-highest text-primary font-bold text-[11px] flex items-center justify-center">
                  2
                </span>
                <div>
                  <span className="text-[14px] font-semibold text-primary block leading-snug">
                    Bommanahalli (Zone 7)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Hosur Rd Arterial • Solid Waste
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[14px] text-on-surface block font-bold tabular-nums">3,490</span>
                <span className="text-[10px] text-secondary">88% triaged</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-surface-container-highest text-primary font-bold text-[11px] flex items-center justify-center">
                  3
                </span>
                <div>
                  <span className="text-[14px] font-semibold text-primary block leading-snug">
                    Koramangala (Ward 151)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Residential South • BWSSB Pipe Works
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[14px] text-on-surface block font-bold tabular-nums">2,810</span>
                <span className="text-[10px] text-on-surface-variant">-4% normal</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Category Distribution + Velocity Chart */}
        <div className="lg:col-span-6 space-y-4">
          {/* Category Distribution */}
          <section className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-primary">Category Distribution</h2>
                <p className="text-[13px] text-on-surface-variant">Classified by Multi-label Civic Model</p>
              </div>
              <span className="text-[12px] text-secondary font-semibold">100% Parsed</span>
            </div>

            <div className="w-full h-4 rounded-full overflow-hidden flex bg-surface-container">
              {snapshot.categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`h-full ${cat.colorClass} transition-all duration-300`}
                  style={{ width: `${cat.pct}%` }}
                  title={`${cat.name}: ${cat.pct}%`}
                />
              ))}
            </div>

            <div className="space-y-3 pt-1">
              {snapshot.categories.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold text-on-surface flex items-center gap-1.5 min-w-0 truncate">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.colorClass} inline-block shrink-0`} />
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className={`text-[11px] font-bold shrink-0 tabular-nums ${cat.textClass}`}>
                      {cat.pct}% ({cat.count})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full ${cat.colorClass} rounded-full transition-all duration-300`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Monthly Resolution Velocity */}
          <section className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-primary">Monthly Resolution Velocity</h2>
                <p className="text-[13px] text-on-surface-variant">Efficiency benchmark: Resolved vs Backlog</p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-bold">
                {snapshot.clearRate}
              </span>
            </div>

            <div className="flex items-center gap-4 bg-surface-container-low p-2.5 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-[11px] text-on-surface font-semibold">Resolved (94%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-on-tertiary-container" />
                <span className="text-[11px] text-on-surface font-semibold">Backlog (6%)</span>
              </div>
              <div className="ml-auto text-[12px] text-secondary font-bold tabular-nums">
                {snapshot.momDelta}
              </div>
            </div>

            <div className="relative w-full h-36 pt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 100">
                <defs>
                  <linearGradient id="resolvedGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#006a66" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006a66" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="backlogGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#e49200" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#e49200" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line stroke="#eff4ff" strokeWidth="1" x1="0" x2="340" y1="10" y2="10" />
                <line stroke="#eff4ff" strokeWidth="1" x1="0" x2="340" y1="50" y2="50" />
                <line stroke="#eff4ff" strokeWidth="1" x1="0" x2="340" y1="90" y2="90" />

                <polygon fill="url(#resolvedGradient)" points={snapshot.resolvedPolygon} />
                <polyline
                  fill="none"
                  points={snapshot.resolvedPoints}
                  stroke="#006a66"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />

                <polygon fill="url(#backlogGradient)" points={snapshot.backlogPolygon} />
                <polyline
                  fill="none"
                  points={snapshot.backlogPoints}
                  stroke="#e49200"
                  strokeDasharray="3,3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />

                <circle cx="330" cy="12" fill="#006a66" r="3.5" />
                <circle cx="330" cy="92" fill="#e49200" r="3" />
              </svg>
              <div className="flex justify-between text-on-surface-variant text-[11px] pt-2 px-1">
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span className="font-bold text-primary">Oct &apos;24</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Vision Pipeline Info & Export Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1 pb-4">
        <section className="md:col-span-7 bg-surface-container-low p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">dataset</span>
          </div>
          <div className="min-w-0">
            <span className="text-[14px] font-semibold text-primary block leading-tight">
              Vision Pipeline v4.2 Active
            </span>
            <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
              Trained on 250k+ Indian civic images across potholes, unauthorized dump sites, and broken water pipes.
            </p>
          </div>
        </section>

        <section className="md:col-span-5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex-1 h-11 rounded-lg bg-primary text-on-primary text-[14px] font-semibold flex items-center justify-center gap-1.5 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export BBMP Triage CSV</span>
          </button>
          <button
            type="button"
            aria-label="Share Analytics"
            onClick={handleShare}
            className="h-11 px-3.5 rounded-lg bg-surface-container text-primary text-[14px] font-semibold flex items-center justify-center hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </section>
      </div>
    </div>
  );
};
