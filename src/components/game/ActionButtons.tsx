import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ActionType } from '@/lib/gameTypes';

interface ActionButtonsProps {
  onAction: (action: ActionType) => void;
  isPerforming: boolean;
  disabled?: boolean;
  className?: string;
}

const actions: { type: ActionType; emoji: string; label: string; color: string }[] = [
  { type: 'feed', emoji: '🍎', label: 'Feed', color: 'hover:bg-orange-100 dark:hover:bg-orange-900/30' },
  { type: 'play', emoji: '🎾', label: 'Play', color: 'hover:bg-green-100 dark:hover:bg-green-900/30' },
  { type: 'clean', emoji: '🫧', label: 'Clean', color: 'hover:bg-blue-100 dark:hover:bg-blue-900/30' },
  { type: 'sleep', emoji: '💤', label: 'Sleep', color: 'hover:bg-purple-100 dark:hover:bg-purple-900/30' },
];

export function ActionButtons({ onAction, isPerforming, disabled, className }: ActionButtonsProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      {actions.map(({ type, emoji, label, color }) => (
        <Tooltip key={type}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'flex flex-col gap-1 h-auto py-3 px-2 rounded-xl border-2 transition-all duration-200',
                'active:scale-95',
                color,
                isPerforming && 'opacity-50 pointer-events-none',
              )}
              onClick={() => onAction(type)}
              disabled={disabled || isPerforming}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs font-medium">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {label} your Blobbi
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
