import React from 'react';
import { motion } from "framer-motion";

const LandingPage = ({ onExerciseSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-6">Welcome to Dexterity Dash</h1>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-12 text-xl max-w-md text-center"
      >
        Choose an exercise to begin your therapy session
      </motion.p>
      
      <div className="flex flex-col gap-6 w-full max-w-md">
        <motion.button 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={() => onExerciseSelect('thumbTapping')} 
          className="w-full px-12 py-6 bg-blue-500 hover:bg-blue-600 border-2 border-white rounded-lg text-white text-2xl font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Thumb Tapping
        </motion.button>
        
        <motion.button 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={() => onExerciseSelect('fistMaking')} 
          className="w-full px-12 py-6 bg-green-500 hover:bg-green-600 border-2 border-white rounded-lg text-white text-2xl font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Fist Making
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPage;