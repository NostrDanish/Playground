import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

import { useCurrentUser } from './useCurrentUser';
import {
  KIND_BLOBBI_STATE,
  DTAG_BUDDIES,
  createDefaultCompanionState,
  computeBlobbiState,
  type BlobbiCompanionState,
  type ComputedBlobbiState,
} from '@/lib/gameTypes';

interface UseBlobbiStateResult {
  companion: BlobbiCompanionState;
  computed: ComputedBlobbiState;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useBlobbiState(pubkey?: string): UseBlobbiStateResult {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  const targetPubkey = pubkey ?? user?.pubkey;

  const query = useQuery<BlobbiCompanionState>({
    queryKey: ['blobbi-buddies', 'state', targetPubkey ?? ''],
    queryFn: async (c) => {
      if (!targetPubkey) {
        return createDefaultCompanionState();
      }

      const events = await nostr.query(
        [{
          kinds: [KIND_BLOBBI_STATE],
          authors: [targetPubkey],
          '#d': [DTAG_BUDDIES],
          limit: 1,
        }],
        { signal: c.signal },
      );

      if (events.length === 0) {
        return createDefaultCompanionState();
      }

      try {
        const p = JSON.parse(events[0].content) as Partial<BlobbiCompanionState>;
        const def = createDefaultCompanionState();
        return {
          stats: {
            feedCount: p.stats?.feedCount ?? 0,
            playCount: p.stats?.playCount ?? 0,
            cleanCount: p.stats?.cleanCount ?? 0,
            sleepCount: p.stats?.sleepCount ?? 0,
            totalCare: p.stats?.totalCare ?? 0,
          },
          friendCare: p.friendCare ?? {},
          coopTasksCompleted: p.coopTasksCompleted ?? 0,
          lastInteraction: p.lastInteraction ?? Math.floor(Date.now() / 1000),
          streak: p.streak ?? 0,
          lastStreakDay: p.lastStreakDay ?? '',
          xp: p.xp ?? 0,
          photos: p.photos ?? [],
          dailyProgress: p.dailyProgress ?? def.dailyProgress,
          dailyDate: p.dailyDate ?? def.dailyDate,
          puzzleWins: p.puzzleWins ?? 0,
        };
      } catch {
        return createDefaultCompanionState();
      }
    },
    enabled: Boolean(targetPubkey),
    staleTime: 30_000,
  });

  const companion = query.data ?? createDefaultCompanionState();
  const computed = computeBlobbiState(companion);

  return {
    companion,
    computed,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
