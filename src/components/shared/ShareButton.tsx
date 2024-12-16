import React from 'react';

interface ShareButtonProps {
  shareUrl: string;
  showCopiedMessage: boolean;
  onCopy: () => void;
}

export default function ShareButton({
  shareUrl,
  showCopiedMessage,
  onCopy,
}: ShareButtonProps) {
  return (
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
          onClick={onCopy}
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
  );
} 