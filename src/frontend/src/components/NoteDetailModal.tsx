import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Note } from '../backend';

interface NoteDetailModalProps {
  note: Note;
  onClose: () => void;
}

export default function NoteDetailModal({ note, onClose }: NoteDetailModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{note.title}</DialogTitle>
          <DialogDescription>{note.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{note.content}</div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
