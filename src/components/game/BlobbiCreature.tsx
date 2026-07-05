import { cn } from '@/lib/utils';
import type { EvolutionStage, BlobbiMood, ActionType } from '@/lib/gameTypes';

interface BlobbiCreatureProps {
  stage: EvolutionStage;
  mood: BlobbiMood;
  currentAction: ActionType | null;
  className?: string;
  /** Override the body color (hex). Falls back to mood-based color. */
  color?: string;
}

/**
 * SVG-based pixel art Blobbi creature with mood-based expressions
 * and animation states.
 */
export function BlobbiCreature({ stage, mood, currentAction, className, color }: BlobbiCreatureProps) {
  const animationClass = (() => {
    if (currentAction === 'feed') return 'animate-blobbi-eat';
    if (currentAction === 'play') return 'animate-blobbi-bounce';
    if (currentAction === 'sleep') return 'animate-blobbi-sleep';
    if (currentAction === 'clean') return 'animate-blobbi-bounce';
    return 'animate-blobbi-idle';
  })();

  const sizeMap: Record<EvolutionStage, { w: number; h: number }> = {
    egg: { w: 64, h: 64 },
    baby: { w: 80, h: 80 },
    child: { w: 96, h: 96 },
    teen: { w: 112, h: 112 },
    adult: { w: 128, h: 128 },
    elder: { w: 136, h: 136 },
  };
  const size = sizeMap[stage];

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          'rounded-full opacity-30 blur-xl',
          mood === 'ecstatic' && 'bg-yellow-300 w-32 h-32',
          mood === 'happy' && 'bg-pink-200 w-28 h-28',
          mood === 'content' && 'bg-blue-200 w-24 h-24',
          mood === 'bored' && 'bg-gray-200 w-20 h-20',
          mood === 'sad' && 'bg-purple-200 w-20 h-20',
          mood === 'hungry' && 'bg-orange-200 w-20 h-20',
        )} />
      </div>

      {/* The Blobbi */}
      <div className={cn('relative z-10', animationClass)} style={{ width: size.w, height: size.h }}>
        <BlobbiSVG stage={stage} mood={mood} width={size.w} height={size.h} overrideColor={color} />
      </div>

      {/* Action effects */}
      {currentAction === 'feed' && (
        <div className="absolute top-0 right-4 animate-float-up text-2xl">🍎</div>
      )}
      {currentAction === 'play' && (
        <>
          <div className="absolute top-2 left-4 animate-sparkle text-lg" style={{ animationDelay: '0s' }}>✨</div>
          <div className="absolute top-0 right-6 animate-sparkle text-lg" style={{ animationDelay: '0.3s' }}>⭐</div>
        </>
      )}
      {currentAction === 'clean' && (
        <>
          <div className="absolute top-2 left-6 animate-float-up text-lg" style={{ animationDelay: '0s' }}>🫧</div>
          <div className="absolute top-4 right-4 animate-float-up text-lg" style={{ animationDelay: '0.2s' }}>🫧</div>
          <div className="absolute top-0 right-8 animate-float-up text-lg" style={{ animationDelay: '0.4s' }}>🫧</div>
        </>
      )}
      {currentAction === 'sleep' && (
        <div className="absolute -top-2 right-2">
          <span className="animate-zzz inline-block text-xl" style={{ animationDelay: '0s' }}>💤</span>
          <span className="animate-zzz inline-block text-sm ml-1" style={{ animationDelay: '0.7s' }}>z</span>
          <span className="animate-zzz inline-block text-xs ml-0.5" style={{ animationDelay: '1.4s' }}>z</span>
        </div>
      )}

      {/* Mood indicator */}
      {!currentAction && (
        <div className="absolute -bottom-2 text-sm">
          {mood === 'ecstatic' && '🌟'}
          {mood === 'happy' && '😊'}
          {mood === 'content' && '🙂'}
          {mood === 'bored' && '😐'}
          {mood === 'sad' && '😢'}
          {mood === 'hungry' && '🍽️'}
        </div>
      )}
    </div>
  );
}

