import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllNotes } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteDetailModal from '../components/NoteDetailModal';
import type { Note } from '../backend';

export default function NotesPage() {
  const { identity } = useInternetIdentity();
  const { data: notes = [], isLoading } = useGetAllNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const isAuthenticated = !!identity;

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">BCA Notes</h1>
            <p className="text-lg text-muted-foreground">
              Please login to access comprehensive study notes for your BCA courses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/notes-icon.dim_64x64.png" alt="Notes" className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold">Study Notes</h1>
              <p className="text-muted-foreground">Comprehensive notes for all BCA subjects</p>
            </div>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {searchQuery ? 'No notes found matching your search.' : 'No notes available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id.toString()} note={note} onClick={() => setSelectedNote(note)} />
            ))}
          </div>
        )}
      </div>

      {selectedNote && (
        <NoteDetailModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </div>
  );
}
