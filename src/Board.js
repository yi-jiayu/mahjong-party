import React, { useState, useRef, useEffect } from "react";
import './board.css';
import './tiles.css';
import * as mahjong from './mahjong';

const DIRECTIONS = ['East', 'South', 'West', 'North']

function InteractiveRack({tiles, onClick, selecting, selected, highlighted}) {
  highlighted = new Set(highlighted);
  return <div className={selecting ? "rack selecting" : "rack"}>
    {tiles.sort().reduce((elems, tile, index) => {
      const isSelected = selected.has(index) || highlighted.delete(tile);
      return [...elems, <span className={isSelected ? "tile selected" : "tile"}
                              data-tile={tile}
                              key={tile + index}
                              onClick={() => onClick(tile, index)}/>];
    }, [])}
  </div>;
}

export function Rack({tiles, highlighting, highlighted = new Set()}) {
  highlighted = new Set(highlighted);
  return <div className={highlighting > 0 ? "rack selecting" : "rack"}>
    {tiles.flat().reduce((elems, tile, index) => {
      return [...elems,
        <span className={highlighted.delete(tile) ? "tile selected" : "tile"} data-tile={tile} key={tile + index}/>];
    }, [])}
  </div>;
}

export function Status({round}) {
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
                   canEndGame, doEndGame,
                   pendingAction, cancelPendingAction
                 }) {
  if (pendingAction === '') {
    return <>
      <button disabled={!canDraw} onClick={doDraw}>Draw tile</button>
      <button disabled={!canChow} onClick={doChow}>Chow</button>
      <button disabled={!canPeng} onClick={doPeng}>Peng</button>
      <button disabled={!canKong} onClick={doKong}>Kong</button>
      <button disabled={!canHu} onClick={doHu}>Declare win</button>
      {canEndGame && <button onClick={doEndGame}>End game in draw</button>}
    </>;
  } else {
    return <button onClick={cancelPendingAction}>Cancel</button>;
  }
}

function Board({nonce, self, players, round, doAction}) {
  const {current_turn: currentTurn, current_action: currentAction, hands, discards} = round;
  const previousTurn = (currentTurn + 3) % 4;
  const seat = self.seat || 0;
  if (self.concealed) {
    hands[seat].concealed = self.concealed;
  }
  const order = [seat, (seat + 1) % 4, (seat + 2) % 4, (seat + 3) % 4];
  const [bottom, right, top, left] = order.map(x => ({direction: DIRECTIONS[x], name: players[x], ...hands[x]}));

  let [selected, setSelected] = useState(new Set());
  let [pendingAction, setPendingAction] = useState('');

  let [remaining, setRemaining] = useState([]);
  let [melds, setMelds] = useState([]);

  let [highlighting, setHighlighting] = useState(false);
  let [highlightedTiles, setHighlightedTiles] = useState(new Set());
  let [highlightedFlowers, setHighlightedFlowers] = useState(new Set());

  // reset pending action if game moves on
  const previousRoundNonceRef = useRef(nonce);
  useEffect(() => {
    if (nonce !== previousRoundNonceRef.current) {
      setRemaining([]);
      setSelected(new Set());
      setPendingAction('');
      setMelds([]);
    }
    previousRoundNonceRef.current = nonce;
  }, [nonce])

  const selectTilesForChow = () => {
    setPendingAction('chow');
  };

  const canDiscard = round.draws_left > 0 && currentTurn === seat && currentAction === mahjong.ACTION_DISCARD;
  const canDraw = round.draws_left > 0 && currentTurn === seat && currentAction === mahjong.ACTION_DRAW;
  const canChow = discards.length > 0 && canDraw
  const canPeng = currentAction === mahjong.ACTION_DRAW && seat !== previousTurn && mahjong.canPeng(self.concealed || [], discards[discards.length - 1]);
  const canKongFromDiscard = discards.length > 0 && seat !== previousTurn && currentAction === mahjong.ACTION_DRAW;
  const canKongFromHand = seat === currentTurn && currentAction === mahjong.ACTION_DISCARD;
  const canKong = canKongFromDiscard || canKongFromHand;
  const canHuFromDiscard = canKongFromDiscard;
  const canHuFromHand = canKongFromHand;
  const canHu = canHuFromDiscard || canHuFromHand;
  const canEndGame = currentTurn === seat && currentAction === mahjong.ACTION_DISCARD && round.draws_left === 0;

  const endGame = () => {
    doAction('end');
  }

  const selectTilesForKong = () => {
    if (canKongFromDiscard) {
      doAction('kong', [discards[discards.length - 1]]);
    } else if (canKongFromHand) {
      setPendingAction('kong');
    }
  };

  const declareWin = () => {
    setPendingAction('win');
    if (canHuFromDiscard) {
      setRemaining([...self.concealed, discards[discards.length - 1]]);
    } else {
      setRemaining(self.concealed);
    }
  }

  let message = '';
  if (highlighting) {
    message = 'Click anywhere to continue';
  } else if (pendingAction === 'win') {
    message = 'Group your remaining tiles into valid melds, except for eyes';
  } else if (pendingAction === 'chow') {
    message = 'Select two tiles to chow with';
  } else if (pendingAction === 'kong') {
    message = 'Select a tile to kong';
  } else if (canDiscard) {
    message = 'Select a tile to discard';
  } else if (canDraw) {
    message = 'Use the "Draw tile" button on the right to draw a new tile';
  } else if (canEndGame) {
    message = 'Try to win, or use the "End game in draw" button to end the game in a draw';
  }

  const selectTile = async (tile, index) => {
    if (pendingAction === 'chow') {
      if (selected.has(index)) {
        selected.delete(index);
      } else {
        selected.add(index);
      }
      if (selected.size === 2) {
        doAction('chow', [...selected].map(i => self.concealed[i]));
        setSelected(new Set());
        setPendingAction('');
      } else {
        setSelected(new Set(selected));
      }
    } else if (pendingAction === 'kong') {
      const resp = await doAction('kong', [tile]);
      if (resp.status === 200) {
        const {drawn, flowers} = await resp.json();
        setHighlightedTiles(new Set([drawn]));
        setHighlightedFlowers(new Set(flowers));
        setHighlighting(true);
      }
      setPendingAction('');
    } else if (pendingAction === 'win') {
      if (selected.has(index)) {
        selected.delete(index);
      } else {
        selected.add(index);
      }
      if (selected.size === 3) {
        melds.push([...selected].map(i => remaining[i]));
        remaining = remaining.filter((_, i) => !selected.has(i));
        selected = new Set();
      }
      if (remaining.length === 2) {
        doAction('hu', null, [...melds, remaining]);
        setSelected(new Set());
        setMelds([]);
        setRemaining([]);
        setPendingAction('');
        return;
      }
      setMelds([...melds]);
      setRemaining(remaining);
      setSelected(new Set(selected));
    } else if (canDiscard) {
      doAction('discard', [tile]);
    }
  };

  const cancelPendingAction = () => {
    setRemaining([]);
    setSelected(new Set());
    setPendingAction('');
    setMelds([]);
  }

  const drawTile = async () => {
    const resp = await doAction('draw', []);
    if (resp.status === 200) {
      const {drawn, flowers} = await resp.json();
      setHighlightedTiles(new Set([drawn]));
      setHighlightedFlowers(new Set(flowers));
      setHighlighting(true);
    }
  };
  const pengTile = () => doAction('peng', [discards[discards.length - 1]]);

  const tableClick = e => {
    if (highlighting) {
      e.stopPropagation();
      setHighlightedFlowers(new Set());
      setHighlightedTiles(new Set());
      setHighlighting(false);
    }
  };

  return (
      <>
        <div className="table" onClickCapture={tableClick}>
          <Status round={round}/>
          <div className="labelBottom">
            <div>
              <div>{bottom.direction}</div>
              <div>{bottom.name}</div>
            </div>
          </div>
          <div className="bottom">
            <Rack tiles={bottom.flowers} highlighting={highlighting} highlighted={highlightedFlowers}/>
            <Rack tiles={bottom.revealed.concat(melds)}/>
            <InteractiveRack tiles={pendingAction === 'win' ? remaining : bottom.concealed} onClick={selectTile}
                             selecting={pendingAction === 'chow' || pendingAction === 'win' || highlighting}
                             selected={selected} highlighted={highlightedTiles}/>
          </div>
          <div className="message">{message}</div>
          <div className="actions">
            <div>
              <Actions canDraw={canDraw} doDraw={drawTile}
                       canChow={canChow} doChow={selectTilesForChow}
                       canPeng={canPeng} doPeng={pengTile}
                       canKong={canKong} doKong={selectTilesForKong}
                       canHu={canHu} doHu={declareWin}
                       canEndGame={canEndGame} doEndGame={endGame}
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
