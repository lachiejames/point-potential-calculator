"use client";

import { useState, useEffect } from "react";
import { Subject, Assignment } from "@/types/subject";
import { calculateSubjectSummary, getDemoData } from "@/utils/calculations";
import { encodeStateToUrl, decodeStateFromUrl } from "@/utils/url";

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [showNameError, setShowNameError] = useState(false);
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<Set<string>>(new Set());
  const [isShowingDemoData, setIsShowingDemoData] = useState(true);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Load state from URL on initial render
  useEffect(() => {
    const urlSubjects = decodeStateFromUrl(window.location.search);
    if (urlSubjects) {
      setSubjects(urlSubjects);
      setExpandedSubjectIds(new Set(urlSubjects.map(subject => subject.id)));
      setIsShowingDemoData(false);
    } else {
      setSubjects(getDemoData());
      setExpandedSubjectIds(new Set(getDemoData().map(subject => subject.id)));
    }
  }, []);

  // Update share URL whenever subjects change
  useEffect(() => {
    if (subjects.length > 0) {
      setShareUrl(encodeStateToUrl(subjects));
    } else {
      setShareUrl("");
    }
  }, [subjects]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Point Potential Calculator
        </h1>

        {/* Share Link Section */}
        {subjects.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-blue-100 transform transition-all hover:shadow-xl">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Your Calculations
              </h2>
              <p className="text-gray-600">
                Copy this link to access your calculations from any device or share with others:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={copyShareLink}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
                >
                  {showCopiedMessage ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="ml-2">Add a subject using the form below</span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">For each subject, add all assignments that contribute to your final grade</span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">Enter the weight (percentage contribution) for each assignment - these must total 100%</span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">Enter grades for completed assignments to see your current total</span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">Your point potential shows the highest possible grade you can achieve</span>
            </li>
          </ol>
        </div>

        {/* Demo Data Notice */}
        {isShowingDemoData && (
          <div className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                This calculator is pre-populated with sample computer science subjects to demonstrate how it works. Clear the demo data to start adding your own subjects.
              </p>
              <button
                onClick={clearDemoData}
                className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
              >
                Clear Demo Data
              </button>
            </div>
          </div>
        )}

        {/* Add Subject Form */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter subject name"
              className={`flex-1 p-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                showNameError ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <button
              onClick={addSubject}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Subject
            </button>
          </div>
          {showNameError && (
            <p className="mt-2 text-sm text-red-600">Please enter a subject name</p>
          )}
        </div>

        {/* Subjects List */}
        <div className="space-y-6">
          {subjects.map((subject) => {
            const summary = calculateSubjectSummary(subject);
            const isExpanded = expandedSubjectIds.has(subject.id);

            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden transition-all duration-200 hover:shadow-xl"
              >
                <div
                  className="p-4 sm:p-6 cursor-pointer"
                  onClick={() => toggleSubject(subject.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingSubjectId === subject.id ? (
                        <input
                          type="text"
                          defaultValue={subject.name}
                          onBlur={(e) => {
                            updateSubjectName(subject.id, e.target.value);
                            setEditingSubjectId(null);
                          }}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                          {subject.name}
                        </h3>
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
                              <th className="pb-3 text-left text-gray-600 font-medium">Assignment</th>
                              <th className="pb-3 text-right text-gray-600 font-medium w-24">Weight (%)</th>
                              <th className="pb-3 text-right text-gray-600 font-medium w-24">Grade (%)</th>
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
                                      updateAssignment(subject.id, assignment.id, {
                                        name: e.target.value,
                                      })
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
                                        handleInputChange(
                                          subject.id,
                                          assignment.id,
                                          "weight",
                                          e.target.value
                                        )
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
                                        handleInputChange(
                                          subject.id,
                                          assignment.id,
                                          "grade",
                                          e.target.value
                                        )
                                      }
                                      className="w-16 text-right bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded p-1"
                                    />
                                  </div>
                                </td>
                                <td className="py-3 text-center">
                                  <button
                                    onClick={() =>
                                      removeAssignment(subject.id, assignment.id)
                                    }
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
                          <p className={`text-sm ${summary.totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
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
                            onClick={() => addAssignment(subject.id)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            Add Assignment
                          </button>
                          <button
                            onClick={() => removeSubject(subject.id)}
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
          })}
        </div>
      </div>
    </main>
  );
}
