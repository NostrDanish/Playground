# Contributing to Blobbi Buddies

First off — thank you for taking the time to contribute! 🐾

This document covers how to set up the project locally, our conventions, and the PR process.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Adding a Feature](#adding-a-feature)
- [Nostr Event Guidelines](#nostr-event-guidelines)
- [Style Guide](#style-guide)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)

---

## Code of Conduct

Be kind. We're all here to build something fun. Harassment or hostility of any kind will not be tolerated.

---

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/NostrDanish/Playground.git
cd Playground
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). You'll need a Nostr browser extension (like [Alby](https://getalby.com) or [nos2x](https://github.com/fiatjaf/nos2x)) or an `nsec` to log in.

### 4. Run the test suite

```bash
npm test
```

This runs TypeScript type checking, ESLint, Vitest unit tests, and a production build. **All of these must pass before opening a PR.**

---

## Development Workflow

```
main
 └── your-feature-branch   ← branch off main, PR back to main
```

1. Branch off `main`: `git checkout -b feat/my-feature`
2. Make your changes
3. Run `npm test` — fix any failures
4. Commit with a clear message (see [Commit Style](#commit-style))
5. Push and open a PR against `main`

---

## Project Structure

```
src/
├── components/
│   ├── auth/       # Login / account UI (do not modify without good reason)
│   ├── game/       # Game-specific components — add new ones here
│   └── ui/         # shadcn/ui primitives — do not edit directly
├── hooks/          # Custom React hooks
├── lib/
│   └── gameTypes.ts   # All Nostr kinds, types, constants, and compute functions
└── pages/
    └── Index.tsx   # Main game page
```

Key files:

| File | Purpose |
|------|---------|
| `src/lib/gameTypes.ts` | Single source of truth for kinds, types, constants, and stat math |
| `src/hooks/useBlobbiState.ts` | Fetch companion state from Nostr |
| `src/hooks/useBlobbiActions.ts` | Publish care actions + update state |
| `src/hooks/useBlobbiRoster.ts` | Multi-Blobbi roster in localStorage |
| `NIP.md` | Documents every custom Nostr event kind used by the game |

---

## Adding a Feature

### New game component

1. Create `src/components/game/MyFeature.tsx`
2. Import and wire it into `src/pages/Index.tsx`
3. If it needs Nostr state, add a hook in `src/hooks/`

### New Nostr event kind

1. Generate a kind number — use the Shakespeare `nostr_generate_kind` tool or check [nostr.com/spec](https://nostr.com/spec) to avoid collisions
2. Define the kind constant in `src/lib/gameTypes.ts`
3. Document the schema in `NIP.md`
4. Use `useNostrPublish` from `@/hooks/useNostrPublish` to publish
5. Always include an `alt` tag (NIP-31) so non-game clients display something readable

### New co-op activity

1. Add an entry to `COOP_TASKS` in `src/lib/gameTypes.ts`:
   ```ts
   'my-activity': {
     label: 'My Activity',
     emoji: '🎉',
     description: 'A fun new thing to do together!',
     duration: 45,
     scene: 'park', // pick from SceneType
   },
   ```
2. That's it — the `CoopTaskPanel` renders dynamically from that map.

### New daily task

1. Add an entry to `DAILY_TASKS` in `src/lib/gameTypes.ts`
2. Add the target count to `DAILY_TASK_TARGETS` in `src/components/game/DailyTasks.tsx`
3. If your task is triggered by a new action type, increment `dailyProgress[taskId]` in `useBlobbiActions.ts`

### New mini-game

1. Add metadata to `MINI_GAMES` in `src/lib/gameTypes.ts`
2. Add a new `if (activeGame === 'my-game')` branch in `src/components/game/MiniGames.tsx`
3. Build a self-contained game component (no hooks that read/write Nostr — the win callback handles XP)
4. Call `onWin?.()` when the player wins

---

## Nostr Event Guidelines

These rules keep Blobbi Buddies safe to run alongside other Nostr clients:

1. **Never write to kind 30311.** That's the Ditto Blobbi — read only.
2. **All custom kinds must have an `alt` tag** (NIP-31). Example: `['alt', 'Blobbi Buddies: feed action']`
3. **Use `t` tags for discoverability.** Prefix all tags with `blobbi-` (e.g. `blobbi-feed`, `blobbi-coop`) so queries can filter at the relay level.
4. **Always filter by `authors` when querying addressable events.** The `d` tag alone is not a trust boundary.
5. **Sanitize any event content before rendering.** Never use `dangerouslySetInnerHTML` with untrusted strings.

For full schema documentation, see [NIP.md](./NIP.md).

---

## Style Guide

### TypeScript

- **No `any` types.** Ever.
- Prefer `interface` for object shapes, `type` for unions and aliases.
- All exported functions and hooks must have JSDoc comments.

### React

- Use **function components** only — no class components.
- Follow React 19 patterns: props via `React.ComponentProps<...>`, ref as a normal prop.
- Keep components small and single-purpose. Split at ~150 lines if growing.
- **No hooks with early returns** — always call hooks unconditionally. Return early *after* all hook calls.

### Tailwind

- Use `cn()` from `@/lib/utils` to merge conditional classes.
- Follow the 8px grid (`p-2`, `p-4`, `gap-4`, etc.).
- Respect dark mode — always include `dark:` variants when adding light-mode colours.
- Use design tokens (`text-primary`, `bg-card`, `text-muted-foreground`) not raw hex values.

### Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add stargazing co-op activity
fix: memory game card state not resetting on replay
chore: update dependencies
docs: add contributing guide
```

---

## Submitting a Pull Request

1. Ensure `npm test` passes locally
2. Open your PR against `main`
3. Fill in the PR template:
   - **What does this PR do?**
   - **How was it tested?**
   - **Does it add/change any Nostr events?** (if yes, update `NIP.md`)
4. Request a review — small PRs get reviewed faster

---

## Reporting Bugs

Open a GitHub Issue with:

- Steps to reproduce
- Expected behaviour
- Actual behaviour
- Browser + OS
- Your Nostr client / login method (extension, nsec, bunker)
- Any console errors

---

Thank you for contributing! 🐾
