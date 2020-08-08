import React from "react";
import './board.css';
import './tiles.css';

const DIRECTIONS = ['East', 'South', 'West', 'North']

function Rack({tiles}) {
  return <div className="rack">
    {tiles.map((tile, index) => <span className="tile" data-tile={tile} key={tile + index}/>)}
  </div>;
}

function Board({self, players, round}) {
  const {draws_left, current_turn, current_action, hands, discards} = round;
  const seat = self.seat || 0;
  if (self.concealed) {
    hands[seat].concealed = self.concealed;
  }
  const order = [seat, (seat + 1) % 4, (seat + 2) % 4, (seat + 3) % 4];
  const [bottom, right, top, left] = order.map(x => ({direction: DIRECTIONS[x], name: players[x], ...hands[x]}));
  return (
      <>
        <div className="table">
          <div className="status">
            <div>Draws left: {draws_left}</div>
            <div>Current turn: {current_turn}</div>
            <div>Current action: {current_action}</div>
          </div>
          <div className="labelBottom">
            <div>
              <div>{bottom.direction}</div>
              <div>{bottom.name}</div>
            </div>
          </div>
          <div className="bottom">
            <Rack tiles={bottom.flowers}/>
            <Rack tiles={bottom.revealed}/>
            <Rack tiles={bottom.concealed}/>
          </div>
          <div className="labelRight">
            <div>
              <div>{right.direction}</div>
              <div>{right.name}</div>
            </div>
          </div>
          <div className="right">
            <Rack tiles={right.flowers}/>
            <Rack tiles={right.revealed}/>
            <Rack tiles={right.concealed}/>
          </div>
          <div className="labelTop">
            <div>
              <div>{top.direction}</div>
              <div>{top.name}</div>
            </div>
          </div>
          <div className="top">
            <Rack tiles={top.concealed}/>
            <Rack tiles={top.revealed}/>
            <Rack tiles={top.flowers}/>
          </div>
          <div className="labelLeft">
            <div>
              <div>{left.direction}</div>
              <div>{left.name}</div>
            </div>
          </div>
          <div className="left">
            <Rack tiles={left.concealed}/>
            <Rack tiles={left.revealed}/>
            <Rack tiles={left.flowers}/>
          </div>
          <div className="discards">
            {discards.map((tile, index) => <span className="tile" data-tile={tile} key={tile + index}/>)}
          </div>
        </div>
      </>
  );
}

export default Board;
