import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CongratsPage from './CongratsPage';

const fileUrl = "/hand_landmarker.task";

const FistMakingExercise = ({ onReturnHome }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [fistCount, setFistCount] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const lastFistTimeRef = useRef(0);
  const fistCooldown = 1000; // 1 second cooldown between fists

  useEffect(() => {
    let handLandmarker;
    let animationFrameId;
    let previouslyOpenHand = false;

    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: fileUrl },
          numHands: 1,
          runningMode: "video",
        });
        detectHands();
      } catch (error) {
        console.error("Error initializing hand detection:", error);
      }
    };

    const detectFist = (landmarks) => {
      if (!landmarks || landmarks.length === 0) return;
      
      // Calculate average distance of fingertips to palm
      const palmBase = landmarks[0]; // Wrist point
      const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]; // Index, middle, ring, pinky tips
      
      let totalDistance = 0;
      fingerTips.forEach(tip => {
        totalDistance += Math.hypot(tip.x - palmBase.x, tip.y - palmBase.y);
      });
      
      const avgDistance = totalDistance / fingerTips.length;
      const now = Date.now();
      
      // Detect transition from open hand to fist
      const isFist = avgDistance < 0.15;
      
      if (!isFist) {
        previouslyOpenHand = true;
      } else if (previouslyOpenHand && isFist && now - lastFistTimeRef.current > fistCooldown && !testComplete && !showInstructions) {
        previouslyOpenHand = false;
        lastFistTimeRef.current = now;
        setFistCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) setTestComplete(true);
          return newCount;
        });
      }
    };

    const detectHands = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
        if (detections.landmarks) {
          detectFist(detections.landmarks[0]);
        }
      }
      animationFrameId = requestAnimationFrame(detectHands);
    };

    const startWebcam = async () => {
      if (showInstructions) return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await initializeHandDetection();
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    if (!showInstructions) {
      startWebcam();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (handLandmarker) {
        handLandmarker.close();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showInstructions]);

  // Calculate progress percentage (0% to 100%)
  const progressPercent = (fistCount / 5) * 100;

  const toggleInstructions = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowInstructions(true);
  };

  const returnToExercise = () => {
    setShowInstructions(false);
  };

  if (testComplete) {
    return <CongratsPage exerciseType="Fist Making" onReturnHome={onReturnHome} />;
  }

  if (showInstructions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-3xl font-bold mb-4">Fist Making Exercise Instructions</h1>
        <video 
          src="/videos/fist-making.mp4" 
          controls 
          className="max-w-full w-[800px] rounded-lg shadow-lg"
        >
          Your browser does not support the video tag.
        </video>
        <div className="mt-6 flex gap-4">
          <button 
            onClick={returnToExercise} 
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-lg"
          >
            I am ready
          </button>
          <div className="px-6 py-3 bg-gray-700 rounded-lg text-white text-lg">
            Current progress: {fistCount}/5 fists
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Dexterity Dash: Fist Making Exercise</h1>
      
      <div className="relative my-6 flex justify-center w-full mx-auto max-w-5xl">
        <video ref={videoRef} autoPlay playsInline className="w-[1000px] h-[750px] rounded-lg shadow-lg" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-6 mb-6">
        <motion.div 
          className="bg-green-500 h-6 rounded-full transition-all duration-300"
          initial={{ width: `${progressPercent}%` }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
          style={{ width: `${progressPercent}%` }}
        ></motion.div>
      </div>
      
      <div className="flex flex-col items-center gap-4 mb-6">
        <p className="text-xl text-center">
          Start with an open palm, then make a fist. Repeat 5 times.
        </p>
        <motion.div
          className="text-8xl font-extrabold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {fistCount}
        </motion.div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={toggleInstructions}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white text-lg"
        >
          Watch Instructions Again
        </button>
      </div>
    </div>
  );
};

export default FistMakingExercise;
