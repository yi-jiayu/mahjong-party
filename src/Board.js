import React from "react";
import './board.css';
import './tiles.css';

class Board extends React.Component {
  renderTiles(tiles) {
    if (tiles) {
      return tiles.map((tile, index) => <span className="tile" data-tile={tile} key={tile + index}></span>);
    }
    return [];
  }

  render() {
    const {round, players, self} = this.props;
    const {draws_left, current_turn, current_action, hands, discards} = round;
    const seat = self.seat || 0;
    if (self.concealed) {
      hands[seat].concealed = self.concealed;
    }
    const order = [0, 1, 2, 3].map(x => x + seat).map(x => x % 4);
    console.log(order);
    const directions = ['East', 'South', 'West', 'North'];
    const seats = order.map(i => hands[i]);
    console.log(seats);
    for (let i = 0; i < 4; i++) {
      seats[i].direction = directions[order[i]];
      seats[i].name = players[order[i]];
    }
    const [bottom, right, top, left] = seats;
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
              <div className="rack">
                {this.renderTiles(bottom.flowers)}
              </div>
              <div className="rack">
                {this.renderTiles(bottom.revealed)}
              </div>
              <div className="rack">
                {this.renderTiles(bottom.concealed)}
              </div>
            </div>
            <div className="labelRight">
              <div>
                <div>{right.direction}</div>
                <div>{right.name}</div>
              </div>
            </div>
            <div className="right">
              <div className="rack">
                {this.renderTiles(right.flowers)}
              </div>
              <div className="rack">
                {this.renderTiles(right.revealed)}
              </div>
              <div className="rack">
                {this.renderTiles(right.concealed)}
              </div>
            </div>
            <div className="labelTop">
              <div>
                <div>{top.direction}</div>
                <div>{top.name}</div>
              </div>
            </div>
            <div className="top">
              <div className="rack">
                {this.renderTiles(top.concealed)}
              </div>
              <div className="rack">
                {this.renderTiles(top.revealed)}
              </div>
              <div className="rack">
                {this.renderTiles(top.flowers)}
              </div>
            </div>
            <div className="labelLeft">
              <div>
                <div>{left.direction}</div>
                <div>{left.name}</div>
              </div>
            </div>
            <div className="left">
              <div className="rack">
                {this.renderTiles(left.concealed)}
              </div>
              <div className="rack">
                {this.renderTiles(left.revealed)}
              </div>
              <div className="rack">
                {this.renderTiles(left.flowers)}
              </div>
            </div>
            <div className="discards">
              {this.renderTiles(discards)}
            </div>
          </div>
        </>
    );
  }
}

export default Board;
