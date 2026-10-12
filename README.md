# Aegis & Co.

Marketing site for **Aegis & Co.**, a systems company that helps service businesses stop losing revenue to missed follow-ups, manual handoffs and stalled work.

**Live:** [aegisco.co](https://aegisco.co)

## What it does

- **Revenue-leak positioning.** The homepage leads with the buyer's problem (demand is there, follow-up isn't) and walks visitors through the leaks Aegis fixes first.
- **Live system visuals.** An animated lead pipeline, a symptom scan and a tabbed workflow viewer show how a capture system routes, qualifies and follows up, instead of describing it in paragraphs.
- **System Assessment.** A guided intake at [`/assessment`](assessment/) that qualifies the business and captures the brief.
- **System Flows.** Standalone flowcharts at [`/flowcharts.html`](flowcharts.html) for sales calls and proposals.

## Engineering

- Static HTML, CSS and vanilla JavaScript. No framework, no build step, served by GitHub Pages.
- **Security regression suite** that runs in CI on every push and pull request: a static scan for unsafe patterns (`eval`, raw `innerHTML`, exposed secrets, unprotected new-tab links), plus Playwright tests for input allowlisting and the assessment form's validation, duplicate blocking and failure handling.
- Dependabot keeps the test tooling and Actions current. Every change is logged in [CHANGELOG.md](CHANGELOG.md).

```bash
npm install
npm run security:test   # static checks + browser tests
```

---

Designed and built by [Chester Studio](https://chesterstudio.space).
