import type { NostrEvent } from '@nostrify/nostrify';
import { useAuthor } from '@/hooks/useAuthor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  events: NostrEvent[];
  isLoading: boolean;
  className?: string;
}

export function ActivityFeed({ events, isLoading, className }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={cn('text-center py-6', className)}>
        <p className="text-sm text-muted-foreground">No activity yet. Start caring for your Blobbi!</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('h-[200px]', className)}>
      <div className="space-y-2 pr-3">
        {events.map((event) => (
          <ActivityItem key={event.id} event={event} />
        ))}
      </div>
    </ScrollArea>
  );
}

function ActivityItem({ event }: { event: NostrEvent }) {
  const author = useAuthor(event.pubkey);
  const name = author.data?.metadata?.name ?? event.pubkey.slice(0, 8);
  const picture = author.data?.metadata?.picture;

  const timeAgo = formatTimeAgo(event.created_at);

  return (
    <div className="flex items-start gap-2 py-1.5 px-1 rounded-lg hover:bg-muted/30 transition-colors">
      <Avatar size="sm" className="mt-0.5">
        {picture && <AvatarImage src={picture} alt={name} />}
        <AvatarFallback className="text-[10px]">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-medium">{name}</span>
          {' '}
          <span className="text-muted-foreground">{event.content}</span>
        </p>
        <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000) - timestamp;
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
