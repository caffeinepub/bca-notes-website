import { useState } from 'react';
import { useCreateNote, useUpdateNote } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Note } from '../../backend';

interface NoteFormProps {
  note: Note | null;
  onClose: () => void;
}

export default function NoteForm({ note, onClose }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [content, setContent] = useState(note?.content || '');

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  const isEditing = !!note;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (isEditing) {
        await updateNote.mutateAsync({ id: note.id, title, description, content });
        toast.success('Note updated successfully');
      } else {
        await createNote.mutateAsync({ title, description, content });
        toast.success('Note created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update note' : 'Failed to create note');
      console.error(error);
    }
  };

  const isPending = createNote.isPending || updateNote.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Note' : 'Create Note'}</h2>
          <p className="text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content"
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : isEditing ? 'Update Note' : 'Create Note'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
