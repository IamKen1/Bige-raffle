import React, { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";

const RaffleInput = ({ onParticipantsUpdate }) => {
  const [manualInput, setManualInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        
        // Assume the names are in the first sheet, first column
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const names = XLSX.utils.sheet_to_json(sheet, { header: 1 }).flat();

        // Filter out empty rows and header if necessary
        const cleanedNames = names
          .map((name) => (typeof name === "string" ? name.trim() : ""))
          .filter((name) => name && name.toLowerCase() !== "participant names"); // Skip header row if present

        onParticipantsUpdate((prevNames) => [...prevNames, ...cleanedNames]);
        setUploadedFileName(file.name);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleManualInput = () => {
    const names = manualInput
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);
    onParticipantsUpdate((prevNames) => [...prevNames, ...names]);
    setManualInput("");
  };

  const clearParticipants = () => {
    onParticipantsUpdate([]);
    setManualInput("");
    setUploadedFileName("");
  };

  return (
    <motion.div 
      className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl text-gray-700 mb-4">Add Participants</h2>
      
      <div className="space-y-4">
        {/* Excel Upload Sections */}
        <div className="p-3 border border-gray-200 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Upload Excel File</h3>
          <label className="flex flex-col items-center justify-center w-full h-24 border border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-4 pb-5">
              <svg className="w-6 h-6 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="text-sm text-gray-500">{uploadedFileName || "Click to upload Excel file"}</p>
            </div>
            <input 
              type="file" 
              accept=".xlsx" 
              onChange={handleFileUpload} 
              className="hidden"
            />
          </label>
        </div>

        {/* Manual Input Section */}
        <div className="p-3 border border-gray-200 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Manual Entry</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            rows="3"
            placeholder="Enter names, one per line"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <motion.button 
              onClick={handleManualInput} 
              className="bg-blue-500 text-white py-1.5 px-4 rounded text-sm hover:bg-blue-600"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Add Names
            </motion.button>
            <motion.button 
              onClick={clearParticipants} 
              className="bg-red-500 text-white py-1.5 px-4 rounded text-sm hover:bg-red-600"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Clear Participants
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RaffleInput;
