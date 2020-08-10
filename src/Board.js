import React, { useState } from "react";
import './board.css';
import './tiles.css';
import * as mahjong from './mahjong';

const DIRECTIONS = ['East', 'South', 'West', 'North']

function InteractiveRack({tiles, onClick, selecting, selected}) {
  return <div className={selecting ? "rack selecting" : "rack"}>
    {tiles.map((tile, index) => <span className={selected === index ? "tile selected" : "tile"}
                                      data-tile={tile}
                                      key={tile + index}
                                      onClick={() => onClick(tile, index)}/>)}
  </div>;
}

function Rack({tiles}) {
  return <div className="rack">
    {tiles.flat().map((tile, index) => <span className="tile" data-tile={tile} key={tile + index}/>)}
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

  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [pendingAction, setPendingAction] = useState('');

  const selectTilesForChow = () => {
    setSelecting(true);
    setPendingAction('chow');
  };

  const canDiscard = current_turn === seat && current_action === mahjong.ACTION_DISCARD
  const canDraw = current_turn === seat && current_action === mahjong.ACTION_DRAW;
  const canPeng = current_action === mahjong.ACTION_DRAW && mahjong.canPeng(self.concealed || [], discards[discards.length - 1]);

  let message = '';
  if (canDiscard) {
    message = 'Select a tile to discard';
  } else if (selecting && pendingAction === 'chow') {
    message = 'Select two tiles to chow with'
  }

  const tileClick = (tile, index) => {
    if (canDiscard) {
      doAction('discard', [tile]);
      return;
    }
    if (!selecting) {
      return;
    }
    if (selected === index) {
      setSelected(-1);
      return;
    }
    if (selected === -1) {
      setSelected(index);
      return
    }
    if (pendingAction === 'chow') {
      doAction('chow', [self.concealed[selected], self.concealed[index]]);
      setSelecting(false);
      setSelected(-1);
      setPendingAction('');
    }
  };
  const drawTile = () => doAction('draw', []);
  const pengTile = () => doAction('peng', [discards[discards.length - 1]]);

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
            <InteractiveRack tiles={bottom.concealed} onClick={tileClick} selecting={selecting} selected={selected}/>
          </div>
          <div className="message">{message}</div>
          <div className="actions">
            <div>
              <button onClick={drawTile} disabled={!canDraw}>Draw tile</button>
              <button disabled={!canDraw} onClick={selectTilesForChow}>Chow</button>
              <button disabled={!canPeng} onClick={pengTile}>Peng</button>
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
