import React from 'react';
import { Subject } from '@/types/subject';
import { calculateSubjectSummary } from '@/utils/calculations';

interface SubjectCardProps {
  subject: Subject;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdateName: (name: string) => void;
  onAddAssignment: () => void;
  onRemoveAssignment: (assignmentId: string) => void;
  onUpdateAssignment: (assignmentId: string, field: "name" | "weight" | "grade", value: string) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
}

export default function SubjectCard({
  subject,
  isExpanded,
  onToggle,
  onRemove,
  onUpdateName,
  onAddAssignment,
  onRemoveAssignment,
  onUpdateAssignment,
  isEditing,
  onStartEdit,
  onEndEdit,
}: SubjectCardProps) {
  const summary = calculateSubjectSummary(subject);
  
  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEndEdit();
    }
  };

  return (
    <div className={`rounded-2xl shadow-lg border overflow-hidden transition-all duration-200 hover:shadow-xl ${
      !summary.isWeightValid ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-blue-100'
    }`}>
      <div
        className="p-4 sm:p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                defaultValue={subject.name}
                onBlur={(e) => {
                  onUpdateName(e.target.value);
                  onEndEdit();
                }}
                onKeyPress={handleNameKeyPress}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                {!summary.isWeightValid && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <h3 
                  className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEdit();
                  }}
                >
                  {subject.name}
                </h3>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Grade</p>
              <p className="text-lg font-semibold text-gray-800">
                {summary.currentGrade.toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Best Possible</p>
              <p className="text-lg font-semibold text-blue-600">
                {summary.bestPossible.toFixed(1)}%
              </p>
            </div>
            <button
              className={`p-2 text-gray-400 hover:text-gray-600 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-4 sm:p-6">
            <div className="mb-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="pb-3 text-left text-gray-700 font-semibold pl-1">Assignment</th>
                    <th className="pb-3 text-right text-gray-700 font-semibold w-24 pr-1">Weight (%)</th>
                    <th className="pb-3 text-right text-gray-700 font-semibold w-24 pr-1">Grade (%)</th>
                    <th className="pb-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {subject.assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-t border-gray-100">
                      <td className="py-3">
                        <input
                          type="text"
                          value={assignment.name}
                          onChange={(e) =>
                            onUpdateAssignment(assignment.id, "name", e.target.value)
                          }
                          className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded p-1"
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end">
                          <input
                            type="text"
                            value={assignment.weight || ""}
                            onChange={(e) =>
                              onUpdateAssignment(assignment.id, "weight", e.target.value)
                            }
                            className="w-16 text-right bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded p-1"
                          />
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end">
                          <input
                            type="text"
                            value={assignment.grade ?? ""}
                            onChange={(e) =>
                              onUpdateAssignment(assignment.id, "grade", e.target.value)
                            }
                            className="w-16 text-right bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded p-1"
                          />
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => onRemoveAssignment(assignment.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="space-y-1">
                {!summary.isWeightValid && (
                  <div className="flex items-center gap-2 text-sm text-yellow-800 bg-yellow-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Assignment weights must total 100% for accurate grade calculations
                  </div>
                )}
                <p className={`text-sm ${summary.totalWeight === 100 ? 'text-green-600' : 'text-yellow-800'}`}>
                  Assignment weights total {summary.totalWeight.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">
                  You currently have {summary.currentGrade.toFixed(1)}% in this subject
                </p>
                <p className="text-sm text-blue-600">
                  Best possible grade: {summary.bestPossible.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">
                  (Assuming perfect scores on remaining work worth {summary.remainingPoints.toFixed(1)}%)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onAddAssignment}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Add Assignment
                </button>
                <button
                  onClick={onRemove}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Delete Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 