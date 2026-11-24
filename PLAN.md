# SkillProof — Technical Architecture & Build Plan

> **Status:** Draft v1 for review  
> **Date:** 24 Nov 2026  
> **Scope:** College prototype, zero-cost, demo-first  
> **Rule:** No application code until this plan is approved.

---

## 0. Executive Summary

SkillProof is a skill-barter platform where people teach what they know and learn what they don't through 1-on-1 video swaps.

This prototype is a **"theater set"**: the room looks complete and polished, but only the parts that matter for the demo are real. The WebRTC video call, Firebase signaling, TURN relay, routing, and local demo state are real. The AI guide, matchmaking algorithm, credits ledger, learn modules, notifications, ratings, and dashboard data are scripted or hardcoded.

**The one-sentence architecture:**

> A static React SPA on Vercel, using Firestore only as a WebRTC signaling mailbox, with native WebRTC for media and Cloudflare TURN as the fallback relay. No backend. No auth. No paid APIs.

**The demo story:**

Maya is a design student who wants to learn Spanish. Diego teaches Spanish and wants to learn UI design. Maya finds Diego in Match Hub, starts a swap, and shares a room code. Diego joins from his phone. They see and hear each other over a real WebRTC call, use a 25-minute timer, end the call, and Maya's dashboard updates with the completed swap and credits.

That story must work reliably. Everything else exists to make it feel like a real product.

---

## 1. Goals, Non-Goals, and Success Criteria

### Goals

1. A non-technical presenter can run a 5–7 minute demo without developer tools.
2. Two participants can join the same room and see/hear each other using real WebRTC.
3. Signaling works through Firebase on the Spark plan.
4. The UI looks like a funded SaaS product, not a college CRUD app.
5. The app runs locally with `npm run dev` and deploys free on Vercel.
6. Zero spend: no paid services, no paid APIs, no paid UI kits.
7. Every visible button does something real, opens a polished modal, or gives a clear "demo" response. No dead ends.
8. The demo can be reset and repeated in under a minute.

### Non-Goals

- Real user accounts, passwords, OAuth, or profiles in a database.
- A real matching algorithm or recommendation engine.
- A real AI chatbot or any LLM API call.
- A real credits ledger, payments, refunds, or financial logic.
- Real course content, video lessons, quizzes, or certificates.
- Multi-party calls, webinars, recording, transcription, or screen sharing.
- Production security, moderation, abuse prevention, or GDPR tooling.
- Native mobile apps, PWA install, or offline-first behavior.
- Automated end-to-end tests of actual WebRTC media (manual QA instead).

### Success Criteria

- Two tabs or two devices connect with bidirectional audio and video.
- The Firestore room document is the only signaling channel.
- TURN relay is verified with a forced-relay test; STUN-only fallback is understood.
- The full demo path works from Home to Dashboard without a refresh.
- No console errors, no unhandled promise rejections, no camera light left on after ending.
- The production build passes and the Vercel URL works on a phone over HTTPS.
- A full rehearsal uses nowhere near any free-tier limit.
- A non-technical presenter can follow the one-page demo script.

---

## 2. Architecture at a Glance

```text
┌─────────────────────┐         Firestore (signaling only)         ┌─────────────────────┐
│  Browser A (Host)   │   offer / answer / ICE candidates          │  Browser B (Guest)  │
│  React + TypeScript │ ◄────────────────────────────────────────► │  React + TypeScript │
│  Native WebRTC      │                                            │  Native WebRTC      │
└──────────┬──────────┘                                            └──────────┬──────────┘
           │                                                                  │
           └──────────── WebRTC media: P2P, or TURN relay ────────────────────┘
                              Cloudflare TURN (fallback)
```

- Vercel serves the static Vite build.
- Firestore stores only ephemeral room state: SDP, ICE candidates, participant display names, status, timestamps.
- Media never touches Firebase. It flows peer-to-peer, or through Cloudflare TURN when NAT/firewall traversal fails.
- All product data (matches, modules, dashboard, AI responses, credits) lives in the client as typed mock data plus `localStorage`.
- There is no API server, no Cloud Functions, no database of users, and no media storage.

### Key Decisions

| Area | Decision | Why |
|---|---|---|
| Build tool | Vite + React + TypeScript (strict) | Fast local dev, simple static deploy, expected stack. |
| Styling | Tailwind CSS v4 + CSS design tokens | Fast polished UI, no component-library bloat. |
| Routing | React Router v7, library mode | Nested layouts, clean URLs, shareable room links. |
| Icons | Lucide React | Consistent, lightweight, explicitly required. |
| Signaling | Cloud Firestore | Free Spark tier, realtime snapshots, simple typed documents. |
| Media | Native `RTCPeerConnection` | No wrapper library needed; full control for the demo. |
| TURN | Cloudflare Realtime TURN | 1,000 GB/month free allowance, global anycast, TLS/TCP fallback. |
| Auth | None for the prototype | Removes login friction; two tabs can act as two people. |
| Demo data | React Context + `useReducer` + `localStorage` | Persists across pages/reloads, no backend. |
| AI Guide | Scripted intent matcher | Convincing without an API key or cost. |
| Deployment | Vercel Hobby, static SPA | Free HTTPS URL, simple env vars, easy phone testing. |
| Tests | Manual QA matrix; optional unit tests | Prototype deadline; WebRTC media is best verified manually. |

### Why Firestore Instead of Realtime Database

Firestore gives typed documents, `onSnapshot`, transactions for claiming a guest slot, and generous Spark quotas. For one 1:1 call, latency is more than adequate. All Firestore access is isolated in `src/lib/signaling.ts`, so switching to Realtime Database later would not change the UI or the WebRTC hook contract.

### Why No Firebase Auth

The prototype does not need identities. Better: each browser tab gets a random `clientId` in `sessionStorage`. This lets two tabs on the same laptop behave as host and guest, which is essential for rehearsal. Firestore rules are open for the demo, so the project must be a dedicated demo project with no real personal data. This is a deliberate prototype trade-off, not a production recommendation.

### Free-Tier Budget and Red Lines

| Service | Free Allowance | Expected Prototype Usage | Guardrail |
|---|---|---|---|
| Cloud Firestore | 1 GiB stored, 50K reads/day, 20K writes/day, 20K deletes/day | A full rehearsal is roughly hundreds of reads and dozens of writes. | Only one active room listener at a time; TTL cleanup; no polling. |
| Cloudflare TURN | First 1,000 GB/month free (shared with SFU), then $0.05/GB; STUN is free and unlimited | A 25-minute 720p call is well under 1 GB; even a day of rehearsals is under 20 GB. | Pre-generated short-lived credentials; monitor usage; never enable paid add-ons. |
| Vercel | Hobby static hosting | A few MB of JS/CSS/font assets per deploy. | No serverless functions in the MVP; no paid analytics. |
| Firebase Cloud Functions | Not available on Spark | Not used. | All logic stays client-side. |
| Firebase Storage / Auth | Not needed | Not used. | No uploads, no recordings, no accounts. |
| Fonts/images | Bundled local assets | Fontsource package + CSS/SVG avatars. | No external image APIs, no Google Fonts requests. |

**Zero-cost red lines:** no Blaze plan, no Cloud Functions, no paid AI API, no paid avatar/image service, no custom domain, no recording/transcoding, no paid component library, no analytics add-ons.

**Cloudflare TURN note:** Standalone TURN is fine for 1:1 WebRTC; an SFU is not required. The 1,000 GB/month free tier is shared between TURN and SFU. TURN credentials are valid for at most 48 hours, and the TURN key/API token must stay server-side. For this prototype, a small local Node script generates demo-day credentials; they are placed in `.env.local` and never committed. A Vercel serverless credential minter is a future hardening step, not MVP scope.

