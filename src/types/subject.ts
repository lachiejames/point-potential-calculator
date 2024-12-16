export interface Assignment {
  id: string;
  name: string;
  weight: number;  // Percentage weight of the assignment (0-100)
  grade?: number;  // Actual grade received (0-100), optional as it might not be completed
}

export interface Subject {
  id: string;
  name: string;
  assignments: Assignment[];
}

export interface SubjectSummary {
  currentTotal: number;        // Current total based on completed assignments
  pointPotential: number;      // Maximum possible grade that can be achieved
  remainingWeight: number;     // Total weight of uncompleted assignments
  isComplete: boolean;         // Whether all assignments have grades
} 