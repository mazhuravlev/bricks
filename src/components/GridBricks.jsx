import React, { Component } from 'react';
import uuid from 'uuid/v4';

import Brick from './Brick';
import * as operations from '../operations';
import { getGridPos, buildSyleObj, isIntersection } from './editorHelpers';

class GridBricks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorPosition: { left: 0, top: 0 },
      bricks: [],
    };
  }

  cursorPosition = () => {
    const { position: { x, y }, step } = this.props;

    const currentCell = getGridPos(x, y, step);
    this.setState({ cursorPosition: currentCell });
  };

  addBrick = () => {
    const newBrick = {
      id: uuid(),
      position: this.state.cursorPosition,
      size: this.props.currentOperation.data,
      color: this.props.color,
    };
    const result = this.state.bricks.map(brick => isIntersection(brick, newBrick));
    const { bricks } = this.state;
    if (result.every(item => !item)) {
      this.setState({ bricks: [...bricks, newBrick] });
    }
  }

  removeBrick = () => {
    const { bricks } = this.state;
    const restBricks = bricks.filter(brick => (
      !isIntersection(brick, { position: this.state.cursorPosition })));
    this.setState({ bricks: restBricks });
  }

  handleOperation = () => {
    const { currentOperation: { type } } = this.props;
    return type ? {
      [operations.ADD_BRICK]: this.addBrick,
      [operations.REMOVE_BRICK]: this.removeBrick,
    }[type]() : null;
  }

  updateChanges = () => {
    this.props.updateBricks(this.state.bricks);
  }

  render() {
    const {
      isActive,
      currentOperation: { type },
      size,
      step,
    } = this.props;
    const { cursorPosition } = this.state;

    return (
      <>
        <div
          className="bricks-grid"
          onMouseMove={this.cursorPosition}
          onClick={this.handleOperation}
          style={buildSyleObj(size, step)}
        >
          {isActive && type === operations.ADD_BRICK ? (
            <div className="brick" style={buildSyleObj({ ...this.props.currentOperation.data, ...cursorPosition }, step)} />
          )
            : null
          }
          {this.state.bricks.map(({ position, size, id, color }) => (  //eslint-disable-line
            <Brick key={id} className="brick" color={color} style={buildSyleObj({ ...position, ...size }, step)} />
          ))}
        </div>
        <button onClick={this.updateChanges} type="button">Save</button>
      </>
    );
  }
}

export default GridBricks;
