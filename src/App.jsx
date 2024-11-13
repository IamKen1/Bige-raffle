import React, { useState } from "react";
import Home from "./pages/Home";
import Raffle from "./pages/Raffle";

const App = () => {
  const [participants, setParticipants] = useState([]);
  const [raffleStarted, setRaffleStarted] = useState(false);
  const [winners, setWinners] = useState([]);

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      {raffleStarted ? (
        <Raffle participants={participants} winners={winners} setWinners={setWinners} />
      ) : (
        <Home onStartRaffle={(p) => { setParticipants(p); setRaffleStarted(true); }} />
      )}
    </div>
  );
};

export default App;
