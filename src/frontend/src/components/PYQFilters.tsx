import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Question } from '../backend';

interface PYQFiltersProps {
  questions: Question[];
  selectedYear: number | null;
  selectedSemester: number | null;
  selectedSubject: string | null;
  onYearChange: (year: number | null) => void;
  onSemesterChange: (semester: number | null) => void;
  onSubjectChange: (subject: string | null) => void;
}

export default function PYQFilters({
  questions,
  selectedYear,
  selectedSemester,
  selectedSubject,
  onYearChange,
  onSemesterChange,
  onSubjectChange,
}: PYQFiltersProps) {
  const years = Array.from(new Set(questions.map((q) => Number(q.year)))).sort((a, b) => b - a);
  const semesters = Array.from(new Set(questions.map((q) => Number(q.semester)))).sort((a, b) => a - b);
  const subjects = Array.from(new Set(questions.map((q) => q.subject))).sort();

  const hasFilters = selectedYear || selectedSemester || selectedSubject;

  const clearFilters = () => {
    onYearChange(null);
    onSemesterChange(null);
    onSubjectChange(null);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={selectedYear?.toString() || 'all'} onValueChange={(v) => onYearChange(v === 'all' ? null : Number(v))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSemester?.toString() || 'all'} onValueChange={(v) => onSemesterChange(v === 'all' ? null : Number(v))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Semesters</SelectItem>
          {semesters.map((sem) => (
            <SelectItem key={sem} value={sem.toString()}>
              Semester {sem}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSubject || 'all'} onValueChange={(v) => onSubjectChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-[200px]">
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
