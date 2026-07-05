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
  getTodayString,
  type ActionType,
  type BlobbiCompanionState,
} from '@/lib/gameTypes';

interface UseBlobbiActionsResult {
  performAction: (action: ActionType, targetPubkey?: string) => Promise<void>;
  publishCompanionState: (state: BlobbiCompanionState) => Promise<void>;
  isPerforming: boolean;
  lastAction: ActionType | null;
}

/**
 * @param dtag — override the d-tag for multi-Blobbi. Defaults to `"blobbi-buddies"`.
 * @param blobbiName — the active Blobbi's name (used in action messages).
 */
export function useBlobbiActions(dtag?: string, blobbiName?: string): UseBlobbiActionsResult {
  const { user } = useCurrentUser();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const activeDtag = dtag ?? DTAG_BUDDIES;
  const { companion } = useBlobbiState(undefined, activeDtag);
  const queryClient = useQueryClient();
  const [isPerforming, setIsPerforming] = useState(false);
  const [lastAction, setLastAction] = useState<ActionType | null>(null);

  const name = blobbiName ?? 'Blobbi';

  const publishCompanionState = useCallback(async (state: BlobbiCompanionState) => {
    await publishEvent({
      kind: KIND_BLOBBI_STATE,
      content: JSON.stringify(state),
      tags: [
        ['d', activeDtag],
        ['alt', 'Blobbi Buddies companion state'],
      ],
    });
    await queryClient.invalidateQueries({ queryKey: ['blobbi-buddies'] });
  }, [publishEvent, queryClient, activeDtag]);

  const performAction = useCallback(async (action: ActionType, targetPubkey?: string) => {
    if (!user) throw new Error('Must be logged in');

    setIsPerforming(true);
    setLastAction(action);

    try {
      const isVisiting = targetPubkey && targetPubkey !== user.pubkey;
      const emoji = ACTION_EMOJI[action];
      const today = getTodayString();

      // 1. Publish the action event
      const actionTags: string[][] = [
        ['t', ACTION_TAGS[action]],
        ['alt', `${emoji} Blobbi Buddies: ${action} action`],
      ];

      if (isVisiting) {
        actionTags.push(['p', targetPubkey]);
      }

      const messages: Record<ActionType, string> = {
        feed: `${emoji} Fed ${name} a tasty snack!`,
        play: `${emoji} Played with ${name}!`,
        clean: `${emoji} Gave ${name} a nice bath!`,
        sleep: `${emoji} Tucked ${name} into bed!`,
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
      const resetDaily = companion.dailyDate !== today;
      const dailyProgress = resetDaily ? {} : { ...companion.dailyProgress };

      const dailyMapping: Record<string, string> = {
        feed: 'feed-3',
        play: 'play-2',
        clean: 'clean-1',
        visit: 'visit-friend',
      };
      const dailyKey = dailyMapping[action];
      if (dailyKey) {
        dailyProgress[dailyKey] = (dailyProgress[dailyKey] ?? 0) + 1;
      }

      let streak = companion.streak ?? 0;
      const lastStreakDay = companion.lastStreakDay ?? '';
      if (lastStreakDay === today) {
        // Already counted today
      } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        streak = lastStreakDay === yesterday ? streak + 1 : 1;
      }

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
        xp: (companion.xp ?? 0) + 5,
        streak,
        lastStreakDay: today,
        dailyProgress,
        dailyDate: today,
      };

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

      await publishCompanionState(updatedCompanion);
    } finally {
      setIsPerforming(false);
      setTimeout(() => setLastAction(null), 1200);
    }
  }, [user, companion, name, publishEvent, publishCompanionState]);

  return {
    performAction,
    publishCompanionState,
    isPerforming,
    lastAction,
  };
}
