import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';

const CongratsPage = ({ exerciseType, onReturnHome }) => {
  useEffect(() => {
    // Launch confetti when component mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Launch confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold mb-8">Congratulations!</h1>
        <div className="text-9xl mb-12">🎉</div>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl mb-12 max-w-lg text-center"
      >
        You've successfully completed the {exerciseType} exercise in Dexterity Dash.
        Well done on your progress!
      </motion.p>
      
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onReturnHome}
        className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-xl font-semibold"
      >
        Return to Home
      </motion.button>
    </div>
  );
};

export default CongratsPage;