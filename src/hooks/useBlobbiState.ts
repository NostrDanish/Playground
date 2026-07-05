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

/**
 * Fetch the Blobbi Buddies companion state for a given pubkey.
 * Falls back to defaults if no event is found.
 */
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
        const parsed = JSON.parse(events[0].content) as BlobbiCompanionState;
        return {
          stats: {
            feedCount: parsed.stats?.feedCount ?? 0,
            playCount: parsed.stats?.playCount ?? 0,
            cleanCount: parsed.stats?.cleanCount ?? 0,
            sleepCount: parsed.stats?.sleepCount ?? 0,
            totalCare: parsed.stats?.totalCare ?? 0,
          },
          friendCare: parsed.friendCare ?? {},
          coopTasksCompleted: parsed.coopTasksCompleted ?? 0,
          lastInteraction: parsed.lastInteraction ?? Math.floor(Date.now() / 1000),
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
