import { useState } from 'react';
import { useGetAllSyllabuses, useDeleteSyllabus } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import SyllabusForm from './SyllabusForm';
import type { Syllabus } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SyllabusManager() {
  const { data: syllabuses = [], isLoading } = useGetAllSyllabuses();
  const deleteSyllabus = useDeleteSyllabus();
  const [editingSyllabus, setEditingSyllabus] = useState<Syllabus | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Syllabus | null>(null);

  const handleDelete = async (syllabus: Syllabus) => {
    try {
      await deleteSyllabus.mutateAsync(syllabus.id);
      toast.success('Syllabus deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete syllabus');
      console.error(error);
    }
  };

  const handleEdit = (syllabus: Syllabus) => {
    setEditingSyllabus(syllabus);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSyllabus(null);
  };

  if (showForm) {
    return <SyllabusForm syllabus={editingSyllabus} onClose={handleCloseForm} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Syllabus</h2>
          <p className="text-muted-foreground">Create, edit, and delete syllabus entries</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Syllabus
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : syllabuses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No syllabus entries yet. Create your first entry!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {syllabuses.map((syllabus) => (
            <Card key={syllabus.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Semester {syllabus.semester.toString()}</Badge>
                      <CardTitle className="text-lg">{syllabus.subject}</CardTitle>
                    </div>
                    <CardDescription>
                      {syllabus.topics.length} topics • {syllabus.courseDetails.substring(0, 100)}...
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(syllabus)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(syllabus)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Syllabus</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.subject}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
