import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EvolutionStage } from '@/lib/gameTypes';
import { Moon, Sun } from 'lucide-react';

interface GameHeaderProps {
  stage: EvolutionStage;
  totalCare: number;
  level: number;
  xp: number;
  streak: number;
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

export function GameHeader({ stage, totalCare, level, xp, streak, className }: GameHeaderProps) {
  const { user } = useCurrentUser();
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className={cn(
      'flex items-center justify-between px-4 py-3 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50',
      className,
    )}>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-primary">Blobbi</span>
          {' '}
          <span className="text-muted-foreground font-normal">Buddies</span>
        </h1>
        <Badge variant="secondary" className="text-[10px] font-normal hidden sm:inline-flex">
          {stageLabels[stage]}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] tabular-nums gap-1 hidden sm:inline-flex">
              ⭐ Lv.{level}
            </Badge>
            {streak > 0 && (
              <Badge variant="secondary" className="text-[10px] tabular-nums gap-1 hidden sm:inline-flex">
                🔥 {streak}
              </Badge>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDark
            ? <Sun className="h-4 w-4 text-yellow-400" />
            : <Moon className="h-4 w-4" />
          }
        </Button>

        <LoginArea className="max-w-44" />
      </div>
    </header>
  );
}
