import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useBlobbiState } from '@/hooks/useBlobbiState';
import { useBlobbiActions } from '@/hooks/useBlobbiActions';
import { useBlobbiActivity } from '@/hooks/useBlobbiActivity';

import { GameHeader } from '@/components/game/GameHeader';
import { BlobbiCreature } from '@/components/game/BlobbiCreature';
import { StatBar } from '@/components/game/StatBar';
import { ActionButtons } from '@/components/game/ActionButtons';
import { ActivityFeed } from '@/components/game/ActivityFeed';
import { FriendsList } from '@/components/game/FriendsList';
import { CoopTaskPanel } from '@/components/game/CoopTaskPanel';
import { ChatPanel } from '@/components/game/ChatPanel';
import { VisitFriend } from '@/components/game/VisitFriend';
import { LoginArea } from '@/components/auth/LoginArea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const Index = () => {
  const { user } = useCurrentUser();
  const { computed, isLoading: stateLoading } = useBlobbiState();
  const { performAction, isPerforming, lastAction } = useBlobbiActions();
  const { data: activities = [], isLoading: activityLoading } = useBlobbiActivity(user?.pubkey);

  const [visitingFriend, setVisitingFriend] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pet');

  useSeoMeta({
    title: 'Blobbi Buddies — Nostr Pet Game',
    description: 'A Tamagotchi-style cooperative pet game on Nostr. Care for your Blobbi solo or with friends!',
  });

  // If visiting a friend, show that view
  if (visitingFriend) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <GameHeader stage={computed.stage} totalCare={computed.totalCare} />
        <div className="flex-1 max-w-lg mx-auto w-full p-4">
          <VisitFriend
            friendPubkey={visitingFriend}
            onBack={() => setVisitingFriend(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader stage={computed.stage} totalCare={computed.totalCare} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4">
        {/* Welcome state for logged-out users */}
        {!user && (
          <WelcomeCard />
        )}

        {/* Pet display area */}
        <div className="relative">
          {/* Background scene */}
          <div className={cn(
            'rounded-2xl overflow-hidden relative',
            'bg-gradient-to-b from-sky-100 via-sky-50 to-green-100',
            'dark:from-indigo-950 dark:via-purple-950 dark:to-emerald-950',
          )}>
            {/* Clouds */}
            <div className="absolute top-3 left-4 text-white/40 dark:text-white/10 text-lg">☁️</div>
            <div className="absolute top-6 right-8 text-white/30 dark:text-white/8 text-sm">☁️</div>

            {/* Ground */}
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-green-200/60 to-transparent dark:from-emerald-900/40" />
            <div className="absolute bottom-1 left-6 text-green-600/30 dark:text-green-400/20 text-xs">🌿</div>
            <div className="absolute bottom-2 right-10 text-green-600/30 dark:text-green-400/20 text-xs">🌱</div>
            <div className="absolute bottom-1 left-1/2 text-green-600/20 dark:text-green-400/15 text-[10px]">🌼</div>

            {/* Blobbi */}
            <div className="flex items-center justify-center py-8 pb-12">
              {stateLoading ? (
                <Skeleton className="w-28 h-28 rounded-full" />
              ) : (
                <BlobbiCreature
                  stage={computed.stage}
                  mood={computed.mood}
                  currentAction={lastAction}
                  className="w-36 h-36"
                />
              )}
            </div>

            {/* Name plate */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full px-3 py-0.5">
                <span className="text-xs font-semibold">{computed.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card className="border-2 rounded-2xl shadow-none">
          <CardContent className="space-y-2 pb-4 pt-4">
            <StatBar label="Hunger" value={computed.hunger} icon="🍎" color="bg-orange-400" />
            <StatBar label="Happiness" value={computed.happiness} icon="😊" color="bg-pink-400" />
            <StatBar label="Cleanliness" value={computed.cleanliness} icon="🫧" color="bg-blue-400" />
            <StatBar label="Energy" value={computed.energy} icon="⚡" color="bg-yellow-400" />
          </CardContent>
        </Card>

        {/* Action buttons (only when logged in) */}
        {user && (
          <ActionButtons
            onAction={performAction}
            isPerforming={isPerforming}
          />
        )}

        {/* Tabs for different panels */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="pet" className="flex-1 text-xs">
              📋 Activity
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex-1 text-xs">
              👫 Friends
            </TabsTrigger>
            <TabsTrigger value="coop" className="flex-1 text-xs">
              🤝 Co-op
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 text-xs">
              💬 Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pet">
            <Card className="border-2 rounded-2xl shadow-none">
              <CardContent className="pt-4 pb-4">
                <ActivityFeed events={activities} isLoading={activityLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card className="border-2 rounded-2xl shadow-none">
              <CardContent className="pt-4 pb-4">
                <FriendsList
                  onVisitFriend={(pubkey) => setVisitingFriend(pubkey)}
                />
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
            A Tamagotchi-style pet game on Nostr. Log in to start caring for your Blobbi!
          </p>
        </div>
        <LoginArea className="max-w-60 mx-auto" />
      </CardContent>
    </Card>
  );
}

export default Index;
