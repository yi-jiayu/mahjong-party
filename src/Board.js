import React from "react";
import './board.css';
import './tiles.css';
import * as mahjong from './mahjong';

const DIRECTIONS = ['East', 'South', 'West', 'North']

function Rack({tiles, onClick}) {
  return <div className="rack">
    {tiles.map((tile, index) => <span className="tile"
                                      data-tile={tile}
                                      key={tile + index}
                                      onClick={() => onClick(tile)}/>)}
  </div>;
}

function Status({round}) {
  const {draws_left, current_turn, current_action} = round;
  return <div className="status">
    <div>Draws left: {draws_left}</div>
    <div>{`Waiting for ${DIRECTIONS[current_turn]} to ${current_action}`}</div>
  </div>;
}

function Board({self, players, round, doAction}) {
  const {current_turn, current_action, hands, discards} = round;
  const seat = self.seat || 0;
  if (self.concealed) {
    hands[seat].concealed = self.concealed;
  }
  const order = [seat, (seat + 1) % 4, (seat + 2) % 4, (seat + 3) % 4];
  const [bottom, right, top, left] = order.map(x => ({direction: DIRECTIONS[x], name: players[x], ...hands[x]}));

  const canDiscard = current_turn === seat && current_action === mahjong.ACTION_DISCARD
  const canDraw = current_turn === seat && current_action === mahjong.ACTION_DRAW;

  let message = '';
  if (canDiscard) {
    message = 'Select a tile to discard';
  }

  const tileClick = tile => {
    if (canDiscard) {
      doAction('discard', [tile]);
    }
  };
  const drawTile = () => doAction('draw', []);

  return (
      <>
        <div className="table">
          <Status round={round}/>
          <div className="labelBottom">
            <div>
              <div>{bottom.direction}</div>
              <div>{bottom.name}</div>
            </div>
          </div>
          <div className="bottom">
            <Rack tiles={bottom.flowers}/>
            <Rack tiles={bottom.revealed}/>
            <Rack tiles={bottom.concealed} onClick={tileClick}/>
          </div>
          <div className="message">{message}</div>
          <div className="actions">
            <div>
              <button onClick={drawTile} disabled={!canDraw}>Draw tile</button>
              <button disabled>Chow</button>
              <button disabled>Peng</button>
              <button disabled>Kong</button>
              <button disabled>Declare win</button>
            </div>
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
