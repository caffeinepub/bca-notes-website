import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import type { Syllabus } from '../backend';

interface SyllabusAccordionProps {
  syllabuses: Syllabus[];
}

export default function SyllabusAccordion({ syllabuses }: SyllabusAccordionProps) {
  const groupedBySemester = syllabuses.reduce((acc, syllabus) => {
    const sem = Number(syllabus.semester);
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(syllabus);
    return acc;
  }, {} as Record<number, Syllabus[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedBySemester)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([semester, items]) => (
          <div key={semester} className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="text-base">Semester {semester}</Badge>
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {items.map((syllabus) => (
                <AccordionItem key={syllabus.id.toString()} value={syllabus.id.toString()} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">{syllabus.subject}</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-medium mb-2">Topics Covered:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {syllabus.topics.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Course Details:</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{syllabus.courseDetails}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
    </div>
  );
}
