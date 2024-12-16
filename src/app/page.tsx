"use client";

import { useState } from "react";
import { Subject, Assignment } from "@/types/subject";
import { calculateSubjectSummary, getDemoData } from "@/utils/calculations";

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>(getDemoData());
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [showNameError, setShowNameError] = useState(false);
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<Set<string>>(
    new Set(getDemoData().map(subject => subject.id))
  );
  const [isShowingDemoData, setIsShowingDemoData] = useState(true);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjectIds(prev => {
      const next = new Set(prev);
      if (next.has(subjectId)) {
        next.delete(subjectId);
      } else {
        next.add(subjectId);
      }
      return next;
    });
  };

  const clearDemoData = () => {
    setSubjects([]);
    setExpandedSubjectIds(new Set());
    setIsShowingDemoData(false);
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) {
      setShowNameError(true);
      return;
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      assignments: [],
    };

    setSubjects([...subjects, newSubject]);
    setNewSubjectName("");
    setShowNameError(false);
    setExpandedSubjectIds(prev => new Set([...prev, newSubject.id]));
  };

  const removeSubject = (subjectId: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== subjectId));
    setExpandedSubjectIds(prev => {
      const next = new Set(prev);
      next.delete(subjectId);
      return next;
    });
  };

  const updateSubjectName = (subjectId: string, newName: string) => {
    if (!newName.trim()) return;

    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId ? { ...subject, name: newName } : subject
      )
    );
  };

  const removeAssignment = (subjectId: string, assignmentId: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id !== subjectId) return subject;
        return {
          ...subject,
          assignments: subject.assignments.filter((a) => a.id !== assignmentId),
        };
      })
    );
  };

  const addAssignment = (subjectId: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id !== subjectId) return subject;

        const newAssignment: Assignment = {
          id: Date.now().toString(),
          name: `Assignment ${subject.assignments.length + 1}`,
          weight: 0,
          grade: undefined,
        };

        return {
          ...subject,
          assignments: [...subject.assignments, newAssignment],
        };
      })
    );
  };

  const validateInput = (value: string): string | undefined => {
    if (value === "") return undefined;

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return "Please enter a valid number";
    }

    if (numValue < 0 || numValue > 100) {
      return "Value must be between 0 and 100";
    }

    return undefined;
  };

  const handleInputChange = (
    subjectId: string,
    assignmentId: string,
    type: "weight" | "grade",
    value: string
  ) => {
    const error = validateInput(value);
    if (error) return;

    const numValue =
      value === "" ? (type === "weight" ? 0 : undefined) : Number(value);
    updateAssignment(subjectId, assignmentId, {
      [type]: numValue,
    });
  };

  const updateAssignment = (
    subjectId: string,
    assignmentId: string,
    updates: Partial<Assignment>
  ) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id !== subjectId) return subject;

        return {
          ...subject,
          assignments: subject.assignments.map((assignment) => {
            if (assignment.id !== assignmentId) return assignment;
            return { ...assignment, ...updates };
          }),
        };
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addSubject();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Point Potential Calculator
        </h1>

        {/* User Guide */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Add a subject using the form below</li>
            <li>
              For each subject, add all assignments that contribute to your
              final grade
            </li>
            <li>
              Enter the weight (percentage contribution) for each assignment -
              these must total 100%
            </li>
            <li>
              Enter grades for completed assignments to see your current total
            </li>
            <li>
              Your point potential shows the highest possible grade you can
              achieve
            </li>
          </ol>
        </div>
        
        {/* Demo Data Notice */}
        {isShowingDemoData && subjects.length > 0 && (
          <div className="mb-8 p-6 bg-yellow-50 rounded-xl shadow-sm border border-yellow-200">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Data Loaded</h3>
                <p className="text-yellow-800 mb-4">
                  This calculator is pre-populated with sample computer science subjects to demonstrate how it works. 
                  Clear the demo data to start adding your own subjects.
                </p>
                <button
                  onClick={clearDemoData}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-medium border border-yellow-300"
                >
                  Clear Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Subject Form */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => {
                  setNewSubjectName(e.target.value);
                  if (showNameError) setShowNameError(false);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter subject name"
                className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
                  ${
                    showNameError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
              />
              <button
                onClick={addSubject}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                Add Subject
              </button>
            </div>
            {showNameError && (
              <div className="text-red-500 text-sm">
                Please enter a subject name
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No subjects added yet. Add a subject to get started, or reload the page to see the demo data again.
          </div>
        )}

        {/* Subjects List */}
        <div className="space-y-4">
          {subjects.map((subject) => {
            const summary = calculateSubjectSummary(subject);
            const isExpanded = expandedSubjectIds.has(subject.id);

            return (
              <div
                key={subject.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors
                  ${
                    summary.isWeightValid
                      ? "border-gray-100"
                      : "border-yellow-200 bg-yellow-50/50"
                  }`}
              >
                {/* Subject Header - Always visible */}
                <div
                  className={`p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors
                    ${summary.isWeightValid ? "" : "bg-yellow-50/30"}`}
                  onClick={() => toggleSubject(subject.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {editingSubjectId === subject.id ? (
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) =>
                            updateSubjectName(subject.id, e.target.value)
                          }
                          onBlur={() => setEditingSubjectId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setEditingSubjectId(null);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className="text-2xl font-semibold text-gray-800 w-full p-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      ) : (
                        <h2
                          className="text-2xl font-semibold text-gray-800 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSubjectId(subject.id);
                          }}
                        >
                          {subject.name}
                        </h2>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSubject(subject.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-4"
                    title="Remove subject"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-6 border-t border-gray-100">
                    {/* Weight Status */}
                    {!summary.isWeightValid && (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="font-medium text-yellow-800">
                          {summary.weightValidationMessage}
                        </div>
                      </div>
                    )}

                    {/* Assignments List */}
                    <div className="space-y-4">
                      {subject.assignments.map((assignment) => {
                        const weightError = validateInput(
                          String(assignment.weight)
                        );
                        const gradeError =
                          assignment.grade !== undefined
                            ? validateInput(String(assignment.grade))
                            : undefined;

                        return (
                          <div
                            key={assignment.id}
                            className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg group"
                          >
                            <input
                              type="text"
                              value={assignment.name}
                              onChange={(e) =>
                                updateAssignment(subject.id, assignment.id, {
                                  name: e.target.value,
                                })
                              }
                              className="flex-1 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <div className="flex flex-col gap-1">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={assignment.weight || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      subject.id,
                                      assignment.id,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Weight"
                                  className={`w-24 p-2 pr-8 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                                    ${
                                      weightError
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200"
                                    }`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                  %
                                </span>
                              </div>
                              {weightError && (
                                <div className="text-red-500 text-xs">
                                  {weightError}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={
                                    assignment.grade !== undefined
                                      ? assignment.grade
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      subject.id,
                                      assignment.id,
                                      "grade",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Grade"
                                  className={`w-24 p-2 pr-8 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                                    ${
                                      gradeError
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200"
                                    }`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                  %
                                </span>
                              </div>
                              {gradeError && (
                                <div className="text-red-500 text-xs">
                                  {gradeError}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                removeAssignment(subject.id, assignment.id)
                              }
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove assignment"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => addAssignment(subject.id)}
                      className={`mt-4 px-4 py-2 text-sm rounded-lg font-medium transition-colors
                        ${
                          summary.isWeightValid
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                    >
                      + Add Assignment
                    </button>

                    {/* Summary Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      {summary.isWeightValid && (
                        <div className="space-y-2">
                          <div className="text-green-600 text-sm font-medium">
                            {summary.weightValidationMessage}
                          </div>
                          {summary.currentTotal > 0 ? (
                            <div className="text-gray-600">
                              You currently have{" "}
                              {summary.currentTotal.toFixed(1)}% in this subject
                            </div>
                          ) : (
                            <div className="text-gray-600">
                              No grades entered yet
                            </div>
                          )}
                          {summary.remainingWeight > 0 && (
                            <div className="text-gray-600">
                              Best possible grade:{" "}
                              {summary.pointPotential.toFixed(1)}%
                              <div className="text-sm text-gray-500 mt-1">
                                (Assumes perfect scores on remaining work worth{" "}
                                {summary.remainingWeight.toFixed(1)}%)
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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
