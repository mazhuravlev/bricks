import React, { Component } from 'react';
import uuid from 'uuid/v4';

import Brick from './Brick';
import * as operations from '../operations';
import { getGridPos, buildSyleObj, isIntersection } from '../helpers';

class GridBricks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorPosition: { left: 0, top: 0 },
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
      size: this.props.brickSize,
      color: this.props.color,
    };
    const { bricks } = this.props;
    const result = Object.values(bricks).map(brick => isIntersection(brick, newBrick));
    if (result.every(item => !item)) {
      this.props.addBrick({ brick: newBrick });
    }
  }

  removeBrick = (id) => {
    if (id) {
      this.props.removeBrick({ id });
    }
  }

  changeBrickColor = (id) => {
    if (id) {
      const { color } = this.props;
      this.props.changeBrickColor({ id, color });
    }
  }

  handleOperation = id => (e) => {
    e.stopPropagation();
    const { currentOperation: { type } } = this.props;
    return type ? {
      [operations.ADD_BRICK]: this.addBrick,
      [operations.REMOVE_BRICK]: this.removeBrick,
      [operations.CHANGE_COLOR_BRICK]: this.changeBrickColor,
    }[type](id) : null;
  }

  updateChanges = () => {
    this.props.updateBricks(this.state.bricks);
  }

  render() {
    const {
      isActive,
      currentOperation: { type },
      templateSize,
      step,
      bricks,
    } = this.props;

    const { cursorPosition } = this.state;

    return (
      <>
        <div
          className="bricks-grid"
          onMouseMove={this.cursorPosition}
          onClick={this.handleOperation()}
          style={buildSyleObj(templateSize, step)}
        >
          {isActive && type === operations.ADD_BRICK ? (
            <div className="brick" style={buildSyleObj({ ...this.props.brickSize, ...cursorPosition }, step)} />
          )
            : null
          }
          {Object.values(bricks).map(({ position, size, id, color }) => (  //eslint-disable-line
            <Brick
              key={id}
              id={id}
              className="brick"
              color={color}
              style={buildSyleObj({ ...position, ...size }, step)}
              handleOperation={this.handleOperation(id)}
            />
          ))}
        </div>
      </>
    );
  }
}

export default GridBricks;
