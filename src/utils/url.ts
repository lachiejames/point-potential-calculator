import { Subject } from '@/types/subject';

interface EncodedData {
  subjects: Array<{
    id: string;
    name: string;
    assignments: Array<{
      id: string;
      name: string;
      weight: number;
      grade: number | null;
    }>;
  }>;
}

export function encodeStateToUrl(subjects: Subject[]): string {
  const data = {
    subjects: subjects.map(subject => ({
      ...subject,
      assignments: subject.assignments.map(assignment => ({
        ...assignment,
        // Convert undefined to null for JSON serialization
        grade: assignment.grade ?? null
      }))
    }))
  };
  
  const encoded = btoa(JSON.stringify(data));
  return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
}

export function decodeStateFromUrl(searchParams: string): Subject[] | null {
  try {
    const params = new URLSearchParams(searchParams);
    const data = params.get('data');
    if (!data) return null;

    const decoded = JSON.parse(atob(data)) as EncodedData;
    return decoded.subjects.map((subject) => ({
      ...subject,
      assignments: subject.assignments.map((assignment) => ({
        ...assignment,
        // Convert null back to undefined
        grade: assignment.grade === null ? undefined : assignment.grade
      }))
    }));
  } catch (error) {
    console.error('Failed to decode state from URL:', error);
    return null;
  }
} 