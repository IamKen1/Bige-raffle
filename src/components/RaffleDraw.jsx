import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Visibility, VisibilityOff, SaveAlt, Replay } from '@mui/icons-material';
import carnival3 from "../assets/carnival4.jpg";
import soundManager from "../utils/sound";
import * as XLSX from "xlsx";

const RaffleDraw = ({ participants, winners, setWinners }) => {
  const [winner, setWinner] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [message, setMessage] = useState("");
  const [showWinners, setShowWinners] = useState(false);
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const [flashingIndex, setFlashingIndex] = useState(0);
  const flashingIntervalRef = useRef(null);

  const itemHeight = 140;

  const calculateFontSize = (name) => {
    const baseSize = 5;
    const reducedSize = 4;
    const maxLength = 18;
    return name.length > maxLength ? `${reducedSize}rem` : `${baseSize}rem`;
  };

  const drawWinner = () => {
    setIsConfettiVisible(false);
    const remainingParticipants = participants.filter(
      (participant) => !winners.includes(participant)
    );
    if (remainingParticipants.length === 0) {
      setMessage("All participants have already been drawn. No more names left to draw.");
      return;
    }

    setIsDrawing(true);
    setMessage("");

    soundManager.playSpinning();

    flashingIntervalRef.current = setInterval(() => {
      setFlashingIndex((prevIndex) => (prevIndex + 1) % remainingParticipants.length);
    }, 100);

    setTimeout(() => {
      clearInterval(flashingIntervalRef.current);
      const selectedWinner = remainingParticipants[flashingIndex];
      setWinner(selectedWinner);
      setWinners([...winners, selectedWinner]);
      setIsConfettiVisible(true);
      setIsDrawing(false);
      soundManager.stopSpinning();
      soundManager.playWin();
    }, 2000);
  };

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
      {isConfettiVisible && <Confetti />}
      <div className="relative z-10 w-full px-2 top-24 max-w-screen-2xl mx-auto">
        <div id="draw-container" className="relative h-[55vh] my-10 w-full mx-auto overflow-hidden 
          sm:max-w-md md:max-w-4xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-6xl ">
          {!isDrawing && (
            <>
              {winner && (
                <motion.div
                  className="absolute inset-x-0 top-1/4 transform -translate-y-1/2 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span className="font-cooper text-white tracking-wider raffle-winner-text"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)', fontSize: '3.5rem' }}>
                    The Winner is
                  </span>
                </motion.div>
              )}
              <motion.div
                id="winner-container"
                className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-32 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 flex items-center justify-center px-4 rounded-lg shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <span className="font-cooper text-white text-center raffle-winner-container"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontSize: calculateFontSize(winner || "Ready to Draw!"),
                        textShadow: '3px 3px 6px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)',
                        animation: 'glow 1.5s infinite alternate'
                      }}>
                  {winner || "Ready to Draw!"}
                </span>
              </motion.div>
            </>
          )}
          
          {isDrawing && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-20">
              <motion.div
                className="flex flex-col items-center justify-center h-[400px]"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
              >
                <div
                  className="py-4 px-6 font-cooper text-white whitespace-nowrap bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 rounded-lg shadow-md"
                  style={{
                    height: `${itemHeight}px`,
                    fontSize: '3.5rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
                  }}
                >
                  {getRemainingParticipants()[flashingIndex]}
                </div>
              </motion.div>
            </div>
          )}
        </div>

        <motion.button 
          onClick={drawWinner} 
          id="draw-button"
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
