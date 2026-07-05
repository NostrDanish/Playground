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

// ─── Actions ────────────────────────────────────────────────────
export type ActionType = 'feed' | 'play' | 'clean' | 'sleep' | 'visit';

export const ACTION_TAGS: Record<ActionType, string> = {
  feed: 'blobbi-feed',
  play: 'blobbi-play',
  clean: 'blobbi-clean',
  sleep: 'blobbi-sleep',
  visit: 'blobbi-visit',
};

export const ACTION_EMOJI: Record<ActionType, string> = {
  feed: '🍎',
  play: '🎾',
  clean: '🫧',
  sleep: '💤',
  visit: '👋',
};

export const ACTION_LABELS: Record<ActionType, string> = {
  feed: 'Feed',
  play: 'Play',
  clean: 'Clean',
  sleep: 'Sleep',
  visit: 'Visit',
};

// ─── Co-op tasks ────────────────────────────────────────────────
export type CoopTaskType =
  | 'walk' | 'build-nest' | 'explore' | 'treasure-hunt'
  | 'picnic' | 'restaurant' | 'beach' | 'stargazing'
  | 'garden' | 'movie-night';

export interface CoopTaskInfo {
  label: string;
  emoji: string;
  description: string;
  duration: number;
  scene: SceneType;
}

export const COOP_TASKS: Record<CoopTaskType, CoopTaskInfo> = {
  'walk': {
    label: 'Walk Together',
    emoji: '🚶',
    description: 'Take a stroll with your Blobbis!',
    duration: 30,
    scene: 'park',
  },
  'build-nest': {
    label: 'Build a Nest',
    emoji: '🏠',
    description: 'Construct a cozy nest together.',
    duration: 45,
    scene: 'home',
  },
  'explore': {
    label: 'Explore',
    emoji: '🗺️',
    description: 'Venture into the unknown!',
    duration: 60,
    scene: 'forest',
  },
  'treasure-hunt': {
    label: 'Treasure Hunt',
    emoji: '💎',
    description: 'Search for hidden treasures.',
    duration: 40,
    scene: 'forest',
  },
  'picnic': {
    label: 'Picnic Date',
    emoji: '🧺',
    description: 'Share a meal outdoors!',
    duration: 35,
    scene: 'park',
  },
  'restaurant': {
    label: 'Dinner Out',
    emoji: '🍽️',
    description: 'Fine dining with friends!',
    duration: 50,
    scene: 'restaurant',
  },
  'beach': {
    label: 'Beach Day',
    emoji: '🏖️',
    description: 'Fun in the sun and sand!',
    duration: 55,
    scene: 'beach',
  },
  'stargazing': {
    label: 'Stargazing',
    emoji: '🌟',
    description: 'Watch the stars together.',
    duration: 40,
    scene: 'night',
  },
  'garden': {
    label: 'Gardening',
    emoji: '🌻',
    description: 'Grow flowers together!',
    duration: 30,
    scene: 'park',
  },
  'movie-night': {
    label: 'Movie Night',
    emoji: '🎬',
    description: 'Cozy movie marathon!',
    duration: 45,
    scene: 'home',
  },
};

export type CoopTaskStatus = 'pending' | 'active' | 'completed' | 'expired';

// ─── Scenes ─────────────────────────────────────────────────────
export type SceneType = 'park' | 'beach' | 'restaurant' | 'home' | 'forest' | 'night';

export interface SceneConfig {
  label: string;
  bgGradientLight: string;
  bgGradientDark: string;
  groundLight: string;
  groundDark: string;
  deco: Array<{ emoji: string; pos: string; size: string }>;
}

