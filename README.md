# 🐾 Blobbi Buddies

> A Tamagotchi-style cooperative pet game built entirely on [Nostr](https://nostr.com).

[![Edit with Shakespeare](https://shakespeare.diy/badge.svg)](https://shakespeare.diy/clone?url=https%3A%2F%2Fgithub.com%2FNostrDanish%2FPlayground.git)

**Live demo →** https://blobbi-buddies.shakespeare.wtf

---

## What is Blobbi Buddies?

Blobbi Buddies lets you care for a cute pixel-art pet called a Blobbi — solo or together with friends. Every action you take is published as a Nostr event, so your care history lives on the decentralised network forever. Friends can visit your Blobbi, play co-op activities, take photo dates, and compete in daily challenges.

| | |
|---|---|
| 🐣 **Raise your Blobbi** | Feed, play, clean, and put it to sleep. Stats decay over time so check in daily. |
| 🌟 **Watch it evolve** | Egg → Baby → Child → Teen → Adult → Elder as you accumulate care points. |
| 🤝 **Co-op activities** | Invite friends to picnics, beach days, dinner dates, stargazing, and more. |
| 📸 **Photo dates** | Stage a scenic photo with a friend's Blobbi and upload real pictures. |
| 🎮 **Mini-games** | Memory Match, Color Rush, and Feed Frenzy — all award XP. |
| ⭐ **Daily tasks** | Four rotating challenges each day with XP rewards and a streak counter. |
| 💬 **In-game chat** | Public game chat powered by Nostr kind-1 notes. |
| 🐾 **Multi-Blobbi** | Own multiple Blobbis, each with a custom name, colour, and independent stats. |

---

## Screenshots

```
┌──────────────────────────────────────────┐
│  Blobbi Buddies  🥚 Egg   ⭐ Lv.3  🔥 5  │  ← sticky header
├──────────────────────────────────────────┤
│  [● Blobbi ✓]  [● Luna]  [● Mochi]  [+]  │  ← switcher bar
│                                           │
│         ╭──────────────────╮              │
│  ☁️      │    🐾  (park)    │  🌿          │
│         │       Blobbi     │              │
│         │       Lv.3       │              │
│         ╰──────────────────╯              │
│  XP ▓▓▓▓▓░░░░░  22/50                    │
│                                           │
│  Hunger   ████████░░  82                  │
│  Happiness████████░░  76                  │
│  Cleanliness ███░░░░░  34                 │
│  Energy  █████████░  90                   │
│                                           │
│  [🍎 Feed] [🎾 Play] [🫧 Clean] [💤 Sleep]│
│                                           │
│  ⭐Daily  🎮Games  📸Photos  🤝Co-op  … │
└──────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- A Nostr key pair — use a browser extension like [Alby](https://getalby.com) or [nos2x](https://github.com/fiatjaf/nos2x), or log in with an `nsec`

### Run locally

```bash
git clone https://github.com/NostrDanish/Playground.git
cd Playground
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
# output is in ./dist/
```

---

## How to Play

### 1. Log in

Click **Join** in the top-right corner. You can log in with:

- A Nostr browser extension (NIP-07) — recommended
- A remote signer via `bunker://` URI (NIP-46)
- Paste an `nsec` directly (least safe — avoid on shared devices)

### 2. Care for your Blobbi

Use the four action buttons each day:

| Button | Effect | Daily task progress |
|--------|--------|---------------------|
| 🍎 Feed | +8 hunger | Counts toward "Feed 3x" task |
| 🎾 Play | +6 happiness | Counts toward "Play 2x" task |
| 🫧 Clean | +10 cleanliness | Counts toward "Clean 1x" task |
| 💤 Sleep | +12 energy | — |

Stats decay about 5 points per hour of neglect, so check in every day to keep your streak alive.

### 3. Level up

- Every action earns **+5 XP**
- Winning a mini-game earns **+15 XP**
- Taking a photo date earns **+20 XP**
- **Level** = floor(XP / 50) + 1, shown on the name plate

### 4. Evolution stages

| Stage | Total care needed | New features |
|-------|-------------------|--------------|
| 🥚 Egg | 0 | Just vibing |
| 🐣 Baby | 5 | Cheeks appear |
| 👶 Child | 20 | Arms grow |
| 🧒 Teen | 50 | Grows bigger |
| 🌟 Adult | 100 | Tiny wings sprout |
| 👑 Elder | 200 | Crown unlocked |

### 5. Multiple Blobbis

You can own as many Blobbis as you like:

1. Tap **`+`** in the switcher bar below the header
2. Give your new Blobbi a name and pick a colour
3. Tap any Blobbi pill to switch to it instantly
4. **Double-tap** a pill to rename, recolour, or remove it

Each Blobbi stores its stats independently on Nostr under its own `d`-tag.

### 6. Co-op activities

1. Go to the **🤝 Co-op** tab
2. Tap **+ New Activity**
3. Pick one of 10 activities (Walk, Picnic, Beach Day, Dinner Out, etc.)
4. Paste your friend's `npub`
5. Both players see the task — tap **Complete Activity** to finish it

### 7. Photo dates

1. Go to the **📸 Photos** tab
2. Tap **+ New Photo**
3. Pick a scene and enter a friend's `npub`
4. See your two Blobbis together in the scene
5. Optionally **upload a real photo** (your actual pets, a meal, a walk — anything!)
6. The photo is uploaded to Blossom and saved to your gallery

### 8. Mini-games

Go to the **🎮 Games** tab and choose:

| Game | Goal | Win condition |
|------|------|---------------|
| 🃏 Memory Match | Flip cards to find matching pairs | Match all 6 pairs |
| 🎨 Color Rush | Tap the named colour before the timer | Score 8 in 15 seconds |
| 🍽️ Feed Frenzy | Memorise and repeat a food sequence | Survive 5 rounds |

### 9. Daily tasks

Four tasks rotate each day (based on date). Complete them for bonus XP. Examples:

- 🍎 **Hungry Buddy** — Feed 3 times (+15 XP)
- 👋 **Social Butterfly** — Visit a friend's Blobbi (+20 XP)
- 🤝 **Team Player** — Complete a co-op task (+25 XP)
- 📸 **Say Cheese!** — Take a photo date (+20 XP)
- 🔥 **On Fire!** — Maintain a 3-day streak (+30 XP)

### 10. Visiting a friend

1. Go to the **👫 Pals** tab
2. Tap **Visit** next to a friend
3. See their Blobbi's stats and optionally Feed or Play with it
4. The visit is recorded in both your and their companion state

---

## Nostr Architecture

Blobbi Buddies never touches the original Ditto Blobbi event. All game data lives in separate kinds:

| Kind | Type | Purpose |
|------|------|---------|
| `30311` | Addressable (read-only) | Ditto Blobbi pet data |
| `32609` | Addressable | Blobbi Buddies companion state (per Blobbi) |
| `7813` | Regular | Action events: feed, play, clean, sleep, visit, photo |
| `3173` | Regular | Co-op task events |
| `1` + `#t:blobbichat` | Regular | In-game public chat |

See [NIP.md](./NIP.md) for the full event schemas.

### Multi-Blobbi d-tags

Each Blobbi gets a unique `d`-tag for its companion state:

```
blobbi-buddies-blobbi-1         ← your first Blobbi
blobbi-buddies-blobbi-2-<ts>    ← second Blobbi (includes timestamp)
```

The roster (names, colours, active selection) is stored in `localStorage` for instant switching.

### Relays

The app defaults to:

- `wss://relay.ditto.pub/` (read + write)
- `wss://relay.dreamith.to/` (read + write)
- `wss://relay.primal.net/` (write only)
- `wss://relay.damus.io/` (write only)

Users can configure their own relay list via NIP-65.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) |
| Nostr | [Nostrify](https://nostrify.dev) + [nostr-tools](https://github.com/nbd-wtf/nostr-tools) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) |
| Routing | [React Router v7](https://reactrouter.com) |
| Media uploads | [Blossom](https://github.com/hzrd149/blossom) via `@nostrify/nostrify` |
| Build | [Vite 8](https://vitejs.dev) |

---

## Project Structure

```
src/
├── components/
│   ├── auth/            # Login, account switcher
│   ├── game/            # All game UI components
│   │   ├── ActionButtons.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── BlobbiCreature.tsx   # SVG pixel-art Blobbi
│   │   ├── BlobbiSwitcher.tsx   # Multi-Blobbi roster UI
│   │   ├── ChatPanel.tsx
│   │   ├── CoopTaskPanel.tsx
│   │   ├── DailyTasks.tsx
│   │   ├── FriendsList.tsx
│   │   ├── GameHeader.tsx
│   │   ├── MiniGames.tsx        # Memory, Color Rush, Feed Frenzy
│   │   ├── PhotoDate.tsx
│   │   ├── SceneBackground.tsx  # Themed scene environments
│   │   ├── StatBar.tsx
│   │   └── VisitFriend.tsx
│   └── ui/              # shadcn/ui primitives
├── hooks/
│   ├── useBlobbiActions.ts   # Publish care actions + update state
│   ├── useBlobbiActivity.ts  # Fetch activity feed events
│   ├── useBlobbiRoster.ts    # Multi-Blobbi roster (localStorage)
│   ├── useBlobbiState.ts     # Fetch companion state from Nostr
│   ├── useCoopTasks.ts       # Co-op task creation + completion
│   └── useFriendsList.ts     # Derive friends from companion state
├── lib/
│   └── gameTypes.ts          # All types, constants, and compute fns
└── pages/
    └── Index.tsx             # Main game page
```

---

## Contributing

We welcome contributions of all kinds. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

---

## License

[MIT](./LICENSE) — free to use, fork, and build upon.

---

<sub>Vibed with ❤️ on <a href="https://shakespeare.diy">Shakespeare</a></sub>
