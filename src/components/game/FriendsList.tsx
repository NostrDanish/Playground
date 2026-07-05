import { useAuthor } from '@/hooks/useAuthor';
import { useFriendsList, type FriendInfo } from '@/hooks/useFriendsList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { UserPlus } from 'lucide-react';

interface FriendsListProps {
  onVisitFriend?: (pubkey: string) => void;
  onInviteFriend?: (pubkey: string) => void;
  className?: string;
}

export function FriendsList({ onVisitFriend, onInviteFriend, className }: FriendsListProps) {
  const { friends, isLoading, friendCount } = useFriendsList();

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (friendCount === 0) {
    return (
      <div className={cn('text-center py-6 px-4', className)}>
        <div className="text-3xl mb-2">👋</div>
        <p className="text-sm text-muted-foreground">
          No friends yet. Visit someone&apos;s Blobbi to become friends!
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('h-[200px]', className)}>
      <div className="space-y-1 pr-3">
        {friends.map((friend) => (
          <FriendItem
            key={friend.pubkey}
            friend={friend}
            onVisit={onVisitFriend}
            onInvite={onInviteFriend}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function FriendItem({
  friend,
  onVisit,
  onInvite,
}: {
  friend: FriendInfo;
  onVisit?: (pubkey: string) => void;
  onInvite?: (pubkey: string) => void;
}) {
  const author = useAuthor(friend.pubkey);
  const name = author.data?.metadata?.name ?? friend.pubkey.slice(0, 8);
  const picture = author.data?.metadata?.picture;

  return (
    <div className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors group">
      <Avatar size="sm">
        {picture && <AvatarImage src={picture} alt={name} />}
        <AvatarFallback className="text-[10px]">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground">
          {friend.totalInteractions} interactions
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onVisit && (
          <Badge
            variant="secondary"
            className="cursor-pointer text-[10px] px-1.5 py-0.5"
            onClick={() => onVisit(friend.pubkey)}
          >
            Visit
          </Badge>
        )}
        {onInvite && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onInvite(friend.pubkey)}
          >
            <UserPlus className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
