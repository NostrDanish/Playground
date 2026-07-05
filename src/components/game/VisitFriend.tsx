import { useState } from 'react';
import { useAuthor } from '@/hooks/useAuthor';
import { useBlobbiState } from '@/hooks/useBlobbiState';
import { useBlobbiActions } from '@/hooks/useBlobbiActions';
import { BlobbiCreature } from './BlobbiCreature';
import { StatBar } from './StatBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ArrowLeft, Heart } from 'lucide-react';

interface VisitFriendProps {
  friendPubkey: string;
  onBack: () => void;
  className?: string;
}

export function VisitFriend({ friendPubkey, onBack, className }: VisitFriendProps) {
  const author = useAuthor(friendPubkey);
  const { computed } = useBlobbiState(friendPubkey);
  const { performAction, isPerforming, lastAction } = useBlobbiActions();
  const [showHeart, setShowHeart] = useState(false);

  const friendName = author.data?.metadata?.name ?? friendPubkey.slice(0, 8);
  const friendPicture = author.data?.metadata?.picture;

  const handleCare = async (action: 'feed' | 'play') => {
    await performAction(action, friendPubkey);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1500);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar size="sm">
          {friendPicture && <AvatarImage src={friendPicture} alt={friendName} />}
          <AvatarFallback className="text-[10px]">
            {friendName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{friendName}&apos;s Blobbi</p>
          <p className="text-[10px] text-muted-foreground">Visiting...</p>
        </div>
      </div>

      {/* Friend's Blobbi */}
      <div className="relative flex justify-center py-6">
        <BlobbiCreature
          stage={computed.stage}
          mood={computed.mood}
          currentAction={lastAction}
          className="w-32 h-32"
        />

        {showHeart && (
          <div className="absolute top-4 right-1/4 animate-float-up">
            <Heart className="h-6 w-6 fill-red-400 text-red-400" />
          </div>
        )}
      </div>

      {/* Stats (read-only view) */}
      <div className="space-y-2 px-2">
        <StatBar label="Hunger" value={computed.hunger} icon="🍎" color="bg-orange-400" />
        <StatBar label="Happiness" value={computed.happiness} icon="😊" color="bg-pink-400" />
        <StatBar label="Cleanliness" value={computed.cleanliness} icon="🫧" color="bg-blue-400" />
        <StatBar label="Energy" value={computed.energy} icon="⚡" color="bg-yellow-400" />
      </div>

      {/* Care actions */}
      <div className="grid grid-cols-2 gap-2 px-2">
        <Button
          variant="outline"
          className="h-auto py-3 rounded-xl border-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          onClick={() => handleCare('feed')}
          disabled={isPerforming}
        >
          <span className="text-xl mr-2">🍎</span>
          <span className="text-sm">Feed</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-3 rounded-xl border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
          onClick={() => handleCare('play')}
          disabled={isPerforming}
        >
          <span className="text-xl mr-2">🎾</span>
          <span className="text-sm">Play</span>
        </Button>
      </div>
    </div>
  );
}