/** Get body color based on mood */
function getBodyColor(mood: BlobbiMood): string {
  switch (mood) {
    case 'ecstatic': return '#FFD700';
    case 'happy': return '#FF8FAB';
    case 'content': return '#A8D8EA';
    case 'bored': return '#C4B7E6';
    case 'sad': return '#8BA6C7';
    case 'hungry': return '#FFB366';
  }
}

/** Get stage features */
function getStageFeatures(stage: EvolutionStage) {
  switch (stage) {
    case 'baby':
      return { bodyRx: 5, bodyRy: 5, hasCheeks: true, hasArms: false, hasCrown: false, hasWings: false };
    case 'child':
      return { bodyRx: 5.5, bodyRy: 5.5, hasCheeks: true, hasArms: true, hasCrown: false, hasWings: false };
    case 'teen':
      return { bodyRx: 5.5, bodyRy: 6, hasCheeks: true, hasArms: true, hasCrown: false, hasWings: false };
    case 'adult':
      return { bodyRx: 6, bodyRy: 6, hasCheeks: true, hasArms: true, hasCrown: false, hasWings: true };
    case 'elder':
      return { bodyRx: 6, bodyRy: 6, hasCheeks: true, hasArms: true, hasCrown: true, hasWings: true };
    default:
      return { bodyRx: 5, bodyRy: 5, hasCheeks: true, hasArms: false, hasCrown: false, hasWings: false };
  }
}

/** SVG pixel art Blobbi at different evolution stages — pure rendering, no hooks */
function BlobbiSVG({ stage, mood, width, height, overrideColor }: { stage: EvolutionStage; mood: BlobbiMood; width: number; height: number; overrideColor?: string }) {
  const bodyColor = overrideColor ?? getBodyColor(mood);
  const cheekColor = '#FF9999';

  if (stage === 'egg') {
    return (
      <svg width={width} height={height} viewBox="0 0 16 16" className="pixel-art w-full h-full">
        <ellipse cx="8" cy="9" rx="5" ry="6" fill={bodyColor} />
        <ellipse cx="8" cy="9" rx="5" ry="6" fill="none" stroke="#00000030" strokeWidth="0.5" />
        <path d="M5 6 L7 8 L6 10" stroke="#ffffff60" strokeWidth="0.5" fill="none" />
        <path d="M10 5 L9 7 L11 9" stroke="#ffffff60" strokeWidth="0.5" fill="none" />
        <circle cx="6" cy="5" r="0.5" fill="#ffffff90" />
      </svg>
    );
  }

  const stageFeatures = getStageFeatures(stage);

  return (
    <svg width={width} height={height} viewBox="0 0 16 16" className="pixel-art w-full h-full">
      {/* Shadow */}
      <ellipse cx="8" cy="14.5" rx="4" ry="1" fill="#00000015" />

      {/* Wings (adult/elder) */}
      {stageFeatures.hasWings && (
        <g>
          <ellipse cx="2.5" cy="8" rx="2" ry="3" fill={bodyColor} opacity="0.6" />
          <ellipse cx="13.5" cy="8" rx="2" ry="3" fill={bodyColor} opacity="0.6" />
        </g>
      )}

      {/* Body */}
      <ellipse cx="8" cy="8.5" rx={stageFeatures.bodyRx} ry={stageFeatures.bodyRy} fill={bodyColor} />
      <ellipse cx="8" cy="8.5" rx={stageFeatures.bodyRx} ry={stageFeatures.bodyRy} fill="none" stroke="#00000020" strokeWidth="0.3" />

      {/* Belly highlight */}
      <ellipse cx="8" cy="9.5" rx="3" ry="2.5" fill="#ffffff30" />

      {/* Arms (child+) */}
      {stageFeatures.hasArms && (
        <g>
          <ellipse cx="3.2" cy="9" rx="1" ry="1.5" fill={bodyColor} />
          <ellipse cx="12.8" cy="9" rx="1" ry="1.5" fill={bodyColor} />
        </g>
      )}

      {/* Feet */}
      <ellipse cx="6.5" cy="13" rx="1.5" ry="0.8" fill={bodyColor} />
      <ellipse cx="9.5" cy="13" rx="1.5" ry="0.8" fill={bodyColor} />

      {/* Crown (elder) */}
      {stageFeatures.hasCrown && (
        <g>
          <polygon points="5.5,3 6.5,1 7.5,2.5 8,0.5 8.5,2.5 9.5,1 10.5,3" fill="#FFD700" stroke="#DAA520" strokeWidth="0.3" />
          <circle cx="8" cy="1.5" r="0.5" fill="#FF4444" />
        </g>
      )}

      {/* Eyes */}
      <BlobbiEyes mood={mood} />

      {/* Cheeks */}
      {stageFeatures.hasCheeks && (
        <g>
          <circle cx="4.5" cy="8" r="1" fill={cheekColor} opacity="0.5" />
          <circle cx="11.5" cy="8" r="1" fill={cheekColor} opacity="0.5" />
        </g>
      )}

      {/* Mouth */}
      <BlobbiMouth mood={mood} />
    </svg>
  );
}

