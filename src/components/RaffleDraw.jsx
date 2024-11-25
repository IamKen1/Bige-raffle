import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Visibility, VisibilityOff, SaveAlt, Replay } from '@mui/icons-material';
import carnival3 from "../assets/carnival3.jpg";
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
  const baseSpinDuration = 10; // Further increased duration for smoother animation
  const minSpinDuration = 6; // Further increased minimum duration for smoother animation
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

    if (remainingParticipants.length === 1) {
      const selectedWinner = remainingParticipants[0];
      setWinner(selectedWinner);
      setWinners([...winners, selectedWinner]);
      setMessage("Only one participant left. Automatically selected as the winner.");
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
    }, 5000); // Spin infinitely for 5 seconds before stopping
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
        // Ensure the animation stops at the winner
        const finalPosition = -(remainingParticipants.length * itemHeight * numberOfSpins + (randomIndex * itemHeight));
        setFinalY(finalPosition);
      }
      setIsDrawing(false);
    }
  };

  // Add this helper function to get remaining participants
  const getRemainingParticipants = () => {
    return participants.filter(participant => !winners.includes(participant));
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

  const clearWinners = () => {
    setWinners([]);
    setWinner("");
    setMessage("Ready to draw again!");
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
        backgroundImage: `url(${carnival3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'lighten',
      }}>
      {/* Brighter overlay with rainbow gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-red-500/30 to-pink-500/30" 
           style={{ mixBlendMode: 'screen' }} />
      
      <div className="relative z-10 w-full px-4 top-20">
        <div id="draw-container" className="relative h-[calc(100vh-350px)] md:h-[calc(100vh-350px)] w-2/3 mx-auto  bg-white/30 backdrop-blur-sm rounded-xl overflow-hidden border-4 border-amber-600 shadow-2xl">
          {/* Winner indicator with brighter colors */}
          {!isDrawing && (
            <>
              {winner && (
                <div className="absolute inset-x-0 top-1/4 transform -translate-y-1/2 flex items-center justify-center">
                  <span className="font-carnival text-white text-4xl md:text-6xl tracking-wider"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                    The Winner is
                  </span>
                </div>
              )}
              <div id="winner-container" className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-32 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 border-y-2 border-amber-600 flex items-center justify-center px-4 rounded-lg shadow-lg">
                {winner ? (
                  <span className="font-carnival text-white text-5xl md:text-7xl whitespace-normal break-words text-center"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                    {winner}
                  </span>
                ) : (
                  <span className="font-carnival text-white text-5xl md:text-7xl whitespace-normal break-words text-center"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                    Ready to Draw!
                  </span>
                )}
              </div>
            </>
          )}
          
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
                  duration: calculateSpinDuration(getRemainingParticipants().length) + 3,
                  ease: [0.42, 0, 0.58, 1],
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
                  ...getRemainingParticipants()
                ].map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    className="py-4 px-6 font-carnival text-white whitespace-nowrap bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 rounded-lg shadow-md"
                    style={{
                      height: `${itemHeight}px`,
                      fontSize: '3.5rem',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
                    }}
                  >
                    {name}
                  </div>
                ))}
              </motion.div>
            </div>
          ) : null}
        </div>

        <motion.button 
          onClick={drawWinner} 
          className="mt-5 bg-amber-700 text-white py-3 px-5 rounded-xl font-carnival text-md shadow-xl 
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
            <div className="flex gap-2 mb-2">
              <motion.button
                onClick={() => setShowWinners(!showWinners)}
                className="bg-amber-600/80 text-white w-10 h-10 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={showWinners ? "Hide Winners" : "Show Winners"}
              >
                {showWinners ? <VisibilityOff /> : <Visibility />}
              </motion.button>
              <motion.button
                onClick={exportWinners}
                className="bg-green-600/80 text-white w-10 h-10 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Export to Excel"
              >
                <SaveAlt />
              </motion.button>
              <motion.button
                onClick={clearWinners}
                className="bg-red-600/80 text-white w-10 h-10 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Clear Winners"
              >
                <Replay />
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
