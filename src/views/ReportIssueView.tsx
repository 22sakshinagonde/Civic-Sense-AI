import React, { useRef, useState } from 'react';
import { REPORT_POTHOLE_PHOTO, SILK_BOARD_MAP_URL } from '../data/civicData';
import { Complaint, IssueCategoryKey, UrgencyLevel } from '../types/civic';
import { ResilientImage } from '../components/ResilientImage';

interface ReportIssueViewProps {
  onSubmitComplaint: (complaint: Complaint) => void;
  onViewMasterCluster: () => void;
  onShowToast: (msg: string) => void;
}

const CATEGORY_MAP: Record<
  IssueCategoryKey,
  { label: string; agency: string; department: string; engineer: string }
> = {
  roads: {
    label: 'Roads & Footpaths (Potholes / Broken Pavers)',
    agency: 'BBMP Roads',
    department: 'BBMP Major Roads',
    engineer: 'BBMP Executive Engineer (South Zone Division)',
  },
  garbage: {
    label: 'Garbage & Sanitation (Solid Waste Dump)',
    agency: 'BBMP SWM',
    department: 'Solid Waste Mgmt',
    engineer: 'BBMP SWM Health Inspector (Ward 174)',
  },
  water: {
    label: 'Water Leakage & Pipeline Burst',
    agency: 'BWSSB',
    department: 'BWSSB Water Supply',
    engineer: 'BWSSB Assistant Executive Engineer (South)',
  },
  streetlights: {
    label: 'Streetlights & Dangling Cables',
    agency: 'BESCOM',
    department: 'BESCOM South',
    engineer: 'BESCOM Ward Team 4 (HSR Sub-station)',
  },
  drainage: {
    label: 'Storm Water Drainage & Rajakaluve',
    agency: 'BBMP SWD',
    department: 'BWSSB Drainage Div',
    engineer: 'BBMP Storm Water Drain Cell',
  },
  animals: {
    label: 'Stray Animal Distress & Animal Control',
    agency: 'BBMP AH',
    department: 'BBMP Animal Husbandry',
    engineer: 'BBMP Animal Control Unit',
  },
};

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  onSubmitComplaint,
  onViewMasterCluster,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoUrl, setPhotoUrl] = useState<string>(REPORT_POTHOLE_PHOTO);
  const [photoCount, setPhotoCount] = useState<number>(1);
  const [detectionTag, setDetectionTag] = useState<string>('Road_Fracture_01');
  const [detectionTitle, setDetectionTitle] = useState<string>('Road Damage / Deep Pothole');
  const [confidence, setConfidence] = useState<number>(97.4);
  const [severityBadge, setSeverityBadge] = useState<string>('High Severity');

  const [category, setCategory] = useState<IssueCategoryKey>('roads');
  const [description, setDescription] = useState<string>(
    "Deep pothole dangerous for 2-wheelers near Silk Board junction exit towards HSR Layout. Expanding after yesterday's rain."
  );
  const [landmark, setLandmark] = useState<string>('Opposite IOCL Petrol Pump');
  const [address, setAddress] = useState<string>('Outer Ring Road, near Central Silk Board');
  const [coordinates, setCoordinates] = useState<string>('12.9177° N, 77.6238° E • Acc: ±3m');
  const [urgency, setUrgency] = useState<UrgencyLevel>('severe');
  const [smsConsent, setSmsConsent] = useState<boolean>(true);

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [enhancing, setEnhancing] = useState<boolean>(false);
  const [recalcGps, setRecalcGps] = useState<boolean>(false);
  const [voiceActive, setVoiceActive] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPhotoUrl(dataUrl);
      setPhotoCount((c) => Math.min(3, c + 1));
      setAnalyzing(true);
      setAiError(null);

      try {
        const res = await fetch('/api/analyze-issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            mimeType: file.type || 'image/jpeg',
            notes: description,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Vision analysis failed');
        }

        const catKey = (['roads', 'garbage', 'water', 'streetlights', 'drainage', 'animals'].includes(
          data.category
        )
          ? data.category
          : 'roads') as IssueCategoryKey;

        setCategory(catKey);
        if (['low', 'moderate', 'severe'].includes(data.urgency)) {
          setUrgency(data.urgency as UrgencyLevel);
        }
        if (data.detectionTag) setDetectionTag(data.detectionTag);
        if (data.categoryLabel) setDetectionTitle(data.categoryLabel);
        if (typeof data.confidence === 'number') setConfidence(data.confidence);
        if (data.severityLabel) setSeverityBadge(data.severityLabel);
        if (data.suggestedDescription) setDescription(data.suggestedDescription);
        onShowToast('CivicSense Vision AI analyzed your uploaded photo');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unable to run AI image analysis';
        setAiError(msg);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEnhanceDescription = async () => {
    if (!description.trim()) {
      setAiError('Please enter a short description before enhancing with AI.');
      return;
    }
    setEnhancing(true);
    setAiError(null);

    try {
      const res = await fetch('/api/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          category: CATEGORY_MAP[category].label,
          landmark,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI clarity enhancement failed');
      }
      if (data.enhanced) {
        setDescription(data.enhanced);
        onShowToast('Description enhanced for BBMP engineering triage');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to enhance description';
      setAiError(msg);
    } finally {
      setEnhancing(false);
    }
  };

  const handleRecalculateGps = () => {
    setRecalcGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          const acc = Math.round(pos.coords.accuracy || 4);
          setCoordinates(`${lat}° N, ${lng}° E • Acc: ±${acc}m`);
          setRecalcGps(false);
          onShowToast('GPS coordinates locked from device sensor');
        },
        () => {
          setTimeout(() => {
            setCoordinates('12.9178° N, 77.6239° E • Acc: ±2m');
            setAddress('Outer Ring Road, near Central Silk Board');
            setRecalcGps(false);
            onShowToast('Civic GPS calibrated to Ward 174 Silk Board corridor');
          }, 600);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setRecalcGps(false);
        onShowToast('Civic GPS calibrated to Ward 174');
      }, 600);
    }
  };

  const handleVoiceMemo = () => {
    if (voiceActive) {
      setVoiceActive(false);
      setDescription((prev) =>
        prev.includes('traffic slow-down')
          ? prev
          : `${prev} Causing peak-hour traffic slow-down near bus bay.`.slice(0, 500)
      );
      onShowToast('Voice memo transcribed into description');
    } else {
      setVoiceActive(true);
      setTimeout(() => {
        setVoiceActive(false);
        setDescription((prev) =>
          prev.includes('traffic slow-down')
            ? prev
            : `${prev} Causing peak-hour traffic slow-down near bus bay.`.slice(0, 500)
        );
        onShowToast('Voice memo captured & transcribed');
      }, 1400);
    }
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      setAiError('Please provide an issue description before submitting.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const catMeta = CATEGORY_MAP[category];
      const randomNum = Math.floor(9105 + Math.random() * 800);
      const newId = `BLR-2026-${randomNum}`;
      const slaText = urgency === 'severe' ? '24h Urgent' : urgency === 'moderate' ? '48h SLA' : '7 Days SLA';

      const newComplaint: Complaint = {
        id: newId,
        title: `${detectionTitle} — ${landmark || address}`,
        description: description.trim(),
        categoryKey: category,
        categoryLabel: catMeta.label,
        department: catMeta.department,
        ward: 'Ward 174 (HSR Layout / Silk Board)',
        location: address,
        landmark: landmark || 'Near Silk Board Junction',
        coordinates,
        status: 'Under Review',
        urgency,
        severityLabel:
          urgency === 'severe'
            ? `High Severity (AI: ${Math.min(9.9, (confidence / 10)).toFixed(1)}/10)`
            : urgency === 'moderate'
            ? 'Moderate Priority'
            : 'Standard Priority',
        aiConfidence: confidence,
        detectionLabel: detectionTag,
        reportedBy: 'Rahul S. (Just now)',
        reportedAt: 'Just now',
        timeAgo: 'Just now',
        slaRemaining: slaText,
        slaBadge: urgency === 'severe' ? '24h Urgent' : 'On Track',
        assignedCrew: catMeta.agency,
        assignedEngineer: catMeta.engineer,
        dispatchNote: `Auto-routed to ${catMeta.engineer}`,
        imageUrl: photoUrl,
        imageAlt: description.trim(),
        mapPreviewUrl: SILK_BOARD_MAP_URL,
        subscribed: smsConsent,
        timeline: [
          {
            title: 'Submitted',
            time: 'Just now',
            description: 'Citizen uploaded geotagged evidence & hazard details.',
            state: 'completed',
          },
          {
            title: 'Under AI Review',
            time: 'Just now',
            description: `CivicSense Vision tagged ${detectionTag} (${confidence}% confidence) and queued for ${catMeta.agency}.`,
            state: 'active',
            badge: `${confidence}% Match`,
          },
          {
            title: 'Assigned',
            time: 'Pending',
            description: `Routing to ${catMeta.engineer}.`,
            state: 'pending',
          },
          {
            title: 'In Progress',
            time: 'Pending',
            description: 'Field crew dispatch & site stabilization.',
            state: 'pending',
          },
          {
            title: 'Resolved & Verified',
            time: `Target: ${slaText}`,
            description: 'Post-repair photographic verification & citizen closure.',
            state: 'pending',
          },
        ],
      };

      setSubmitting(false);
      onSubmitComplaint(newComplaint);
    }, 800);
  };

  const catMeta = CATEGORY_MAP[category];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Context Header Banner */}
      <div className="px-4 md:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Ward 174 • HSR Layout / Silk Board
          </span>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
          Triage v2.4
        </span>
      </div>

      <div className="px-4 md:px-6 space-y-4">
        {/* AI Smart Assist Banner */}
        <div className="bg-surface-container-low rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-secondary-container/30 blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-[14px] font-semibold text-primary">AI Smart Assist Active</h1>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-medium">
                  Auto-Triage
                </span>
              </div>
              <p className="text-[13px] text-on-surface-variant mt-1">
                Visual models automatically infer category, severity, and civic jurisdiction (BBMP, BESCOM, or BWSSB) in real-time.
              </p>
            </div>
          </div>
        </div>

        {aiError && (
          <div
            role="alert"
            className="bg-error-container text-on-error-container rounded-xl p-3 flex items-center justify-between gap-2 text-[13px]"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{aiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAiError(null)}
              className="text-[11px] font-semibold underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Responsive 2-column form layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Photo, Category, Description */}
          <div className="lg:col-span-7 space-y-4">
            {/* Photo & Evidence Upload */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">photo_camera</span>
                  Evidence &amp; Site Photos
                </label>
                <span className="text-[11px] font-semibold text-on-surface-variant">
                  {photoCount} of 3 uploaded
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="relative rounded-xl overflow-hidden bg-surface-container-high/40 min-h-[210px] md:min-h-[250px] flex flex-col justify-end p-4">
                <ResilientImage
                  src={photoUrl}
                  alt="Uploaded civic grievance evidence photo"
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackIcon="photo_camera"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />

                <div className="absolute top-3.5 left-3.5 z-10 bg-primary/75 backdrop-blur-md px-2.5 py-1 rounded-md text-on-primary flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[14px] text-secondary-fixed">
                    {analyzing ? 'sync' : 'center_focus_strong'}
                  </span>
                  <span className="text-[12px] font-medium tabular-nums">
                    {analyzing ? 'Analyzing with Gemini AI...' : `${detectionTag} • ${confidence}%`}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Upload or Retake Photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-on-surface flex items-center justify-center hover:bg-surface-container-lowest transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                </button>

                <div className="relative z-10 bg-surface-container-lowest/95 backdrop-blur-md rounded-lg p-2.5 shadow-md flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-primary font-bold">AI Detected:</span>
                      <span className="text-[11px] text-on-surface font-semibold">{detectionTitle}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold">
                        {severityBadge}
                      </span>
                      <span className="text-[12px] text-secondary font-medium tabular-nums">
                        Confidence {confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                  {analyzing ? 'Running AI Vision...' : 'Upload Photo for AI Triage'}
                </button>
                <button
                  type="button"
                  onClick={handleVoiceMemo}
                  className={`py-2.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    voiceActive
                      ? 'bg-error-container text-on-error-container animate-pulse'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                  {voiceActive ? 'Listening...' : 'Voice Memo'}
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="category-select"
                  className="text-[14px] font-semibold text-primary flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">account_tree</span>
                  Civic Category &amp; Agency
                </label>
                <span className="text-[11px] text-secondary font-semibold">{catMeta.agency}</span>
              </div>
              <div className="relative">
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategoryKey)}
                  className="w-full h-11 px-3.5 pr-10 rounded-lg bg-surface-container-low text-on-surface text-[14px] appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 transition-all cursor-pointer"
                >
                  <option value="roads">Roads &amp; Footpaths (Potholes / Broken Pavers) — BBMP</option>
                  <option value="garbage">Garbage &amp; Sanitation (Solid Waste Dump) — BBMP SWM</option>
                  <option value="water">Water Leakage &amp; Pipeline Burst — BWSSB</option>
                  <option value="streetlights">Streetlights &amp; Dangling Cables — BESCOM</option>
                  <option value="drainage">Storm Water Drainage &amp; Rajakaluve — BBMP SWD</option>
                  <option value="animals">Stray Animal Distress &amp; Animal Control — BBMP AH</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant flex items-center">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-on-surface-variant">
                Auto-routed to {catMeta.engineer}.
              </p>
            </div>

            {/* Issue Description */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="issue-description"
                  className="text-[14px] font-semibold text-primary flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">description</span>
                  Issue Description
                </label>
                <span className="text-[12px] font-medium text-on-surface-variant tabular-nums">
                  {description.length}/500
                </span>
              </div>
              <textarea
                id="issue-description"
                rows={3}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details regarding hazard depth, traffic impedance, or nearby landmarks..."
                className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-[14px] focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 transition-all resize-none"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={enhancing}
                  onClick={handleEnhanceDescription}
                  className="flex items-center gap-1 text-secondary text-[11px] font-semibold hover:underline disabled:opacity-60 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {enhancing ? 'progress_activity' : 'auto_fix_high'}
                  </span>
                  <span>{enhancing ? 'Enhancing via Gemini AI...' : 'Enhance with Civic AI Clarity'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDescription('')}
                  className="text-[11px] font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Geolocation, Urgency, Cluster, Consent, Submit */}
          <div className="lg:col-span-5 space-y-4">
            {/* Location Input with Vector Map Preview */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
                  Incident Geolocation
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold">
                  GPS Locked ±3m
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">pin_drop</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-primary truncate">{address}</p>
                  <p className="text-[13px] text-on-surface-variant">
                    Bengaluru, Karnataka • 560068 ({coordinates})
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="landmark-input"
                  className="block text-[11px] font-semibold text-on-surface-variant mb-1"
                >
                  Specific Landmark / Directional Anchor
                </label>
                <input
                  id="landmark-input"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Pillar #412"
                  className="w-full h-10 px-3.5 rounded-lg bg-surface-container-low text-on-surface text-[14px] focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 transition-all"
                />
              </div>

              <div className="relative rounded-xl overflow-hidden h-36 bg-surface-container-high shadow-inner">
                <ResilientImage
                  src={SILK_BOARD_MAP_URL}
                  alt="GIS Cadastral map of Central Silk Board, Bengaluru"
                  className="w-full h-full object-cover"
                  fallbackIcon="map"
                />
                <div className="absolute inset-0 bg-primary/20 pointer-events-none flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-secondary/20 animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[24px] text-on-primary">location_pin</span>
                  </div>
                </div>
                <div className="absolute top-2.5 left-2.5 bg-primary/85 backdrop-blur-md px-2.5 py-1 rounded-full text-on-primary text-[11px] font-semibold flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[14px] text-secondary-container">domain</span>
                  <span>Ward 174 (Madivala Sub-div)</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded-lg text-primary text-[11px] font-semibold flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[14px] text-secondary">layers</span>
                  <span>GIS Cadastral</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRecalculateGps}
                className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[16px] text-secondary ${
                    recalcGps ? 'animate-spin' : ''
                  }`}
                >
                  my_location
                </span>
                {recalcGps ? 'Calibrating GPS...' : 'Recalculate Current GPS Location'}
              </button>
            </div>

            {/* Urgency Level Selector */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">speed</span>
                  Urgency Level
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    urgency === 'severe'
                      ? 'text-error'
                      : urgency === 'moderate'
                      ? 'text-on-tertiary-container'
                      : 'text-secondary'
                  }`}
                >
                  Priority SLA: {urgency === 'severe' ? '24h' : urgency === 'moderate' ? '48h' : '7 Days'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('low')}
                  className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    urgency === 'low'
                      ? 'bg-secondary-container/60 text-on-secondary-fixed-variant shadow-sm ring-1 ring-secondary'
                      : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
                  <span className="text-[11px] font-semibold">Low</span>
                  <span className="text-[10px] text-on-surface-variant">7 Days SLA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('moderate')}
                  className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    urgency === 'moderate'
                      ? 'bg-tertiary-fixed/60 text-on-tertiary-fixed shadow-sm ring-1 ring-on-tertiary-container'
                      : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-on-tertiary-container">schedule</span>
                  <span className="text-[11px] font-semibold">Moderate</span>
                  <span className="text-[10px] text-on-surface-variant">48h SLA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('severe')}
                  className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    urgency === 'severe'
                      ? 'bg-error/10 text-error shadow-sm ring-1 ring-error'
                      : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-error">emergency</span>
                  <span className="text-[11px] font-bold">Severe</span>
                  <span className="text-[10px] text-error font-semibold">24h Urgent</span>
                </button>
              </div>
            </div>

            {/* AI Duplicate Checker Card */}
            <div className="bg-surface-container-high rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">merge</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-primary">Duplicate Clustering Notice</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-bold">
                      +12 Upvotes
                    </span>
                  </div>
                  <p className="text-[13px] text-on-surface-variant mt-1">
                    <span className="font-semibold text-on-surface">2 similar reports</span> detected within 150m. Your report will be linked to Master Ticket{' '}
                    <span className="font-semibold text-primary">#BLR-2024-8891</span> to accelerate BBMP escalation priority.
                  </p>
                  <button
                    type="button"
                    onClick={onViewMasterCluster}
                    className="mt-2 text-[11px] text-secondary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Master Incident Cluster</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Citizen Notification Consent */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed-variant flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">sms</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-primary">SMS &amp; WhatsApp Updates</p>
                  <p className="text-[13px] text-on-surface-variant truncate">
                    Live dispatch alerts to +91 98••• ••812
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
              </label>
            </div>

            {/* Submission CTA */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="w-full h-12 rounded-xl bg-primary text-on-primary text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.99] transition-all shadow-lg shadow-primary/20 disabled:opacity-80 cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[20px] ${submitting ? 'animate-spin' : ''}`}>
                  {submitting ? 'progress_activity' : 'send'}
                </span>
                <span>
                  {submitting ? 'Dispatching Ticket to Ward Engineer...' : 'Submit Civic Complaint'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-on-surface-variant py-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                <span className="text-[11px] font-semibold">
                  BBMP Integrated Grievance Portal • 256-Bit Encrypted Direct Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
