import { useState } from 'react';
import { useCoopTasks } from '@/hooks/useCoopTasks';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { COOP_TASKS, type CoopTaskType } from '@/lib/gameTypes';
import { cn } from '@/lib/utils';
import { nip19 } from 'nostr-tools';
import { Users, Loader2 } from 'lucide-react';

interface CoopTaskPanelProps {
  className?: string;
}

export function CoopTaskPanel({ className }: CoopTaskPanelProps) {
  const { user } = useCurrentUser();
  const { tasks, isLoading, createTask, completeTask, isCreating } = useCoopTasks();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CoopTaskType>('walk');
  const [friendNpub, setFriendNpub] = useState('');
  const [createError, setCreateError] = useState('');

  const handleCreate = async () => {
    if (!friendNpub.trim()) {
      setCreateError('Enter a friend\'s npub');
      return;
    }

    try {
      let pubkey: string;
      const decoded = nip19.decode(friendNpub.trim());
      if (decoded.type === 'npub') {
        pubkey = decoded.data;
      } else if (decoded.type === 'nprofile') {
        pubkey = decoded.data.pubkey;
      } else {
        setCreateError('Invalid npub or nprofile');
        return;
      }

      await createTask(selectedTask, pubkey);
      setShowCreateDialog(false);
      setFriendNpub('');
      setCreateError('');
    } catch {
      setCreateError('Failed to create task. Check the npub and try again.');
    }
  };

  if (!user) {
    return (
      <div className={cn('text-center py-6', className)}>
        <p className="text-sm text-muted-foreground">Log in to start co-op tasks!</p>
      </div>
    );
  }

  const taskEntries = Object.entries(COOP_TASKS) as [CoopTaskType, typeof COOP_TASKS[CoopTaskType]][];

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          Co-op Activities
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs rounded-lg"
          onClick={() => setShowCreateDialog(true)}
        >
          + New Activity
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-4 px-3 rounded-xl border border-dashed">
          <p className="text-sm text-muted-foreground">
            No active activities. Invite a friend!
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[200px]">
          <div className="space-y-2 pr-3">
            {tasks.map((task) => {
              const info = COOP_TASKS[task.content.taskType];
              const otherPubkey = task.content.participants.find(p => p !== user.pubkey);

              return (
                <TaskItem
                  key={task.event.id}
                  taskEmoji={info?.emoji ?? '❓'}
                  taskLabel={info?.label ?? task.content.taskType}
                  status={task.content.status}
                  progress={task.content.progress}
                  otherPubkey={otherPubkey}
                  onComplete={() => completeTask(task)}
                />
              );
            })}
          </div>
        </ScrollArea>
      )}

      {/* Create Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Start an Activity</DialogTitle>
            <DialogDescription>
              Pick something fun to do with a friend!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <ScrollArea className="h-[220px]">
              <div className="grid grid-cols-2 gap-2 pr-3">
                {taskEntries.map(([type, info]) => (
                  <button
                    key={type}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center',
                      selectedTask === type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30',
                    )}
                    onClick={() => setSelectedTask(type)}
                  >
                    <span className="text-2xl">{info.emoji}</span>
                    <span className="text-[10px] font-medium leading-tight">{info.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Friend&apos;s npub
              </label>
              <Input
                placeholder="npub1..."
                value={friendNpub}
                onChange={(e) => {
                  setFriendNpub(e.target.value);
                  setCreateError('');
                }}
                className="text-sm"
              />
              {createError && (
                <p className="text-xs text-destructive mt-1">{createError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full rounded-xl"
            >
              {isCreating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</>
              ) : (
                `Start ${COOP_TASKS[selectedTask].emoji} ${COOP_TASKS[selectedTask].label}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskItem({
  taskEmoji,
  taskLabel,
  status,
  progress,
  otherPubkey,
  onComplete,
}: {
  taskEmoji: string;
  taskLabel: string;
  status: string;
  progress: number;
  otherPubkey?: string;
  onComplete: () => void;
}) {
  const author = useAuthor(otherPubkey);
  const friendName = author.data?.metadata?.name ?? otherPubkey?.slice(0, 8) ?? '???';

  return (
    <div className="p-3 rounded-xl border bg-card/50 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{taskEmoji}</span>
          <div>
            <p className="text-sm font-medium">{taskLabel}</p>
            <p className="text-[10px] text-muted-foreground">with {friendName}</p>
          </div>
        </div>
        <Badge
          variant={status === 'completed' ? 'default' : 'secondary'}
          className="text-[10px]"
        >
          {status}
        </Badge>
      </div>

      <Progress value={progress} className="h-1.5" />

      {status !== 'completed' && (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs rounded-lg"
          onClick={onComplete}
        >
          Complete Activity ✨
        </Button>
      )}
    </div>
  );
}
