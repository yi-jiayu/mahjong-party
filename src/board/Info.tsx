import React, { FunctionComponent } from "react";
import { Player, Round } from "../mahjong";

const WINDS = ["East", "South", "West", "North"];

const SoundToggle: FunctionComponent<{
  soundOn: boolean;
  toggleSound: () => void;
}> = ({ soundOn, toggleSound }) => {
  return (
    <span className="sound-toggle" onClick={toggleSound}>
      {soundOn ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clipRule="evenodd"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      )}
    </span>
  );
};

const Info: FunctionComponent<{
  players: Player[];
  round: Round;
  soundOn: boolean;
  toggleSound: () => void;
}> = ({ players, round, soundOn, toggleSound, children }) => {
  const { wind, dealer, draws_left } = round;
  return (
    <div className="info">
      <span className="infobox">Prevailing wind: {WINDS[wind]}</span>
      <span className="infobox">Dealer: {players[dealer].name}</span>
      <span className="infobox">Draws left: {draws_left}</span>
      <span style={{ marginRight: "auto" }} />
      {children}
      <SoundToggle soundOn={soundOn} toggleSound={toggleSound} />
    </div>
  );
};

export default Info;
