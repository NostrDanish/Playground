import { cn } from '@/lib/utils';
import type { SceneType } from '@/lib/gameTypes';

interface SceneBackgroundProps {
  scene: SceneType;
  children: React.ReactNode;
  className?: string;
}

/**
 * Scene backgrounds using pre-defined class mappings so Tailwind
 * can detect and compile them.
 */
const SCENE_CLASSES: Record<SceneType, {
  bgLight: string;
  bgDark: string;
  groundLight: string;
  groundDark: string;
}> = {
  park: {
    bgLight: 'bg-gradient-to-b from-sky-100 via-sky-50 to-green-100',
    bgDark: 'dark:from-indigo-950 dark:via-slate-900 dark:to-emerald-950',
    groundLight: 'from-green-200/60',
    groundDark: 'dark:from-emerald-900/40',
  },
  beach: {
    bgLight: 'bg-gradient-to-b from-sky-200 via-cyan-50 to-amber-100',
    bgDark: 'dark:from-slate-900 dark:via-cyan-950 dark:to-amber-950',
    groundLight: 'from-amber-200/70',
    groundDark: 'dark:from-amber-900/40',
  },
  restaurant: {
    bgLight: 'bg-gradient-to-b from-amber-50 via-orange-50 to-red-50',
    bgDark: 'dark:from-amber-950 dark:via-orange-950 dark:to-red-950',
    groundLight: 'from-amber-100/60',
    groundDark: 'dark:from-amber-900/30',
  },
  home: {
    bgLight: 'bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50',
    bgDark: 'dark:from-slate-900 dark:via-amber-950 dark:to-orange-950',
    groundLight: 'from-amber-100/50',
    groundDark: 'dark:from-orange-900/30',
  },
  forest: {
    bgLight: 'bg-gradient-to-b from-emerald-100 via-green-50 to-lime-50',
    bgDark: 'dark:from-emerald-950 dark:via-green-950 dark:to-slate-900',
    groundLight: 'from-green-300/60',
    groundDark: 'dark:from-green-900/50',
  },
  night: {
    bgLight: 'bg-gradient-to-b from-indigo-200 via-purple-100 to-slate-200',
    bgDark: 'dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950',
    groundLight: 'from-slate-200/60',
    groundDark: 'dark:from-slate-800/50',
  },
};

const SCENE_DECO: Record<SceneType, Array<{ emoji: string; className: string }>> = {
  park: [
    { emoji: '☁️', className: 'top-3 left-4 text-lg' },
    { emoji: '☁️', className: 'top-6 right-8 text-sm' },
    { emoji: '🌿', className: 'bottom-1 left-6 text-xs' },
    { emoji: '🌱', className: 'bottom-2 right-10 text-xs' },
    { emoji: '🌼', className: 'bottom-1 left-1/2 text-[10px]' },
    { emoji: '🦋', className: 'top-10 right-4 text-xs' },
  ],
  beach: [
    { emoji: '☀️', className: 'top-2 right-4 text-xl' },
    { emoji: '🐚', className: 'bottom-1 left-8 text-xs' },
    { emoji: '🌊', className: 'bottom-6 left-2 text-sm' },
    { emoji: '🌊', className: 'bottom-7 right-4 text-sm' },
    { emoji: '⛱️', className: 'bottom-2 right-6 text-sm' },
  ],
  restaurant: [
    { emoji: '🕯️', className: 'top-3 left-6 text-sm' },
    { emoji: '🕯️', className: 'top-3 right-6 text-sm' },
    { emoji: '🍷', className: 'bottom-2 left-4 text-xs' },
    { emoji: '🍝', className: 'bottom-1 right-8 text-xs' },
    { emoji: '🎵', className: 'top-6 right-3 text-[10px]' },
  ],
  home: [
    { emoji: '🪴', className: 'bottom-1 left-4 text-sm' },
    { emoji: '🛋️', className: 'bottom-2 right-4 text-sm' },
    { emoji: '📚', className: 'top-3 left-6 text-xs' },
    { emoji: '🖼️', className: 'top-4 right-8 text-xs' },
    { emoji: '💡', className: 'top-2 left-1/2 text-xs' },
  ],
  forest: [
    { emoji: '🌲', className: 'top-2 left-2 text-lg' },
    { emoji: '🌲', className: 'top-4 right-4 text-xl' },
    { emoji: '🍄', className: 'bottom-1 left-8 text-xs' },
    { emoji: '🐿️', className: 'bottom-2 right-6 text-xs' },
    { emoji: '🌳', className: 'top-3 right-12 text-lg' },
  ],
  night: [
    { emoji: '🌙', className: 'top-2 right-4 text-xl' },
    { emoji: '⭐', className: 'top-3 left-6 text-[10px]' },
    { emoji: '⭐', className: 'top-5 left-12 text-xs' },
    { emoji: '⭐', className: 'top-4 right-12 text-[10px]' },
    { emoji: '✨', className: 'top-6 left-3 text-[10px]' },
    { emoji: '🦉', className: 'bottom-2 right-4 text-xs' },
  ],
};

export function SceneBackground({ scene, children, className }: SceneBackgroundProps) {
  const classes = SCENE_CLASSES[scene];
  const deco = SCENE_DECO[scene];

  return (
    <div className={cn(
      'rounded-2xl overflow-hidden relative',
      classes.bgLight,
      classes.bgDark,
      className,
    )}>
      {/* Decorations */}
      {deco.map((d, i) => (
        <div
          key={i}
          className={cn('absolute opacity-40 dark:opacity-20', d.className)}
        >
          {d.emoji}
        </div>
      ))}

      {/* Ground */}
      <div className={cn(
        'absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t to-transparent',
        classes.groundLight,
        classes.groundDark,
      )} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
