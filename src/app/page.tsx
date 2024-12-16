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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSubject();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Point Potential Calculator
        </h1>
        
        {/* Add Subject Form */}
        <div className="mb-12 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex gap-4">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter subject name"
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={addSubject}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* Subjects List */}
        <div className="space-y-8">
          {subjects.map(subject => {
            const summary = calculateSubjectSummary(subject);
            
            return (
              <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800">{subject.name}</h2>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                    <div className="text-sm font-medium text-blue-600 mb-1">Current Total</div>
                    <div className="text-3xl font-bold text-blue-900">{summary.currentTotal.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100">
                    <div className="text-sm font-medium text-green-600 mb-1">Point Potential</div>
                    <div className="text-3xl font-bold text-green-900">{summary.pointPotential.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                    <div className="text-sm font-medium text-purple-600 mb-1">Remaining Weight</div>
                    <div className="text-3xl font-bold text-purple-900">{summary.remainingWeight}%</div>
                  </div>
                </div>

                {/* Assignments */}
                <div className="p-6 border-t border-gray-100">
                  <div className="space-y-4">
                    {subject.assignments.map(assignment => (
                      <div key={assignment.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                        <input
                          type="text"
                          value={assignment.name}
                          onChange={(e) => updateAssignment(subject.id, assignment.id, { name: e.target.value })}
                          className="flex-1 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={assignment.weight}
                            onChange={(e) => updateAssignment(subject.id, assignment.id, { weight: Number(e.target.value) })}
                            placeholder="Weight %"
                            className="w-24 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <span className="text-gray-400">%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={assignment.grade}
                            onChange={(e) => updateAssignment(subject.id, assignment.id, { grade: Number(e.target.value) })}
                            placeholder="Grade %"
                            className="w-24 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <span className="text-gray-400">%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addAssignment(subject.id)}
                    className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    + Add Assignment
                  </button>
                </div>

                {/* Required Grade Calculator */}
                {summary.remainingWeight > 0 && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Grades</h3>
                    <div className="space-y-3">
                      {[50, 60, 70, 80].map(target => {
                        const required = calculateRequiredGrade(
                          summary.currentTotal,
                          target,
                          summary.remainingWeight
                        );
                        
                        return (
                          <div key={target} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                            <span className="text-gray-600">To achieve {target}% overall:</span>
                            <span className={`font-semibold ${
                              required === null ? 'text-gray-400' :
                              required <= 100 ? 'text-green-600' : 'text-red-600'
                            }`}>
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
      </div>
    </main>
  );
}
