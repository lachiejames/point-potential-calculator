import { Assignment, Subject, SubjectSummary } from '../types/subject';

export const getDemoData = (): Subject[] => {
  return [
    {
      id: "1",
      name: "Data Structures & Algorithms",
      assignments: [
        { id: "1-1", name: "Assignment 1: Sorting Algorithms", weight: 20, grade: 85 },
        { id: "1-2", name: "Assignment 2: Tree Traversal", weight: 20, grade: 92 },
        { id: "1-3", name: "Mid-semester Exam", weight: 25, grade: 78 },
        { id: "1-4", name: "Final Exam", weight: 35 } // No grade yet
      ]
    },
    {
      id: "2",
      name: "Web Development",
      assignments: [
        { id: "2-1", name: "Project: Frontend App", weight: 40, grade: 95 },
        { id: "2-2", name: "Project: Backend API", weight: 40, grade: 88 },
        { id: "2-3", name: "Documentation", weight: 20 } // No grade yet
      ]
    },
    {
      id: "3",
      name: "Database Systems",
      assignments: [
        { id: "3-1", name: "SQL Assignment", weight: 15, grade: 100 },
        { id: "3-2", name: "NoSQL Project", weight: 25 },
        { id: "3-3", name: "Mid-term", weight: 25 },
        { id: "3-4", name: "Final Project", weight: 35 }
      ]
    },
    {
      id: "4",
      name: "Software Engineering",
      assignments: [
        { id: "4-1", name: "Group Project", weight: 50 }, // Large project with no grade yet
        { id: "4-2", name: "Individual Report", weight: 30 },
        { id: "4-3", name: "Peer Reviews", weight: 20 }
      ]
    }
  ];
};

export function calculateSubjectSummary(subject: Subject): SubjectSummary {
  let currentTotal = 0;
  let completedWeight = 0;
  let remainingWeight = 0;
  
  // Calculate total weight first to validate
  const totalWeight = subject.assignments.reduce((sum, a) => sum + (a.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 0.01;
  
  // Only calculate grades if weights are valid
  if (isWeightValid) {
    subject.assignments.forEach(assignment => {
      const weight = assignment.weight || 0;
      
      if (assignment.grade !== undefined) {
        currentTotal += (assignment.grade * weight / 100);
        completedWeight += weight;
      } else {
        remainingWeight += weight;
      }
    });
  }

  // Calculate point potential (maximum possible grade)
  const pointPotential = isWeightValid 
    ? currentTotal + remainingWeight 
    : 0;

  return {
    currentTotal: isWeightValid ? currentTotal : 0,
    pointPotential: isWeightValid ? pointPotential : 0,
    remainingWeight: isWeightValid ? remainingWeight : 0,
    completedWeight: isWeightValid ? completedWeight : 0,
    isComplete: remainingWeight === 0,
    totalWeight,
    isWeightValid,
    weightValidationMessage: getWeightValidationMessage(totalWeight)
  };
}

function getWeightValidationMessage(totalWeight: number): string {
  if (Math.abs(totalWeight - 100) < 0.01) {
    return 'Assignment weights total 100% ✓';
  }
  if (totalWeight < 100) {
    return `Assignment weights currently total ${totalWeight.toFixed(1)}% (need ${(100 - totalWeight).toFixed(1)}% more)`;
  }
  return `Assignment weights currently total ${totalWeight.toFixed(1)}% (${(totalWeight - 100).toFixed(1)}% too high)`;
}

export function validateWeightTotal(assignments: Assignment[]): boolean {
  const totalWeight = assignments.reduce((sum, a) => sum + (a.weight || 0), 0);
  return Math.abs(totalWeight - 100) < 0.01;
} 