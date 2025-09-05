import React, { useState, useEffect, useRef } from "react";
import "./BreathingGame.css";

const steps = [
  { text: "Inhale - Take a deep breath", scale: 1.8 },
  { text: "Hold your breath", scale: 1.8 },
  { text: "Exhale - Slowly release the air", scale: 1 },
];

const sessionDuration = 60; // مدة دقيقة واحدة
const tips = [
  "Focus on your breathing.",
  "Relax your shoulders.",
  "Clear your mind.",
  "Feel your body calm down.",
  "Good job! You're more relaxed now 🌸",
];

const BreathingGame = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionDuration);
  const [tipIndex, setTipIndex] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if ((sessionDuration - (timeLeft - 1)) % 4 === 0) {
          setStepIndex((prev) => (prev + 1) % steps.length);
          setTipIndex((prev) => (prev + 1) % tips.length);
        }
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsRunning(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
    setTimeLeft(sessionDuration);
    setStepIndex(0);
    setTipIndex(0);
    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.volume = 0.4; // صوت منخفض
    }
  };

  return (
    <div className="game-container">
      <img src="/relax-background.jpg" alt="background" className="background-img" />

      <div
        className="circle"
        style={{
          transform: `scale(${steps[stepIndex].scale})`,
        }}
      ></div>

      <h2>{steps[stepIndex].text}</h2>

      {isRunning && timeLeft > 0 && <p className="timer">Time Left: {timeLeft}s</p>}
      {isRunning && timeLeft > 0 && <p className="tip">{tips[tipIndex]}</p>}

      {!isRunning && timeLeft === sessionDuration && (
        <button onClick={handleStart}>Start Breathing Session</button>
      )}

      {!isRunning && timeLeft === 0 && (
        <p className="tip">Session completed! Well done 🌸</p>
      )}

      <audio ref={audioRef} loop>
        <source src="/calm.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

export default BreathingGame;
