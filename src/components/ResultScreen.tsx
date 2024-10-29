import React from 'react';
import { Share2 } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';

interface ResultScreenProps {
  theme: string;
  solvedWords: string[];
  timeTaken: number;
  onPlayAgain: () => void;
  onShare: () => void;
}

export function ResultScreen({ theme, solvedWords, timeTaken, onPlayAgain, onShare }: ResultScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Congratulations! 🎉</h2>
        <p className="text-center mb-2">You found all words in the "{theme}" category!</p>
        <p className="text-center mb-4 text-lg font-semibold">Time: {formatTime(timeTaken)}</p>
        
        <div className="space-y-2 mb-6">
          {solvedWords.map((word) => (
            <div key={word} className="bg-green-100 p-2 rounded text-center font-medium">
              {word}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}