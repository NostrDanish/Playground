import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

import { KIND_BLOBBI_ACTION } from '@/lib/gameTypes';

/**
 * Fetch recent Blobbi action events for the activity feed.
 * Can filter by a specific pubkey or show global feed.
 */
export function useBlobbiActivity(pubkey?: string, limit = 20) {
  const { nostr } = useNostr();

  return useQuery<NostrEvent[]>({
    queryKey: ['blobbi-buddies', 'activity', pubkey ?? 'global', limit],
    queryFn: async (c) => {
      const filter: Record<string, unknown> = {
        kinds: [KIND_BLOBBI_ACTION],
        limit,
      };

      if (pubkey) {
        filter.authors = [pubkey];
      }

      return nostr.query(
        [filter as Parameters<typeof nostr.query>[0][0]],
        { signal: c.signal },
      );
    },
    staleTime: 30_000,
  });
}