**Billing caveat:** Cloudflare may require a billing profile to enable Realtime even while usage is inside the free allowance. Verify this before committing to TURN. If a payment method is unacceptable, the fallback is STUN-only plus a phone hotspot, with the limitation documented. Never silently add a paid service.

---

## 3. File and Folder Structure

```text
skillproof/
├── public/
│   └── favicon.svg
├── scripts/
│   └── turn-credentials.mjs        # local-only helper; prints VITE_TURN_* values
├── src/
│   ├── main.tsx                    # React root, providers, font import
│   ├── App.tsx                     # router + route-level layouts
│   ├── index.css                   # Tailwind import, @theme tokens, base styles
│   ├── vite-env.d.ts               # typed Vite env variables
│   ├── assets/
│   │   └── logo-mark.svg
│   ├── components/
│   │   ├── ui/                     # generic, reusable primitives
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # sidebar + mobile nav + content area
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── MarketingNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── ScrollToTop.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── LiveSwapPreview.tsx # JSX-only video-call mockup in the hero
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FeaturedSkills.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CtaBand.tsx
│   │   ├── match/
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchFilters.tsx
│   │   │   ├── MatchDetailModal.tsx
│   │   │   └── FindingMatchOverlay.tsx
│   │   ├── guide/
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatComposer.tsx
│   │   │   ├── SuggestionChips.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── session/
│   │   │   ├── PreCallPanel.tsx
│   │   │   ├── VideoTile.tsx
│   │   │   ├── CallControls.tsx
│   │   │   ├── SessionTimer.tsx
│   │   │   ├── ConnectionBadge.tsx
│   │   │   ├── SessionNotesPanel.tsx
│   │   │   ├── EndCallModal.tsx
│   │   │   └── PostCallSummary.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── UpcomingSwapCard.tsx
│   │   │   ├── SkillProgressCard.tsx
│   │   │   └── ActivityFeed.tsx
│   │   ├── learn/
│   │   │   ├── ModuleCard.tsx
│   │   │   ├── LessonList.tsx
│   │   │   └── ModuleProgressHeader.tsx
│   │   └── system/
│   │       └── FirebaseSetupNotice.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── MatchHubPage.tsx
│   │   ├── AiGuidePage.tsx
│   │   ├── SwapLobbyPage.tsx
│   │   ├── SwapSessionPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LearnModulesPage.tsx
│   │   ├── LearnModulePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── layouts/
│   │   ├── MarketingLayout.tsx
│   │   ├── AppLayout.tsx
│   │   └── SessionLayout.tsx
│   ├── hooks/
│   │   ├── useLocalMedia.ts
│   │   ├── useRoom.ts
│   │   ├── useWebRTC.ts
│   │   ├── useSessionTimer.ts
│   │   ├── useMockAI.ts
│   │   ├── useCopyToClipboard.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useToast.ts
│   │   └── useDocumentTitle.ts
│   ├── lib/
│   │   ├── firebase.ts             # guarded Firebase app/Firestore init
│   │   ├── signaling.ts            # typed room create/join/offer/answer/ICE/end
│   │   ├── webrtc.ts               # ICE config, peer connection, media helpers
│   │   ├── env.ts                  # validated Vite env access
│   │   ├── clientId.ts             # per-tab identity in sessionStorage
│   │   ├── constants.ts            # durations, credits, categories, storage keys
│   │   ├── format.ts               # time, initials, relative dates
│   │   └── cn.ts                   # clsx + tailwind-merge
│   ├── context/
│   │   ├── DemoStateContext.tsx    # mock app state + reducer + persistence
│   │   └── ToastContext.tsx
│   ├── data/
│   │   ├── currentUser.ts
│   │   ├── matches.ts
│   │   ├── modules.ts
│   │   ├── dashboardSeed.ts
│   │   ├── testimonials.ts
│   │   ├── skills.ts
│   │   └── aiResponses.ts
│   ├── types/
│   │   ├── index.ts                # User, Match, Session, Module, AI, DemoState
│   │   └── signaling.ts            # Room, Participant, SDP/ICE payloads
│   └── styles/
│       └── animations.css          # optional keyframes; tokens stay in index.css
├── .env.example
├── .gitignore
├── firestore.rules                  # demo-only rules, pasted into Firebase console
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json                      # SPA rewrite
├── vite.config.ts
├── README.md
└── PLAN.md
```

### Structure Rules

- `pages/` own orchestration: route params, creating/joining a room, composing page sections.
- `components/` are presentational where possible. No raw Firestore calls inside components.
- `hooks/` own reusable stateful behavior: media, peer connection, timer, mock AI, clipboard.
- `lib/` owns infrastructure and pure utilities: Firebase, signaling, WebRTC, env, formatting.
- `data/` is the single source of hardcoded demo content. Components never contain large literal arrays.
- `context/` holds only global demo state and toasts. WebRTC state stays local to the session page.
- `types/` contains shared contracts. Avoid type definitions inside components.
- No barrel-file maze. Import directly; only `types/index.ts` may re-export types.
- Path alias `@/` points to `src/`. One component per file, PascalCase filenames. Hooks start with `use`. Constants are `UPPER_SNAKE_CASE`.
- Keep critical files small. The WebRTC hook should be the only complex hook; if it grows past readability, split signaling effects into helpers rather than adding more components.

---

## 4. Routes and Layouts

| Route | Layout | Page | Purpose | Reality |
|---|---|---|---|---|
| `/` | Marketing | HomePage | Landing page, product story, CTA | Polished UI; all content mock |
| `/match` | App | MatchHubPage | Browse, search, filter matches; start a swap | Client-side logic over mock JSON |
| `/swap` | App | SwapLobbyPage | Join by room code; start from a match | Real navigation + room creation |
| `/swap/:roomId` | Session | SwapSessionPage | Pre-call setup, live call, timer, summary | Real WebRTC + Firestore signaling |
| `/guide` | App | AiGuidePage | Scripted AI guide chat | Mock intent engine |
| `/learn` | App | LearnModulesPage | Module catalog and progress | Mock catalog; local progress |
| `/learn/:moduleId` | App | LearnModulePage | Lesson list and completion | Mock content; local progress |
| `/dashboard` | App | DashboardPage | Stats, upcoming swap, skills, activity | Seeded mock + local updates |
| `*` | Marketing/standalone | NotFoundPage | Friendly 404 | Polished fallback |

**Route behavior:**

- The invite link format is `/swap/ABC123?name=Diego%20Alvarez`. The `name` query param pre-fills the guest display name for the two-tab demo; it is editable and not trusted.
- Match Hub's "Start swap" opens a confirmation modal, reserves mock credits, creates the room in Firestore, then navigates to `/swap/:roomId` as host.
- If Firebase is not configured, `/swap` and room creation show a friendly setup notice instead of a raw error. All other pages still work.
- `/swap/:roomId` handles three phases in one page: pre-call, in-call, post-call summary. This avoids passing a live `MediaStream` across routes.
- The session layout is full-screen and chrome-free: no sidebar, no marketing footer.

---

## 5. Mock vs. Real Matrix

**Reality boundary:** real things are WebRTC media, Firestore signaling, TURN relay, browser media controls, routing, timers, and local persistence. Everything that implies a backend, an algorithm, or a paid API is mocked.

### Pitch-Deck Features

