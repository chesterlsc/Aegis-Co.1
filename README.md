# Aegis & Co.

Revenue-focused landing page for Aegis & Co., a systems company that helps service businesses fix missed follow-ups, manual handoffs, and revenue leaks inside their workflows.

## Latest Update

This revision moves the homepage from a general systems/automation message into a clearer conversion path for service businesses with demand but messy operations.

Source comparison:
- Previous/current source version: [`chesterlsc/aegis-co-1.0`](https://github.com/chesterlsc/aegis-co-1.0)
- New implemented version: [`chesterlsc/Aegis-Co.1`](https://github.com/chesterlsc/Aegis-Co.1)

What changed:
- Repositioned the hero around missed follow-ups, manual handoffs, and revenue leakage.
- Reduced the desktop hero headline scale so the first landing view fits cleanly in one screen.
- Upgraded the navigation with a more premium sticky treatment and stronger assessment CTA.
- Redesigned the lead-capture workflow visual into a more polished diagnostic pipeline.
- Rebuilt the "This is for you if..." section as a dark diagnostic console that matches the system-led visual language.
- Reworked "Common Revenue Leaks We Fix First" into a large tabbed workflow viewer with previous/next controls so each problem is easier for clients to inspect.
- Enlarged the flowchart display for better visibility.
- Redesigned "How Your System Expands Over Time" as a dark expansion-path map instead of plain pills.
- Added lightweight reveal and tab interactions through `scripts.js`.
- Preserved responsive behavior for desktop and mobile.

## Previous Version vs New Version

### Previous Version: `chesterlsc/aegis-co-1.0`

The previous version was a strong first design direction for Aegis. It presented Aegis as a systems and operations company focused on structure, clarity, control, workflows, automation, reporting, and internal tools.

The old homepage was organized around:
- A broad "Systems Built for Control" hero.
- A "What Aegis Builds" services grid.
- A dark system visual showing how work connects from trigger to output.
- Outcomes around less manual work, cleaner handoffs, faster reporting, visibility, control, and fewer bottlenecks.
- A simple process section and system-area grid.

What worked well:
- The brand felt precise, technical, modern, and operational.
- The light/dark visual system made Aegis feel structured and premium.
- The original flow visuals gave the page a strong system-led identity.

What needed improvement:
- The message was still broad and could apply to many business types.
- The hero explained what Aegis builds, but did not make the buyer's pain feel immediate.
- The CTA was more general and did not clearly explain why someone should click.
- Flowcharts were not surfaced as clearly as conversion proof.
- The system expansion areas were useful, but visually plain compared to the rest of the site.

### New Version: `chesterlsc/Aegis-Co.1`

The new version keeps the Aegis visual language but makes the business problem sharper: service businesses already have demand, but revenue leaks because follow-ups, routing, handoffs, and visibility are not systemized.

The new homepage is organized around:
- A revenue-leak hero focused on missed follow-ups and manual handoffs.
- A premium diagnostic panel for lead capture and follow-up.
- A dark "This is for you if..." console that helps visitors self-identify.
- A large tabbed workflow viewer for common revenue leaks.
- Previous/next controls so clients can browse each workflow type.
- A focused Revenue Capture System Build offer.
- A clearer lead-capture workflow visual.
- A more expressive expansion-path map showing how the system grows over time.
- A final CTA centered on finding what's slowing the business down.

Why this version is stronger:
- The ICP is clearer: service businesses with demand but messy operations.
- The pain is more concrete: missed follow-ups, manual handoffs, inconsistent routing, and hidden stalled work.
- The CTA is more useful: the visitor knows the assessment identifies workflow leaks.
- The flowcharts are now conversion assets, not just supporting visuals.
- The page feels more premium and interactive without losing the Aegis system-led tone.
- Desktop and mobile layouts were tightened so the landing experience is easier to scan.

## Repository Cleanup

This repository was cleaned for GitHub before publishing:
- Local editor settings were removed from Git tracking and ignored through `.gitignore`.
- Local-only review notes and temporary visual files were removed before publishing.
- Git author identity is configured as `chesterlsc` for committed updates.

## Site Structure

- Hero and revenue-capture diagnostic
- ICP/self-identification console
- Common revenue leaks workflow viewer
- Revenue Capture System Build offer
- Lead-capture system visual
- Workflow outcomes
- Aegis process
- System expansion path
- Final assessment CTA

## Tech

This is a static site built with HTML, CSS, and vanilla JavaScript.

Main files:
- `index.html`
- `styles.css`
- `scripts.js`
- `assessment/index.html`
- `flowcharts.html`
- `assets/flows/`

## Deployment

The site can be hosted on any static host. The repository includes a `CNAME` file for the configured domain.
