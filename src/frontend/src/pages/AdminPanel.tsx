import { useIsCallerAdmin } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, BookOpen, FileText, HelpCircle, File } from 'lucide-react';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import NotesManager from '../components/admin/NotesManager';
import SyllabusManager from '../components/admin/SyllabusManager';
import PYQManager from '../components/admin/PYQManager';
import PDFManager from '../components/admin/PDFManager';

export default function AdminPanel() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage notes, syllabus, PDFs, and previous year questions</p>
          </div>
        </div>

        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="notes" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="gap-2">
              <FileText className="h-4 w-4" />
              Syllabus
            </TabsTrigger>
            <TabsTrigger value="pdfs" className="gap-2">
              <File className="h-4 w-4" />
              PDFs
            </TabsTrigger>
            <TabsTrigger value="pyq" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              PYQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <NotesManager />
          </TabsContent>

          <TabsContent value="syllabus">
            <SyllabusManager />
          </TabsContent>

          <TabsContent value="pdfs">
            <PDFManager />
          </TabsContent>

          <TabsContent value="pyq">
            <PYQManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