| Feature | Screen | What the Audience Sees | Implementation | Real or Mock | Notes |
|---|---|---|---|---|---|
| **Home** | `/` | Hero, live-swap mockup, how it works, skills, testimonials, CTA | JSX + Tailwind + hardcoded content | **Mock content, real UI** | No backend. CTA routes into the app. |
| **Match Hub** | `/match` | Match cards with compatibility, skills, ratings, availability | Typed array in `data/matches.ts`; client-side search/filter | **Mock data, real filtering** | Compatibility percentages and "why you match" are hardcoded. |
| **AI Guide** | `/guide` | Chat with suggestions, typing indicator, helpful replies | Keyword/intent matcher in `useMockAI` + canned responses | **Fully mock** | No API call, no key, no cost. Label as prototype assistant. |
| **Swap Session** | `/swap/:roomId` | Pre-call preview, real video/audio, controls, 25-min timer, summary | Native WebRTC + Firestore signaling + Cloudflare TURN | **Real video; mock notes/agenda** | The only truly backend-dependent feature. |
| **Dashboard** | `/dashboard` | Stats, upcoming swap, skill progress, activity feed | Seeded mock data + reducer updates from completed swaps/lessons | **Mock data, real local updates** | Feels coherent because the session actually updates it. |
| **Learn Modules** | `/learn`, `/learn/:moduleId` | Module catalog, progress, lesson checklist | Hardcoded modules and lesson text; progress in `localStorage` | **Mock content, real local progress** | No videos, no quizzes, no certificates. |

### Supporting Capabilities

| Capability | Reality | Implementation | Demo Behavior |
|---|---|---|---|
| Authentication | **None** | Per-tab `clientId` in `sessionStorage`; fixed demo persona | No login screen. Sidebar shows "Demo account". |
| User profiles | **Mock** | `data/currentUser.ts` and `data/matches.ts` | Avatar initials, headline, teaches/wants, rating. |
| Matching algorithm | **Mock** | Fixed compatibility scores and reasons per profile | "Smart match" is a scripted delay that highlights a card. |
| Search and filters | **Real, client-side** | `useState` + `useMemo` over mock matches | Search by name/skill, filter by category/availability. |
| Credits system | **Mock** | Reducer + `localStorage`; constants for reserve/reward | Reserve 20 on room creation, add 40 on completion. Reset restores seed. |
| Payments | **None** | Not built | No payment UI. |
| In-call chat | **Out of scope** | Not built | Notes panel is mock/static. |
| Notifications | **Mock** | Hardcoded dropdown list | Bell opens a small menu; no push. |
| Ratings and reviews | **Mock** | Post-call star selector updates local state | No moderation, no public reviews. |
| Session history | **Mock + local** | Completed sessions stored in demo state | Dashboard and activity feed reflect it. |
| File uploads/recordings | **None** | Not built | No storage cost, no privacy risk. |
| Screen sharing | **Future/stretch** | Native `getDisplayMedia` if time allows | Excluded from MVP acceptance. |
| Signaling | **Real** | Firestore room document + snapshots | Offer/answer/ICE only. |
| TURN relay | **Real when configured** | Cloudflare credentials from env | STUN-only fallback if absent/expired. |
| Deployment | **Real** | Vercel static build + SPA rewrite | Free HTTPS URL for phone testing. |
| Analytics | **None** | Not built | No tracking, no cookies. |

### "No Dead Button" Policy

Every visible control must do at least one of these:

1. Navigate to a real route.
2. Open a real modal/drawer with real content.
3. Change local state in a visible way.
4. Show a specific toast such as "Demo only: scheduling is mocked in this prototype."

Nothing should silently do nothing. Placeholder pages are acceptable in Phase 1, but no placeholder ships in Phase 5.

---

## 6. Data, State, and Mock Content

### Demo State

Global demo state lives in `DemoStateContext.tsx` and is persisted to `localStorage` under a versioned key, for example `skillproof.demo.v1`.

| Slice | Contents | Source | Persisted |
|---|---|---|---|
| `profile` | Maya Chen, design student, teaches UI Design, wants Spanish, streak | `data/currentUser.ts` | Yes |
| `credits` | Starting balance 120; reserve/reward changes | Reducer | Yes |
| `sessions` | Completed swaps: roomId, partner, topic, duration, credits, rating | Reducer | Yes |
| `moduleProgress` | Module ID to completed lesson IDs | Reducer + `data/modules.ts` | Yes |
| `activity` | Seeded activity plus generated swap/lesson events | Reducer + seed | Yes |
| `upcoming` | One seeded upcoming swap | `data/dashboardSeed.ts` | Yes (static) |
| `stats` | Baseline swaps, hours, streak; derived totals | Seed + reducer | Yes |

**Actions:** `RESERVE_SWAP_CREDITS`, `COMPLETE_SWAP`, `COMPLETE_LESSON`, `RATE_SWAP`, `RESET_DEMO`. `COMPLETE_SWAP` is idempotent by `roomId`, so host and guest tabs cannot double-count the same session. The reducer clamps credits at zero and writes a new versioned object.

**Cross-tab caveat:** both tabs share the same `localStorage` because they share an origin. For the demo this is desirable: the host tab's dashboard updates from the call. Display names are per-room, so the guest can appear as Diego while the browser account remains Maya. This is a theater trick, not a real multi-user model.

**Reset:** a "Reset demo data" action in the profile menu clears the storage key, restores the seed, and reloads. This is the safety net before every rehearsal.

### Firestore Room Document

No other Firestore collections are used.

| Field | Type | Notes |
|---|---|---|
| `roomId` | string | Document ID; six-character uppercase code. |
| `createdAt` | timestamp | Server timestamp. |
| `expiresAt` | timestamp | Firestore TTL policy deletes stale rooms after ~2 hours. |
| `status` | `waiting` / `active` / `ended` | UI state. |
| `topic` | string | Example: "UI Design ↔ Spanish". |
| `durationMinutes` | number | Default 25. |
| `host` | participant object | `{ clientId, displayName, initials }`. |
| `guest` | participant object or `null` | Claimed with a transaction. |
| `offer` | SDP object or `null` | Host's local description. |
| `answer` | SDP object or `null` | Guest's local description. |
| `hostCandidates` | array | Host ICE candidates, appended with `arrayUnion`. |
| `guestCandidates` | array | Guest ICE candidates, appended with `arrayUnion`. |
| `startedAt` | timestamp or `null` | Host writes once, when media is connected and guest is present. |
| `endedAt` | timestamp or `null` | Set by either participant when ending. |
| `endReason` | string or `null` | `completed`, `left`, `timeout`, `error`. |

**Why candidate arrays, not subcollections:** one writer per array avoids lost updates, `arrayUnion` is atomic, and deleting the room document via TTL also removes the candidates. A call produces dozens of candidates, nowhere near the document size limit.

**Room creation:** generate a six-character code from an unambiguous alphabet, check existence in a transaction, retry up to three times. **Joining:** transaction reads the room, rejects ended/expired rooms, claims the empty guest slot, and is idempotent for the same `clientId`.

### Mock Content Catalog

**Current user:** Maya Chen, "Design student learning Spanish", teaches UI Design, wants Spanish, 120 credits, 5-day streak.

**Matches:** 10 profiles with name, initials/avatar seed, headline, bio, teaches, wants, rating, completed swaps, availability, compatibility score, and a hardcoded "why you match" reason. Recommended cast:

- Diego Alvarez — teaches Spanish, wants UI Design — 94%
- Priya Nair — teaches Data Analytics, wants Public Speaking — 91%
- Noah Williams — teaches Guitar, wants Figma — 88%
- Sofia Rossi — teaches Italian Cooking, wants Photography — 86%
- Kenji Tanaka — teaches Japanese, wants React — 84%
- Amara Okafor — teaches Public Speaking, wants Excel — 82%
- Liam O'Brien — teaches Photography, wants Guitar — 80%
- Elena Petrova — teaches Chess, wants Spanish — 78%
- Marcus Lee — teaches React, wants UX Research — 76%
- Zara Ahmed — teaches Digital Marketing, wants Video Editing — 74%

**Modules:** Figma Fundamentals (72%), Spanish for Beginners (45%), Public Speaking 101 (30%), React Essentials, Photography Basics, Personal Finance. Each has 4–8 lessons with titles, durations, and three static takeaways. "Mark complete" updates local progress and adds a small credit reward.

