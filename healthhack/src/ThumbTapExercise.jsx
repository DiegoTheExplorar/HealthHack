import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CongratsPage from './CongratsPage';

const fileUrl = "/hand_landmarker.task";

const ThumbTapExercise = ({ onReturnHome }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [tapCount, setTapCount] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const lastTapTimeRef = useRef(0);

  // One-second cooldown between taps
  const tapCooldown = 1000;

  useEffect(() => {
    let handLandmarker;
    let animationFrameId;

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

    const detectThumbTap = (landmarks) => {
      if (!landmarks || landmarks.length === 0) return;
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8]; // Index finger tip
      const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);

      const now = Date.now();
      if (
        distance < 0.05 &&
        now - lastTapTimeRef.current > tapCooldown &&
        !testComplete &&
        !showInstructions
      ) {
        lastTapTimeRef.current = now;
        setTapCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 5) setTestComplete(true);
          return newCount;
        });
      }
    };

    const detectHands = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const detections = handLandmarker.detectForVideo(
          videoRef.current,
          performance.now()
        );
        if (detections.landmarks) {
          detectThumbTap(detections.landmarks[0]);
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
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (handLandmarker) {
        handLandmarker.close();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showInstructions, testComplete]);

  // Calculate progress percentage (0% to 100%)
  const progressPercent = (tapCount / 5) * 100;

  const toggleInstructions = () => {
    // Stop camera stream while showing instructions
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setShowInstructions(true);
  };

  const returnToExercise = () => {
    setShowInstructions(false);
  };

  if (testComplete) {
    return <CongratsPage exerciseType="Thumb Tapping" onReturnHome={onReturnHome} />;
  }

  if (showInstructions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-3xl font-bold mb-4">Thumb Tapping Exercise Instructions</h1>
        <video 
          src="/videos/thumb-tapping.mp4" 
          controls 
          className="mx-auto max-w-full w-[800px] rounded-lg shadow-lg"
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
            Current progress: {tapCount}/5 taps
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Dexterity Dash: Thumb Tapping Exercise</h1>

      {/* Video Container */}
      <div className="relative my-6 flex justify-center w-full max-w-screen-lg mx-auto">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          // Use max-w plus h-auto to keep aspect ratio
          className="rounded-lg shadow-lg max-w-[800px] w-full h-auto"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-6 mb-6">
        <motion.div
          className="bg-green-500 h-6 rounded-full transition-all duration-300"
          initial={{ width: `${progressPercent}%` }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Instructions + Tap Count */}
      <div className="flex items-center gap-8 mb-6 flex-wrap justify-center">
        <p className="text-xl text-center">
          Touch your thumb to your index finger. Repeat 5 times.
        </p>
        <motion.div
          className="text-6xl font-extrabold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {tapCount}
        </motion.div>
      </div>

      {/* Buttons */}
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

export default ThumbTapExercise;
