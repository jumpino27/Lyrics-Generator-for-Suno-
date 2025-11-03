
import React from 'react';
import { Loader } from './Loader';

interface InputFormProps {
  songDescription: string;
  setSongDescription: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ songDescription, setSongDescription, onGenerate, isLoading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <label htmlFor="song-description" className="block text-lg font-medium text-gray-300 mb-2">
        Describe your song idea
      </label>
      <textarea
        id="song-description"
        rows={4}
        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-200 placeholder-gray-500"
        placeholder="e.g., an upbeat 80s synth-pop song about winning a championship, or a sad acoustic ballad about a lost friendship..."
        value={songDescription}
        onChange={(e) => setSongDescription(e.target.value)}
        disabled={isLoading}
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader />
              <span className="ml-2">Generating...</span>
            </>
          ) : (
            'Generate Content'
          )}
        </button>
      </div>
    </div>
  );
};
