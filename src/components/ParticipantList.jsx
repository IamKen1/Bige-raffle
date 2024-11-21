import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaTrashAlt } from "react-icons/fa";

const ParticipantList = ({ participants, onRemoveParticipant, onClearParticipants }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <motion.div 
      className="p-4 rounded-lg shadow-sm bg-white border border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl text-gray-700">Participants</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsVisible(!isVisible)} 
            className="text-gray-700"
          >
            {isVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
          <button 
            onClick={onClearParticipants} 
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      {isVisible && (
        <div className="max-h-64 overflow-y-auto">
          <ul className="space-y-1">
            {participants.map((name, index) => (
              <motion.li 
                key={index} 
                className="flex justify-between items-center text-gray-600 text-sm px-2 py-1 bg-gray-50 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {name}
                <button 
                  onClick={() => onRemoveParticipant(index)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ParticipantList;
