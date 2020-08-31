import React from "react";
import Board from "./board/Board";
import Tour, { ReactourStep } from "reactour";
import { Player } from "./mahjong";
import { useHistory } from "react-router-dom";

const players: Player[] = [
  { name: "You" },
  { name: "Francisco Bot" },
  { name: "Lupe Bot" },
  { name: "Mordecai Bot" },
];
const round = require("./round.json");

const steps: ReactourStep[] = [
  {
    content: "Welcome to Mahjong Party!",
  },
  {
    selector: ".tutorial-board",
    content: "This is the mahjong board.",
  },
  {
    selector: ".info",
    content: "You can find information about the current round at the top.",
  },
  {
    selector: ".bottom",
    content:
      "Your hand consists of your flowers, completed melds and concealed tiles.",
  },
  {
    selector: ".tutorial-play_area",
    content:
      "You can also see your opponents' flowers, completed melds and how many concealed tiles they have left.",
  },
  {
    selector: ".label-bottom",
    content:
      "Next to everyone's name is their current score. The star symbol indicates the current dealer.",
  },
  {
    selector: ".underneath",
    content:
      "Below the play area are your controls, a log of game events and a description of what is currently happening.",
  },
  {
    selector: ".tutorial-your_tiles",
    content: "You can drag and drop to rearrange your tiles. Try it!",
  },
  {
    selector: ".tutorial-hand_and_discards",
    content:
      "Besides using the discard button, you can also drag a tile directly to the discard pile to discard it.",
  },
  {
    content:
      "You've reached the end of the tutorial! Now grab some friends and start a real game! Missing someone? Fill the empty slots with bots!",
  },
];

export default function Tutorial() {
  const history = useHistory();

  return (
    <div>
      <Board
        nonce={0}
        players={players}
        round={round}
        dispatchAction={() => {}}>
        <div className="tutorial-board" />
        <div className="tutorial-hand_and_discards" />
        <div className="tutorial-play_area" />
      </Board>
      <Tour
        isOpen={true}
        steps={steps}
        onRequestClose={() => history.push("/")}
        closeWithMask={false}
      />
    </div>
  );
}
