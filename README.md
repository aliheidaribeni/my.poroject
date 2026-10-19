# My Project

A home for independent projects. Each project has its own purpose, documentation, and instructions.

## Projects

| Category | Project | What it does | Status | Open |
|---|---|---|---|---|
| 📚 Learning & Language | **Flashcards & Grammar** | Persian-friendly English flashcards and grammar practice as a lightweight web app/PWA. | Existing app | [Open app](./Flashcards-and-Grammar_v2.html) · [Project notes](./projects/flashcards/README.md) |
| 🌐 Networking | **Iran Smart Routing** | Xray/v2rayN/v2rayNG routing rules to send Iranian destinations direct and other traffic through the proxy. | Setup and docs in progress | [Project folder](./iran-smart-routing/) · [README](./iran-smart-routing/README.md) |
| 💪 Health & Fitness | **Workout Program** | Personal workout plan document. | Reference document | [Open PDF](./Workout_Program.pdf) |

## Repository layout

```text
my.poroject/
├── README.md                      # Project dashboard
├── Flashcards-and-Grammar_v2.html # Flashcards app entry
├── index.html                     # Existing Pages/PWA launcher
├── app.js, style.css, sw.js       # Existing PWA support files
├── manifest.json, images/         # PWA metadata and assets
├── Workout_Program.pdf            # Fitness reference
├── projects/
│   └── flashcards/
│       └── README.md              # Flashcards project documentation
└── iran-smart-routing/
    ├── README.md
    ├── docs/
    ├── rules/
    └── scripts/
```

## Project organization rules

- Keep each project's documentation, scripts, rules, and tests inside its own folder.
- Keep the current flashcards app files at the repository root for now. The existing `index.html`, service worker, manifest, and asset paths are wired together; moving them without updating and testing those paths could break the published app.
- Put new independent projects in their own named folders and add them to this index.
- Do not place secrets, access tokens, or private server credentials in this public repository.

## Quick links

- [Flashcards project notes](./projects/flashcards/README.md)
- [Iran Smart Routing documentation](./iran-smart-routing/README.md)
