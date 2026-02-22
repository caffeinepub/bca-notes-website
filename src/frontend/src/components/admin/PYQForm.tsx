import { useState } from 'react';
import { useCreateQuestion, useUpdateQuestion } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Question } from '../../backend';

interface PYQFormProps {
  question: Question | null;
  onClose: () => void;
}

export default function PYQForm({ question, onClose }: PYQFormProps) {
  const [year, setYear] = useState(question ? Number(question.year) : new Date().getFullYear());
  const [semester, setSemester] = useState(question ? Number(question.semester) : 1);
  const [subject, setSubject] = useState(question?.subject || '');
  const [questionContent, setQuestionContent] = useState(question?.questionContent || '');

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();

  const isEditing = !!question;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !questionContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (isEditing) {
        await updateQuestion.mutateAsync({
          id: question.id,
          year: BigInt(year),
          semester: BigInt(semester),
          subject,
          questionContent,
        });
        toast.success('Question updated successfully');
      } else {
        await createQuestion.mutateAsync({
          year: BigInt(year),
          semester: BigInt(semester),
          subject,
          questionContent,
        });
        toast.success('Question created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update question' : 'Failed to create question');
      console.error(error);
    }
  };

  const isPending = createQuestion.isPending || updateQuestion.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Question' : 'Create Question'}</h2>
          <p className="text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  max="8"
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionContent">Question Content</Label>
              <Textarea
                id="questionContent"
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="Enter the question content"
                rows={12}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : isEditing ? 'Update Question' : 'Create Question'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
