import React, { Component } from 'react'

const getGridPos = (x, y, step) => {
  const posX = Math.floor(x / step);
  const posY = Math.floor(y / step);
  return { x: posX, y: posY, step };
};

const buildMerkerStyle = ({ x, y, step }) => ({
  left: x * step,
  top: y * step,
});

export class GridBricks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 15,
    };
  }

  render() {
    const {
      // isPositionOutside = false,
      elementDimensions: {
        width = 0,
        height = 0
      } = {},
      position: {
        x = 0,
        y = 0
      } = {}
    } = this.props;

    const gridPos = getGridPos(x, y, this.state.step);

    console.log(`Element width: ${width} height: ${height}`);
    console.log(`Cursor position! X: ${x} Y: ${y}`);
    console.log(`Grid position! X: ${gridPos.x} Y: ${gridPos.y}`);
    return (
      <div className="bricks-grid">
        <div className='marker-grid-position' style={buildMerkerStyle(gridPos)}></div>
        <div className="testbrick"></div>
      </div>
    )
  }
}

export default GridBricks;
