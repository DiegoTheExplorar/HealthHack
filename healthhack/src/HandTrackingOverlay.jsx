import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import React, { useEffect, useRef, useState } from "react";

const fileUrl = "/hand_landmarker.task";
const Demo = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [handPresence, setHandPresence] = useState(null);
    const [fistDetected, setFistDetected] = useState(false);

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
                    numHands: 2,
                    runningMode: "video"
                });
                detectHands();
            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };

        const drawLandmarks = (landmarksArray) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";

            landmarksArray.forEach(landmarks => {
                landmarks.forEach(landmark => {
                    const x = landmark.x * canvas.width;
                    const y = landmark.y * canvas.height;

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });
            });
        };

        const detectFistTransition = (landmarks) => {
            if (!landmarks || landmarks.length === 0) return false;
            
            const tips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
            const palmBase = landmarks[0];
            const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
            
            const openPalm = tips.every(tip => distance(tip, palmBase) > 0.2);
            const closedFist = tips.every(tip => distance(tip, palmBase) < 0.1);
            
            return openPalm && closedFist;
        };

        const detectHands = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
                setHandPresence(detections.handednesses.length > 0);
                
                if (detections.landmarks) {
                    drawLandmarks(detections.landmarks);
                    setFistDetected(detections.landmarks.some(detectFistTransition));
                }
            }
            animationFrameId = requestAnimationFrame(detectHands);
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                await initializeHandDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

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
    }, []);

    return (
        <>
            <h1>Is there a Hand? {handPresence ? "Yes" : "No"}</h1>
            <h1 style={{ color: "green", visibility: fistDetected ? "visible" : "hidden" }}>Fist Detected: Yes</h1>
            <div style={{ position: "relative" }}>
                <video ref={videoRef} autoPlay playsInline></video>
                <canvas ref={canvasRef} style={{ backgroundColor: "black", width: "600px", height: "480px" }}></canvas>
            </div>
        </>
    );
};

export default Demo;