**AI intents:** greeting, how SkillProof works, find a match for a skill, explain credits, prepare for a swap, what should I teach, technical help, fallback. Each intent has 1–2 response bubbles, optional suggested actions, and a 700–1,400 ms typing delay. Keyword scoring, not an LLM.

**Dashboard seed:** 12 completed swaps, 8.5 learning hours, 120 credits, 5-day streak; upcoming swap with Diego tomorrow at 4:00 PM; skill progress for UI Design, Spanish, Public Speaking; seeded activity feed.

**Avatars:** initials on deterministic teal/sand/ink gradients. No external image URLs, so the app works offline and never breaks during a demo.

---

## 7. WebRTC and Signaling Design

### Room Lifecycle

```text
Host                         Firestore                         Guest
 │                              │                               │
 │ 1. create room (transaction) │                               │
 │─────────────────────────────►│                               │
 │ 2. pre-call preview          │                               │
 │ 3. join, add local tracks    │                               │
 │ 4. createOffer               │                               │
 │ 5. setLocalDescription       │                               │
 │ 6. write offer + host ICE    │                               │
 │─────────────────────────────►│                               │
 │                              │ 7. guest opens invite link    │
 │                              │◄──────────────────────────────│
 │                              │ 8. join transaction (guest)   │
 │                              │ 9. read offer                 │
 │                              │ 10. setRemoteDescription      │
 │                              │ 11. createAnswer              │
 │                              │ 12. write answer + guest ICE  │
 │ 13. onSnapshot answer        │◄──────────────────────────────│
 │ 14. setRemoteDescription     │                               │
 │ 15. exchange queued ICE      │                               │
 │ 16. DTLS/ICE connects; ontrack│                              │
 │ 17. host writes startedAt    │                               │
 │ 18. both show 25:00 timer    │                               │
 │ 19. end → status ended       │                               │
```

### Roles and Identity

- Host creates the room and owns the `host` slot.
- Guest claims the `guest` slot with a Firestore transaction. A second guest is rejected as "Room is full."
- `clientId` is a random UUID stored in `sessionStorage`; each tab is distinct, even on the same browser.
- The role is derived from `clientId` matching `host.clientId` or `guest.clientId`, never from a URL parameter.
- The display name is editable in pre-call. The invite link's `name` query parameter only pre-fills it.
- A host cannot join their own room as guest in the same tab; the UI tells them to open the link in a new tab or another device.

### Hook Contracts

| Hook | Owns | Returns |
|---|---|---|
| `useLocalMedia` | `getUserMedia`, preview, device list, mic/cam enabled flags, cleanup | `stream`, `status`, `error`, `devices`, `toggleMic`, `toggleCam`, `stop` |
| `useRoom` | One Firestore `onSnapshot` listener for the room document | `room`, `loading`, `error` |
| `useWebRTC` | `RTCPeerConnection`, offer/answer, ICE writes and queue, remote stream, connection state | `remoteStream`, `connectionState`, `error`, `endCall` |
| `useSessionTimer` | Countdown anchored to Firestore `startedAt` | `remainingSeconds`, `formatted`, `isWarning`, `isExpired`, `extend` |
| `useMockAI` | Scripted chat state, typing delay, intent matching | `messages`, `isTyping`, `sendMessage`, `reset` |
| `useCopyToClipboard` | Clipboard write + fallback + toast trigger | `copy`, `copied` |

`useRoom` owns the only room listener. `useWebRTC` receives the latest room snapshot as a parameter, so it does not create a second listener and does not duplicate reads.

### Signaling Functions (`lib/signaling.ts`)

- `createRoom(roomId, host, topic, durationMinutes)`
- `joinRoom(roomId, guest)` — transactional guest claim
- `writeOffer(roomId, offer)`
- `writeAnswer(roomId, answer)`
- `addHostCandidate(roomId, candidate)`
- `addGuestCandidate(roomId, candidate)`
- `startRoom(roomId)` — sets `status: active` and `startedAt` once
- `endRoom(roomId, reason)`
- `subscribeRoom(roomId, callback, onError)`

All functions are typed, sanitize ICE candidate fields, and never expose Firebase objects outside `lib/`. Firestore failures map to friendly app errors.

All signaling effects are role-gated and idempotent: the host never re-processes its own offer, the guest never re-processes its own answer, and each side tracks the last processed candidate index so React re-renders cannot apply the same ICE candidate twice.

### Media Constraints

- Video: ideal 1280×720, minimum 640×360, frame rate 24–30, front camera.
- Audio: echo cancellation, noise suppression, auto gain control enabled.
- Local preview is always muted; remote video is unmuted.
- `playsInline` on both video elements. Remote `play()` failures show a "Tap to enable sound" overlay.
- Device selection happens in pre-call. Mid-call device switching is a stretch goal, not MVP.
- Screen sharing is out of scope for MVP.

### ICE and TURN

- Default STUN: `stun:stun.cloudflare.com:3478` plus a Google STUN fallback.
- TURN: all practical Cloudflare URLs from the generated response, including UDP 3478, TCP 80/3478, and TLS 443/5349.
- `VITE_FORCE_RELAY=true` sets `iceTransportPolicy: "relay"` for QA. This proves TURN actually works.
- If TURN env vars are missing or expired, the app logs a development warning, shows a small "Direct connection" badge, and uses STUN only. It must not block the call.
- TURN credentials have a maximum 48-hour lifetime. Generate them on demo day, not weeks in advance. Regenerate and redeploy if the Vercel build embeds them.

### Failure Handling

| Failure | Detection | Audience-Facing UI | Recovery |
|---|---|---|---|
| Firebase env missing | `lib/env.ts` check at startup | Setup notice on swap pages; mock app still works | Add `.env.local`, restart dev server |
| Camera denied | `getUserMedia` rejection | Friendly permission card with browser instructions | "Join audio only" or retry |
| No camera device | `NotFoundError` | Avatar placeholder + audio-only join | Continue with audio |
| Second tab can't access camera | `NotReadableError` on Windows | Same fallback | Use phone via Vercel or join audio-only |
| Remote autoplay blocked | `video.play()` rejection | Large tap-to-unmute overlay | User taps once |
| Room full | Transaction conflict | "This swap already has two people" | Back to Match Hub |
| Room expired/ended | Room snapshot | "This room has ended" | Start a new swap |
| ICE failed | `connectionState === "failed"` | "Connection lost" panel | End and retry with a new room; no silent hang |
| Guest leaves | Room/participant update | "Diego left the swap" + end button | End and summary |
| TURN expired | Env expiry check / ICE failure | Dev warning; STUN fallback | Regenerate credentials |
| Firestore permission/network error | Snapshot error | Friendly retry card | Retry or reload |

### Explicitly Out of Scope for WebRTC MVP

- ICE restart and seamless reconnection after refresh.
- Multi-party calls or SFU.
- Screen sharing, recording, transcription, background blur.
- In-call chat, file transfer, or whiteboard.
- Mobile native APIs, camera switching mid-call, bandwidth adaptation UI.
- Perfect negotiation / glare handling. Roles are fixed: host always offers, guest always answers.

### Security and Privacy Notes

- This is a demo-only Firestore project with open rules. Do not use real names, emails, or sensitive data.
- Room codes are short and not a security boundary. Anyone with the code and link can join.
- TURN API token stays in `.env.turn` on the developer machine, never in Vite variables.
- Media is encrypted with DTLS-SRTP. TURN relays encrypted packets; it does not store media.
- No recording. Obtain verbal consent before testing with another person.
- Delete or lock down the Firebase project after the college demo. A production version needs Auth, strict rules, App Check, rate limiting, and a real abuse plan.

---

## 8. UI/UX and Design System

### Visual Direction

Polished, calm, modern SaaS with a teal identity. White surfaces on a soft mint-tinted canvas, dark green ink, generous spacing, rounded cards, subtle shadows, and one strong accent color used with restraint. No gradients everywhere, no glassmorphism overload, no generic purple startup palette.

