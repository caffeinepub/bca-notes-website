import { useState } from 'react';
import { useGetAllPDFs } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import PDFCard from '../components/PDFCard';
import PDFFilters from '../components/PDFFilters';

export default function PDFsPage() {
  const { identity } = useInternetIdentity();
  const { data: pdfs = [], isLoading } = useGetAllPDFs();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  // Filter PDFs
  const filteredPDFs = pdfs.filter((pdf) => {
    if (selectedSubject && pdf.subject !== selectedSubject) return false;
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">PDF Resources</h1>
            <p className="text-muted-foreground text-lg">
              Please log in to access PDF study materials
            </p>
          </div>
          <Button size="lg" onClick={() => window.location.reload()}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">PDF Resources</h1>
            <p className="text-muted-foreground">
              Download and view PDF study materials organized by subject
            </p>
          </div>
        </div>

        <PDFFilters pdfs={pdfs} selectedSubject={selectedSubject} onSubjectChange={setSelectedSubject} />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredPDFs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No PDFs Found</h3>
            <p className="text-muted-foreground">
              {selectedSubject
                ? `No PDFs available for ${selectedSubject}`
                : 'No PDFs have been uploaded yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPDFs.map((pdf) => (
              <PDFCard key={pdf.id.toString()} pdf={pdf} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
