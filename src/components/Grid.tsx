import React from 'react';
import { motion } from 'framer-motion';

interface GridProps {
  letters: string[];
  selectedIndices: number[];
  solvedIndices: number[];
  isError: boolean;
  onLetterClick: (index: number) => void;
}

export function Grid({ letters, selectedIndices, solvedIndices, isError, onLetterClick }: GridProps) {
  const getLetterStatus = (index: number) => {
    if (solvedIndices.includes(index)) return 'solved';
    if (selectedIndices.includes(index)) return isError ? 'error' : 'selected';
    return 'default';
  };

  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {letters.map((letter, index) => (
        <motion.button
          key={`${index}-${letter}`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLetterClick(index)}
          className={`
            w-14 h-14 rounded-lg font-bold text-2xl flex items-center justify-center
            transition-colors duration-300
            ${getLetterStatus(index) === 'solved' ? 'bg-green-500 text-white' : ''}
            ${getLetterStatus(index) === 'selected' ? 'bg-blue-500 text-white' : ''}
            ${getLetterStatus(index) === 'error' ? 'bg-red-500 text-white' : ''}
            ${getLetterStatus(index) === 'default' ? 'bg-white shadow-md hover:bg-gray-50' : ''}
          `}
        >
          {letter}
        </motion.button>
      ))}
    </div>
  );
}