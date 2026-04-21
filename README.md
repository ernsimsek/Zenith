# Zenith — Music from the future

> A next-generation web music player with the **Dark Matter** design system.
> Built on React 18 + Vite + Tailwind + **Jamendo** (Creative Commons catalog).

This repository contains the **MVP** slice of Zenith: layout shell, Home, Library, Discover, Search, detail pages, player bar, and FFT visualizer. 


---

## What's inside (MVP)

- **Jamendo API** — free `client_id` from [devportal.jamendo.com](https://devportal.jamendo.com/) (no OAuth in the browser for catalog reads)
- **Dark Matter design system** — CSS variables + Tailwind tokens + custom fonts (Syne, Space Grotesk, DM Sans, JetBrains Mono)
- **Layout shell** — Sidebar · TopNav · PlayerBar · PageWrapper (fade-up stagger)
- **Pages**: `/` Home · `/library` · `/discover` · `/search` · `/settings` · `/artist/:id` · `/album/:id` · `/playlist/:id`
- **Audio engine** — Howler.js + Web Audio `AnalyserNode`, stream URLs from Jamendo where available
- **Player bar** — play/pause, shuffle, repeat, waveform scrubber, volume, like burst
- **FrequencyBars visualizer** — real-time FFT

---

## Quick start

### 1. Jamendo app

1. Create an application at [Jamendo Developer Portal](https://devportal.jamendo.com/).
2. Copy the **Client ID** (do not expose **Client Secret** in `VITE_*` env vars).

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_JAMENDO_CLIENT_ID=your_jamendo_client_id_here
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173 — if `VITE_JAMENDO_CLIENT_ID` is missing, you are redirected to `/setup`.

### Troubleshooting: `ERR_CONNECTION_REFUSED`

Use **http://127.0.0.1:5173** (IPv4). This repo sets `server.host: '127.0.0.1'` in [`vite.config.js`](./vite.config.js).

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

---

## Known limitations

- **Catalog** is Jamendo’s CC / independent artist catalog, not major-label streaming mirrors.
- **Library “Songs”** tab has no personal saved-tracks backend yet; playlists in the sidebar come from Jamendo featured playlists.
- **Rate limiting** — respect Jamendo API fair use.

---

## Project structure

```
src/
├── components/
│   ├── layout/      Sidebar, TopNav, PageWrapper
│   ├── music/       TrackRow, AlbumCard, ArtistCard, PlaylistCard
│   ├── player/      PlayerBar, WaveformScrubber, PlayIcon
│   ├── ui/          Toast, Skeleton, SectionHeading
│   └── visualizers/ WaveformBg, FrequencyBars
├── hooks/           useAudio, useVisualizer
├── lib/             audio (Howler), jamendoApi
├── pages/           Home, Library, Discover, Search, Settings, Setup, Artist, Album, Playlist
├── store/           playerStore, libraryStore, settingsStore (persist), uiStore (Zustand)
└── styles/          variables.css, globals.css, animations.css
```

---

## Design tokens

Dark Matter colors live in [`src/styles/variables.css`](./src/styles/variables.css) and are wired through [`tailwind.config.js`](./tailwind.config.js).

Easing used throughout: `cubic-bezier(0.16, 1, 0.3, 1)` (Tailwind: `ease-zenith`).

<img width="1919" height="883" alt="Ekran görüntüsü 2026-04-21 151954" src="https://github.com/user-attachments/assets/9d566124-2d92-4d1a-a4ec-bd50740df916" />
---

*Music from the future, felt in the present.*