### Color Tokens

| Token | Hex | Use |
|---|---|---|
| `brand-50` | `#E6F7F4` | Tinted backgrounds, selected chips |
| `brand-100` | `#CCEFEA` | Hover tints, progress tracks |
| `brand-300` | `#66CFC3` | Illustration accents |
| `brand-500` | `#00A896` | Brand accent, icons, highlights, live indicators |
| `brand-600` | `#007A6D` | Primary buttons, links, focus rings |
| `brand-700` | `#005F55` | Primary hover, dark emphasis |
| `ink-900` | `#0B1F1C` | Headings |
| `ink-600` | `#4E625D` | Body and muted text |
| `canvas` | `#F6FAF9` | App background |
| `surface` | `#FFFFFF` | Cards, sidebar, modals |
| `border` | `#E3ECE9` | Hairline borders |
| `amber` | `#F4B740` | Ratings and small highlights |
| `danger` | `#D9534F` | End call, destructive actions, errors |
| `success` | `#1F9D75` | Connected/complete states |

**Accessibility note:** `#00A896` on white is roughly 3:1, which is fine for large graphics and icons but not normal text. Use `brand-600`/`brand-700` for text and primary button fills with white labels. Do not rely on color alone for connection state; pair it with text and an icon.

### Typography

- **Font:** Plus Jakarta Sans Variable, bundled via `@fontsource-variable/plus-jakarta-sans` so it works offline.
- Display: 48–64 px, weight 700–800, tight tracking.
- Page title: 32–40 px, weight 700.
- Section title: 24–28 px, weight 700.
- Body: 16 px / 26 px, weight 400.
- Small/meta: 13–14 px, weight 500.
- Max line length ~65 characters. Avoid all-caps paragraphs.

### Shape, Spacing, and Motion

- Radius: buttons 12 px, inputs 12 px, cards 16–20 px, modals 24 px, pills full.
- Spacing: 4 px base scale; page padding 24 px mobile, 32–40 px tablet, 48 px desktop.
- Section spacing: 64–96 px marketing, 32–48 px app pages.
- Shadows: soft and low opacity; one stronger elevation for modals. Hairline borders do most of the structure.
- Motion: 160–240 ms ease-out for hover, menus, modals, page fades. Skeleton shimmer for loading. Respect `prefers-reduced-motion`.
- Hover: 1–2 px lift or background tint, never a jarring scale.

### Reusable UI Primitives

Button (primary/secondary/ghost/danger, small/medium/large, loading, icon), Card, Badge (skill/level/status), Avatar (initials, sizes, online dot), Input, Select, Modal (focus trap, Esc, return focus), Toast (max 3, auto-dismiss, `aria-live`), ProgressBar, ProgressRing, Skeleton, EmptyState, ErrorBoundary, PageHeader, Logo.

Build these by hand with Tailwind. Do not add a component library; custom primitives are what make the app feel distinctive and keep dependencies lean.

### Layouts

1. **MarketingLayout** — sticky glass nav, max-width 1280 content, footer. Used only for Home and 404.
2. **AppLayout** — desktop sidebar (264 px) with logo, nav, primary "Start a swap" button, credits card, demo profile; mobile top bar and bottom navigation. Used for Match Hub, AI Guide, Learn, Dashboard, Swap Lobby.
3. **SessionLayout** — full-screen dark teal call environment, no sidebar or footer. Used for the live room and pre-call.

### Screen Direction

**Home**
- Hero headline: "Teach what you know. Learn what you don't."
- Subcopy: "SkillProof pairs you with real people for 1-on-1 skill swaps over video. No money. Just skills."
- Primary CTA: "Find your swap". Secondary: "See how it works".
- Hero visual: a JSX-built live-swap card with two avatar tiles, a 18:42 timer, a teal connection pill, skill chips, and a floating "Swap complete +40 credits" card. This sells the product without an image dependency.
- Sections: social proof (avatars + "12,000 swaps completed"), how it works (Match → Meet → Master), featured skill categories, three testimonials, CTA band, footer with a small "College prototype" note.

**Match Hub**
- Header: "Your next skill is one swap away."
- Search, category chips, availability filter, "Smart match" button with sparkles icon.
- Match grid: compatibility badge, avatar, name, headline, teaches/wants chips, rating, swaps, availability, "View profile" and "Start swap".
- "Smart match" shows a 1.6 s finding overlay, then highlights the top card with a subtle ring and toast.
- Detail modal: bio, skills, "Why you match" mock reason, schedule slots, credit cost, primary CTA.
- Empty state with "Clear filters".

**AI Guide**
- Split layout: context panel ("Your swap copilot") + chat card.
- Suggested prompts: "Find me a design swap", "How do credits work?", "Help me prepare for a session".
- Assistant messages can include an action chip such as "Open Match Hub".
- Typing indicator; disclaimer "Prototype assistant — responses are scripted."
- Clear chat action.

**Swap Lobby**
- Join-by-code card with large segmented input.
- Recent match shortcuts and "Start from Match Hub".
- Clear explanation of what the camera is used for.

**Pre-Call / Session**
- Dark full-screen environment with a teal glow.
- Left: local camera preview, mirrored, muted, with camera-off avatar fallback.
- Right: partner card, topic, duration, name input, mic/camera device selects, "Join swap" button, room code, copy invite link.
- Host waiting state: animated "Waiting for Diego to join..." and a visible invite link.
- In-call: remote video dominant, local picture-in-picture, top bar with topic + connection badge + timer, bottom control bar with mic, camera, notes, end call.
- Side notes panel (mock agenda: "Warm-up, teach 10 min, practice 10 min, wrap-up") can be toggled.
- End modal: "End this swap?" with a summary of time remaining.
- Summary: partner, topic, duration, credits earned, star rating, "Back to dashboard".
- Timer warning at 5 minutes and 1 minute; ring turns amber then red.
- Connection states: "Waiting for guest", "Connecting video", "Connected", "Reconnecting", "Connection lost".

**Dashboard**
- Greeting with time-aware "Good morning/afternoon/evening, Maya."
- Four stat cards: swaps, learning hours, credits, streak.
- Upcoming swap card with partner, topic, relative time, "Open lobby".
- Skill progress cards with rings/bars.
- Weekly activity bars (CSS only, no chart library).
- Recent activity feed.
- "Reset demo data" in the profile menu.

**Learn**
- Catalog with progress summary and category filters.
- Module cards with icon, level, duration, lesson count, progress bar, "Continue".
- Detail page: progress header, lesson list with durations, three takeaways per lesson, "Mark complete", "Practice this with a swap" CTA.
- Mock content is clearly written, never lorem ipsum.

### Accessibility Checklist

- Semantic landmarks and heading order.
- Visible focus ring on every interactive element.
- Icon-only buttons have `aria-label`.
- Modal focus trap, Esc to close, focus returns to trigger.
- Form labels are real labels, not placeholders.
- Timer and connection changes announced with `aria-live="polite"` at sensible intervals.
- Contrast checked for small text and buttons.
- No color-only status.
- Keyboard-operable filters, chips, modals, and video controls.
- `prefers-reduced-motion` disables shimmer and large transitions.
- Video has no captions in the prototype; state this limitation in the README and do not claim accessibility compliance.

### Theater Details That Sell the Prototype

- Scripted 0.7–1.6 s delays for "smart match" and AI replies. Instant responses feel fake.
- Coherent data: completing a swap updates dashboard stats, credits, skill progress, and activity.
- Warm, specific copy with real names and relative times.
- Friendly error states instead of stack traces.
- Subtle "Demo" labels only where honesty matters (AI assistant, demo account). Do not plaster "mock" over the product.
- No external image requests; all visuals are CSS/SVG/initials.
- A hidden-in-plain-sight "Demo tools" menu in the profile area: reset data, open guest tab, copy invite.

