import React from 'react';

interface DemoDataButtonProps {
  isShowingDemoData: boolean;
  onClear: () => void;
  onLoad: () => void;
}

export default function DemoDataButton({
  isShowingDemoData,
  onClear,
  onLoad,
}: DemoDataButtonProps) {
  return (
    <button
      onClick={isShowingDemoData ? onClear : onLoad}
      className={`mt-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
        isShowingDemoData 
          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
    >
      {isShowingDemoData ? 'Clear Demo Data' : 'Load Demo Data'}
    </button>
  );
} 