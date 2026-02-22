import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { PDF } from '../backend';

interface PDFFiltersProps {
  pdfs: PDF[];
  selectedSubject: string | null;
  onSubjectChange: (subject: string | null) => void;
}

export default function PDFFilters({ pdfs, selectedSubject, onSubjectChange }: PDFFiltersProps) {
  const subjects = Array.from(new Set(pdfs.map((pdf) => pdf.subject))).sort();

  const hasFilters = selectedSubject !== null;

  const clearFilters = () => {
    onSubjectChange(null);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={selectedSubject || 'all'} onValueChange={(v) => onSubjectChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map((subject) => (
            <SelectItem key={subject} value={subject}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
