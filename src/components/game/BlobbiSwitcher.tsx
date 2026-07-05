import { useState } from 'react';
import { useBlobbiRoster, type RosterBlobbi } from '@/hooks/useBlobbiRoster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';

interface BlobbiSwitcherProps {
  className?: string;
}

export function BlobbiSwitcher({ className }: BlobbiSwitcherProps) {
  const {
    roster,
    activeBlobbi,
    switchBlobbi,
    addBlobbi,
    renameBlobbi,
    recolorBlobbi,
    removeBlobbi,
    defaultColors,
  } = useBlobbiRoster();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<RosterBlobbi | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(defaultColors[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addBlobbi(newName.trim(), newColor);
    setNewName('');
    setShowAddDialog(false);
  };

  const handleEdit = (blobbi: RosterBlobbi) => {
    setEditTarget(blobbi);
    setNewName(blobbi.name);
    setNewColor(blobbi.color);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editTarget || !newName.trim()) return;
    renameBlobbi(editTarget.id, newName.trim());
    recolorBlobbi(editTarget.id, newColor);
    setShowEditDialog(false);
    setEditTarget(null);
  };

  const handleRemove = () => {
    if (!editTarget) return;
    removeBlobbi(editTarget.id);
    setShowEditDialog(false);
    setEditTarget(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Blobbi roster row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {roster.blobbis.map((b) => (
          <button
            key={b.id}
            className={cn(
              'flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 transition-all',
              b.id === activeBlobbi.id
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted/50',
            )}
            onClick={() => switchBlobbi(b.id)}
            onDoubleClick={() => handleEdit(b)}
            title={`Switch to ${b.name} (double-click to edit)`}
          >
            <div
              className="w-5 h-5 rounded-full border border-white/30 shadow-sm flex-shrink-0"
              style={{ backgroundColor: b.color }}
            />
            <span className={cn(
              'text-xs font-medium truncate max-w-[72px]',
              b.id === activeBlobbi.id ? 'text-foreground' : 'text-muted-foreground',
            )}>
              {b.name}
            </span>
            {b.id === activeBlobbi.id && (
              <Check className="h-3 w-3 text-primary flex-shrink-0" />
            )}
          </button>
        ))}

        {/* Add button */}
        <button
          className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
          onClick={() => {
            setNewName('');
            setNewColor(defaultColors[roster.blobbis.length % defaultColors.length]);
            setShowAddDialog(true);
          }}
          title="Add a new Blobbi"
        >
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Add Blobbi dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>New Blobbi! 🐾</DialogTitle>
            <DialogDescription>
              Give your new buddy a name and pick a color.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Name your Blobbi..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-sm"
              maxLength={20}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">Color</p>
              <div className="flex flex-wrap gap-2">
                {defaultColors.map((c) => (
                  <button
                    key={c}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                      newColor === c ? 'border-foreground scale-110 shadow-md' : 'border-transparent',
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setNewColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="w-full rounded-xl"
            >
              Create {newName.trim() || 'Blobbi'} ✨
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Blobbi dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Edit Blobbi
            </DialogTitle>
            <DialogDescription>
              Rename, recolor, or remove this Blobbi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Blobbi name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-sm"
              maxLength={20}
              autoFocus
            />

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">Color</p>
              <div className="flex flex-wrap gap-2">
                {defaultColors.map((c) => (
                  <button
                    key={c}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                      newColor === c ? 'border-foreground scale-110 shadow-md' : 'border-transparent',
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setNewColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2">
            {roster.blobbis.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl gap-1"
                onClick={handleRemove}
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </Button>
            )}
            <Button
              onClick={handleSaveEdit}
              disabled={!newName.trim()}
              className="flex-1 rounded-xl"
            >
              Save ✓
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
