import { useState } from 'react';
import { useCreatePDF, useUpdatePDF } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { PDF } from '../../backend';

interface PDFFormProps {
  pdf: PDF | null;
  onClose: () => void;
}

const SUBJECTS = [
  'Programming in C',
  'Data Structures',
  'Database Management',
  'Operating Systems',
  'Computer Networks',
  'Web Development',
  'Software Engineering',
  'Mathematics',
  'Digital Electronics',
  'Computer Architecture',
];

export default function PDFForm({ pdf, onClose }: PDFFormProps) {
  const [subject, setSubject] = useState(pdf?.subject || '');
  const [title, setTitle] = useState(pdf?.title || '');
  const [description, setDescription] = useState(pdf?.description || '');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createPDF = useCreatePDF();
  const updatePDF = useUpdatePDF();

  const isEditing = !!pdf;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        e.target.value = '';
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isEditing && !file) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      setUploadProgress(0);
      
      if (isEditing) {
        await updatePDF.mutateAsync({ id: pdf.id, subject, title, description });
        toast.success('PDF updated successfully');
      } else {
        if (!file) return;
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);
        
        await createPDF.mutateAsync({ subject, title, description, file });
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        toast.success('PDF uploaded successfully');
      }
      
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update PDF' : 'Failed to upload PDF');
      console.error(error);
    } finally {
      setUploadProgress(0);
    }
  };

  const isPending = createPDF.isPending || updatePDF.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit PDF' : 'Upload PDF'}</h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update PDF metadata' : 'Upload a new PDF file'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PDF Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="file">PDF File</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB. Only PDF files are allowed.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter PDF title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the PDF content"
                rows={4}
              />
            </div>

            {isPending && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? (isEditing ? 'Updating...' : 'Uploading...') : isEditing ? 'Update PDF' : 'Upload PDF'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
