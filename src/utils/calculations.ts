import { Subject, SubjectSummary } from '../types/subject';

export function calculateSubjectSummary(subject: Subject): SubjectSummary {
  let currentTotal = 0;
  let pointPotential = 100;
  let remainingWeight = 0;
  
  // Calculate totals from completed assignments
  subject.assignments.forEach(assignment => {
    // Ensure weight is a valid number between 0 and 100
    const weight = Math.min(Math.max(assignment.weight || 0, 0), 100);
    
    if (assignment.grade !== undefined) {
      // Ensure grade is a valid number between 0 and 100
      const grade = Math.min(Math.max(assignment.grade, 0), 100);
      
      // Calculate points lost from maximum
      const pointsLost = (100 - grade) * (weight / 100);
      pointPotential -= pointsLost;
      
      // Add to current total
      currentTotal += (grade * weight / 100);
    } else {
      remainingWeight += weight;
    }
  });

  // Ensure values are within valid ranges
  currentTotal = Math.min(Math.max(currentTotal, 0), 100);
  pointPotential = Math.min(Math.max(pointPotential, 0), 100);
  remainingWeight = Math.min(Math.max(remainingWeight, 0), 100);

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
  // Validate inputs
  if (remainingWeight <= 0) return null;
  if (currentTotal < 0 || targetGrade < 0 || remainingWeight < 0) return null;
  if (currentTotal > 100 || targetGrade > 100 || remainingWeight > 100) return null;
  
  const remainingPoints = targetGrade - currentTotal;
  const requiredGrade = (remainingPoints / remainingWeight) * 100;
  
  // If the required grade is negative or NaN, return null
  if (isNaN(requiredGrade) || requiredGrade < 0) return null;
  
  return requiredGrade;
} 