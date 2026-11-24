---
name: CivicSense AI
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#73777f'
  outline-variant: '#c3c6d0'
  surface-tint: '#3f608c'
  primary: '#00254a'
  on-primary: '#ffffff'
  primary-container: '#173b65'
  on-primary-container: '#86a6d6'
  inverse-primary: '#a8c8fa'
  secondary: '#006a66'
  on-secondary: '#ffffff'
  secondary-container: '#7bf3ed'
  on-secondary-container: '#006f6b'
  tertiary: '#372000'
  on-tertiary: '#ffffff'
  tertiary-container: '#543300'
  on-tertiary-container: '#e49200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a8c8fa'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#264872'
  secondary-fixed: '#7ef5ef'
  secondary-fixed-dim: '#60d9d3'
  on-secondary-fixed: '#00201f'
  on-secondary-fixed-variant: '#00504d'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The brand voice balances municipal authority with modern machine intelligence. Designed for public works officials, ward engineers, civic administrators, and citizens within urban India (tailored to complex municipal workflows like BBMP, BESCOM, and BWSSB), the UI must instantly communicate institutional dependability, uncompromising clarity, and analytical precision.

The aesthetic fuses **Corporate / Modern GovTech** with **High-Trust Analytical SaaS**:
- Utilitarian precision designed for rapid triage, high-density data parsing, and situational awareness.
- A clean, unembellished white-and-slate canvas punctuated by deliberate civic status signifiers.
- Restrained, confidence-inspiring interactions that reduce cognitive load during municipal crises, monsoon road repair escalations, and ward-level grievance routing.
- High accessibility standards (WCAG 2.1 AA compliant) ensuring legible reading across varying hardware displays from ward offices to centralized control command centers.

## Colors
The palette leverages deep institutional navy for gravitas and governance, counterbalanced by vibrant teal to signal automated intelligence, active triage, and forward motion.

- **Primary (`#173B65`)**: Anchors structural navigation, persistent sidebars, top headers, primary actions, and institutional brand headers.
- **Secondary (`#16A6A1`)**: Communicates machine learning actions, automated duplicate clustering, AI confidence metrics, and secondary interactions.
- **Tertiary / Warning (`#F59E0B`)**: Signals unassigned escalations, pending approvals, and medium-severity pothole or water-supply alerts.
- **Neutral (`#64748B`)**: Drives structural outlines, supporting metadata, ward identifiers, and non-actionable labels against crisp neutral backgrounds (`#F5F7FB` app canvas and `#FFFFFF` elevated cards).
- **Functional Semantics**:
  - Critical / P0 Emergency: `#EF4444` (open transformers, arterial water pipe bursts, caved-in culverts).
  - Validated / Resolved: `#10B981` (pothole asphalt cured, garbage cleared, power feeder restored).
  - Base Text: `#1E293B` for uncompromised typographic contrast against surfaces.

## Typography
Typographic rhythm relies on `Inter` across all structural levels to maximize optical legibility when digesting tabular feeds, geospatial telemetry, and status dashboards.

- **Numerics & Data Density**: Apply tabular figures (`font-feature-settings: 'tnum' on, 'cv05' on`) to all municipal issue counts, ward numbers, and latency timestamps to prevent visual jitter in dynamically updating tables.
- **Labels & Badging**: Use `label-sm` and `label-md` exclusively in uppercase or tight semibold tracking for machine tags (`AI CONFIDENCE: 94%`, `BBMP WEST`, `BWSSB SEWAGE`).
- **Hierarchy Rules**: Ensure secondary administrative context (Ward No., Jurisdiction, Incident ID) retains an exact 2:1 visual weight proportion below primary ticket titles.

## Layout & Spacing
The layout follows a responsive 12-column fluid grid system engineered for command-and-control operations:

- **Desktop (1200px+)**: 12 columns with `24px` (`1.5rem`) gutters, `32px` (`2rem`) outer canvas margins. Features a persistent 260px triage sidebar, a primary operational feed spanning 7-8 columns, and a contextual inspector panel occupying 4-5 columns for incident cluster inspection and GIS maps.
- **Tablet (768px - 1199px)**: 8 columns with `16px` gutters and `24px` margins. Inspector panels collapse into slide-over sheets.
- **Mobile (< 768px)**: 4 columns with `16px` (`1rem`) gutters and `16px` (`1rem`) margins. Navigation shifts to a persistent bottom operational bar, collapsing complex filter matrices into full-screen dialogs.
- **Internal Density**: Dense operational views (e.g., ticket lists) utilize `space-sm` for horizontal metric spacing and `space-md` for row encapsulation, maintaining breathable whitespace despite deep operational detail.

