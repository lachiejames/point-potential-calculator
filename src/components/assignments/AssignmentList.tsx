import React from 'react';
import { Assignment } from '@/types/subject';
import AssignmentRow from '@/components/assignments/AssignmentRow';

interface AssignmentListProps {
  assignments: Assignment[];
  onAdd: () => void;
  onRemove: (assignmentId: string) => void;
  onUpdate: (assignmentId: string, type: "name" | "weight" | "grade", value: string) => void;
}

export default function AssignmentList({
  assignments,
  onAdd,
  onRemove,
  onUpdate,
}: AssignmentListProps) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-[1fr,100px,100px,40px] gap-2 text-sm font-medium text-gray-600">
        <div>Assignment</div>
        <div>Weight (%)</div>
        <div>Grade (%)</div>
        <div></div>
      </div>

      {assignments.map((assignment) => (
        <AssignmentRow
          key={assignment.id}
          assignment={assignment}
          onRemove={() => onRemove(assignment.id)}
          onUpdate={(type: "name" | "weight" | "grade", value: string) => onUpdate(assignment.id, type, value)}
        />
      ))}

      <button
        onClick={onAdd}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        + Add Assignment
      </button>
    </div>
  );
} 