---

## 9. Build Order

### Summary

| Phase | Name | Main Outcome | Estimate |
|---|---|---|---|
| 1 | Scaffolding & UI Shell | Polished clickable shell, routes, design system, Home | 2–3 focused days |
| 2 | Match Hub & Mocking | Full mock product: matches, AI, learn, demo state | 3–4 focused days |
| 3 | Firebase & WebRTC Hook | Two tabs/devices connect with real audio/video | 3–5 focused days |
| 4 | Session UI & Timer | Complete call experience with timer, controls, summary | 2–3 focused days |
| 5 | Polish & Dashboard | Dashboard, deployment, QA, demo rehearsal | 2–3 focused days |

**Total:** roughly 12–18 focused development days. Phase 3 is the critical path; do not start Phase 4 until a two-tab call is stable.

### Phase 1 — Scaffolding & UI Shell

**Goal:** a beautiful, navigable shell with no real backend behavior yet.

Tasks:
- Scaffold Vite + React + TypeScript; enable strict mode; configure ESLint and path alias.
- Install Tailwind CSS v4 with the Vite plugin; define `@theme` color, font, radius, and shadow tokens.
- Add Plus Jakarta Sans via Fontsource; set base typography and background.
- Build `Button`, `Card`, `Badge`, `Avatar`, `Input`, `Modal`, `Skeleton`, `ProgressBar`, `ProgressRing`, `Toast`, `EmptyState`, `ErrorBoundary`.
- Build MarketingLayout, AppLayout, SessionLayout, sidebar, mobile nav, marketing nav, footer, PageHeader.
- Set up React Router routes and placeholder pages for Match, Guide, Swap, Learn, Dashboard, 404.
- Build the full Home page: hero, live-swap mockup, how it works, skills, testimonials, CTA.
- Add `useDocumentTitle`, `ScrollToTop`, and a polished 404.
- Create the Firebase project and `.env.example` early, but do not integrate signaling yet.
- Add a friendly Firebase setup notice on swap pages when env vars are absent.

Deliverable: a responsive, polished shell that looks like a real SaaS product, with Home fully done.

Acceptance:
- `npm run dev` and `npm run build` pass.
- TypeScript strict and ESLint pass with no errors.
- All routes render; no console errors.
- Responsive at 375, 768, 1024, and 1280 widths.
- Teal brand system is consistently applied; no default Tailwind blue/purple.

Demo checkpoint: show Home and navigate the shell. No call yet.

### Phase 2 — Match Hub & Mocking

**Goal:** a complete clickable product except for the real call.

Tasks:
- Define shared types and typed mock data: current user, 10 matches, 6 modules, testimonials, skills, AI responses, dashboard seed.
- Implement `DemoStateContext` with reducer, versioned `localStorage`, reset, and derived stats.
- Build Match Hub: search, category/availability filters, smart-match overlay, cards, detail modal, start-swap confirmation.
- Build AI Guide: chat layout, message bubbles, suggestion chips, typing indicator, keyword intent engine, action chips.
- Build Learn Modules: catalog, filters, module detail, lesson completion, progress persistence.
- Build Swap Lobby: join-by-code UI, recent matches, start-from-match CTA; show setup notice if Firebase is missing.
- Build Dashboard shell with seeded data, pending final updates in Phase 5.
- Add toasts for every mock action; no dead buttons.
- Persist module progress and credits across refresh.

Deliverable: a presenter can click from Home → Match → AI Guide → Learn → Dashboard and everything responds.

Acceptance:
- Full mock click-through with no console errors.
- Refresh preserves credits, sessions, and module progress.
- Search/filter works with empty states.
- AI chat never makes a network request.
- All buttons have visible outcomes.
- Mobile layouts are usable.

Demo checkpoint: a 4-minute mock walkthrough. The call button can show "Setup required" until Phase 3.

### Phase 3 — Firebase & WebRTC Hook

**Goal:** the hard part works before it is pretty.

Tasks:
- Configure Firebase web app, Firestore database, demo rules, and TTL policy on `expiresAt`.
- Implement `lib/firebase.ts`, `lib/env.ts`, `lib/clientId.ts`, `lib/signaling.ts`.
- Build room create/join transactions, room-code generation, guest claim, room-full/expired handling.
- Build `useLocalMedia` with preview, device enumeration, permission errors, and cleanup.
- Build `useRoom` with one snapshot listener.
- Build `useWebRTC`: peer connection, tracks, offer/answer, ICE writes, candidate queue, remote stream, connection state, cleanup.
- Add pre-call raw video UI for testing; do not polish yet.
- Add TURN credentials via the local script; test STUN-only and forced relay.
- Add dev-only connection diagnostics: ICE state, candidate types, whether relay is in use.
- Verify StrictMode behavior, listener cleanup, camera light off after end.

Deliverable: two tabs or two devices connect with bidirectional audio/video through Firebase signaling.

Acceptance:
- Three consecutive two-tab calls succeed without refreshing.
- Audio and video flow both ways; mic/camera toggles work.
- Forced relay test produces a relay candidate and still connects.
- Ending stops all tracks, closes the peer connection, unsubscribes, and marks the room ended.
- Missing Firebase config, camera denial, room full, and expired room all show friendly UI.
- No duplicate listeners or leaked tracks in React StrictMode.

Demo checkpoint: a raw but real call. This is the go/no-go gate.

### Phase 4 — Session UI & Timer

**Goal:** turn the working call into a polished product experience.

Tasks:
- Build the full pre-call panel: preview, name, device selects, mic/cam toggles, room code, copy invite, waiting state.
- Build the in-call layout: remote stage, local PiP, top bar, connection badge, controls, notes panel, end modal.
- Build the timer anchored to Firestore `startedAt`; warnings at 5 and 1 minute; extend 5 minutes as a mock action.
- Host writes `startedAt` exactly once when connected and guest present.
- Build post-call summary with duration, partner, topic, credits, and star rating.
- Complete the swap in demo state idempotently by `roomId`; update credits, stats, skill progress, and activity.
- Handle guest leaves, host ends, connection lost, autoplay blocked, and camera denied.
- Make invite links/codes work across tabs and devices.
- Polish mobile session layout.

Deliverable: a complete Match → Lobby → Call → Summary → Dashboard loop.

Acceptance:
- Full flow from Match Hub to summary in under two minutes.
- Timer stays in sync within a couple of seconds across tabs.
- Ending from either side produces a summary; demo state updates once.
- Mic/cam controls, copy link, notes, and end flow all work.
- No camera light remains on after leaving.
- Works on desktop and phone-sized screens.

Demo checkpoint: run the full theater flow twice, once with two tabs and once with a phone.

### Phase 5 — Polish & Dashboard

**Goal:** make it presentable, deploy it, and rehearse.

Tasks:
- Finish Dashboard: stats, upcoming swap, skill progress, weekly bars, activity feed, empty states.
- Add page transitions, skeleton states, hover polish, and consistent microcopy.
- Accessibility pass: focus states, labels, modal behavior, reduced motion, contrast.
- Responsive QA at 375, 390, 768, 1024, 1280.
- Vercel deployment with env vars and SPA rewrite; test the production URL on a phone.
- Write README: setup, Firebase, TURN, scripts, demo script, troubleshooting, limitations.
- Add "Reset demo data" and "Open guest tab" demo tools.
- Run the QA matrix and a zero-cost audit.
- Optional if time: Vitest unit tests for mock AI/util functions, screen share, or a Vercel TURN credential endpoint.

Deliverable: deployed, polished, repeatable demo.

Acceptance:
- Production URL works; refreshing `/match` or `/swap/ABC123` does not 404.
- Two devices connect over HTTPS.
- A non-technical presenter can run the demo from the script.
- Full rehearsal under 7 minutes; reset under 1 minute.
- No paid resources enabled; quotas checked.
- README lets a teammate run the project from scratch.

