import React from "react";
import RaffleDraw from "../components/RaffleDraw";

const Raffle = ({ participants, winners, setWinners }) => (
  <div className="flex items-center justify-center w-screen min-h-screen bg-yellow-100">
    <RaffleDraw participants={participants} winners={winners} setWinners={setWinners} />
  </div>
);

export default Raffle;
