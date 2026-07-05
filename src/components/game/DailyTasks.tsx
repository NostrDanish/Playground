import { useBlobbiState } from '@/hooks/useBlobbiState';
import { getTodaysDailyTasks, getTodayString, type DailyTask } from '@/lib/gameTypes';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Star } from 'lucide-react';

interface DailyTasksProps {
  className?: string;
}

const DAILY_TASK_TARGETS: Record<string, number> = {
  'feed-3': 3,
  'play-2': 2,
  'clean-1': 1,
  'visit-friend': 1,
  'chat-5': 5,
  'coop-task': 1,
  'photo-date': 1,
  'puzzle-win': 1,
  'streak-3': 3,
};

export function DailyTasks({ className }: DailyTasksProps) {
  const { companion, computed } = useBlobbiState();
  const todaysTasks = getTodaysDailyTasks();
  const today = getTodayString();

  const dailyProgress = companion.dailyDate === today
    ? companion.dailyProgress
    : {};

  const completedCount = todaysTasks.filter(t => {
    const target = DAILY_TASK_TARGETS[t.id] ?? 1;
    const current = t.id === 'streak-3'
      ? (computed.streak >= 3 ? 3 : computed.streak)
      : (dailyProgress[t.id] ?? 0);
    return current >= target;
  }).length;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with streak */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Star className="h-4 w-4 text-yellow-500" />
          Daily Tasks
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] gap-1">
            <Flame className="h-3 w-3 text-orange-500" />
            {computed.streak} day streak
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {completedCount}/{todaysTasks.length}
          </Badge>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {todaysTasks.map((task) => (
          <DailyTaskItem
            key={task.id}
            task={task}
            progress={task.id === 'streak-3'
              ? Math.min(computed.streak, 3)
              : (dailyProgress[task.id] ?? 0)
            }
            target={DAILY_TASK_TARGETS[task.id] ?? 1}
          />
        ))}
      </div>
    </div>
  );
}

function DailyTaskItem({
  task,
  progress,
  target,
}: {
  task: DailyTask;
  progress: number;
  target: number;
}) {
  const isComplete = progress >= target;
  const pct = Math.min(100, (progress / target) * 100);

  return (
    <div className={cn(
      'p-3 rounded-xl border transition-all',
      isComplete
        ? 'bg-accent/30 border-accent-foreground/20'
        : 'bg-card/50 border-border',
    )}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{task.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-sm font-medium',
              isComplete && 'line-through opacity-60',
            )}>
              {task.label}
            </span>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {Math.min(progress, target)}/{target}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">{task.description}</p>
        </div>
        {isComplete && (
          <span className="text-xs">✅</span>
        )}
      </div>
      <Progress value={pct} className="h-1" />
      <div className="flex justify-end mt-1">
        <span className="text-[10px] text-muted-foreground">+{task.xpReward} XP</span>
      </div>
    </div>
  );
}