### If Time Runs Short

Cut in this order:
1. Learn module detail depth (keep catalog + progress).
2. Match detail modal (keep cards + filters).
3. Dashboard weekly bars.
4. AI multi-bubble sequences.
5. Decorative animations.

Never cut: real two-device call, TURN test, timer, pre-call permission fallbacks, summary/dashboard update, mobile layout, demo reset, deployment.

---

## 10. Required Dependencies

Use the latest stable majors at scaffold time and commit the lockfile. Do not upgrade major versions mid-build. Target stack: React 19, Vite 7+, TypeScript 5+, Tailwind CSS 4, React Router 7, Firebase JS SDK 12+.

### Runtime Dependencies

| Package | Purpose | Notes |
|---|---|---|
| `react` | UI runtime | Required. |
| `react-dom` | DOM renderer | Required. |
| `react-router-dom` | Routing, nested layouts, shareable URLs | Library mode; no framework/data router needed. |
| `firebase` | Firestore client for signaling | Modular SDK; only Firestore APIs imported. |
| `lucide-react` | Icon set | Explicit requirement. |
| `clsx` | Conditional class names | Small utility for UI primitives. |
| `tailwind-merge` | Merge conflicting Tailwind classes | Used by `cn()`. |
| `@fontsource-variable/plus-jakarta-sans` | Locally bundled variable font | No Google Fonts network dependency. |

### Development Dependencies

| Package | Purpose |
|---|---|
| `vite` | Dev server and production build. |
| `@vitejs/plugin-react` | React fast refresh and JSX transform. |
| `typescript` | Type checking. |
| `@types/react` | React types. |
| `@types/react-dom` | React DOM types. |
| `@types/node` | Vite config/path alias typings. |
| `tailwindcss` | Utility CSS engine. |
| `@tailwindcss/vite` | Tailwind v4 Vite integration. |
| `eslint` | Linting. |
| `@eslint/js` | ESLint recommended config. |
| `typescript-eslint` | TypeScript-aware lint rules. |
| `eslint-plugin-react-hooks` | Hook rules. |
| `eslint-plugin-react-refresh` | Fast-refresh safety. |
| `globals` | Browser globals for ESLint. |
| `prettier` | Optional formatting. |
| `prettier-plugin-tailwindcss` | Optional class sorting. |
| `vitest` | Optional unit tests. |
| `@testing-library/react` | Optional component tests. |
| `@testing-library/jest-dom` | Optional DOM assertions. |
| `jsdom` | Optional test DOM. |
| `firebase-tools` | Optional CLI for deploying Firestore rules; console is enough. |

### Explicitly Not Needed

| Package/Service | Why Not |
|---|---|
| `simple-peer` or WebRTC wrapper | Native `RTCPeerConnection` is the requirement and is easier to debug. |
| `framer-motion` | CSS transitions/keyframes are enough; keeps bundle small. |
| `recharts` / chart library | Dashboard charts are CSS bars and progress rings. |
| `zustand` / Redux | One small reducer context is sufficient. |
| `react-hook-form` / `zod` | A handful of controlled inputs; no complex forms. |
| `date-fns` | `Intl.DateTimeFormat` and simple helpers suffice. |
| shadcn/ui, MUI, Chakra, Headless UI | Custom primitives avoid dependency weight and generic visuals. |
| AI SDK / OpenAI SDK | AI is scripted, not real. |
| Any paid avatar/image API | Initials + CSS gradients. |
| Firebase Auth/Storage, Cloud Functions | Not needed; Functions are not available on Spark. |
| Paid TURN/SFU, Twilio, Agora, Daily | Cloudflare TURN free tier + native WebRTC. |

### NPM Scripts

| Script | Purpose |
|---|---|
| `dev` | Vite dev server on localhost. |
| `build` | Type-check and production build. |
| `preview` | Serve the production build locally. |
| `lint` | ESLint. |
| `typecheck` | `tsc --noEmit`. |
| `turn:credentials` | Local Node script; prints fresh Cloudflare TURN env values. |
| `format` | Optional Prettier. |
| `test` | Optional Vitest. |

---

## 11. Environment, Setup, and Deployment

### Environment Variables

Firebase values are public client configuration (security comes from rules), but the project should still be a dedicated demo project.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase web app config. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase web app config. |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firestore project. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Standard config value; storage is not used. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Standard config value. |
| `VITE_FIREBASE_APP_ID` | Yes | Standard config value. |
| `VITE_TURN_URLS` | Optional | Comma-separated Cloudflare TURN URLs. |
| `VITE_TURN_USERNAME` | Optional | Short-lived TURN username. |
| `VITE_TURN_CREDENTIAL` | Optional | Short-lived TURN credential. |
| `VITE_TURN_EXPIRES_AT` | Optional | ISO timestamp for the dev expiry warning. |
| `VITE_FORCE_RELAY` | Optional | `true` for a TURN-only QA run. |

Server-only, never prefixed with `VITE_`, never committed:

| Variable | Purpose |
|---|---|
| `CLOUDFLARE_TURN_KEY_ID` | Cloudflare TURN key ID for the local credential script. |
| `CLOUDFLARE_TURN_API_TOKEN` | Cloudflare API token allowed to mint TURN credentials. |

### Firebase Setup

1. Create a dedicated Firebase project on the Spark plan.
2. Add a Web app and copy the config into `.env.local`.
3. Create a Firestore database in production mode, choosing a nearby region.
4. Paste the demo-only rules into the Firestore Rules console. The rules allow read/write only on `rooms/{roomId}` and nothing else.
5. Enable a TTL policy on the `rooms` collection for the `expiresAt` field.
6. Do not enable Auth, Storage, Functions, or Hosting. They are not used.
7. Verify reads/writes in the Firebase usage dashboard after a rehearsal.

### Cloudflare TURN Setup

1. Create a Cloudflare account and open the Realtime/TURN dashboard.
2. Create a TURN key; keep the key ID and API token secret.
3. Run `npm run turn:credentials` locally with the two server-side env vars. The script calls Cloudflare's credential endpoint with a TTL of up to 48 hours and prints `VITE_TURN_*` lines.
4. Copy the output into `.env.local`.
5. Restart the dev server; use `VITE_FORCE_RELAY=true` once to verify a relay candidate.
6. On demo day, regenerate credentials before deploying/rehearsing. Credentials expire; do not generate them weeks early.
7. Confirm whether Cloudflare requires a billing profile to enable Realtime. Usage inside the 1,000 GB/month free tier should not charge, but do not add a paid plan.

### Local Run

1. Install Node 20 or 22 LTS and npm.
2. `npm install`
3. Create `.env.local` from `.env.example`; add Firebase config and optional TURN values.
4. `npm run dev`
5. Open `http://localhost:3000` (or the port Vite prints).
6. Host: create a room. Guest: open the invite link in a second tab or on a phone.
7. For phone testing, use the Vercel HTTPS URL or a tunnel. `getUserMedia` requires HTTPS except on localhost.

### Vercel Deployment

1. Push the repo to GitHub.
2. Import it into Vercel as a Vite project.
3. Build command `npm run build`; output directory `dist`.
4. Add the same `VITE_*` environment variables in Vercel for Production and Preview.
5. Add a SPA rewrite so every route serves `index.html`.
6. Deploy and test the production URL on a phone.
7. If TURN credentials are baked at build time, regenerate and redeploy before the demo.

### Future Hardening (Not MVP)

- A tiny Vercel serverless function to mint TURN credentials per session, avoiding redeploys and exposing only short-lived credentials.
- Firebase Anonymous Auth + strict Firestore rules + App Check.
- A real backend for profiles, credits, and moderation.
- ICE restart/reconnection.
- In-call chat via Firestore.
- Screen sharing and recording (with consent).

---

