import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import GridBricks from './GridBricks';
import { ADD_BRICK, REMOVE_BRICK } from '../operations';

const colors = ["red", "yellow", "black", "blue"];

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: {},
      color: colors[0]
    };
  }

  setOperation(operation) {
    this.setState({ operation });
  }

  setBrickOperation = (width, height) => () => this.setOperation({ type: ADD_BRICK, data: { width, height } });
  setRemoveBrickOperation = () => this.setOperation({ type: REMOVE_BRICK });

  render() {
    const { operation } = this.state
    return (
      <div>
        <div className="toolsPanel">
          <div className="btn-group bricks-horizontal-size">
            <button onClick={this.setBrickOperation(4, 1)}>4x1</button>
            <button onClick={this.setBrickOperation(3, 1)}>3x1</button>
            <button onClick={this.setBrickOperation(2, 1)}>2x1</button>
            <button onClick={this.setBrickOperation(1, 1)}>1x1</button>
          </div>
          <div className="btn-group bricks-vertical-size">
            <button onClick={this.setBrickOperation(1, 4)}>1x4</button>
            <button onClick={this.setBrickOperation(1, 3)}>1x3</button>
            <button onClick={this.setBrickOperation(1, 2)}>1x2</button>
          </div>
          <div>
            <select onChange={(e) => this.setState({ color: e.target.value })}>
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={this.setRemoveBrickOperation}>Delete</button>
          </div>
        </div>
        <div className="workArea">
          <ReactCursorPosition>
            <GridBricks color={this.state.color} currentOperation={operation} />
          </ReactCursorPosition>
        </div>
      </div>
    )
  }
}

export default Editor
