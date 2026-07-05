import { useState, useCallback } from 'react';
import { useSeoMeta } from '@unhead/react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useBlobbiState } from '@/hooks/useBlobbiState';
import { useBlobbiActions } from '@/hooks/useBlobbiActions';
import { useBlobbiActivity } from '@/hooks/useBlobbiActivity';
import { useBlobbiRoster } from '@/hooks/useBlobbiRoster';

import { GameHeader } from '@/components/game/GameHeader';
import { BlobbiCreature } from '@/components/game/BlobbiCreature';
import { BlobbiSwitcher } from '@/components/game/BlobbiSwitcher';
import { SceneBackground } from '@/components/game/SceneBackground';
import { StatBar } from '@/components/game/StatBar';
import { ActionButtons } from '@/components/game/ActionButtons';
import { ActivityFeed } from '@/components/game/ActivityFeed';
import { FriendsList } from '@/components/game/FriendsList';
import { CoopTaskPanel } from '@/components/game/CoopTaskPanel';
import { ChatPanel } from '@/components/game/ChatPanel';
import { VisitFriend } from '@/components/game/VisitFriend';
import { DailyTasks } from '@/components/game/DailyTasks';
import { MiniGames } from '@/components/game/MiniGames';
import { PhotoDate } from '@/components/game/PhotoDate';
import { LoginArea } from '@/components/auth/LoginArea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user } = useCurrentUser();
  const { activeBlobbi, activeDtag } = useBlobbiRoster();

  // Pass the active Blobbi's d-tag, name, and color into the state + actions hooks
  const { companion, computed, isLoading: stateLoading } = useBlobbiState(
    undefined, activeDtag, activeBlobbi.name, activeBlobbi.color,
  );
  const { performAction, publishCompanionState, isPerforming, lastAction } = useBlobbiActions(
    activeDtag, activeBlobbi.name,
  );
  const { data: activities = [], isLoading: activityLoading } = useBlobbiActivity(user?.pubkey);

  const [visitingFriend, setVisitingFriend] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('daily');

  useSeoMeta({
    title: 'Blobbi Buddies — Nostr Pet Game',
    description: 'A Tamagotchi-style cooperative pet game on Nostr. Care for your Blobbi solo or with friends!',
  });

  const handlePuzzleWin = useCallback(async () => {
    if (!user) return;
    await publishCompanionState({
      ...companion,
      xp: (companion.xp ?? 0) + 15,
      puzzleWins: (companion.puzzleWins ?? 0) + 1,
      dailyProgress: {
        ...companion.dailyProgress,
        'puzzle-win': (companion.dailyProgress['puzzle-win'] ?? 0) + 1,
      },
    });
  }, [user, companion, publishCompanionState]);

  // Visiting friend view
  if (visitingFriend) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <GameHeader
          stage={computed.stage}
          totalCare={computed.totalCare}
          level={computed.level}
          xp={computed.xp}
          streak={computed.streak}
        />
        <div className="flex-1 max-w-lg mx-auto w-full p-4">
          <VisitFriend
            friendPubkey={visitingFriend}
            onBack={() => setVisitingFriend(null)}
          />
        </div>
      </div>
    );
  }

  const xpInLevel = computed.xp % 50;
  const xpNeeded = 50;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader
        stage={computed.stage}
        totalCare={computed.totalCare}
        level={computed.level}
        xp={computed.xp}
        streak={computed.streak}
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4">
        {/* Welcome state for logged-out users */}
        {!user && <WelcomeCard />}

        {/* Blobbi switcher — pick which Blobbi to play with */}
        {user && <BlobbiSwitcher />}

        {/* Pet display area with scene */}
        <SceneBackground scene="park">
          <div className="flex items-center justify-center py-8 pb-12">
            {stateLoading ? (
              <Skeleton className="w-28 h-28 rounded-full" />
            ) : (
              <BlobbiCreature
                stage={computed.stage}
                mood={computed.mood}
                currentAction={lastAction}
                color={activeBlobbi.color}
                className="w-36 h-36"
              />
            )}
          </div>

          {/* Name plate with level */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full px-3 py-0.5 flex items-center gap-2">
              <span className="text-xs font-semibold">{computed.name}</span>
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-white/50 dark:bg-black/30">
                Lv.{computed.level}
              </Badge>
            </div>
          </div>
        </SceneBackground>

        {/* XP Bar */}
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-6">XP</span>
            <Progress value={(xpInLevel / xpNeeded) * 100} className="h-1.5 flex-1" />
            <span className="text-[10px] text-muted-foreground tabular-nums w-10 text-right">
              {xpInLevel}/{xpNeeded}
            </span>
          </div>
        )}

        {/* Stats */}
        <Card className="border-2 rounded-2xl shadow-none">
          <CardContent className="space-y-2 pb-4 pt-4">
            <StatBar label="Hunger" value={computed.hunger} icon="🍎" color="bg-orange-400" />
            <StatBar label="Happiness" value={computed.happiness} icon="😊" color="bg-pink-400" />
            <StatBar label="Cleanliness" value={computed.cleanliness} icon="🫧" color="bg-blue-400" />
            <StatBar label="Energy" value={computed.energy} icon="⚡" color="bg-yellow-400" />
          </CardContent>
        </Card>

        {/* Action buttons */}
        {user && (
          <ActionButtons
            onAction={performAction}
            isPerforming={isPerforming}
          />
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-6">
            <TabsTrigger value="daily" className="text-[10px] px-1">
              ⭐ Daily
            </TabsTrigger>
            <TabsTrigger value="games" className="text-[10px] px-1">
              🎮 Games
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-[10px] px-1">
              📸 Photos
            </TabsTrigger>
            <TabsTrigger value="coop" className="text-[10px] px-1">
              🤝 Co-op
            </TabsTrigger>
            <TabsTrigger value="friends" className="text-[10px] px-1">
              👫 Pals
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-[10px] px-1">
              💬 Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <Card className="border-2 rounded-2xl shadow-none">
              <CardContent className="pt-4 pb-4">
                <DailyTasks />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games">
            <Card className="border-2 rounded-2xl shadow-none">
              <CardContent className="pt-4 pb-4">
                <MiniGames onWin={handlePuzzleWin} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="border-2 rounded-2xl shadow-none">
              <CardContent className="pt-4 pb-4">
                <PhotoDate />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coop">
            <Card className="border-2 rounded-2xl shadow-none">
              <CardContent className="pt-4 pb-4">
                <CoopTaskPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card className="border-2 rounded-2xl shadow-none">
              <CardContent className="pt-4 pb-4">
                <FriendsList
                  onVisitFriend={(pubkey) => setVisitingFriend(pubkey)}
                />
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Recent Activity</h4>
                  <ActivityFeed events={activities} isLoading={activityLoading} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="border-2 rounded-2xl shadow-none h-[360px]">
              <CardContent className="pt-4 pb-4 h-full">
                <ChatPanel className="h-full" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center py-4 space-y-1">
          <p className="text-[10px] text-muted-foreground">
            All actions are published to Nostr relays.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Vibed with{' '}
            <a
              href="https://shakespeare.diy"
              className="underline hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shakespeare
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

function WelcomeCard() {
  return (
    <Card className="border-2 border-dashed border-primary/30 rounded-2xl shadow-none bg-primary/5">
      <CardContent className="py-6 text-center space-y-3">
        <div className="text-4xl">🐾</div>
        <div>
          <h2 className="text-lg font-bold">Welcome to Blobbi Buddies!</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            A Tamagotchi-style pet game on Nostr. Care for your Blobbi, play mini-games, take photos with friends, and complete daily tasks!
          </p>
        </div>
        <LoginArea className="max-w-60 mx-auto" />
      </CardContent>
    </Card>
  );
}

export default Index;
