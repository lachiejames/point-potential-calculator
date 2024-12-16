import React from 'react';

interface AddSubjectFormProps {
  newSubjectName: string;
  showNameError: boolean;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export default function AddSubjectForm({
  newSubjectName,
  showNameError,
  onNameChange,
  onSubmit,
}: AddSubjectFormProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter subject name"
          className={`flex-1 p-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            showNameError ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        <button
          onClick={onSubmit}
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
  );
} 