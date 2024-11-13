import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaFileExcel } from "react-icons/fa";
import carnival1 from "../assets/carnival1.jpg";
import soundManager from "../utils/sound";
import * as XLSX from "xlsx";

const RaffleDraw = ({ participants, winners, setWinners }) => {
  const [winner, setWinner] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [message, setMessage] = useState("");
  const [initialY, setInitialY] = useState(0);
  const [finalY, setFinalY] = useState(0);
  const [isInfiniteSpinning, setIsInfiniteSpinning] = useState(false);
  const [showWinners, setShowWinners] = useState(false);
  const spinRef = useRef(null);
  const centerObserverRef = useRef(null);
  
  // Adjust these values to control the animation
  const itemHeight = 140; // Increased from 100 to accommodate larger text
  const baseSpinDuration = 4; // Base duration for many participants
  const minSpinDuration = 2; // Minimum spin duration for few participants
  const numberOfSpins = 2;
  const viewportOffset = -itemHeight / 2; // Center alignment offset

  const calculateSpinDuration = (participantCount) => {
    // Adjust duration based on participant count
    // More participants = longer duration, fewer participants = shorter duration
    return Math.max(
      minSpinDuration,
      Math.min(baseSpinDuration, participantCount * 0.3)
    );
  };

  const drawWinner = () => {
    const remainingParticipants = participants.filter(
      (participant) => !winners.includes(participant)
    );
    if (remainingParticipants.length === 0) {
      setMessage("All participants have already been drawn. No more names left to draw.");
      return;
    }

    setIsDrawing(true);
    setIsInfiniteSpinning(true);
    setMessage("");
    
    // Start spinning sound
    soundManager.playSpinning();
    
    const currentSpinDuration = calculateSpinDuration(remainingParticipants.length);
    const randomIndex = Math.floor(Math.random() * remainingParticipants.length);
    
    // Start with infinite spinning
    setTimeout(() => {
      setIsInfiniteSpinning(false);
      // Calculate final position for the stop
      const spinHeight = remainingParticipants.length * itemHeight;
      const finalPosition = -(spinHeight * numberOfSpins + (randomIndex * itemHeight));
      setFinalY(finalPosition);
    }, 2000); // Spin infinitely for 2 seconds before stopping
  };

  const handleAnimationComplete = () => {
    if (!isInfiniteSpinning) {
      // Stop spinning sound and play win sound
      soundManager.stopSpinning();
      soundManager.playWin();

      const remainingParticipants = participants.filter(
        (participant) => !winners.includes(participant)
      );
      
      // Randomly select a winner from remaining participants
      const randomIndex = Math.floor(Math.random() * remainingParticipants.length);
      const selectedWinner = remainingParticipants[randomIndex];
      
      if (selectedWinner) {
        setWinner(selectedWinner);
        setWinners([...winners, selectedWinner]);
      }
      setIsDrawing(false);
    }
  };

  // Add this helper function to get remaining participants
  const getRemainingParticipants = () => {
    return participants.filter(participant => !winners.includes(participant));
  };

  // Add responsive font size calculation
  const calculateFontSize = (name) => {
    if (!name) return '6xl';
    if (name.length > 15) return '4xl';
    if (name.length > 10) return '5xl';
    return '6xl';
  };

  const exportWinners = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      winners.map((name, index) => ({
        'Draw Order': index + 1,
        'Winner Name': name
      }))
    );
    
    XLSX.utils.book_append_sheet(wb, ws, "Winners");
    XLSX.writeFile(wb, "raffle-winners.xlsx");
  };

  useEffect(() => {
    setWinner("");
    setMessage("");
  }, [participants]);

  // Cleanup sounds when component unmounts
  useEffect(() => {
    return () => {
      soundManager.stopSpinning();
    };
  }, []);

  return (
    <div className="w-screen min-h-screen flex items-center justify-center text-center relative"
      style={{
        backgroundImage: `url(${carnival1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'lighten',
      }}>
      {/* Brighter overlay with rainbow gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-red-500/30 to-pink-500/30" 
           style={{ mixBlendMode: 'screen' }} />
      
      <div className="relative z-10 w-full px-4">
        <motion.div 
          className="relative mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="font-carnival text-6xl md:text-8xl text-amber-900 relative z-10 tracking-wider"
            style={{ 
              textShadow: `
                4px 4px 0px rgba(255,255,255,0.8),
                8px 8px 0px rgba(255,187,51,0.4)
              `,
              WebkitTextStroke: '2px rgba(139,69,19,0.3)'
            }}
            animate={{ 
              scale: [1, 1.02, 1],
              rotate: [-1, 1, -1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            The Winner is
          </motion.h2>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-amber-500/20 to-yellow-300/20 blur-xl" />
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/10 to-yellow-500/10 rounded-full animate-pulse" />
        </motion.div>

        <div className="relative h- md:h-64 w-full bg-white/30 backdrop-blur-sm rounded-xl overflow-hidden border-4 border-amber-600 shadow-2xl">
          {/* Winner indicator with brighter colors */}
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-16 bg-amber-500/50 border-y-2 border-amber-600" />
          
          {isDrawing ? (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-20">
              <motion.div
                ref={spinRef}
                className="flex flex-col items-center justify-center h-[400px]"
                initial={{ y: 0 }}
                animate={isInfiniteSpinning 
                  ? { 
                      y: [-itemHeight * getRemainingParticipants().length, 0],
                      transition: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }
                  : { y: finalY }
                }
                transition={!isInfiniteSpinning ? {
                  duration: calculateSpinDuration(getRemainingParticipants().length),
                  ease: [0.19, 0.82, 0.84, 1],
                  type: "spring",
                  stiffness: 50,
                  damping: 20
                } : undefined}
                onAnimationComplete={!isInfiniteSpinning ? handleAnimationComplete : undefined}
              >
                {[
                  ...getRemainingParticipants(),
                  ...getRemainingParticipants(),
                  ...getRemainingParticipants(),
                  ...getRemainingParticipants() // Add one more repeat for smoother infinite scroll
                ].map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    className={`py-4 px-6 font-carnival text-amber-900 whitespace-nowrap text-${calculateFontSize(name)}`}
                    style={{
                      height: `${itemHeight}px`,
                      textShadow: '4px 4px 8px rgba(255,255,255,0.4)' // Enhanced shadow for larger text
                    }}
                  >
                    {name}
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                className="absolute inset-0 flex items-center justify-center p-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 1 }} // Increased from 0.5
              >
                <span className={`font-carnival text-amber-900 text-${calculateFontSize(winner || message)}`}
                      style={{ textShadow: '3px 3px 6px rgba(255,255,255,0.4)' }}>
                  {winner || message || "Ready to Draw!"}
                </span>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <motion.button 
          onClick={drawWinner} 
          className="mt-8 bg-amber-700 text-white py-4 px-12 rounded-xl font-carnival text-xl shadow-xl 
                 hover:bg-amber-600 transition-all border-2 border-amber-500 
                 hover:shadow-amber-400/50 transform hover:-translate-y-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isDrawing}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}
        >
          {isDrawing ? "Please wait..." : "Draw Winner"}
        </motion.button>

        {winners.length > 0 && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowWinners(!showWinners)}
                className="bg-amber-600/80 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={showWinners ? "Hide Winners" : "Show Winners"}
              >
                {showWinners ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </motion.button>
              <motion.button
                onClick={exportWinners}
                className="bg-green-600/80 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Export to Excel"
              >
                <FaFileExcel size={16} />
              </motion.button>
            </div>

            <AnimatePresence>
              {showWinners && (
                <motion.div
                  className="mt-4 p-4 bg-white/40 rounded-lg backdrop-blur-sm w-full"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-carnival text-2xl text-amber-900 mb-3"
                      style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.4)' }}>
                    Previous Winners:
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {winners.map((prev, index) => (
                      <motion.span
                        key={index}
                        className="bg-amber-700/20 px-6 py-3 rounded-xl text-amber-900 text-lg font-bold"
                        style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.4)' }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                      >
                        {prev}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaffleDraw;
