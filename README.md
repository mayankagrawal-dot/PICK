# PICK — Break the Autopilot

A Next.js dashboard for noticing how *often* you reach for your phone, not just how long you're on it. See the full [product spec](#product-notes) below.

## Run it locally

This machine doesn't have Node.js installed yet, so install it first:

1. Download the **LTS** installer from [nodejs.org](https://nodejs.org/) (or `winget install OpenJS.NodeJS.LTS` in PowerShell) and run it.
2. Open a **new** terminal window (so it picks up the updated PATH) and confirm it worked:

```bash
node -v
npm -v
```

Then, from this project folder:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **No backend, no database** — all pickup/focus-session data lives in the browser's `localStorage` (see `lib/storage.ts`). Refreshing the page keeps your data; "Reset all data" clears it.

## Project structure

```
app/
  layout.tsx        root layout, global styles
  page.tsx           the dashboard — owns all state, wires components together
  globals.css        Tailwind entrypoint + a couple of custom classes
components/          presentational UI pieces (stats, charts, modals, overlays)
lib/
  types.ts           PickupEvent / FocusSession shapes
  constants.ts        triggers, experiments, goal, storage keys
  storage.ts          localStorage read/write helpers
  stats.ts             pure derived-stat functions (gaps, streaks, trends, insights)
  demoData.ts          generates a realistic simulated week, for demos
```

## Product notes

**Core message:** It's not only how long you spend on your phone — it's how often you feel the urge to check it.

**Important technical honesty:** a browser (and this web app) cannot detect real physical phone pickups. Every pickup here is logged manually — via the button, the `Space` key, or the "Load a demo week" simulator. A future native Android/iOS app could use real device unlock events, subject to OS permissions.

**What's on the dashboard:**
- Today's pickup count vs. goal, longest/average gap between pickups, and an intentionality score — each with a trend badge vs. yesterday
- A streak counter for consecutive days under your goal
- An **Urge Map** — pickups bucketed by hour, so you can see your peak-risk windows
- A **7-day trend chart** against your daily goal
- Rule-based **AI insights** (peak trigger, riskiest hour, intentional vs. autopilot ratio, week-over-week change)
- A **25-minute phone-down focus sprint** with a full-screen timer and completion feedback
- A rotating **daily experiment** suggestion

This app never diagnoses addiction, gives medical advice, or shames the user for phone use — it's meant to build awareness, not guilt.
