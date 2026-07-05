# Blobbi Buddies — Custom Nostr Event Kinds

This document describes the custom event kinds used by the Blobbi Buddies game.

## Overview

Blobbi Buddies is a Tamagotchi-style cooperative pet game built on Nostr. It reads the existing Ditto Blobbi state (kind `30311`) as a source of truth for pet data and publishes companion events to separate kinds so it never overwrites or conflicts with the original Blobbi data.

---

## Kind 30311 — Ditto Blobbi (READ-ONLY)

- **NIP**: Ditto-specific (addressable/parameterized replaceable)
- **`d` tag**: `"blobbi"`
- **Content**: JSON with pet state: `{ hunger, mood, evolution, name, ... }`
- **Authors**: Each Blobbi owner's pubkey

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
  "lastInteraction": 1700000000
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
- **Content**: Human-readable description of the action, e.g. `"🍎 Fed Blobbi an apple!"`

### Tags

| Tag | Description |
|-----|-------------|
| `t` | Action type: `"blobbi-feed"`, `"blobbi-play"`, `"blobbi-clean"`, `"blobbi-sleep"`, `"blobbi-visit"` |
| `p` | Pubkey of the Blobbi owner (if visiting someone else's pet) |
| `alt` | Human-readable description (NIP-31) |

These events form a transparent activity feed for all care actions.

---

## Kind 3173 — Co-op Task Event

- **Range**: Regular (1000–9999)
- **Content**: JSON object describing the co-op task

```json
{
  "taskType": "walk" | "build-nest" | "explore" | "treasure-hunt",
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
| `alt` | Human-readable description (NIP-31) |

---

## Chat

In-game chat uses standard **NIP-17 Direct Messages** (kind 14, wrapped in NIP-59 Gift Wrap). This ensures full interoperability with Lief and other Nostr chat clients.

---

## Discoverability

All game-related events use `t` tags prefixed with `blobbi-` for relay-level filtering:
- `#t: ["blobbi-feed"]` — feed actions
- `#t: ["blobbi-play"]` — play actions
- `#t: ["blobbi-coop"]` — co-op tasks
- `#t: ["blobbi-visit"]` — visit actions
