import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllQuestions } from '../hooks/useQueries';
import { HelpCircle } from 'lucide-react';
import PYQList from '../components/PYQList';
import PYQFilters from '../components/PYQFilters';

export default function PYQPage() {
  const { identity } = useInternetIdentity();
  const { data: questions = [], isLoading } = useGetAllQuestions();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <HelpCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Previous Year Questions</h1>
            <p className="text-lg text-muted-foreground">
              Please login to access previous year question papers for exam preparation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredQuestions = questions.filter((q) => {
    if (selectedYear && Number(q.year) !== selectedYear) return false;
    if (selectedSemester && Number(q.semester) !== selectedSemester) return false;
    if (selectedSubject && q.subject !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/pyq-icon.dim_64x64.png" alt="PYQ" className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold">Previous Year Questions</h1>
              <p className="text-muted-foreground">Practice with past exam papers</p>
            </div>
          </div>
          <PYQFilters
            questions={questions}
            selectedYear={selectedYear}
            selectedSemester={selectedSemester}
            selectedSubject={selectedSubject}
            onYearChange={setSelectedYear}
            onSemesterChange={setSelectedSemester}
            onSubjectChange={setSelectedSubject}
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {selectedYear || selectedSemester || selectedSubject
                ? 'No questions found matching your filters.'
                : 'No questions available yet.'}
            </p>
          </div>
        ) : (
          <PYQList questions={filteredQuestions} />
        )}
      </div>
    </div>
  );
}
