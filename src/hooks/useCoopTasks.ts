import { useNostr } from '@nostrify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';
import { useCallback, useState } from 'react';

import { useCurrentUser } from './useCurrentUser';
import { useNostrPublish } from './useNostrPublish';
import {
  KIND_BLOBBI_COOP,
  COOP_TASKS,
  type CoopTaskType,
  type CoopTaskContent,
} from '@/lib/gameTypes';

interface ParsedCoopTask {
  event: NostrEvent;
  content: CoopTaskContent;
}

function parseCoopTask(event: NostrEvent): ParsedCoopTask | null {
  try {
    const content = JSON.parse(event.content) as CoopTaskContent;
    if (!content.taskType || !content.participants || !content.status) return null;
    return { event, content };
  } catch {
    return null;
  }
}

export function useCoopTasks() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch active tasks for the current user
  const tasksQuery = useQuery<ParsedCoopTask[]>({
    queryKey: ['blobbi-buddies', 'coop-tasks', user?.pubkey ?? ''],
    queryFn: async (c) => {
      if (!user) return [];

      const events = await nostr.query(
        [{
          kinds: [KIND_BLOBBI_COOP],
          '#p': [user.pubkey],
          limit: 20,
        }],
        { signal: c.signal },
      );

      return events
        .map(parseCoopTask)
        .filter((t): t is ParsedCoopTask => t !== null)
        .sort((a, b) => b.event.created_at - a.event.created_at);
    },
    enabled: Boolean(user),
    staleTime: 15_000,
  });

  const createTask = useCallback(async (taskType: CoopTaskType, friendPubkey: string) => {
    if (!user) throw new Error('Must be logged in');

    setIsCreating(true);
    try {
      const taskInfo = COOP_TASKS[taskType];
      const content: CoopTaskContent = {
        taskType,
        status: 'pending',
        participants: [user.pubkey, friendPubkey],
        progress: 0,
        startedAt: Math.floor(Date.now() / 1000),
        completedAt: null,
      };

      await publishEvent({
        kind: KIND_BLOBBI_COOP,
        content: JSON.stringify(content),
        tags: [
          ['t', 'blobbi-coop'],
          ['p', user.pubkey],
          ['p', friendPubkey],
          ['alt', `Blobbi Buddies co-op task: ${taskInfo.label}`],
        ],
      });

      await queryClient.invalidateQueries({ queryKey: ['blobbi-buddies', 'coop-tasks'] });
    } finally {
      setIsCreating(false);
    }
  }, [user, publishEvent, queryClient]);

  const completeTask = useCallback(async (task: ParsedCoopTask) => {
    if (!user) throw new Error('Must be logged in');

    const updatedContent: CoopTaskContent = {
      ...task.content,
      status: 'completed',
      progress: 100,
      completedAt: Math.floor(Date.now() / 1000),
    };

    await publishEvent({
      kind: KIND_BLOBBI_COOP,
      content: JSON.stringify(updatedContent),
      tags: [
        ['t', 'blobbi-coop'],
        ...task.content.participants.map(p => ['p', p]),
        ['e', task.event.id],
        ['alt', `Blobbi Buddies co-op task completed: ${COOP_TASKS[task.content.taskType]?.label ?? task.content.taskType}`],
      ],
    });

    await queryClient.invalidateQueries({ queryKey: ['blobbi-buddies', 'coop-tasks'] });
  }, [user, publishEvent, queryClient]);

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    createTask,
    completeTask,
    isCreating,
    refetch: tasksQuery.refetch,
  };
}