## 12. QA and Demo Runbook

### Manual Test Matrix

| Test | Expected |
|---|---|
| Chrome desktop ↔ Chrome desktop, two tabs, localhost | Bidirectional audio/video; timer starts; toggles work. |
| Chrome laptop ↔ phone via Vercel HTTPS | Same; mobile layout usable. |
| Chrome ↔ Edge | Same. |
| Camera denied on host | Friendly permission card; audio-only join offered. |
| Camera denied on guest | Guest can join audio-only; host sees avatar. |
| Mic denied | Call still connects; host sees muted state. |
| Guest joins before host offer | Guest waits; offer arrives; connection completes. |
| Guest joins after host offer | Offer is waiting in Firestore; connection completes. |
| Force relay (`VITE_FORCE_RELAY=true`) | Relay candidate selected; call connects. |
| TURN env missing | STUN fallback; dev warning; call still works on permissive networks. |
| Room full | Third participant is rejected with a clear message. |
| Expired/ended room | Friendly "room ended" screen; no hang. |
| Host ends call | Guest sees ended state and summary; tracks stop. |
| Guest ends call | Host sees guest left/ended state; tracks stop. |
| Refresh during call | Documented limitation: call ends; reload starts fresh. |
| Wi-Fi off/on | Connection lost state; no silent freeze. |
| Autoplay blocked | Tap-to-unmute overlay. |
| Mobile 375/390 px | No horizontal scroll; controls reachable. |
| Build + preview | Production bundle works; routes refresh correctly. |
| Vercel refresh `/swap/ABC123` | SPA rewrite serves the app, not 404. |
| Reset demo | Seed state restored; credits, sessions, progress reset. |

### Pre-Demo Checklist (30 Minutes Before)

- Firebase project active; Firestore rules correct; TTL configured.
- TURN credentials fresh (within 48 hours); force-relay test passed.
- Vercel production URL opens on phone; HTTPS camera permission works.
- Camera and microphone permissions granted on the demo laptop.
- Headphones ready to avoid echo between tabs/devices.
- Second device charged, on the same network or hotspot.
- Demo data reset; dashboard shows the seeded story.
- Close unused tabs, notifications, and apps that might grab the camera.
- Run one full call and end it; confirm camera light turns off.
- Check Firebase and Cloudflare usage dashboards.
- Keep the README and troubleshooting section open on a second screen.

### Six-Minute Demo Script

1. **Home (45 s):** "SkillProof is a skill-barter platform. Teach what you know, learn what you don't. No money, just skills." Point out the live-swap visual and CTA.
2. **Match Hub (60 s):** Filter to Design/Languages. Show Diego at 94% match. Open the detail modal, explain the mock compatibility and credits, start the swap.
3. **Pre-call (45 s):** Camera preview, mic/cam controls, room code, copy invite. Open the guest view on the phone or second tab; pre-fill Diego.
4. **Live call (2 min):** Both join. Wave, toggle mic/camera, point out the real connection badge and 25-minute timer. Mention that media is peer-to-peer, with TURN as fallback; Firebase only carries signaling.
5. **End + summary (45 s):** End the swap. Show duration, topic, credits, rating. Back to dashboard.
6. **Dashboard + Learn (60 s):** Show the completed swap in activity, updated stats/credits/skill progress. Open Learn, mark a lesson complete, show progress. Close with the Home CTA.

### Failure Drills

- If the second tab cannot access the camera, join audio-only and continue; use the phone as the primary guest.
- If campus Wi-Fi blocks P2P, TURN over TLS 443 should relay. If TURN is unavailable, use a phone hotspot and STUN.
- If the room fails, end, create a new room, and rejoin. Do not debug in front of the audience.
- If Firebase config is missing, the app shows setup instructions; keep a working `.env.local` backup.
- If TURN credentials expire, regenerate and restart/redeploy; do not present a call that silently fails.
- If the demo state looks wrong, use Reset demo data and start from Home.

### Free-Tier Monitoring

- Firebase console → Firestore usage: reads, writes, storage.
- Cloudflare dashboard → Realtime/TURN analytics: egress GB.
- Vercel dashboard → bandwidth and build minutes.
- No Cloud Functions, Storage, or paid add-ons should appear.

---

## 13. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cloudflare TURN requires a billing profile | Medium | High if a card is unacceptable | Verify before Phase 3; if blocked, STUN-only + hotspot and document the limitation. |
| TURN credentials expire before demo | Medium | High | Generate on demo day; show expiry warning; redistribute/redeploy; rehearse force-relay. |
| Campus Wi-Fi blocks UDP/P2P | Medium | High | TURN over TLS 443; phone hotspot fallback; test on the actual venue network. |
| Second tab cannot access the same camera | Medium | Medium | Phone as guest; audio-only guest; join with camera off. |
| Firestore latency or listener bug | Low | High | Candidate queue; connection state UI; test three consecutive calls; isolate signaling. |
| StrictMode double effects leak tracks/listeners | Medium | High | Idempotent cleanup; refs; dev test camera light off; keep signaling in one listener. |
| Open Firestore rules abused | Low for demo | High if public | Dedicated project, no PII, TTL, delete/lock after demo. |
| Spark quota exceeded | Very low | Medium | One room at a time; no polling; monitor usage; no Functions/Storage. |
| Browser/Safari autoplay or track differences | Medium | Medium | Chrome primary; tap-to-unmute; track-accumulation fallback; test Safari if available. |
| Firebase SDK/config missing on reviewer machine | Medium | Medium | `.env.example`, README, setup notice; mock pages still work. |
| Vercel SPA refresh 404 | Low | Medium | Test rewrites; verify direct room link. |
| Scope creep into real auth/AI/credits | High | High | Freeze features after Phase 2; this plan is the contract. |
| Non-technical presenter cannot recover | Medium | High | One-page script, reset button, friendly errors, rehearsal. |
| Camera/mic consent and privacy | Low | Medium | Ask consent; no recording; no uploads; use demo names. |
| Time overrun in Phase 3 | High | High | Start Firebase setup early; timebox signaling; use native APIs; cut non-core features. |

---

## 14. Out of Scope / Future Roadmap

**Out of scope for this prototype:** real auth, database profiles, matching algorithm, AI API, payment/credits ledger, course content, in-call chat, notifications, recording, screen share, multi-party, moderation, analytics, PWA, automated WebRTC tests, production security.

**If SkillProof becomes a real product:**

1. Firebase Auth (or another identity provider) and strict per-user Firestore rules.
2. Server-owned credits ledger and booking state, not `localStorage`.
3. A real matching service with explainable recommendations.
4. A server-side AI endpoint with guardrails and cost limits.
5. A TURN credential service (Vercel serverless or Cloudflare Worker) with per-session credentials.
6. ICE restart, reconnection, call quality telemetry, and TURN fallback analytics.
7. Moderation, reporting, consent, recording policy, and data deletion.
8. Automated end-to-end tests with browser automation plus a real two-peer test harness.

---

## 15. Approval Checklist

Before any application code is written, confirm:

1. **Stack and phase order** are approved as written.
2. **TURN approach:** pre-generated 48-hour credentials for demo day (recommended for this prototype chain), or spend time on a Vercel credential endpoint.
3. **Cloudflare account:** confirm a billing profile is acceptable while staying inside the free 1,000 GB/month allowance; otherwise approve the STUN-only fallback.
4. **Demo personas:** Maya Chen and Diego Alvarez are acceptable (or provide preferred names/skills).
5. **Session length:** 25 minutes is the default (or choose 15/30).
6. **College rubric:** confirm whether real auth, tests, admin, or a database are required. If yes, the scope changes.
7. **Plan location:** Plan mode restricts plan files to the OpenCode plan folder. After switching to Build mode, copy this `PLAN.md` to the repository root as the first build step.

**No React components, application code, or config files have been created. This is the planning deliverable.**

