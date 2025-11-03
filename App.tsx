
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { OutputCard } from './components/OutputCard';
import { Loader } from './components/Loader';
import { generateSongContent } from './services/geminiService';

const App: React.FC = () => {
  const [songDescription, setSongDescription] = useState<string>('');
  const [lyrics, setLyrics] = useState<string>('');
  const [styleDescription, setStyleDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!songDescription.trim()) {
      setError('Please enter a song description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setHasGenerated(true);
    try {
      const result = await generateSongContent(songDescription);
      setLyrics(result.lyrics);
      setStyleDescription(result.styleDescription);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating content. Please check the console and try again.');
      setLyrics('');
      setStyleDescription('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Suno AI Lyric Architect
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Turn your song ideas into professional lyrics and style descriptions for Suno v5.
          </p>
        </header>

        <main>
          <InputForm
            songDescription={songDescription}
            setSongDescription={setSongDescription}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {hasGenerated && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OutputCard 
                title="Lyrics & Metadata" 
                content={lyrics} 
                isLoading={isLoading}
                placeholder="Generating lyrics..."
              />
              <OutputCard 
                title="Style Description" 
                content={styleDescription} 
                isLoading={isLoading} 
                placeholder="Generating style description..."
              />
            </div>
          )}

          {!hasGenerated && (
             <div className="mt-8 text-center text-gray-500">
                <p>Your generated lyrics and style description will appear here.</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
