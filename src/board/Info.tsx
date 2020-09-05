import React, { FunctionComponent } from "react";
import { Player, Round } from "../mahjong";
import { Link, useLocation } from "react-router-dom";

const WINDS = ["East", "South", "West", "North"];

const Info: FunctionComponent<{ players: Player[]; round: Round }> = ({
  players,
  round,
}) => {
  const location = useLocation();

  const { wind, dealer, draws_left } = round;
  return (
    <div className="info">
      <span className="infobox">Prevailing wind: {WINDS[wind]}</span>
      <span className="infobox">Dealer: {players[dealer].name}</span>
      <span className="infobox">Draws left: {draws_left}</span>
      <span style={{ marginRight: "auto" }} />
      <Link to={`${location.pathname}/results`}>Results</Link>
    </div>
  );
};

export default Info;
