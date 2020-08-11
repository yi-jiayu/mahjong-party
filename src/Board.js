import React, { useState } from "react";
import './board.css';
import './tiles.css';
import * as mahjong from './mahjong';

const DIRECTIONS = ['East', 'South', 'West', 'North']

function InteractiveRack({tiles, onClick, selecting, selected}) {
  return <div className={selecting ? "rack selecting" : "rack"}>
    {tiles.map((tile, index) => <span className={selected.includes(index) ? "tile selected" : "tile"}
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

function Actions({
                   canDraw, doDraw,
                   canChow, doChow,
                   canPeng, doPeng,
                   canKong, doKong,
                   canHu, doHu,
                   pendingAction, cancelPendingAction
                 }) {
  if (pendingAction === '') {
    return <>
      <button disabled={!canDraw} onClick={doDraw}>Draw tile</button>
      <button disabled={!canChow} onClick={doChow}>Chow</button>
      <button disabled={!canPeng} onClick={doPeng}>Peng</button>
      <button disabled={!canKong} onClick={doKong}>Kong</button>
      <button disabled={!canHu} onClick={doHu}>Declare win</button>
    </>;
  } else {
    return <button onClick={cancelPendingAction}>Cancel</button>;
  }
}

function Board({self, players, round, doAction}) {
  const {current_turn: currentTurn, current_action: currentAction, hands, discards} = round;
  const previousTurn = (currentTurn + 3) % 4;
  const seat = self.seat || 0;
  if (self.concealed) {
    hands[seat].concealed = self.concealed;
  }
  const order = [seat, (seat + 1) % 4, (seat + 2) % 4, (seat + 3) % 4];
  const [bottom, right, top, left] = order.map(x => ({direction: DIRECTIONS[x], name: players[x], ...hands[x]}));

  const [selected, setSelected] = useState([]);
  const [pendingAction, setPendingAction] = useState('');

  const [remaining, setRemaining] = useState([]);
  const [melds, setMelds] = useState([]);

  const selectTilesForChow = () => {
    setPendingAction('chow');
  };

  const canDiscard = currentTurn === seat && currentAction === mahjong.ACTION_DISCARD;
  const canDraw = currentTurn === seat && currentAction === mahjong.ACTION_DRAW;
  const canPeng = currentAction === mahjong.ACTION_DRAW && mahjong.canPeng(self.concealed || [], discards[discards.length - 1]);
  const canKongFromDiscard = discards.length > 0 && seat !== previousTurn && currentAction === mahjong.ACTION_DRAW;
  const canKongFromHand = seat === currentTurn && currentAction === mahjong.ACTION_DISCARD;
  const canKong = canKongFromDiscard || canKongFromHand;
  const canHuFromDiscard = canKongFromHand;
  const canHuFromHand = canKongFromHand;
  const canHu = canHuFromDiscard || canHuFromHand;

  const selectTilesForKong = () => {
    if (canKongFromDiscard) {
      doAction('kong', [discards[discards.length - 1]]);
    } else if (canKongFromHand) {
      setPendingAction('kong');
    }
  };

  const declareWin = () => {
    setPendingAction('win');
    setRemaining(self.concealed);
  }

  let message = '';
  if (pendingAction === 'win') {
    message = 'Group your remaining tiles into valid melds, leaving the eyes for last.'
  } else if (pendingAction === 'chow') {
    message = 'Select two tiles to chow with'
  } else if (pendingAction === 'kong') {
    message = 'Select a tile to kong';
  } else if (canDiscard) {
    message = 'Select a tile to discard';
  }

  const selectTile = (tile, index) => {
    if (pendingAction === 'chow') {
      if (selected.length === 1 && selected[0] === index) {
        setSelected([]);
      } else if (selected.length === 0) {
        setSelected([index]);
      } else {
        doAction('chow', [self.concealed[selected[0]], self.concealed[index]]);
        setSelected([]);
        setPendingAction('');
      }
    } else if (pendingAction === 'kong') {
      doAction('kong', [tile]);
      setPendingAction('');
    } else if (pendingAction === 'win') {
      if (selected.length === 2) {
        if (index === selected[0]) {
          setSelected([selected[1]]);
        } else if (index === selected[1]) {
          setSelected([selected[0]]);
        } else {
          setMelds(melds.concat([[bottom.concealed[selected[0]], bottom.concealed[selected[1]], bottom.concealed[index]]]))
          setRemaining(remaining.filter((_, i) => i !== selected[0] && i !== selected[1] && i !== index));
          setSelected([]);
          if (remaining.length === 5) {
            doAction('hu', null, melds);
            setMelds([]);
            setRemaining([]);
            setPendingAction('');
            return;
          }
        }
      } else if (selected.length === 1) {
        if (index === selected[0]) {
          setSelected([]);
        } else {
          setSelected([selected[0], index]);
        }
      } else if (selected.length === 0) {
        setSelected([index]);
      }
    } else if (canDiscard) {
      doAction('discard', [tile]);
    }
  };

  const cancelPendingAction = () => {
    setRemaining([]);
    setSelected([]);
    setPendingAction('');
    setMelds([]);
  }

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
            <Rack tiles={bottom.revealed.concat(melds)}/>
            <InteractiveRack tiles={pendingAction === 'win' ? remaining : bottom.concealed} onClick={selectTile}
                             selecting={pendingAction === 'chow' || pendingAction === 'win'}
                             selected={selected}/>
          </div>
          <div className="message">{message}</div>
          <div className="actions">
            <div>
              <Actions canDraw={canDraw} doDraw={drawTile}
                       canChow={canDraw} doChow={selectTilesForChow}
                       canPeng={canPeng} doPeng={pengTile}
                       canKong={canKong} doKong={selectTilesForKong}
                       canHu={canHu} doHu={declareWin}
                       pendingAction={pendingAction} cancelPendingAction={cancelPendingAction}/>
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
