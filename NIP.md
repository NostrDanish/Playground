# Blobbi Buddies — Custom Nostr Event Kinds

This document describes the custom event kinds used by the Blobbi Buddies game.

## Overview

Blobbi Buddies is a Tamagotchi-style cooperative pet game built on Nostr. It reads the existing Ditto Blobbi state (kind `30311`) as a source of truth for pet data and publishes companion events to separate kinds so it never overwrites or conflicts with the original Blobbi data.

---

## Kind 30311 — Ditto Blobbi (READ-ONLY)

- **NIP**: Ditto-specific (addressable/parameterized replaceable)
- **`d` tag**: `"blobbi"`
- **Content**: JSON with pet state: `{ hunger, mood, evolution, name, ... }`
- **Authors**: Each Blobbi owner

This kind is **read-only** in Blobbi Buddies. We never publish events of this kind.

---

## Kind 32609 — Blobbi Buddies Companion State

- **Range**: Addressable (30000–39999)
- **`d` tag**: `"blobbi-buddies"`
- **Content**: JSON object

```json
{
  "stats": {
    "feedCount": 0,
    "playCount": 0,
    "cleanCount": 0,
    "sleepCount": 0,
    "totalCare": 0
  },
  "friendCare": {
    "<hex-pubkey>": {
      "feedCount": 0,
      "playCount": 0,
      "visits": 0,
      "lastVisit": 1700000000
    }
  },
  "coopTasksCompleted": 0,
  "lastInteraction": 1700000000,
  "streak": 3,
  "lastStreakDay": "2026-07-05",
  "xp": 150,
  "photos": ["https://blossom.example.com/abc.jpg"],
  "dailyProgress": {
    "feed-3": 2,
    "play-2": 1
  },
  "dailyDate": "2026-07-05",
  "puzzleWins": 5
}
```

### Tags

| Tag | Description |
|-----|-------------|
| `d` | `"blobbi-buddies"` — identifies this as the companion state |
| `alt` | Human-readable description (NIP-31) |

---

## Kind 7813 — Blobbi Action Event

- **Range**: Regular (1000–9999)
- **Content**: Human-readable description of the action, e.g. `"🍎 Fed my Blobbi a tasty snack!"`

### Tags

| Tag | Description |
|-----|-------------|
| `t` | Action type: `"blobbi-feed"`, `"blobbi-play"`, `"blobbi-clean"`, `"blobbi-sleep"`, `"blobbi-visit"`, `"blobbi-photo"` |
| `p` | Pubkey of the Blobbi owner (if visiting/interacting with someone else's pet) |
| `imeta` | NIP-94 file metadata for photos (when `t` = `"blobbi-photo"`) |
| `alt` | Human-readable description (NIP-31) |

These events form a transparent activity feed for all care actions.

---

## Kind 3173 — Co-op Task Event

- **Range**: Regular (1000–9999)
- **Content**: JSON object describing the co-op task

```json
{
  "taskType": "walk" | "build-nest" | "explore" | "treasure-hunt" | "picnic" | "restaurant" | "beach" | "stargazing" | "garden" | "movie-night",
  "status": "pending" | "active" | "completed" | "expired",
  "participants": ["<hex-pubkey-1>", "<hex-pubkey-2>"],
  "progress": 0,
  "startedAt": 1700000000,
  "completedAt": null
}
```

### Tags

| Tag | Description |
|-----|-------------|
| `t` | `"blobbi-coop"` — makes co-op tasks discoverable |
| `p` | Pubkey of each participant (one tag per participant) |
| `e` | Reference to original task event (for completion events) |
| `alt` | Human-readable description (NIP-31) |

---

## Chat

In-game public chat uses standard kind `1` notes tagged with `#blobbichat`. For private DMs, users should use a dedicated chat client like Lief which supports NIP-17 gift-wrapped messages.

---

## Game Features

### Daily Tasks
Rotating daily challenges tracked in companion state `dailyProgress`. Tasks reset each day based on `dailyDate`. XP is awarded for completion.

### Mini Games
Three puzzle games (Memory Match, Color Rush, Feed Frenzy) that award XP and progress the `puzzle-win` daily task.

### Photo Dates
Users upload real photos via Blossom, which are stored in companion state `photos` array and published as action events with `imeta` tags and `t` = `"blobbi-photo"`.

### Streaks
Daily care streaks tracked via `streak` and `lastStreakDay`. Streaks increment when the user performs any care action on consecutive days.

---

## Discoverability

All game-related events use `t` tags prefixed with `blobbi-` for relay-level filtering:
- `#t: ["blobbi-feed"]` — feed actions
- `#t: ["blobbi-play"]` — play actions
- `#t: ["blobbi-coop"]` — co-op tasks
- `#t: ["blobbi-visit"]` — visit actions
- `#t: ["blobbi-photo"]` — photo date posts
- `#t: ["blobbichat"]` — in-game chat messages
