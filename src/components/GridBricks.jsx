import React, { Component } from 'react';
import uuid from 'uuid/v4';
import _ from 'lodash';

const getGridPos = (x, y, step) => {
  const left = Math.floor(x / step);
  const top = Math.floor(y / step);
  return { left, top };
};

const buildSyleObj = (styleObj, step) => Object.keys(styleObj)
  .reduce((acc, key) => ({ ...acc, [key]: styleObj[key] * step }), {});

export class GridBricks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 20,
      cursorPosition: { left: 0, top: 0 },
      bricks: [],
    };
  }

  cursorPosition = () => {
    const { x, y } = this.props.position;
    const currentCell = getGridPos(x, y, this.state.step);
    this.setState({ cursorPosition: currentCell });
  };

  addBrick = () => {
    const newBrick = {
      id: uuid(),
      position: this.state.cursorPosition,
      size: this.props.currentOperation.data,
    }
    this.setState({ bricks: [...this.state.bricks, newBrick] });
  }

  removeBrick = () => {
    // const { bricks, cursorPosition } = this.state;
    // bricks.filter(({ position }) => !_.isEqual(position, cursorPosition))
  }

  handleOperation = () => {
    const { currentOperation: { type } } = this.props;
    return {
      ADD_BRICK: this.addBrick,
      REMOVE_BRICK: this.removeBrick,
    }[type]();
  }

  render() {
    const { isActive, currentOperation: { type } } = this.props;

    const { cursorPosition, step } = this.state;

    return (
      <div className="bricks-grid" onMouseMove={this.cursorPosition} onClick={this.handleOperation}>
        {isActive && type === 'ADD_BRICK' ? 
          <div className="brick" style={buildSyleObj({ ...this.props.currentOperation.data, ...cursorPosition }, step)}></div>
          : null
        }
        {this.state.bricks.map(({ position, size, id }) => (
          <div key={id} className="brick" style={buildSyleObj({ ...position, ...size }, step)}></div>
        ))}
      </div>
    )
  }
}

export default GridBricks;
