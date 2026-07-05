import { useState, useRef, useEffect } from 'react';
import { useNostr } from '@nostrify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useAuthor } from '@/hooks/useAuthor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Send, MessageCircle } from 'lucide-react';

interface ChatPanelProps {
  className?: string;
}

/**
 * In-game chat panel using kind 1 notes tagged with #blobbichat.
 * This creates a public game chat that's transparent and discoverable,
 * while keeping it scoped to Blobbi Buddies interactions.
 *
 * For private DMs, users should use a dedicated chat client like Lief
 * which supports NIP-17 gift-wrapped messages.
 */
export function ChatPanel({ className }: ChatPanelProps) {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch recent game chat messages
  const { data: messages = [], isLoading } = useQuery<NostrEvent[]>({
    queryKey: ['blobbi-buddies', 'chat'],
    queryFn: async (c) => {
      return nostr.query(
        [{
          kinds: [1],
          '#t': ['blobbichat'],
          limit: 50,
        }],
        { signal: c.signal },
      );
    },
    staleTime: 10_000,
    refetchInterval: 15_000,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!message.trim() || !user || isSending) return;

    setIsSending(true);
    try {
      await publishEvent({
        kind: 1,
        content: message.trim(),
        tags: [
          ['t', 'blobbichat'],
        ],
      });
      setMessage('');
      await queryClient.invalidateQueries({ queryKey: ['blobbi-buddies', 'chat'] });
    } finally {
      setIsSending(false);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => a.created_at - b.created_at);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center gap-2 pb-2 border-b">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Game Chat</h3>
        <span className="text-[10px] text-muted-foreground">({messages.length})</span>
      </div>

      <ScrollArea className="flex-1 py-2" ref={scrollRef}>
        <div className="space-y-2 pr-2">
          {isLoading ? (
            <p className="text-xs text-muted-foreground text-center py-4">Loading chat...</p>
          ) : sortedMessages.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No messages yet. Say hello! 👋
            </p>
          ) : (
            sortedMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                event={msg}
                isOwn={msg.pubkey === user?.pubkey}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {user ? (
        <div className="flex items-center gap-2 pt-2 border-t">
          <Input
            placeholder="Say something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="h-8 text-sm rounded-lg"
            disabled={isSending}
          />
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-lg flex-shrink-0"
            onClick={handleSend}
            disabled={!message.trim() || isSending}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2 border-t">
          Log in to chat
        </p>
      )}
    </div>
  );
}

function ChatMessage({ event, isOwn }: { event: NostrEvent; isOwn: boolean }) {
  const author = useAuthor(event.pubkey);
  const name = author.data?.metadata?.name ?? event.pubkey.slice(0, 8);
  const picture = author.data?.metadata?.picture;

  return (
    <div className={cn(
      'flex items-start gap-1.5',
      isOwn && 'flex-row-reverse',
    )}>
      <Avatar size="sm" className="mt-0.5 flex-shrink-0">
        {picture && <AvatarImage src={picture} alt={name} />}
        <AvatarFallback className="text-[10px]">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        'max-w-[75%] rounded-xl px-2.5 py-1.5',
        isOwn
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted rounded-tl-sm',
      )}>
        {!isOwn && (
          <p className="text-[10px] font-medium opacity-70 mb-0.5">{name}</p>
        )}
        <p className="text-sm leading-snug break-words">{event.content}</p>
      </div>
    </div>
  );
}
