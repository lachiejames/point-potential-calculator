'use client';

import { useState } from 'react';
import { Subject, Assignment } from '@/types/subject';
import { calculateSubjectSummary, calculateRequiredGrade } from '@/utils/calculations';

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

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

  const removeSubject = (subjectId: string) => {
    setSubjects(subjects.filter(subject => subject.id !== subjectId));
  };

  const updateSubjectName = (subjectId: string, newName: string) => {
    if (!newName.trim()) return; // Prevent empty names
    
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { ...subject, name: newName }
        : subject
    ));
  };

  const removeAssignment = (subjectId: string, assignmentId: string) => {
    setSubjects(subjects.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        assignments: subject.assignments.filter(a => a.id !== assignmentId)
      };
    }));
  };

  const addAssignment = (subjectId: string) => {
    setSubjects(subjects.map(subject => {
      if (subject.id !== subjectId) return subject;
      
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        name: `Assignment ${subject.assignments.length + 1}`,
        weight: 0,
        grade: undefined
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
          
          // Ensure weight and grade are numbers or undefined
          const processedUpdates = {
            ...updates,
            weight: updates.weight !== undefined ? Number(updates.weight) : assignment.weight,
            grade: updates.grade !== undefined && String(updates.grade) !== '' 
              ? Number(updates.grade)
              : String(updates.grade) === '' ? undefined : assignment.grade
          };
          
          return { ...assignment, ...processedUpdates };
        })
      };
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSubject();
    }
  };

  const getTotalWeight = (assignments: Assignment[]): number => {
    return assignments.reduce((sum, assignment) => sum + (assignment.weight || 0), 0);
  };

  const handleWeightChange = (
    subjectId: string,
    assignmentId: string,
    value: string
  ) => {
    const numValue = value === '' ? 0 : Number(value);
    updateAssignment(subjectId, assignmentId, { weight: numValue });
  };

  const handleGradeChange = (
    subjectId: string,
    assignmentId: string,
    value: string
  ) => {
    const numValue = value === '' ? undefined : Number(value);
    updateAssignment(subjectId, assignmentId, { grade: numValue });
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
            const totalWeight = getTotalWeight(subject.assignments);
            const isWeightValid = Math.abs(totalWeight - 100) < 0.01; // Allow for floating point imprecision
            
            return (
              <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex-1">
                    {editingSubjectId === subject.id ? (
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) => updateSubjectName(subject.id, e.target.value)}
                        onBlur={() => setEditingSubjectId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingSubjectId(null);
                          }
                        }}
                        autoFocus
                        className="text-2xl font-semibold text-gray-800 w-full p-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <h2 
                        className="text-2xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                        onClick={() => setEditingSubjectId(subject.id)}
                      >
                        {subject.name}
                      </h2>
                    )}
                  </div>
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-4"
                    title="Remove subject"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
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
                  <div className={`bg-gradient-to-br p-4 rounded-xl border ${
                    isWeightValid 
                      ? 'from-purple-50 to-white border-purple-100' 
                      : 'from-yellow-50 to-white border-yellow-100'
                  }`}>
                    <div className={`text-sm font-medium mb-1 ${
                      isWeightValid ? 'text-purple-600' : 'text-yellow-600'
                    }`}>
                      Total Weight
                    </div>
                    <div className={`text-3xl font-bold ${
                      isWeightValid ? 'text-purple-900' : 'text-yellow-600'
                    }`}>
                      {totalWeight}%
                    </div>
                    {!isWeightValid && (
                      <div className="text-sm text-yellow-600 mt-1">
                        Must total 100%
                      </div>
                    )}
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
                            value={assignment.weight || ''}
                            onChange={(e) => handleWeightChange(subject.id, assignment.id, e.target.value)}
                            placeholder="Weight %"
                            min="0"
                            max="100"
                            className="w-24 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <span className="text-gray-400">%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={assignment.grade ?? ''}
                            onChange={(e) => handleGradeChange(subject.id, assignment.id, e.target.value)}
                            placeholder="Grade %"
                            min="0"
                            max="100"
                            className="w-24 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <span className="text-gray-400">%</span>
                        </div>
                        <button
                          onClick={() => removeAssignment(subject.id, assignment.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove assignment"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
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
                {isWeightValid && summary.remainingWeight > 0 && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Grades</h3>
                    <div className="space-y-3">
                      {[50, 60, 70, 80].map(target => {
                        const required = calculateRequiredGrade(
                          summary.currentTotal,
                          target,
                          summary.remainingWeight
                        );
                        
                        if (required === null || required > 100) return null;
                        
                        return (
                          <div key={target} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                            <span className="text-gray-600">To achieve {target}% overall:</span>
                            <span className="font-semibold text-green-600">
                              Need {required.toFixed(1)}% on remaining
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
