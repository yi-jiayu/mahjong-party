import React from "react";
import './board.css';
import './tiles.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    const {players, round} = props;
    this.state = {players, round};
  }

  renderTiles(tiles) {
    if (tiles) {
      return tiles.map((tile, index) => <span className="tile" data-tile={tile} key={tile + index}></span>);
    }
    return [];
  }

  render() {
    const {round, players} = this.state;
    const {draws_left, current_turn, current_action, hands, discards} = round;
    const [bottom, right, top, left] = hands;
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
                <div>East</div>
                <div>{players[0]}</div>
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
                <div>South</div>
                <div>{players[1]}</div>
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
                <div>West</div>
                <div>{players[2]}</div>
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
                <div>North</div>
                <div>{players[3]}</div>
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
