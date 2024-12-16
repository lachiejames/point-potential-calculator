import { Assignment, Subject, SubjectSummary } from '../types/subject';

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