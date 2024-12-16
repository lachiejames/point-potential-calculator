'use client';

import { useState } from 'react';
import { Subject, Assignment } from '@/types/subject';
import { calculateSubjectSummary, calculateRequiredGrade } from '@/utils/calculations';

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      assignments: []
    };
    
    setSubjects([...subjects, newSubject]);
    setNewSubjectName('');
  };

  const addAssignment = (subjectId: string) => {
    setSubjects(subjects.map(subject => {
      if (subject.id !== subjectId) return subject;
      
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        name: `Assignment ${subject.assignments.length + 1}`,
        weight: 0
      };
      
      return {
        ...subject,
        assignments: [...subject.assignments, newAssignment]
      };
    }));
  };

  const updateAssignment = (
    subjectId: string,
    assignmentId: string,
    updates: Partial<Assignment>
  ) => {
    setSubjects(subjects.map(subject => {
      if (subject.id !== subjectId) return subject;
      
      return {
        ...subject,
        assignments: subject.assignments.map(assignment => {
          if (assignment.id !== assignmentId) return assignment;
          return { ...assignment, ...updates };
        })
      };
    }));
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Point Potential Calculator</h1>
        
        {/* Add Subject Form */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex gap-4">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Enter subject name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addSubject}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* Subjects List */}
        {subjects.map(subject => {
          const summary = calculateSubjectSummary(subject);
          
          return (
            <div key={subject.id} className="mb-8 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">{subject.name}</h2>
              
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Current Total</div>
                  <div className="text-2xl font-bold">{summary.currentTotal.toFixed(1)}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Point Potential</div>
                  <div className="text-2xl font-bold">{summary.pointPotential.toFixed(1)}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Remaining Weight</div>
                  <div className="text-2xl font-bold">{summary.remainingWeight}%</div>
                </div>
              </div>

              {/* Assignments */}
              <div className="space-y-4">
                {subject.assignments.map(assignment => (
                  <div key={assignment.id} className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={assignment.name}
                      onChange={(e) => updateAssignment(subject.id, assignment.id, { name: e.target.value })}
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={assignment.weight}
                      onChange={(e) => updateAssignment(subject.id, assignment.id, { weight: Number(e.target.value) })}
                      placeholder="Weight %"
                      className="w-24 p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={assignment.grade}
                      onChange={(e) => updateAssignment(subject.id, assignment.id, { grade: Number(e.target.value) })}
                      placeholder="Grade %"
                      className="w-24 p-2 border rounded"
                    />
                  </div>
                ))}
              </div>

              {/* Add Assignment Button */}
              <button
                onClick={() => addAssignment(subject.id)}
                className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Add Assignment
              </button>

              {/* Required Grade Calculator */}
              {summary.remainingWeight > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded">
                  <h3 className="text-lg font-semibold mb-2">Required Grades</h3>
                  <div className="space-y-2">
                    {[50, 60, 70, 80].map(target => {
                      const required = calculateRequiredGrade(
                        summary.currentTotal,
                        target,
                        summary.remainingWeight
                      );
                      
                      return (
                        <div key={target} className="flex justify-between">
                          <span>To achieve {target}% overall:</span>
                          <span className="font-semibold">
                            {required !== null
                              ? required <= 100
                                ? `Need ${required.toFixed(1)}% on remaining`
                                : 'Not possible'
                              : 'N/A'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
