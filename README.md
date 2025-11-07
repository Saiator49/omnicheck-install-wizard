# omnicheck-install-wizard
# OMNIcheck Installation Wizard

The OMNIcheck Installation Wizard is a single-page, media-rich assistant that guides technicians through every phase of deploying an OMNIcheck system - from hardware setup through legacy data migration. Each section combines concise instructions with annotated screenshots so field teams can work self-serve or alongside remote support.

## Features

- Guided workflow covering hardware setup, support escalation, pre-install warnings, software installation, and legacy migration
- Screenshots for every step so technicians can verify they are on the right screen before continuing
- Progress-aware navigation with saved step state, Previous/Next controls, and tabbed jumping between sections
- Modular HTML fragments (`src/sections/*.html`) loaded on demand, making it easy to update content without touching the core shell
- Built-in escalation links and PostgreSQL backup warnings to prevent skipped safety steps
- Google Analytics (gtag) hook already embedded for usage tracking if needed

## Tech stack

- Static HTML5 shell (`index.html`) with a lightweight vanilla JavaScript controller (`src/js/app.js`)
- Responsive CSS (`src/css/styles.css`) tuned for large displays typically used at workstations
- Local image assets under `src/Images/` for every step of the wizard

## Repository structure

```
.
|-- index.html                # Shell, tabs, progress bar, GA snippet
|-- src/
|   |-- css/styles.css        # Global styles + wizard layout
|   |-- js/app.js             # Navigation logic and dynamic section loading
|   |-- sections/             # HTML fragments for hardware, contact, warnings, software, legacy
|   |-- Images/               # Referenced screenshots and branding
|-- tests/e2e/                # Placeholder for Playwright/Cypress style flows
|-- .github/                  # Automation hooks (CI, issue templates, etc.)
`-- .vscode/                  # Workspace launch and debugging helpers
```

## Getting started

### Prerequisites

- A modern browser (Chrome, Edge, or Firefox) to run the wizard locally
- Optional: Node.js 18+ if you prefer to serve the site with a local static server instead of opening the HTML file directly

### Run locally

1. Clone the repository: `git clone https://github.com/Saiator49/omnicheck-install-wizard.git`
2. Change into the project folder: `cd omnicheck-install-wizard`
3. Choose one of the following preview options:
   - **Open the file directly:** double-click `index.html` (fastest for quick reviews)
   - **Serve with a lightweight HTTP server:** `npx serve .` or `python -m http.server 8080` and browse to `http://localhost:8080`
4. Click **Start Installation Guide** to launch the wizard UI

### Recommended VS Code setup

- Install the *Live Server* extension to auto-reload changes to sections or styling
- Use the provided `.vscode/launch.json` to launch a browser session directly from VS Code if desired

## Customizing the wizard

1. **Update copy or screenshots:** edit the relevant fragment in `src/sections/` and update the referenced image under `src/Images/`
2. **Add a new section:**
   - Create `src/sections/<name>.html`
   - Add a new tab button in `index.html`
   - Append the section key to `sectionOrder`, `tabs`, and `labels` inside `src/js/app.js`
3. **Tweak styling:** make changes in `src/css/styles.css`; the layout is mobile-friendly but optimized for desktop, so test both breakpoints
4. **Analytics:** replace the GA Measurement ID in `index.html` or remove the snippet entirely if analytics are not required

## Assets

- Keep PNG/JPEG/GIF assets in `src/Images/`
- Use descriptive filenames (e.g., `step10_restore.png`) so future editors can locate screenshots quickly
- All images load relative to the project root, so ensure case sensitivity if you deploy to Linux-based hosting

## Testing

- The `tests/e2e/` folder is reserved for end-to-end scripts (Playwright, Cypress, etc.) that walk through the wizard
- Suggested scenarios: hardware tab navigation, software step progression, legacy migration flow, and regression checks for tab switching/persistence

## Deployment options

- **GitHub Pages:** push to `main`, enable Pages on the repository, and point it at `/ (root)`
- **Internal hosting:** copy the repository (or the built `dist` folder if you later add a build step) to any static web server such as IIS, Nginx, S3, or an internal documentation portal
- **Offline package:** zip the repository so technicians can open `index.html` without network access

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes with clear commits
3. Add or update screenshots when UI copy changes
4. Open a pull request describing the motivation, screenshots, and any testing performed

## License / usage

This project is intended for internal OMNIcheck deployments. Confirm with the product owner before distributing or open-sourcing the wizard.


