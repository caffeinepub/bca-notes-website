import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllSyllabuses } from '../hooks/useQueries';
import { FileText } from 'lucide-react';
import SyllabusAccordion from '../components/SyllabusAccordion';

export default function SyllabusPage() {
  const { identity } = useInternetIdentity();
  const { data: syllabuses = [], isLoading } = useGetAllSyllabuses();
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <FileText className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">BCA Syllabus</h1>
            <p className="text-lg text-muted-foreground">
              Please login to access the complete BCA syllabus organized by semester.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const semesters = Array.from(new Set(syllabuses.map((s) => Number(s.semester)))).sort((a, b) => a - b);

  const filteredSyllabuses = selectedSemester
    ? syllabuses.filter((s) => Number(s.semester) === selectedSemester)
    : syllabuses;

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/syllabus-icon.dim_64x64.png" alt="Syllabus" className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold">Course Syllabus</h1>
              <p className="text-muted-foreground">Complete BCA curriculum organized by semester</p>
            </div>
          </div>
          {semesters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSemester(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSemester === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All Semesters
              </button>
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSemester === sem
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Semester {sem}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredSyllabuses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No syllabus entries available yet.</p>
          </div>
        ) : (
          <SyllabusAccordion syllabuses={filteredSyllabuses} />
        )}
      </div>
    </div>
  );
}
