import { useState } from 'react';
import { Subject } from '@/types/subject';
import { getDemoData } from '@/utils/calculations';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [showNameError, setShowNameError] = useState(false);
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<Set<string>>(new Set());
  const [isShowingDemoData, setIsShowingDemoData] = useState(true);

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

  const loadDemoData = () => {
    const demoData = getDemoData();
    setSubjects(demoData);
    setExpandedSubjectIds(new Set(demoData.map(subject => subject.id)));
    setIsShowingDemoData(true);
  };

  return {
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
    loadDemoData
  };
}; 