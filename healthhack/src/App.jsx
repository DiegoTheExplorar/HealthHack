import React, { useState } from 'react';
import LandingPage from './LandingPage';
import IntroPage from './IntroPage';
import ThumbTapExercise from './ThumbTapExercise';
import FistMakingExercise from './FistMakingExercise';
import './App.css';

function App() {
  const [page, setPage] = useState('landing');
  const [exerciseType, setExerciseType] = useState(null);

  const handleExerciseSelect = (type) => {
    setExerciseType(type);
    setPage('intro');
  };

  const handleReady = () => {
    setPage('exercise');
  };

  const handleReturnHome = () => {
    setPage('landing');
    setExerciseType(null);
  };

  return (
    <>
      {page === 'landing' && (
        <LandingPage onExerciseSelect={handleExerciseSelect} />
      )}
      
      {page === 'intro' && (
        <IntroPage 
          onReady={handleReady} 
          exerciseType={exerciseType} 
        />
      )}
      
      {page === 'exercise' && exerciseType === 'thumbTapping' && (
        <ThumbTapExercise onReturnHome={handleReturnHome} />
      )}
      
      {page === 'exercise' && exerciseType === 'fistMaking' && (
        <FistMakingExercise onReturnHome={handleReturnHome} />
      )}
    </>
  );
}

export default App;