export const SCENES: Record<SceneType, SceneConfig> = {
  park: {
    label: 'Park',
    bgGradientLight: 'from-sky-100 via-sky-50 to-green-100',
    bgGradientDark: 'from-indigo-950 via-slate-900 to-emerald-950',
    groundLight: 'from-green-200/60',
    groundDark: 'from-emerald-900/40',
    deco: [
      { emoji: '☁️', pos: 'top-3 left-4', size: 'text-lg' },
      { emoji: '☁️', pos: 'top-6 right-8', size: 'text-sm' },
      { emoji: '🌿', pos: 'bottom-1 left-6', size: 'text-xs' },
      { emoji: '🌱', pos: 'bottom-2 right-10', size: 'text-xs' },
      { emoji: '🌼', pos: 'bottom-1 left-1/2', size: 'text-[10px]' },
      { emoji: '🦋', pos: 'top-10 right-4', size: 'text-xs' },
    ],
  },
  beach: {
    label: 'Beach',
    bgGradientLight: 'from-sky-200 via-cyan-50 to-amber-100',
    bgGradientDark: 'from-slate-900 via-cyan-950 to-amber-950',
    groundLight: 'from-amber-200/70',
    groundDark: 'from-amber-900/40',
    deco: [
      { emoji: '☀️', pos: 'top-2 right-4', size: 'text-xl' },
      { emoji: '🐚', pos: 'bottom-1 left-8', size: 'text-xs' },
      { emoji: '🌊', pos: 'bottom-6 left-2', size: 'text-sm' },
      { emoji: '🌊', pos: 'bottom-7 right-4', size: 'text-sm' },
      { emoji: '🏄', pos: 'bottom-8 right-12', size: 'text-[10px]' },
      { emoji: '⛱️', pos: 'bottom-2 right-6', size: 'text-sm' },
    ],
  },
  restaurant: {
    label: 'Restaurant',
    bgGradientLight: 'from-amber-50 via-orange-50 to-red-50',
    bgGradientDark: 'from-amber-950 via-orange-950 to-red-950',
    groundLight: 'from-amber-100/60',
    groundDark: 'from-amber-900/30',
    deco: [
      { emoji: '🕯️', pos: 'top-3 left-6', size: 'text-sm' },
      { emoji: '🕯️', pos: 'top-3 right-6', size: 'text-sm' },
      { emoji: '🍷', pos: 'bottom-2 left-4', size: 'text-xs' },
      { emoji: '🍝', pos: 'bottom-1 right-8', size: 'text-xs' },
      { emoji: '🎵', pos: 'top-6 right-3', size: 'text-[10px]' },
      { emoji: '✨', pos: 'top-8 left-4', size: 'text-[10px]' },
    ],
  },
  home: {
    label: 'Home',
    bgGradientLight: 'from-orange-50 via-amber-50 to-yellow-50',
    bgGradientDark: 'from-slate-900 via-amber-950 to-orange-950',
    groundLight: 'from-amber-100/50',
    groundDark: 'from-orange-900/30',
    deco: [
      { emoji: '🪴', pos: 'bottom-1 left-4', size: 'text-sm' },
      { emoji: '🛋️', pos: 'bottom-2 right-4', size: 'text-sm' },
      { emoji: '📚', pos: 'top-3 left-6', size: 'text-xs' },
      { emoji: '🖼️', pos: 'top-4 right-8', size: 'text-xs' },
      { emoji: '💡', pos: 'top-2 left-1/2', size: 'text-xs' },
    ],
  },
  forest: {
    label: 'Forest',
    bgGradientLight: 'from-emerald-100 via-green-50 to-lime-50',
    bgGradientDark: 'from-emerald-950 via-green-950 to-slate-900',
    groundLight: 'from-green-300/60',
    groundDark: 'from-green-900/50',
    deco: [
      { emoji: '🌲', pos: 'top-2 left-2', size: 'text-lg' },
      { emoji: '🌲', pos: 'top-4 right-4', size: 'text-xl' },
      { emoji: '🍄', pos: 'bottom-1 left-8', size: 'text-xs' },
      { emoji: '🐿️', pos: 'bottom-2 right-6', size: 'text-xs' },
      { emoji: '🌳', pos: 'top-3 right-12', size: 'text-lg' },
      { emoji: '🍃', pos: 'top-8 left-6', size: 'text-[10px]' },
    ],
  },
  night: {
    label: 'Night Sky',
    bgGradientLight: 'from-indigo-200 via-purple-100 to-slate-200',
    bgGradientDark: 'from-slate-950 via-indigo-950 to-purple-950',
    groundLight: 'from-slate-200/60',
    groundDark: 'from-slate-800/50',
    deco: [
      { emoji: '🌙', pos: 'top-2 right-4', size: 'text-xl' },
      { emoji: '⭐', pos: 'top-3 left-6', size: 'text-[10px]' },
      { emoji: '⭐', pos: 'top-5 left-12', size: 'text-xs' },
      { emoji: '⭐', pos: 'top-4 right-12', size: 'text-[10px]' },
      { emoji: '✨', pos: 'top-6 left-3', size: 'text-[10px]' },
      { emoji: '🦉', pos: 'bottom-2 right-4', size: 'text-xs' },
    ],
  },
};

// ─── Daily tasks ────────────────────────────────────────────────
export type DailyTaskId =
  | 'feed-3' | 'play-2' | 'clean-1' | 'visit-friend'
  | 'chat-5' | 'coop-task' | 'photo-date'
  | 'puzzle-win' | 'streak-3';

export interface DailyTask {
  id: DailyTaskId;
  label: string;
  emoji: string;
  description: string;
  xpReward: number;
}

export const DAILY_TASKS: DailyTask[] = [
  { id: 'feed-3', label: 'Hungry Buddy', emoji: '🍎', description: 'Feed your Blobbi 3 times', xpReward: 15 },
  { id: 'play-2', label: 'Playtime!', emoji: '🎾', description: 'Play with your Blobbi 2 times', xpReward: 10 },
  { id: 'clean-1', label: 'Squeaky Clean', emoji: '🫧', description: 'Give your Blobbi a bath', xpReward: 5 },
  { id: 'visit-friend', label: 'Social Butterfly', emoji: '👋', description: 'Visit a friend\'s Blobbi', xpReward: 20 },
  { id: 'chat-5', label: 'Chatty', emoji: '💬', description: 'Send 5 messages in game chat', xpReward: 10 },
  { id: 'coop-task', label: 'Team Player', emoji: '🤝', description: 'Complete a co-op task', xpReward: 25 },
  { id: 'photo-date', label: 'Say Cheese!', emoji: '📸', description: 'Take a photo with a friend\'s Blobbi', xpReward: 20 },
  { id: 'puzzle-win', label: 'Brain Power', emoji: '🧩', description: 'Win a mini puzzle game', xpReward: 15 },
  { id: 'streak-3', label: 'On Fire!', emoji: '🔥', description: 'Maintain a 3-day care streak', xpReward: 30 },
];

