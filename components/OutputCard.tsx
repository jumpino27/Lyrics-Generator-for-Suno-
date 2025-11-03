
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface OutputCardProps {
  title: string;
  content: string;
  isLoading: boolean;
  placeholder: string;
}

export const OutputCard: React.FC<OutputCardProps> = ({ title, content, isLoading, placeholder }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
        <button
          onClick={handleCopy}
          disabled={!content || isLoading}
          className="flex items-center px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CopyIcon className="w-4 h-4 mr-2" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 flex-grow overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">{placeholder}</p>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
            {content || "No content generated."}
          </pre>
        )}
      </div>
    </div>
  );
};
