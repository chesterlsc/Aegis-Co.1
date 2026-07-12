# Changelog

All notable changes to the Aegis & Co. site since creation.

---

## 1.2 — System Visuals & Live Interactions (July 12–13, 2026)

The polish pass: every chart on the site became animated, color-consistent, and interactive.

### Added
- **Live hero pipeline simulation** — the "workflow after the system is installed" strip now runs on a loop: each stage activates in sequence (Capturing → Validating → Qualifying → Routing → CRM Updated), completed steps earn green checkmarks, a progress track fills, and a mono status readout narrates the run, ending on "RUN COMPLETE — 0 DROPPED".
- **Live symptom scan** — the "This is for you if..." console starts in standby, then a scanline sweeps the five signals and detects them one by one with a match counter (0/5 → 5/5), per-row revenue-impact meters, and an assessment CTA that arms with a glow when the scan completes.
- **Chart idle animations** — a signal sweep travels through every revenue-leak diagram (nodes, arrows, AI checklist, timeline dots, fan-out brackets), the reporting loop core breathes, and the lead-system pipeline pulses stage by stage.
- **Depth grid background** — the subtle engineering-grid texture now runs across the entire page and the lead-system band, matching the revenue-leaks section.

### Changed
- **Unified chart palette** — one color system across every visual: blue for active flow, green for success/live states, amber for detected leaks. Replaced the previous per-tab and per-node rainbow accents.
- All chart nodes gained hover states (lift, brighter border, accent glow).

### Fixed
- Diagram icons rendering blank due to missing SVG namespace after a script refactor.
- Security regression workflow failures.
- Repository hygiene: untracked `node_modules`, ignored build/test artifacts.

---

## 1.1 — Revenue Capture Redesign (July 11, 2026)

The big repositioning: from a broad "systems company" message to a sharp revenue-leak conversion path for service businesses with demand but messy operations.

### Added
- **New hero** focused on missed follow-ups and manual handoffs, sized to fit one desktop viewport, with a premium diagnostic panel (leak rows + workflow strip).
- **"This is for you if..." console** — dark self-identification panel matching the system-led visual language.
- **Tabbed revenue-leak viewer** — five workflow types (Lead Qualification, Follow-up & Booking, Fulfillment Handoffs, Back Office Admin, Reporting & Visibility) rendered as coded system diagrams in a console frame with problem/outcome strips, stat tiles, and a spec sheet.
- **Security-perimeter outcomes section** — six outcome modules in a bento grid inside a HUD-framed dark panel (corner brackets, scan sweep, live feed, load-absorption bars).
- **Expansion-path map** — the system-areas list redesigned as a numbered subway-line map with a traveling pulse, replacing plain pills.
- **Premium navigation** — full-width sticky header with blur, animated link underlines, and a solid gradient CTA.
- Playwright test suite, security-review workflow, and repository documentation.

### Changed
- Homepage copy repositioned around revenue leakage; flowcharts became conversion assets inside the leak viewer.
- Mobile layout compressed toward one screen per section; long stacks became swipeable snap rails.

### Removed
- Local editor settings and temporary review files from Git tracking.

---

## 1.0.x — Assessment Funnel & Mobile Polish (June 27 – July 9, 2026)

Building the conversion funnel and hardening it.

### Added
- **Assessment intake page** (`assessment/`) — 12-question wizard with progress tracking, validation, and dark diagnostic styling.
- **Custom domain** — `aegisco.co` via CNAME.
- Assessment form integration with submission handling, deliverability, and stability fixes.

### Changed
- Mobile homepage refinements: systems layout, header and footer, section spacing, and system visuals across several passes.
- Fixed assessment mobile menu overlap and polished its spacing; cleaned live routes.

---

## 1.0 — Initial Site (May 28 – June 10, 2026)

The first design direction: Aegis as the systems and operations company.

### Added
- Homepage built around "Systems Built for Control": hero, "What Aegis Builds" services grid, dark trigger-to-output system visual, outcomes, process, and system-areas sections.
- Light base with darker system-led sections; precise, technical, operational visual identity.
- **Dedicated flowcharts page** with five system flow diagrams (lead qualification, call handling, order-to-accounting, back-office automation, daily reporting loop).
- Initial positioning refinements and README documentation.
