import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EvolutionStage } from '@/lib/gameTypes';

interface GameHeaderProps {
  stage: EvolutionStage;
  totalCare: number;
  className?: string;
}

const stageLabels: Record<EvolutionStage, string> = {
  egg: '🥚 Egg',
  baby: '🐣 Baby',
  child: '👶 Child',
  teen: '🧒 Teen',
  adult: '🌟 Adult',
  elder: '👑 Elder',
};

export function GameHeader({ stage, totalCare, className }: GameHeaderProps) {
  const { user } = useCurrentUser();

  return (
    <header className={cn(
      'flex items-center justify-between px-4 py-3 border-b bg-card/80 backdrop-blur-sm',
      className,
    )}>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-primary">Blobbi</span>
          {' '}
          <span className="text-muted-foreground font-normal">Buddies</span>
        </h1>
        <Badge variant="secondary" className="text-[10px] font-normal">
          {stageLabels[stage]}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground">Total Care</p>
            <p className="text-sm font-bold tabular-nums">{totalCare}</p>
          </div>
        )}
        <LoginArea className="max-w-48" />
      </div>
    </header>
  );
}
