import { useState } from 'react';
import { useCreateSyllabus, useUpdateSyllabus } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Syllabus } from '../../backend';

interface SyllabusFormProps {
  syllabus: Syllabus | null;
  onClose: () => void;
}

export default function SyllabusForm({ syllabus, onClose }: SyllabusFormProps) {
  const [semester, setSemester] = useState(syllabus ? Number(syllabus.semester) : 1);
  const [subject, setSubject] = useState(syllabus?.subject || '');
  const [topics, setTopics] = useState<string[]>(syllabus?.topics || ['']);
  const [courseDetails, setCourseDetails] = useState(syllabus?.courseDetails || '');

  const createSyllabus = useCreateSyllabus();
  const updateSyllabus = useUpdateSyllabus();

  const isEditing = !!syllabus;

  const addTopic = () => {
    setTopics([...topics, '']);
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredTopics = topics.filter((t) => t.trim());
    if (!subject.trim() || filteredTopics.length === 0 || !courseDetails.trim()) {
      toast.error('Please fill in all fields and add at least one topic');
      return;
    }

    try {
      if (isEditing) {
        await updateSyllabus.mutateAsync({
          id: syllabus.id,
          semester: BigInt(semester),
          subject,
          topics: filteredTopics,
          courseDetails,
        });
        toast.success('Syllabus updated successfully');
      } else {
        await createSyllabus.mutateAsync({
          semester: BigInt(semester),
          subject,
          topics: filteredTopics,
          courseDetails,
        });
        toast.success('Syllabus created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update syllabus' : 'Failed to create syllabus');
      console.error(error);
    }
  };

  const isPending = createSyllabus.isPending || updateSyllabus.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Syllabus' : 'Create Syllabus'}</h2>
          <p className="text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Syllabus Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="Enter subject name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Topics</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTopic} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Topic
                </Button>
              </div>
              <div className="space-y-2">
                {topics.map((topic, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={topic}
                      onChange={(e) => updateTopic(index, e.target.value)}
                      placeholder={`Topic ${index + 1}`}
                    />
                    {topics.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTopic(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseDetails">Course Details</Label>
              <Textarea
                id="courseDetails"
                value={courseDetails}
                onChange={(e) => setCourseDetails(e.target.value)}
                placeholder="Enter course details, objectives, and description"
                rows={8}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : isEditing ? 'Update Syllabus' : 'Create Syllabus'}
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
