import React from 'react';
import { motion } from "framer-motion";

const IntroPage = ({ onReady, exerciseType }) => {
  // Select the correct video based on exercise type
  const videoSource = exerciseType === 'thumbTapping' 
    ? "/thumb-tapping.mp4" 
    : "/fist-making.mp4";
  
  const exerciseTitle = exerciseType === 'thumbTapping'
    ? "Thumb Tapping Exercise"
    : "Fist Making Exercise";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-6"
      >
        Dexterity Dash: {exerciseTitle} Instructions
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-4xl flex justify-center"
      >
        <video 
          src={videoSource} 
          controls 
          className="w-[800px] rounded-lg shadow-lg"
        >
          Your browser does not support the video tag.
        </video>
      </motion.div>
      
      <motion.button 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onReady} 
        className="mt-8 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-xl font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        I am ready
      </motion.button>
    </div>
  );
};

export default IntroPage;