## Elevation & Depth
Visual hierarchy is established using layered flat planes, low-contrast architectural borders, and soft diffuse ambient drop shadows:

- **Surface Ground (`#F5F7FB`)**: The base background layer for all dashboard workflows and viewport frames.
- **Surface Level 1 (Card & Module Canvas - `#FFFFFF`)**: Standard cards, incident rows, and metrics panels sit with a razor-thin border `1px solid #E2E8F0` and an ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Surface Level 2 (Hover & Active Drag States)**: Elevates during interaction or drag-to-merge duplicate states: `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Surface Level 3 (Drawers, Overlays & Command Palettes)**: High elevation for GIS map detail drawers and AI resolution workflows: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Focus Rings**: Strict civic keyboard accessibility uses a `2px` offset outline in Primary Navy (`#173B65`) or Teal (`#16A6A1`).

## Shapes
The system balances enterprise authority with modern usability by using structural rounded rectangles for cards alongside tight pills for atomic statuses:

- **Data Cards & Modules**: Utilize `rounded-xl` (16px) for standard incident widgets, metric containers, and modal boundaries; use `rounded-2xl` (24px) for expansive analytical overview cards and hero summary blocks.
- **Interactive Controls**: Form inputs, action buttons, search bars, and dropdown menus adhere to `rounded-md` (8px) or `rounded-lg` (12px) to communicate tactile solidity.
- **Pill Badges (`rounded-full`)**: Issue statuses, priority levels, AI confidence tags, and ward labels exclusively use rounded pill geometry to visually decouple categorization chips from card wrappers.

## Components

### Buttons
- **Primary**: Background `#173B65`, text `#FFFFFF`, hover `#102A48`, active `#0B1D33`. `rounded-lg`, height 40px, padding horizontal `16px`. `title-sm` font.
- **Secondary / AI Action**: Background `#E6F7F6`, text `#0E6865`, border `1px solid #16A6A1`. Hover background `#D1F0EE`. Highlights automated actions such as "Auto-Cluster Duplicates" or "Verify via Vision Model".
- **Ghost / Neutral**: Background transparent, text `#1E293B`, border `1px solid #E2E8F0`, hover background `#F1F5F9`.

### Status Badges (Pills)
All badges use `rounded-full`, padding `4px 10px`, `label-sm` weight:
- **Submitted**: Background `#F1F5F9`, text `#475569`, border `1px solid #CBD5E1`.
- **Under Review**: Background `#EFF6FF`, text `#1D4ED8`, border `1px solid #BFDBFE`.
- **Assigned**: Background `#F5F3FF`, text `#6D28D9`, border `1px solid #DDD6FE`.
- **In Progress**: Background `#FFFBEB`, text `#B45309`, border `1px solid #FDE68A`.
- **Resolved**: Background `#ECFDF5`, text `#047857`, border `1px solid #A7F3D0`.

### Cards & Ticket Modules
Constructed on `#FFFFFF` backgrounds with `1px solid #E2E8F0` and `rounded-xl`. Includes structured header zones distinguishing department jurisdiction (`BBMP Major Roads`, `BESCOM South Zone`, `BWSSB Water Supply`) with clear metadata separation lines (`#F1F5F9`).

### Form Inputs & Search
Default height 42px, background `#FFFFFF`, border `1px solid #CBD5E1`, text `#1E293B`, placeholder `#94A3B8`, `rounded-lg`. Active/Focus: Border `#16A6A1`, outline `2px solid rgba(22, 166, 161, 0.2)`.

### AI Confidence & Cluster Metrics
Dedicated badge component indicating computer vision confidence (e.g., "Pothole Severity: Critical (98% match)"). Includes spark progress rings or micro-meters with `#16A6A1` filled track on `#E2E8F0` ground.

### Checkboxes & Selection Controls
Standard `18px` squircle with `4px` corner radius. Inactive border `2px solid #CBD5E1`. Checked state: Background `#173B65` with white checkmark. Indeterminate state uses secondary teal `#16A6A1`.