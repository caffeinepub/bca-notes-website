import { useState } from 'react';
import { useGetAllPDFs, useDeletePDF } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import PDFForm from './PDFForm';
import type { PDF } from '../../backend';
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

export default function PDFManager() {
  const { data: pdfs = [], isLoading } = useGetAllPDFs();
  const deletePDF = useDeletePDF();
  const [editingPDF, setEditingPDF] = useState<PDF | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<PDF | null>(null);

  const handleDelete = async (pdf: PDF) => {
    try {
      await deletePDF.mutateAsync(pdf.id);
      toast.success('PDF deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete PDF');
      console.error(error);
    }
  };

  const handleEdit = (pdf: PDF) => {
    setEditingPDF(pdf);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPDF(null);
  };

  // Group PDFs by subject
  const pdfsBySubject = pdfs.reduce((acc, pdf) => {
    if (!acc[pdf.subject]) {
      acc[pdf.subject] = [];
    }
    acc[pdf.subject].push(pdf);
    return acc;
  }, {} as Record<string, PDF[]>);

  if (showForm) {
    return <PDFForm pdf={editingPDF} onClose={handleCloseForm} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage PDFs</h2>
          <p className="text-muted-foreground">Upload and manage PDF files organized by subject</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload PDF
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : pdfs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No PDFs yet. Upload your first PDF!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(pdfsBySubject).map(([subject, subjectPDFs]) => (
            <div key={subject} className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {subject}
                <Badge variant="secondary">{subjectPDFs.length}</Badge>
              </h3>
              <div className="grid gap-3">
                {subjectPDFs.map((pdf) => (
                  <Card key={pdf.id.toString()}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{pdf.title}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {(new Blob([new Uint8Array(pdf.fileData)]).size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">{pdf.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(pdf)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(pdf)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete PDF</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This action cannot be undone.
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