/** Get today's daily tasks (rotate based on day of year) */
export function getTodaysDailyTasks(): DailyTask[] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const shuffled = [...DAILY_TASKS].sort((a, b) => {
    const ha = hashString(a.id + dayOfYear);
    const hb = hashString(b.id + dayOfYear);
    return ha - hb;
  });
  return shuffled.slice(0, 4);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ─── Mini puzzle games ──────────────────────────────────────────
export type MiniGameType = 'memory' | 'color-match' | 'feed-sequence';

export interface MiniGameInfo {
  type: MiniGameType;
  label: string;
  emoji: string;
  description: string;
}

export const MINI_GAMES: MiniGameInfo[] = [
  { type: 'memory', label: 'Memory Match', emoji: '🃏', description: 'Match pairs of Blobbi cards!' },
  { type: 'color-match', label: 'Color Rush', emoji: '🎨', description: 'Tap the correct color before time runs out!' },
  { type: 'feed-sequence', label: 'Feed Frenzy', emoji: '🍽️', description: 'Remember and repeat the feeding order!' },
];

// ─── Photo dates ────────────────────────────────────────────────
export interface PhotoDateScene {
  id: string;
  label: string;
  emoji: string;
  scene: SceneType;
}

export const PHOTO_DATE_SCENES: PhotoDateScene[] = [
  { id: 'park-date', label: 'Park Date', emoji: '🌳', scene: 'park' },
  { id: 'beach-selfie', label: 'Beach Selfie', emoji: '🏖️', scene: 'beach' },
  { id: 'dinner-date', label: 'Dinner Date', emoji: '🍽️', scene: 'restaurant' },
  { id: 'cozy-night', label: 'Cozy Night In', emoji: '🛋️', scene: 'home' },
  { id: 'forest-hike', label: 'Forest Hike', emoji: '🌲', scene: 'forest' },
  { id: 'stargazing', label: 'Stargazing', emoji: '🌙', scene: 'night' },
];

// ─── State types ────────────────────────────────────────────────
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
  streak: number;
  lastStreakDay: string;
  xp: number;
  photos: string[]; // URLs of uploaded photos
  dailyProgress: Record<string, number>; // taskId -> count for today
  dailyDate: string; // YYYY-MM-DD to know when to reset
  puzzleWins: number;
}

export interface CoopTaskContent {
  taskType: CoopTaskType;
  status: CoopTaskStatus;
  participants: string[];
  progress: number;
  startedAt: number;
  completedAt: number | null;
}

export type BlobbiMood = 'ecstatic' | 'happy' | 'content' | 'bored' | 'sad' | 'hungry';
export type EvolutionStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult' | 'elder';

export interface ComputedBlobbiState {
  hunger: number;
  happiness: number;
  cleanliness: number;
  energy: number;
  mood: BlobbiMood;
  stage: EvolutionStage;
  name: string;
  totalCare: number;
  xp: number;
  streak: number;
  level: number;
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
    streak: 0,
    lastStreakDay: '',
    xp: 0,
    photos: [],
    dailyProgress: {},
    dailyDate: new Date().toISOString().split('T')[0],
    puzzleWins: 0,
  };
}

export function computeMood(hunger: number, happiness: number, energy: number): BlobbiMood {
  const avg = (hunger + happiness + energy) / 3;
  if (avg >= 85) return 'ecstatic';
  if (avg >= 70) return 'happy';
  if (avg >= 50) return 'content';
  if (avg >= 30) return 'bored';
  if (hunger < 20) return 'hungry';
  return 'sad';
}

export function computeStage(totalCare: number): EvolutionStage {
  if (totalCare >= 200) return 'elder';
  if (totalCare >= 100) return 'adult';
  if (totalCare >= 50) return 'teen';
  if (totalCare >= 20) return 'child';
  if (totalCare >= 5) return 'baby';
  return 'egg';
}

export function computeLevel(xp: number): number {
  return Math.floor(xp / 50) + 1;
}

export function computeBlobbiState(companion: BlobbiCompanionState): ComputedBlobbiState {
  const now = Math.floor(Date.now() / 1000);
  const hoursSinceLastInteraction = Math.max(0, (now - companion.lastInteraction) / 3600);

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
  const xp = companion.xp ?? 0;

  return {
    hunger,
    happiness,
    cleanliness,
    energy,
    mood,
    stage,
    name: 'Blobbi',
    totalCare: companion.stats.totalCare,
    xp,
    streak: companion.streak ?? 0,
    level: computeLevel(xp),
  };
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
