import { useLocalStorage } from './useLocalStorage';

/**
 * A single Blobbi in the player's roster.
 * Stored in localStorage for instant switching (not on Nostr — it's a UI preference).
 */
export interface RosterBlobbi {
  /** Unique id like "blobbi-1", "blobbi-2" — used as suffix on the Nostr d-tag */
  id: string;
  /** Player-chosen name */
  name: string;
  /** Hex color for tinting the SVG body */
  color: string;
  /** Timestamp when this Blobbi was created */
  createdAt: number;
}

export interface BlobbiRoster {
  /** All Blobbis owned by this player */
  blobbis: RosterBlobbi[];
  /** ID of the currently active Blobbi */
  activeId: string;
}

const DEFAULT_COLORS = [
  '#FF8FAB', // pink
  '#A8D8EA', // blue
  '#C4B7E6', // lavender
  '#FFD700', // gold
  '#FFB366', // orange
  '#98D8AA', // mint
  '#F9C6D3', // rose
  '#B5DEFF', // sky
];

function createDefaultRoster(): BlobbiRoster {
  return {
    blobbis: [
      {
        id: 'blobbi-1',
        name: 'Blobbi',
        color: '#FF8FAB',
        createdAt: Math.floor(Date.now() / 1000),
      },
    ],
    activeId: 'blobbi-1',
  };
}

/**
 * Manage multiple Blobbis — create, rename, recolor, switch.
 * The roster is stored in localStorage; each Blobbi maps to a separate
 * Nostr d-tag (`blobbi-buddies-{id}`) so every Blobbi has its own stats.
 */
export function useBlobbiRoster() {
  const [roster, setRoster] = useLocalStorage<BlobbiRoster>(
    'blobbi-buddies:roster',
    createDefaultRoster(),
  );

  /** The active Blobbi object */
  const activeBlobbi = roster.blobbis.find(b => b.id === roster.activeId)
    ?? roster.blobbis[0]
    ?? createDefaultRoster().blobbis[0];

  /** The d-tag suffix for the active Blobbi's companion state */
  const activeDtag = `blobbi-buddies-${activeBlobbi.id}`;

  /** Switch to a different Blobbi */
  function switchBlobbi(id: string) {
    if (roster.blobbis.some(b => b.id === id)) {
      setRoster(prev => ({ ...prev, activeId: id }));
    }
  }

  /** Add a new Blobbi */
  function addBlobbi(name: string, color?: string) {
    const nextNum = roster.blobbis.length + 1;
    const id = `blobbi-${nextNum}-${Date.now()}`;
    const newBlobbi: RosterBlobbi = {
      id,
      name: name || `Blobbi ${nextNum}`,
      color: color ?? DEFAULT_COLORS[nextNum % DEFAULT_COLORS.length],
      createdAt: Math.floor(Date.now() / 1000),
    };
    setRoster(prev => ({
      ...prev,
      blobbis: [...prev.blobbis, newBlobbi],
      activeId: id,
    }));
    return newBlobbi;
  }

  /** Rename a Blobbi */
  function renameBlobbi(id: string, name: string) {
    setRoster(prev => ({
      ...prev,
      blobbis: prev.blobbis.map(b => b.id === id ? { ...b, name } : b),
    }));
  }

  /** Change a Blobbi's color */
  function recolorBlobbi(id: string, color: string) {
    setRoster(prev => ({
      ...prev,
      blobbis: prev.blobbis.map(b => b.id === id ? { ...b, color } : b),
    }));
  }

  /** Remove a Blobbi (cannot remove the last one) */
  function removeBlobbi(id: string) {
    if (roster.blobbis.length <= 1) return;
    setRoster(prev => {
      const updated = prev.blobbis.filter(b => b.id !== id);
      return {
        ...prev,
        blobbis: updated,
        activeId: prev.activeId === id ? updated[0].id : prev.activeId,
      };
    });
  }

  return {
    roster,
    activeBlobbi,
    activeDtag,
    switchBlobbi,
    addBlobbi,
    renameBlobbi,
    recolorBlobbi,
    removeBlobbi,
    defaultColors: DEFAULT_COLORS,
  };
}
