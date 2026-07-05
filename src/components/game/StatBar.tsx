import { cn } from '@/lib/utils';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  icon: string;
  color: string;
  className?: string;
}

export function StatBar({ label, value, maxValue = 100, icon, color, className }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm w-5 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className="text-xs tabular-nums text-muted-foreground">{Math.round(value)}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              color,
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