/** Eyes component — pure rendering */
function BlobbiEyes({ mood }: { mood: BlobbiMood }) {
  switch (mood) {
    case 'ecstatic':
      return (
        <g>
          <path d="M5 6 Q6 5 7 6" stroke="#333" strokeWidth="0.6" fill="none" />
          <path d="M9 6 Q10 5 11 6" stroke="#333" strokeWidth="0.6" fill="none" />
        </g>
      );
    case 'happy':
      return (
        <g>
          <circle cx="6" cy="6" r="1" fill="#333" />
          <circle cx="10" cy="6" r="1" fill="#333" />
          <circle cx="6.3" cy="5.7" r="0.3" fill="#fff" />
          <circle cx="10.3" cy="5.7" r="0.3" fill="#fff" />
        </g>
      );
    case 'sad':
      return (
        <g>
          <circle cx="6" cy="6.5" r="1" fill="#333" />
          <circle cx="10" cy="6.5" r="1" fill="#333" />
          <circle cx="6.3" cy="6.2" r="0.3" fill="#fff" />
          <circle cx="10.3" cy="6.2" r="0.3" fill="#fff" />
          <circle cx="7.5" cy="8" r="0.4" fill="#66b3ff" />
        </g>
      );
    case 'hungry':
      return (
        <g>
          <circle cx="6" cy="6" r="1.2" fill="#333" />
          <circle cx="10" cy="6" r="1.2" fill="#333" />
          <circle cx="6.4" cy="5.6" r="0.4" fill="#fff" />
          <circle cx="10.4" cy="5.6" r="0.4" fill="#fff" />
        </g>
      );
    case 'bored':
      return (
        <g>
          <line x1="5" y1="6" x2="7" y2="6.3" stroke="#333" strokeWidth="0.6" />
          <line x1="9" y1="6.3" x2="11" y2="6" stroke="#333" strokeWidth="0.6" />
        </g>
      );
    default: // content
      return (
        <g>
          <circle cx="6" cy="6" r="0.8" fill="#333" />
          <circle cx="10" cy="6" r="0.8" fill="#333" />
          <circle cx="6.2" cy="5.8" r="0.25" fill="#fff" />
          <circle cx="10.2" cy="5.8" r="0.25" fill="#fff" />
        </g>
      );
  }
}

/** Mouth component — pure rendering */
function BlobbiMouth({ mood }: { mood: BlobbiMood }) {
  switch (mood) {
    case 'ecstatic':
      return <path d="M6 9 Q8 11 10 9" stroke="#333" strokeWidth="0.5" fill="#FF6B8A" />;
    case 'happy':
      return <path d="M6.5 9 Q8 10.5 9.5 9" stroke="#333" strokeWidth="0.5" fill="none" />;
    case 'sad':
      return <path d="M6.5 10 Q8 8.5 9.5 10" stroke="#333" strokeWidth="0.5" fill="none" />;
    case 'hungry':
      return <ellipse cx="8" cy="9.5" rx="1" ry="1.2" fill="#333" />;
    case 'bored':
      return <line x1="7" y1="9.5" x2="9" y2="9.5" stroke="#333" strokeWidth="0.5" />;
    default:
      return <path d="M7 9 Q8 10 9 9" stroke="#333" strokeWidth="0.5" fill="none" />;
  }
}
