import { useMemo } from 'react';
import { useBlobbiState } from './useBlobbiState';

export interface FriendInfo {
  pubkey: string;
  feedCount: number;
  playCount: number;
  visits: number;
  lastVisit: number;
  totalInteractions: number;
}

/**
 * Derive a friends list from the companion state's friendCare map.
 */
export function useFriendsList() {
  const { companion, isLoading } = useBlobbiState();

  const friends = useMemo((): FriendInfo[] => {
    return Object.entries(companion.friendCare)
      .map(([pubkey, data]) => ({
        pubkey,
        feedCount: data.feedCount,
        playCount: data.playCount,
        visits: data.visits,
        lastVisit: data.lastVisit,
        totalInteractions: data.feedCount + data.playCount + data.visits,
      }))
      .sort((a, b) => b.totalInteractions - a.totalInteractions);
  }, [companion.friendCare]);

  return {
    friends,
    isLoading,
    friendCount: friends.length,
  };
}
