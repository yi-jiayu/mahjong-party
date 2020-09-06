import React, { FunctionComponent } from "react";
import { Room, RoomPhase } from "../mahjong";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const WINDS = ["East", "South", "West", "North"];

const Results: FunctionComponent<{ room: Room }> = ({ room }) => {
  const { id, players, results } = room;
  const scores =
    room.phase === RoomPhase.InProgress ? room.round.scores : room.scores;
  return (
    <div>
      <Helmet>
        <title>Results | {id} | Mahjong Party </title>
      </Helmet>
      <h1>{id}</h1>
      {room.phase === RoomPhase.InProgress && (
        <Link to={`/rooms/${id}`}>&lt; Back to game</Link>
      )}
      <h2>Current standings</h2>
      <table>
        <tbody>
          <tr>
            <td>{players[0].name}</td>
            <td>{scores[0]}</td>
          </tr>
          <tr>
            <td>{players[1].name}</td>
            <td>{scores[1]}</td>
          </tr>
          <tr>
            <td>{players[2].name}</td>
            <td>{scores[2]}</td>
          </tr>
          <tr>
            <td>{players[3].name}</td>
            <td>{scores[3]}</td>
          </tr>
        </tbody>
      </table>
      <h2>Previous round results</h2>
      <table>
        <thead>
          <tr>
            <th />
            <th>Dealer</th>
            <th>Wind</th>
            <th>Winner</th>
            <th>Loser</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {room.phase === RoomPhase.InProgress && room.round.finished && (
            <tr>
              <td>{results.length + 1}</td>
              <td>{players[room.round.dealer].name}</td>
              <td>{WINDS[room.round.wind]}</td>
              <td>
                {room.round.result.winner !== -1
                  ? players[room.round.result.winner].name
                  : "No one"}
              </td>
              <td>
                {room.round.result.loser !== -1
                  ? players[room.round.result.loser].name
                  : "No one"}
              </td>
              <td>{room.round.result.points}</td>
            </tr>
          )}
          {results
            .slice()
            .reverse()
            .map(({ dealer, wind, winner, loser, points }, index) => (
              <tr key={results.length - index}>
                <td>{results.length - index}</td>
                <td>{players[dealer].name}</td>
                <td>{WINDS[wind]}</td>
                <td>{winner !== -1 ? players[winner].name : "No one"}</td>
                <td>{loser !== -1 ? players[loser].name : "No one"}</td>
                <td>{points}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
