import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ExternalLink } from 'lucide-react';
import type { PDF } from '../backend';

interface PDFCardProps {
  pdf: PDF;
}

export default function PDFCard({ pdf }: PDFCardProps) {
  const handleDownload = () => {
    const blob = new Blob([new Uint8Array(pdf.fileData)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdf.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleView = () => {
    const blob = new Blob([new Uint8Array(pdf.fileData)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const fileSizeMB = (new Blob([new Uint8Array(pdf.fileData)]).size / 1024 / 1024).toFixed(2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{pdf.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{pdf.subject}</Badge>
              <Badge variant="outline" className="text-xs">
                {fileSizeMB} MB
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 mb-4">{pdf.description}</CardDescription>
        <div className="flex gap-2">
          <Button onClick={handleView} variant="default" size="sm" className="gap-2 flex-1">
            <ExternalLink className="h-4 w-4" />
            View
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 flex-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
