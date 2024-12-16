"use client";

import { useEffect, useRef } from "react";
import { useSubjects } from "@/hooks/useSubjects";
import { useAssignments } from "@/hooks/useAssignments";
import { useUrlState } from "@/hooks/useUrlState";
import SubjectList from "@/components/subjects/SubjectList";
import AddSubjectForm from "@/components/subjects/AddSubjectForm";
import ShareButton from "@/components/shared/ShareButton";
import DemoDataButton from "@/components/shared/DemoDataButton";

export default function Home() {
  const {
    subjects,
    setSubjects,
    newSubjectName,
    setNewSubjectName,
    editingSubjectId,
    setEditingSubjectId,
    showNameError,
    expandedSubjectIds,
    isShowingDemoData,
    setIsShowingDemoData,
    addSubject,
    removeSubject,
    updateSubjectName,
    toggleSubject,
    clearDemoData,
    loadDemoData,
  } = useSubjects();

  const { addAssignment, removeAssignment, handleInputChange } = useAssignments(
    subjects,
    setSubjects
  );

  const {
    shareUrl,
    showCopiedMessage,
    updateShareUrl,
    copyShareLink,
    loadStateFromUrl,
  } = useUrlState();

  const isInitialized = useRef(false);

  // Load state from URL or demo data on initial render
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const urlSubjects = loadStateFromUrl();
    if (urlSubjects && urlSubjects.length > 0) {
      setSubjects(urlSubjects);
      expandedSubjectIds.clear();
      urlSubjects.forEach((subject) => {
        expandedSubjectIds.add(subject.id);
      });
      setIsShowingDemoData(false);
    } else {
      loadDemoData();
    }
  }); // Empty dependency array since we use isInitialized.current to prevent re-runs

  // Update share URL whenever subjects change
  useEffect(() => {
    updateShareUrl(subjects);
  }, [subjects, updateShareUrl]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Point Potential Calculator
        </h1>

        {/* Share Link Section */}
        {subjects.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-blue-100 transform transition-all hover:shadow-xl">
            <ShareButton
              shareUrl={shareUrl}
              showCopiedMessage={showCopiedMessage}
              onCopy={copyShareLink}
            />
          </div>
        )}

        {/* How to Use Section */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="ml-2">Add a subject using the form below</span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">
                For each subject, add all assignments that contribute to your
                final grade
              </span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">
                Enter the weight (percentage contribution) for each assignment -
                these must total 100%
              </span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">
                Enter grades for completed assignments to see your current total
              </span>
            </li>
            <li className="flex items-start">
              <span className="ml-2">
                Your point potential shows the highest possible grade you can
                achieve
              </span>
            </li>
          </ol>
        </div>

        {/* Demo Data Notice */}
        {isShowingDemoData && (
          <div className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                This calculator is pre-populated with sample computer science
                subjects to demonstrate how it works. Clear the demo data to
                start adding your own subjects.
              </p>
              <DemoDataButton
                isShowingDemoData={isShowingDemoData}
                onClear={clearDemoData}
                onLoad={loadDemoData}
              />
            </div>
          </div>
        )}

        <AddSubjectForm
          newSubjectName={newSubjectName}
          showNameError={showNameError}
          onNameChange={setNewSubjectName}
          onSubmit={addSubject}
        />

        <SubjectList
          subjects={subjects}
          expandedSubjectIds={expandedSubjectIds}
          editingSubjectId={editingSubjectId}
          onToggleSubject={toggleSubject}
          onRemoveSubject={removeSubject}
          onUpdateSubjectName={updateSubjectName}
          onAddAssignment={addAssignment}
          onRemoveAssignment={removeAssignment}
          onUpdateAssignment={handleInputChange}
          onStartEdit={(id) => setEditingSubjectId(id)}
          onEndEdit={() => setEditingSubjectId(null)}
        />
      </div>
    </main>
  );
}
