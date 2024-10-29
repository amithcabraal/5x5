import React, { useState, useEffect } from 'react';
import { wordSets } from './data/wordSets';
import { Grid } from './components/Grid';
import { ResultScreen } from './components/ResultScreen';
import { Sparkles, Pause, Play } from 'lucide-react';
import { rearrangeGrid } from './utils/gridUtils';
import { formatTime } from './utils/timeUtils';

function App() {
  const [currentSetIndex, setCurrentSetIndex] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const setId = urlParams.get('set');
    if (setId) {
      const index = wordSets.findIndex(set => set.id === setId);
      return index !== -1 ? index : Math.floor(Math.random() * wordSets.length);
    }
    return Math.floor(Math.random() * wordSets.length);
  });

  const [letters, setLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [solvedIndices, setSolvedIndices] = useState<number[]>([]);
  const [solvedWords, setSolvedWords] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [finalTime, setFinalTime] = useState(0);

  const currentSet = wordSets[currentSetIndex];

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!showResult && !isPaused) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showResult, isPaused]);

  useEffect(() => {
    const allLetters = currentSet.words.join('').split('');
    for (let i = allLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
    }
    setLetters(allLetters);
    setSelectedIndices([]);
    setSolvedIndices([]);
    setSolvedWords([]);
    setShowResult(false);
    setTimer(0);
    setIsPaused(false);
  }, [currentSetIndex]);

  const handleLetterClick = (index: number) => {
    if (solvedIndices.includes(index) || isPaused) return;
    
    setIsError(false);
    
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
      return;
    }

    if (selectedIndices.length < 5) {
      const newSelected = [...selectedIndices, index];
      setSelectedIndices(newSelected);

      if (newSelected.length === 5) {
        const word = newSelected.map(i => letters[i]).join('');
        if (currentSet.words.includes(word)) {
          const newLetters = rearrangeGrid(letters, solvedWords, word);
          setLetters(newLetters);
          
          const newSolvedIndices = Array.from(
            { length: (solvedWords.length + 1) * 5 },
            (_, i) => i
          );
          
          setSolvedIndices(newSolvedIndices);
          setSolvedWords([...solvedWords, word]);
          setSelectedIndices([]);

          if (solvedWords.length + 1 === currentSet.words.length) {
            setFinalTime(timer);
            setTimeout(() => setShowResult(true), 1000);
          }
        } else {
          setIsError(true);
          setTimeout(() => {
            setSelectedIndices([]);
            setIsError(false);
          }, 1000);
        }
      }
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?set=${currentSet.id}`;
    const message = `I completed "${currentSet.theme}" in ${formatTime(finalTime)} on QuizWordz 5x5!\n\nCan you beat my time? Try it here: ${url}`;
    navigator.clipboard.writeText(message);
    alert('Results copied to clipboard!');
  };

  const handlePlayAgain = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * wordSets.length);
    } while (nextIndex === currentSetIndex);
    setCurrentSetIndex(nextIndex);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-500" />
            QuizWordz 5x5
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <p className="text-xl font-mono">{formatTime(timer)}</p>
            <button
              onClick={togglePause}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          </div>
          <p className="text-gray-600 mt-2">Find five 5-letter words about: {currentSet.theme}</p>
          <p className="text-sm text-gray-500 mt-1">Set {currentSetIndex + 1} of {wordSets.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          {!isPaused ? (
            <Grid
              letters={letters}
              selectedIndices={selectedIndices}
              solvedIndices={solvedIndices}
              isError={isError}
              onLetterClick={handleLetterClick}
            />
          ) : (
            <div className="h-[360px] flex items-center justify-center">
              <p className="text-xl text-gray-500 font-medium">Game Paused</p>
            </div>
          )}
        </div>

        {showResult && (
          <ResultScreen
            theme={currentSet.theme}
            solvedWords={solvedWords}
            timeTaken={finalTime}
            onPlayAgain={handlePlayAgain}
            onShare={handleShare}
          />
        )}
      </div>
    </div>
  );
}

export default App;