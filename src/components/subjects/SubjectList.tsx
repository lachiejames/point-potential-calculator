import React from 'react';
import { Subject } from '@/types/subject';
import SubjectCard from './SubjectCard';

interface SubjectListProps {
  subjects: Subject[];
  expandedSubjectIds: Set<string>;
  editingSubjectId: string | null;
  onToggleSubject: (subjectId: string) => void;
  onRemoveSubject: (subjectId: string) => void;
  onUpdateSubjectName: (subjectId: string, name: string) => void;
  onAddAssignment: (subjectId: string) => void;
  onRemoveAssignment: (subjectId: string, assignmentId: string) => void;
  onUpdateAssignment: (subjectId: string, assignmentId: string, type: "name" | "weight" | "grade", value: string) => void;
  onStartEdit: (subjectId: string) => void;
  onEndEdit: () => void;
}

export default function SubjectList({
  subjects,
  expandedSubjectIds,
  editingSubjectId,
  onToggleSubject,
  onRemoveSubject,
  onUpdateSubjectName,
  onAddAssignment,
  onRemoveAssignment,
  onUpdateAssignment,
  onStartEdit,
  onEndEdit,
}: SubjectListProps) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          isExpanded={expandedSubjectIds.has(subject.id)}
          isEditing={editingSubjectId === subject.id}
          onToggle={() => onToggleSubject(subject.id)}
          onRemove={() => onRemoveSubject(subject.id)}
          onUpdateName={(name) => onUpdateSubjectName(subject.id, name)}
          onAddAssignment={() => onAddAssignment(subject.id)}
          onRemoveAssignment={(assignmentId) =>
            onRemoveAssignment(subject.id, assignmentId)
          }
          onUpdateAssignment={(assignmentId, type, value) =>
            onUpdateAssignment(subject.id, assignmentId, type, value)
          }
          onStartEdit={() => onStartEdit(subject.id)}
          onEndEdit={onEndEdit}
        />
      ))}
    </div>
  );
} 