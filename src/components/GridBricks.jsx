import React, { Component } from 'react'

export class GridBricks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bricks-grid">
        <div className="testbrick"></div>
        <p className="grid-test-lebel">Element width: {this.props.elementDimensions.width} height: {this.props.elementDimensions.height}</p>
        <p className="grid-test-lebel">Cursor position! X: {this.props.position.x} Y: {this.props.position.y}</p>
      </div>
    )
  }
}

export default GridBricks
