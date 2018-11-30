import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Brick from './Brick';

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
      brickPosition: { left: 0, top: 0 },
      bricks: [],
    };
  }

  // calcBrickSize = () => {
  //   const { data } = this.props.currentOperation;
  //   if (data) {
  //     const brickSize = {
  //       width: data.x,
  //       height: data.y,
  //     };
  //     this.setState({ brickSize });
  //   }
  // };

  calcBrickPosition = () => {
    const { x, y } = this.props.position;
    const currentCell = getGridPos(x, y, this.state.step);
    this.setState({ brickPosition: currentCell });
  };

  addBrick = () => {
    const newBrick = {
      id: uuid(),
      position: this.state.brickPosition,
      size: this.props.currentOperation.data,
      color: this.props.color
    }
    this.setState({ bricks: [...this.state.bricks, newBrick] });
  }

  render() {
    const { isActive, currentOperation: { type, data } } = this.props;

    const { brickPosition, step } = this.state;

    return (
      <div className="bricks-grid" onMouseMove={this.calcBrickPosition} onClick={this.addBrick}>
        {isActive && type === 'ADD_BRICK'
          ? <div className="testbrick"
            style={buildSyleObj({ ...this.props.currentOperation.data, ...brickPosition }, step)}></div>
          : null}
        {this.state.bricks.map(({ position, size, id, color }) => (
          <Brick key={id} className="testbrick" color={color} style={buildSyleObj({ ...position, ...size }, step)} />
        ))}
      </div>
    )
  }
}

export default GridBricks;
