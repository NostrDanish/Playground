import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MINI_GAMES, type MiniGameType } from '@/lib/gameTypes';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';

interface MiniGamesProps {
  onWin?: () => void;
  className?: string;
}

export function MiniGames({ onWin, className }: MiniGamesProps) {
  const [activeGame, setActiveGame] = useState<MiniGameType | null>(null);

  if (activeGame === 'memory') {
    return <MemoryGame onBack={() => setActiveGame(null)} onWin={onWin} />;
  }
  if (activeGame === 'color-match') {
    return <ColorMatchGame onBack={() => setActiveGame(null)} onWin={onWin} />;
  }
  if (activeGame === 'feed-sequence') {
    return <FeedSequenceGame onBack={() => setActiveGame(null)} onWin={onWin} />;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-semibold flex items-center gap-1.5">
        <Trophy className="h-4 w-4 text-yellow-500" />
        Mini Games
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {MINI_GAMES.map((game) => (
          <button
            key={game.type}
            className="flex items-center gap-3 p-3 rounded-xl border-2 bg-card/50 hover:border-primary/40 transition-all text-left"
            onClick={() => setActiveGame(game.type)}
          >
            <span className="text-2xl">{game.emoji}</span>
            <div>
              <p className="text-sm font-medium">{game.label}</p>
              <p className="text-[10px] text-muted-foreground">{game.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Memory Match ───────────────────────────────────────────────
const MEMORY_EMOJIS = ['🍎', '🎾', '🫧', '💤', '🌟', '💎', '🦋', '🌻'];

function MemoryGame({ onBack, onWin }: { onBack: () => void; onWin?: () => void }) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const lockRef = useRef(false);

  const initGame = useCallback(() => {
    const pairs = MEMORY_EMOJIS.slice(0, 6);
    const deck = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setWon(false);
    lockRef.current = false;
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleFlip = (index: number) => {
    if (lockRef.current || flipped.includes(index) || matched.has(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);

      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        const newMatched = new Set(matched);
        newMatched.add(newFlipped[0]);
        newMatched.add(newFlipped[1]);
        setMatched(newMatched);
        setFlipped([]);
        lockRef.current = false;

        if (newMatched.size === cards.length) {
          setWon(true);
          onWin?.();
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-7 gap-1">
          <ArrowLeft className="h-3 w-3" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">Moves: {moves}</Badge>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={initGame}>
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {won ? (
        <div className="text-center py-6 space-y-2">
          <div className="text-4xl">🎉</div>
          <p className="font-bold">You won in {moves} moves!</p>
          <p className="text-sm text-muted-foreground">+15 XP earned!</p>
          <Button onClick={initGame} className="rounded-xl mt-2">Play Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5">
          {cards.map((emoji, i) => {
            const isFlipped = flipped.includes(i) || matched.has(i);
            return (
              <button
                key={i}
                className={cn(
                  'aspect-square rounded-lg border-2 flex items-center justify-center text-xl transition-all duration-300',
                  isFlipped
                    ? 'bg-card border-primary/40 scale-100'
                    : 'bg-primary/10 border-primary/20 hover:border-primary/40 hover:scale-105',
                  matched.has(i) && 'bg-accent/30 border-accent-foreground/30',
                )}
                onClick={() => handleFlip(i)}
              >
                {isFlipped ? emoji : '❓'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Color Match ────────────────────────────────────────────────
const COLORS = [
  { name: 'Red', bg: 'bg-red-400 dark:bg-red-500', emoji: '🔴' },
  { name: 'Blue', bg: 'bg-blue-400 dark:bg-blue-500', emoji: '🔵' },
  { name: 'Green', bg: 'bg-green-400 dark:bg-green-500', emoji: '🟢' },
  { name: 'Yellow', bg: 'bg-yellow-400 dark:bg-yellow-500', emoji: '🟡' },
  { name: 'Purple', bg: 'bg-purple-400 dark:bg-purple-500', emoji: '🟣' },
  { name: 'Orange', bg: 'bg-orange-400 dark:bg-orange-500', emoji: '🟠' },
];

function ColorMatchGame({ onBack, onWin }: { onBack: () => void; onWin?: () => void }) {
  const [score, setScore] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [options, setOptions] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const newRound = useCallback(() => {
    const target = Math.floor(Math.random() * COLORS.length);
    const opts = new Set([target]);
    while (opts.size < 4) {
      opts.add(Math.floor(Math.random() * COLORS.length));
    }
    setTargetIndex(target);
    setOptions([...opts].sort(() => Math.random() - 0.5));
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    newRound();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [newRound]);

  useEffect(() => { startGame(); return () => clearInterval(timerRef.current); }, [startGame]);

  const handlePick = (colorIdx: number) => {
    if (gameOver) return;
    if (colorIdx === targetIndex) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= 8) {
        clearInterval(timerRef.current);
        setGameOver(true);
        onWin?.();
      } else {
        newRound();
      }
    } else {
      setTimeLeft(t => Math.max(0, t - 2));
    }
  };

  const won = gameOver && score >= 8;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-7 gap-1">
          <ArrowLeft className="h-3 w-3" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">Score: {score}/8</Badge>
          <Badge variant={timeLeft <= 5 ? 'destructive' : 'outline'} className="text-[10px] tabular-nums">
            {timeLeft}s
          </Badge>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center py-6 space-y-2">
          <div className="text-4xl">{won ? '🎉' : '⏰'}</div>
          <p className="font-bold">{won ? `Amazing! ${score} colors matched!` : `Time's up! Score: ${score}`}</p>
          {won && <p className="text-sm text-muted-foreground">+15 XP earned!</p>}
          <Button onClick={startGame} className="rounded-xl mt-2">Play Again</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">Tap the matching color:</p>
            <div className={cn(
              'inline-block w-16 h-16 rounded-2xl',
              COLORS[targetIndex].bg,
            )} />
            <p className="text-xs font-medium mt-2">{COLORS[targetIndex].name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {options.map((colorIdx) => (
              <button
                key={colorIdx}
                className={cn(
                  'h-14 rounded-xl transition-all active:scale-95',
                  COLORS[colorIdx].bg,
                  'hover:opacity-90',
                )}
                onClick={() => handlePick(colorIdx)}
              >
                <span className="text-white font-medium text-sm drop-shadow">{COLORS[colorIdx].name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Feed Sequence ──────────────────────────────────────────────
const FOOD_EMOJIS = ['🍎', '🍌', '🥕', '🍇', '🍓', '🥦'];

function FeedSequenceGame({ onBack, onWin }: { onBack: () => void; onWin?: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [showIndex, setShowIndex] = useState(-1);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const startNewRound = useCallback((prevSequence: number[] = []) => {
    const next = Math.floor(Math.random() * FOOD_EMOJIS.length);
    const newSequence = [...prevSequence, next];
    setSequence(newSequence);
    setPlayerInput([]);
    setIsShowing(true);

    // Show each item in sequence
    newSequence.forEach((_, i) => {
      setTimeout(() => setShowIndex(i), (i + 1) * 600);
    });
    setTimeout(() => {
      setShowIndex(-1);
      setIsShowing(false);
    }, (newSequence.length + 1) * 600);
  }, []);

  useEffect(() => { startNewRound(); }, [startNewRound]);

  const handlePick = (foodIdx: number) => {
    if (isShowing || gameOver) return;

    const newInput = [...playerInput, foodIdx];
    setPlayerInput(newInput);

    const currentPos = newInput.length - 1;
    if (newInput[currentPos] !== sequence[currentPos]) {
      setGameOver(true);
      return;
    }

    if (newInput.length === sequence.length) {
      const newRound = round + 1;
      setRound(newRound);

      if (newRound >= 5) {
        setWon(true);
        setGameOver(true);
        onWin?.();
      } else {
        setTimeout(() => startNewRound(sequence), 500);
      }
    }
  };

  const restart = () => {
    setRound(0);
    setGameOver(false);
    setWon(false);
    startNewRound([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-7 gap-1">
          <ArrowLeft className="h-3 w-3" /> Back
        </Button>
        <Badge variant="secondary" className="text-[10px]">Round: {round + 1}/5</Badge>
      </div>

      {gameOver ? (
        <div className="text-center py-6 space-y-2">
          <div className="text-4xl">{won ? '🎉' : '😅'}</div>
          <p className="font-bold">{won ? 'Perfect memory!' : `Made it to round ${round + 1}!`}</p>
          {won && <p className="text-sm text-muted-foreground">+15 XP earned!</p>}
          <Button onClick={restart} className="rounded-xl mt-2">Play Again</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isShowing ? 'Watch the sequence...' : 'Repeat it!'}
            </p>
            <div className="flex justify-center gap-1 mt-2 min-h-[32px]">
              {sequence.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm transition-all',
                    showIndex === i
                      ? 'border-primary bg-primary/20 scale-110'
                      : i < playerInput.length
                        ? 'border-accent-foreground/30 bg-accent/30'
                        : 'border-muted bg-muted/30',
                  )}
                >
                  {(showIndex === i || i < playerInput.length)
                    ? FOOD_EMOJIS[sequence[i]]
                    : '•'
                  }
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {FOOD_EMOJIS.map((emoji, i) => (
              <button
                key={i}
                className={cn(
                  'h-14 rounded-xl border-2 flex items-center justify-center text-2xl transition-all',
                  isShowing
                    ? 'opacity-50 pointer-events-none border-muted'
                    : 'border-border hover:border-primary/40 active:scale-95',
                )}
                onClick={() => handlePick(i)}
                disabled={isShowing}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
