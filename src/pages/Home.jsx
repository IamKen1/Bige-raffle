import React, { useState } from "react";
import { motion } from "framer-motion";
import RaffleInput from "../components/RaffleInput";
import ParticipantList from "../components/ParticipantList";

const Home = ({ onStartRaffle }) => {
  const [participants, setParticipants] = useState([]);

  const removeParticipant = (index) => {
    setParticipants((prevParticipants) => prevParticipants.filter((_, i) => i !== index));
  };

  const clearParticipants = () => {
    setParticipants([]);
  };

  return (
    <div className="flex flex-col items-center justify-start w-screen min-h-screen overflow-y-auto p-8 font-carnival">
      <div className="w-full max-w-4xl space-y-8">
        <motion.h1 
          className="text-6xl text-white text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BigE Raffle
        </motion.h1>
        <RaffleInput onParticipantsUpdate={setParticipants} />
        <ParticipantList 
          participants={participants} 
          onRemoveParticipant={removeParticipant} 
          onClearParticipants={clearParticipants} 
        />
        {participants.length > 0 && (
          <motion.button
            onClick={() => onStartRaffle(participants)}
            className="w-full bg-amber-600 text-white py-4 px-8 rounded-xl text-xl shadow-lg hover:bg-amber-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Raffle
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Home;
