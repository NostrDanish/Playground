import { useState, useRef, useCallback } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useBlobbiState } from '@/hooks/useBlobbiState';
import { useBlobbiActions } from '@/hooks/useBlobbiActions';
import { useAuthor } from '@/hooks/useAuthor';
import { BlobbiCreature } from './BlobbiCreature';
import { SceneBackground } from './SceneBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PHOTO_DATE_SCENES, KIND_BLOBBI_ACTION, type SceneType } from '@/lib/gameTypes';
import { cn } from '@/lib/utils';
import { nip19 } from 'nostr-tools';
import { Camera, Image as ImageIcon, Loader2, Upload } from 'lucide-react';

interface PhotoDateProps {
  className?: string;
}

export function PhotoDate({ className }: PhotoDateProps) {
  const { user } = useCurrentUser();
  const { companion } = useBlobbiState();
  const [showScenePicker, setShowScenePicker] = useState(false);
  const [selectedScene, setSelectedScene] = useState<SceneType>('park');
  const [friendNpub, setFriendNpub] = useState('');
  const [friendPubkey, setFriendPubkey] = useState<string | null>(null);
  const [photoMode, setPhotoMode] = useState(false);
  const [npubError, setNpubError] = useState('');

  const handleStartDate = () => {
    if (!friendNpub.trim()) {
      setNpubError('Enter your friend\'s npub');
      return;
    }
    try {
      const decoded = nip19.decode(friendNpub.trim());
      if (decoded.type === 'npub') {
        setFriendPubkey(decoded.data);
      } else if (decoded.type === 'nprofile') {
        setFriendPubkey(decoded.data.pubkey);
      } else {
        setNpubError('Invalid npub');
        return;
      }
      setPhotoMode(true);
      setShowScenePicker(false);
    } catch {
      setNpubError('Invalid npub format');
    }
  };

  if (!user) {
    return (
      <div className={cn('text-center py-6', className)}>
        <p className="text-sm text-muted-foreground">Log in to take photos!</p>
      </div>
    );
  }

  if (photoMode && friendPubkey) {
    return (
      <PhotoDateView
        friendPubkey={friendPubkey}
        scene={selectedScene}
        onBack={() => {
          setPhotoMode(false);
          setFriendPubkey(null);
          setFriendNpub('');
        }}
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Camera className="h-4 w-4" />
          Photo Dates
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs rounded-lg"
          onClick={() => setShowScenePicker(true)}
        >
          + New Photo
        </Button>
      </div>

      {/* Photo gallery */}
      {(companion.photos?.length ?? 0) > 0 ? (
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-2 gap-2 pr-3">
            {(companion.photos ?? []).map((url, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden border-2 border-border bg-muted"
              >
                <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-6 rounded-xl border border-dashed">
          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">
            No photos yet! Take your first date photo.
          </p>
        </div>
      )}

      {/* Scene picker dialog */}
      <Dialog open={showScenePicker} onOpenChange={setShowScenePicker}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" /> Photo Date
            </DialogTitle>
            <DialogDescription>
              Pick a scene and invite a friend for a photo!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {PHOTO_DATE_SCENES.map((s) => (
                <button
                  key={s.id}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-center',
                    selectedScene === s.scene
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30',
                  )}
                  onClick={() => setSelectedScene(s.scene)}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-[10px] font-medium">{s.label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Friend&apos;s npub
              </label>
              <Input
                placeholder="npub1..."
                value={friendNpub}
                onChange={(e) => {
                  setFriendNpub(e.target.value);
                  setNpubError('');
                }}
                className="text-sm"
              />
              {npubError && (
                <p className="text-xs text-destructive mt-1">{npubError}</p>
              )}
            </div>

            <Button onClick={handleStartDate} className="w-full rounded-xl">
              Start Photo Date 📸
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PhotoDateView({
  friendPubkey,
  scene,
  onBack,
  className,
}: {
  friendPubkey: string;
  scene: SceneType;
  onBack: () => void;
  className?: string;
}) {
  const { user } = useCurrentUser();
  const { computed } = useBlobbiState();
  const { companion, computed: friendComputed } = useBlobbiState(friendPubkey);
  const { publishCompanionState } = useBlobbiActions();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const friendAuthor = useAuthor(friendPubkey);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);

  const friendName = friendAuthor.data?.metadata?.name ?? friendPubkey.slice(0, 8);

  const handleUploadPhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const tags = await uploadFile(file);
      const url = tags[0][1];
      setLastUploadedUrl(url);

      // Save to companion state
      const updatedPhotos = [...(companion.photos ?? []), url];
      await publishCompanionState({
        ...companion,
        photos: updatedPhotos,
        xp: (companion.xp ?? 0) + 20,
      });

      // Publish as action note
      const imeta = tags.map(([name, value]) => `${name} ${value}`);
      await publishEvent({
        kind: KIND_BLOBBI_ACTION,
        content: `📸 Took a photo date with ${friendName}'s Blobbi! ${url}`,
        tags: [
          ['t', 'blobbi-photo'],
          ['p', friendPubkey],
          ['alt', 'Blobbi Buddies photo date'],
          ['imeta', ...imeta],
        ],
      });
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }, [user, companion, friendPubkey, friendName, uploadFile, publishEvent, publishCompanionState]);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={onBack}>
          ← Back
        </Button>
        <Badge variant="secondary" className="text-[10px]">
          📸 Photo Date with {friendName}
        </Badge>
      </div>

      {/* Photo scene with both Blobbis */}
      <SceneBackground scene={scene}>
        <div className="flex items-end justify-center gap-4 py-8 pb-12 px-4">
          <div className="text-center">
            <BlobbiCreature
              stage={computed.stage}
              mood="happy"
              currentAction={null}
              className="w-20 h-20"
            />
            <p className="text-[10px] mt-1 font-medium bg-white/70 dark:bg-black/40 rounded-full px-2 inline-block">
              You
            </p>
          </div>

          <div className="text-2xl mb-4">❤️</div>

          <div className="text-center">
            <BlobbiCreature
              stage={friendComputed.stage}
              mood="happy"
              currentAction={null}
              className="w-20 h-20"
            />
            <p className="text-[10px] mt-1 font-medium bg-white/70 dark:bg-black/40 rounded-full px-2 inline-block">
              {friendName}
            </p>
          </div>
        </div>
      </SceneBackground>

      {/* Upload real photo or use the scene as-is */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadPhoto}
        />

        <Button
          className="w-full rounded-xl gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="h-4 w-4" /> Upload a Real Photo</>
          )}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Upload a photo of your pets together, a dinner, a walk — anything fun!
        </p>
      </div>

      {/* Last uploaded photo */}
      {lastUploadedUrl && (
        <div className="rounded-xl overflow-hidden border-2 border-primary/30">
          <img src={lastUploadedUrl} alt="Photo date" className="w-full h-48 object-cover" />
          <div className="p-2 bg-card text-center">
            <p className="text-xs text-muted-foreground">Photo saved to your gallery! 📸</p>
          </div>
        </div>
      )}
    </div>
  );
}
