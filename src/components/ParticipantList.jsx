import React from "react";
import { motion } from "framer-motion";

const ParticipantList = ({ participants }) => (
  <motion.div 
    className="p-4 rounded-lg shadow-sm bg-white border border-gray-200"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-xl text-gray-700 mb-3">Participants</h3>
    <ul className="space-y-1">
      {participants.map((name, index) => (
        <motion.li 
          key={index} 
          className="text-gray-600 text-sm px-2 py-1 bg-gray-50 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {name}
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export default ParticipantList;
