import React from 'react';
import { Assignment } from '@/types/subject';

interface AssignmentRowProps {
  assignment: Assignment;
  onRemove: () => void;
  onUpdate: (type: "name" | "weight" | "grade", value: string) => void;
}

export default function AssignmentRow({
  assignment,
  onRemove,
  onUpdate,
}: AssignmentRowProps) {
  return (
    <div className="grid grid-cols-[1fr,100px,100px,40px] gap-2 mb-2">
      <input
        type="text"
        value={assignment.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        placeholder="Assignment name"
        className="px-2 py-1 text-sm border rounded"
      />
      
      <input
        type="text"
        value={assignment.weight || ""}
        onChange={(e) => onUpdate("weight", e.target.value)}
        placeholder="Weight"
        className="px-2 py-1 text-sm border rounded"
      />
      
      <input
        type="text"
        value={assignment.grade || ""}
        onChange={(e) => onUpdate("grade", e.target.value)}
        placeholder="Grade"
        className="px-2 py-1 text-sm border rounded"
      />
      
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
} 