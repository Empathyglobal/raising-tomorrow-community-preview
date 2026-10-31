# Raising Tomorrow

A parenting life simulation about choices, consequences, repair, and learning. Created by **Eric Gonzalez-Payne, a Harvard-trained educator**, to help people learn about parenting through playful decisions and reflection. The project is personally owned by its creator; Harvard does not endorse or sponsor it.

## Private preparation copy

This repository is a **private, sanitized preparation copy** exported from an existing Base44 project on October 31, 2026. It is for owner review, not a public release. Its initial commit records the sanitized export as it exists today; it does **not** recreate the original project's development or Base44 checkpoint history.

This separate export must not be represented as an original-history repository for BYOP eligibility. Organizer confirmation, owner approval for any public release, and a license decision are separate outstanding steps. The owner reports that the original project has no real users yet. No user records or backend database exports are included here.

## What is included

- The existing React gameplay, built-in scenarios, choices and consequences, character setup, progression, local saves, settings, themes, and earned-diamond mechanics.
- Local gameplay and the existing pass-and-play implementation; remote multiplayer is unavailable.
- An isolated local service adapter. It cannot connect to the original Base44 application, authenticate an online account, invoke remote AI, or take payments.
- A local placeholder illustration in place of hosted art. The original artwork and external fonts are not fetched.

This is still an evolving test build. Preserving a source module does not mean every scenario or mode has been play-tested.

## Run locally

Use Node.js 22 or newer and npm. From this directory:

```sh
npm ci --ignore-scripts
npm run dev
```

Open the loopback URL printed by Vite (normally `http://127.0.0.1:5173`). No account, API key, Stripe setup, Base44 project ID, environment variable, or paid service is required. `.env.example` intentionally contains no credentials. Do not supply production configuration.

For a production-format local build:

```sh
npm run build
npm test
npm run preview
```

The build output is local and ignored by Git. These commands do not deploy or publish the application.

## Isolation and limitations

Real payment checkout, webhooks, provider identifiers, payment test probes, backend deployment files, telemetry, OAuth consent flows, and production connection settings were excluded or replaced. Earned diamonds remain game currency; no real-money purchase is available. The clearly labeled demo reward grants four local diamonds without showing an advertisement. AI conversations and online multiplayer show explicit unavailable messages. Some content formerly supplied by remote entities may be empty or use built-in fallback content. Remote badge awarding is unavailable.

Use fictional character names and situations. Gameplay saves can remain in this browser's local storage, and manual save files remain on the user's computer. Do not enter real people's sensitive information. Local feedback is not submitted to a service. Clearing site data removes browser-local saves and preferences.

The app includes a Content Security Policy that restricts network connections to its own local origin and loopback development sockets. This is defense in depth alongside source-level service removal, not a substitute for review. Do not weaken it to reconnect the original backend.

## Stack

React 18, JavaScript/JSX, Vite 6, React Router 7, Tailwind CSS 3, Radix UI components, TanStack Query, Framer Motion, and supporting libraries. The upstream project used React Router 6, the Base44 SDK and Vite plugin; this copy updates routing, removes those Base44 integrations and Stripe packages, and drops unused vulnerable PDF/editor/schema packages. Exact resolved versions are recorded in `package-lock.json`.

## Review evidence

See [REVIEW.md](REVIEW.md) for actual checks, limitations, and remaining blockers. This project does not claim a complete security audit or universal gameplay coverage.

## License and release

**License pending the creator's choice.** No open-source license has been selected or granted for this preparation copy. Dependency licenses remain applicable to their respective packages. Keep the repository private until the owner explicitly approves a release and its licensing.
