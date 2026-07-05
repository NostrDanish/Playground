import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { useCurrentUser } from './useCurrentUser';
import { useNostrPublish } from './useNostrPublish';
import { useBlobbiState } from './useBlobbiState';
import {
  KIND_BLOBBI_STATE,
  KIND_BLOBBI_ACTION,
  DTAG_BUDDIES,
  ACTION_TAGS,
  ACTION_EMOJI,
  type ActionType,
  type BlobbiCompanionState,
} from '@/lib/gameTypes';

interface UseBlobbiActionsResult {
  performAction: (action: ActionType, targetPubkey?: string) => Promise<void>;
  isPerforming: boolean;
  lastAction: ActionType | null;
}

export function useBlobbiActions(): UseBlobbiActionsResult {
  const { user } = useCurrentUser();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const { companion } = useBlobbiState();
  const queryClient = useQueryClient();
  const [isPerforming, setIsPerforming] = useState(false);
  const [lastAction, setLastAction] = useState<ActionType | null>(null);

  const performAction = useCallback(async (action: ActionType, targetPubkey?: string) => {
    if (!user) throw new Error('Must be logged in');

    setIsPerforming(true);
    setLastAction(action);

    try {
      const isVisiting = targetPubkey && targetPubkey !== user.pubkey;
      const emoji = ACTION_EMOJI[action];

      // 1. Publish the action event (visible in feeds)
      const actionTags: string[][] = [
        ['t', ACTION_TAGS[action]],
        ['alt', `${emoji} Blobbi Buddies: ${action} action`],
      ];

      if (isVisiting) {
        actionTags.push(['p', targetPubkey]);
      }

      const messages: Record<ActionType, string> = {
        feed: `${emoji} Fed my Blobbi a tasty snack!`,
        play: `${emoji} Played with my Blobbi!`,
        clean: `${emoji} Gave my Blobbi a nice bath!`,
        sleep: `${emoji} Tucked my Blobbi into bed!`,
        visit: `${emoji} Visited a friend's Blobbi!`,
      };

      await publishEvent({
        kind: KIND_BLOBBI_ACTION,
        content: isVisiting
          ? `${emoji} Helped care for a friend's Blobbi!`
          : messages[action],
        tags: actionTags,
      });

      // 2. Update companion state
      const updatedCompanion: BlobbiCompanionState = {
        ...companion,
        stats: {
          ...companion.stats,
          feedCount: companion.stats.feedCount + (action === 'feed' ? 1 : 0),
          playCount: companion.stats.playCount + (action === 'play' ? 1 : 0),
          cleanCount: companion.stats.cleanCount + (action === 'clean' ? 1 : 0),
          sleepCount: companion.stats.sleepCount + (action === 'sleep' ? 1 : 0),
          totalCare: companion.stats.totalCare + 1,
        },
        lastInteraction: Math.floor(Date.now() / 1000),
      };

      // Track friend interactions
      if (isVisiting) {
        const existing = updatedCompanion.friendCare[targetPubkey] ?? {
          feedCount: 0,
          playCount: 0,
          visits: 0,
          lastVisit: 0,
        };

        updatedCompanion.friendCare = {
          ...updatedCompanion.friendCare,
          [targetPubkey]: {
            ...existing,
            feedCount: existing.feedCount + (action === 'feed' ? 1 : 0),
            playCount: existing.playCount + (action === 'play' ? 1 : 0),
            visits: existing.visits + (action === 'visit' ? 1 : 0),
            lastVisit: Math.floor(Date.now() / 1000),
          },
        };
      }

      await publishEvent({
        kind: KIND_BLOBBI_STATE,
        content: JSON.stringify(updatedCompanion),
        tags: [
          ['d', DTAG_BUDDIES],
          ['alt', 'Blobbi Buddies companion state'],
        ],
      });

      // Invalidate queries to refresh UI
      await queryClient.invalidateQueries({ queryKey: ['blobbi-buddies'] });
    } finally {
      // Keep lastAction set for animation, clear performing flag
      setIsPerforming(false);
      // Clear lastAction after animation
      setTimeout(() => setLastAction(null), 1200);
    }
  }, [user, companion, publishEvent, queryClient]);

  return {
    performAction,
    isPerforming,
    lastAction,
  };
}
