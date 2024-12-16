import { Subject, SubjectSummary } from '../types/subject';

export function calculateSubjectSummary(subject: Subject): SubjectSummary {
  let currentTotal = 0;
  let pointPotential = 100;
  let remainingWeight = 0;
  
  // Calculate totals from completed assignments
  subject.assignments.forEach(assignment => {
    if (assignment.grade !== undefined) {
      // Calculate points lost from maximum
      const pointsLost = (100 - assignment.grade) * (assignment.weight / 100);
      pointPotential -= pointsLost;
      
      // Add to current total
      currentTotal += (assignment.grade * assignment.weight / 100);
    } else {
      remainingWeight += assignment.weight;
    }
  });

  return {
    currentTotal,
    pointPotential,
    remainingWeight,
    isComplete: remainingWeight === 0
  };
}

export function calculateRequiredGrade(
  currentTotal: number,
  targetGrade: number,
  remainingWeight: number
): number | null {
  if (remainingWeight === 0) return null;
  
  const remainingPoints = targetGrade - currentTotal;
  const requiredGrade = (remainingPoints / remainingWeight) * 100;
  
  return requiredGrade;
} 