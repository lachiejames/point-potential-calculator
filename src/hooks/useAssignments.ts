import { Subject, Assignment } from '@/types/subject';

export const useAssignments = (subjects: Subject[], setSubjects: (subjects: Subject[]) => void) => {
  const addAssignment = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    const assignmentNumber = subject ? subject.assignments.length + 1 : 1;
    
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name: `Assignment ${assignmentNumber}`,
      weight: 0,
      grade: undefined
    };

    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? { ...subject, assignments: [...subject.assignments, newAssignment] }
          : subject
      )
    );
  };

  const removeAssignment = (subjectId: string, assignmentId: string) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              assignments: subject.assignments.filter((a) => a.id !== assignmentId),
            }
          : subject
      )
    );
  };

  const validateInput = (value: string): number | undefined => {
    if (!value) return undefined;
    const num = parseFloat(value);
    if (isNaN(num)) return undefined;
    if (num < 0) return 0;
    if (num > 100) return 100;
    return num;
  };

  const handleInputChange = (
    subjectId: string,
    assignmentId: string,
    type: "name" | "weight" | "grade",
    value: string
  ) => {
    if (type === "name") {
      updateAssignment(subjectId, assignmentId, { name: value });
    } else {
      const validatedValue = validateInput(value);
      updateAssignment(subjectId, assignmentId, { [type]: validatedValue });
    }
  };

  const updateAssignment = (
    subjectId: string,
    assignmentId: string,
    updates: Partial<Assignment>
  ) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              assignments: subject.assignments.map((assignment) =>
                assignment.id === assignmentId
                  ? { ...assignment, ...updates }
                  : assignment
              ),
            }
          : subject
      )
    );
  };

  return {
    addAssignment,
    removeAssignment,
    handleInputChange,
    updateAssignment,
  };
}; 