import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Question } from '../backend';

interface PYQListProps {
  questions: Question[];
}

export default function PYQList({ questions }: PYQListProps) {
  const groupedByYear = questions.reduce((acc, question) => {
    const year = Number(question.year);
    if (!acc[year]) acc[year] = [];
    acc[year].push(question);
    return acc;
  }, {} as Record<number, Question[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedByYear)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, items]) => (
          <div key={year} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Badge variant="default" className="text-base px-3 py-1">Year {year}</Badge>
            </h2>
            <div className="grid gap-4">
              {items.map((question) => (
                <Card key={question.id.toString()}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Badge variant="outline">Sem {question.semester.toString()}</Badge>
                      <span>{question.subject}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">{question.questionContent}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
