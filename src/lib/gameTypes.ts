/** Custom Nostr kind for Blobbi Buddies companion state (addressable) */
export const KIND_BLOBBI_STATE = 32609;

/** Custom Nostr kind for Blobbi action events (regular) */
export const KIND_BLOBBI_ACTION = 7813;

/** Custom Nostr kind for co-op task events (regular) */
export const KIND_BLOBBI_COOP = 3173;

/** Ditto Blobbi kind (read-only) */
export const KIND_DITTO_BLOBBI = 30311;

/** d-tag for companion state */
export const DTAG_BUDDIES = 'blobbi-buddies';

/** d-tag for Ditto Blobbi */
export const DTAG_BLOBBI = 'blobbi';

/** Action types for solo interactions */
export type ActionType = 'feed' | 'play' | 'clean' | 'sleep' | 'visit';

/** Action tag values for Nostr events */
export const ACTION_TAGS: Record<ActionType, string> = {
  feed: 'blobbi-feed',
  play: 'blobbi-play',
  clean: 'blobbi-clean',
  sleep: 'blobbi-sleep',
  visit: 'blobbi-visit',
};

/** Emoji for each action */
export const ACTION_EMOJI: Record<ActionType, string> = {
  feed: '🍎',
  play: '🎾',
  clean: '🫧',
  sleep: '💤',
  visit: '👋',
};

/** Human-readable labels */
export const ACTION_LABELS: Record<ActionType, string> = {
  feed: 'Feed',
  play: 'Play',
  clean: 'Clean',
  sleep: 'Sleep',
  visit: 'Visit',
};

/** Co-op task types */
export type CoopTaskType = 'walk' | 'build-nest' | 'explore' | 'treasure-hunt';

export const COOP_TASKS: Record<CoopTaskType, { label: string; emoji: string; description: string; duration: number }> = {
  'walk': {
    label: 'Walk Together',
    emoji: '🚶',
    description: 'Take a stroll with your Blobbis!',
    duration: 30, // seconds
  },
  'build-nest': {
    label: 'Build a Nest',
    emoji: '🏠',
    description: 'Construct a cozy nest together.',
    duration: 45,
  },
  'explore': {
    label: 'Explore',
    emoji: '🗺️',
    description: 'Venture into the unknown!',
    duration: 60,
  },
  'treasure-hunt': {
    label: 'Treasure Hunt',
    emoji: '💎',
    description: 'Search for hidden treasures.',
    duration: 40,
  },
};

export type CoopTaskStatus = 'pending' | 'active' | 'completed' | 'expired';

/** Companion state stored in kind 32609 */
export interface BlobbiCompanionState {
  stats: {
    feedCount: number;
    playCount: number;
    cleanCount: number;
    sleepCount: number;
    totalCare: number;
  };
  friendCare: Record<string, {
    feedCount: number;
    playCount: number;
    visits: number;
    lastVisit: number;
  }>;
  coopTasksCompleted: number;
  lastInteraction: number;
}

/** Co-op task event content */
export interface CoopTaskContent {
  taskType: CoopTaskType;
  status: CoopTaskStatus;
  participants: string[];
  progress: number;
  startedAt: number;
  completedAt: number | null;
}

/** Blobbi mood levels */
export type BlobbiMood = 'ecstatic' | 'happy' | 'content' | 'bored' | 'sad' | 'hungry';

/** Evolution stages */
export type EvolutionStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult' | 'elder';

/** Computed Blobbi state from companion data */
export interface ComputedBlobbiState {
  hunger: number; // 0-100
  happiness: number; // 0-100
  cleanliness: number; // 0-100
  energy: number; // 0-100
  mood: BlobbiMood;
  stage: EvolutionStage;
  name: string;
  totalCare: number;
}

/** Default empty companion state */
export function createDefaultCompanionState(): BlobbiCompanionState {
  return {
    stats: {
      feedCount: 0,
      playCount: 0,
      cleanCount: 0,
      sleepCount: 0,
      totalCare: 0,
    },
    friendCare: {},
    coopTasksCompleted: 0,
    lastInteraction: Math.floor(Date.now() / 1000),
  };
}

/** Compute mood from stats */
export function computeMood(hunger: number, happiness: number, energy: number): BlobbiMood {
  const avg = (hunger + happiness + energy) / 3;
  if (avg >= 85) return 'ecstatic';
  if (avg >= 70) return 'happy';
  if (avg >= 50) return 'content';
  if (avg >= 30) return 'bored';
  if (hunger < 20) return 'hungry';
  return 'sad';
}

/** Compute evolution stage from total care count */
export function computeStage(totalCare: number): EvolutionStage {
  if (totalCare >= 200) return 'elder';
  if (totalCare >= 100) return 'adult';
  if (totalCare >= 50) return 'teen';
  if (totalCare >= 20) return 'child';
  if (totalCare >= 5) return 'baby';
  return 'egg';
}

/** Compute full Blobbi state from companion data + time decay */
export function computeBlobbiState(companion: BlobbiCompanionState): ComputedBlobbiState {
  const now = Math.floor(Date.now() / 1000);
  const hoursSinceLastInteraction = Math.max(0, (now - companion.lastInteraction) / 3600);

  // Stats decay over time (lose ~5 points per hour of neglect)
  const decay = Math.min(100, hoursSinceLastInteraction * 5);

  const baseHunger = Math.min(100, companion.stats.feedCount * 8);
  const baseHappiness = Math.min(100, companion.stats.playCount * 6 + companion.stats.feedCount * 2);
  const baseCleanliness = Math.min(100, companion.stats.cleanCount * 10);
  const baseEnergy = Math.min(100, companion.stats.sleepCount * 12);

  const hunger = Math.max(0, baseHunger - decay);
  const happiness = Math.max(0, baseHappiness - decay);
  const cleanliness = Math.max(0, baseCleanliness - decay * 0.5);
  const energy = Math.max(0, baseEnergy - decay * 0.7);

  const mood = computeMood(hunger, happiness, energy);
  const stage = computeStage(companion.stats.totalCare);

  return {
    hunger,
    happiness,
    cleanliness,
    energy,
    mood,
    stage,
    name: 'Blobbi',
    totalCare: companion.stats.totalCare,
  };
}
