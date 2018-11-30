import React, { Component } from 'react';
import cn from 'classnames';
import ReactCursorPosition from 'react-cursor-position';

import GridBricks from './GridBricks';

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBrick: {
        size: 1,
        orientation: 'horizontal',
      },
    };
  }

  changeSize = (selectBrick) => () => {
    this.setState({ selectBrick: { ...selectBrick } });
  }

  render() {
    const { size, orientation } = this.state.selectBrick;
    return (
      <div>
        <div className="toolsPanel">
          <p>Select horizontal brick:</p>
          <div className="btn-group bricks-horizontal-size">
            <button onClick={this.changeSize({ size: 1, orientation: 'horizontal' })}type="button" className={cn({ btn: true, active: (size === 1 && orientation === 'horizontal') })}>1</button>
            <button onClick={this.changeSize({ size: 0.75, orientation: 'horizontal' })}type="button" className={cn({ btn: true, active: (size === 0.75 && orientation === 'horizontal') })}>0,75</button>
            <button onClick={this.changeSize({ size: 0.5, orientation: 'horizontal' })}type="button" className={cn({ btn: true, active: (size === 0.5 && orientation === 'horizontal') })}>0,5</button>
            <button onClick={this.changeSize({ size: 0.25, orientation: 'horizontal' })}type="button" className={cn({ btn: true, active: (size === 0.25 && orientation === 'horizontal') })}>0,25</button>
          </div>
          <p>Select vertical brick:</p>
          <div className="btn-group bricks-vertical-size">
            <button onClick={this.changeSize({ size: 1, orientation: 'vertival' })} type="button" className={cn({ btn: true, active: (size === 1 && orientation === 'vertival') })}>1</button>
            <button onClick={this.changeSize({ size: 0.75, orientation: 'vertival' })}type="button" className={cn({ btn: true, active: (size === 0.75 && orientation === 'vertival') })}>0,75</button>
            <button onClick={this.changeSize({ size: 0.5, orientation: 'vertival' })}type="button" className={cn({ btn: true, active: (size === 0.5 && orientation === 'vertival') })}>0,5</button>
            <button onClick={this.changeSize({ size: 0.25, orientation: 'vertival' })}type="button" className={cn({ btn: true, active: (size === 0.25 && orientation === 'vertival') })}>0,25</button>
          </div>
        </div>
        <div className="workArea">
          <h2>Grid</h2>
          <p>size: {this.state.selectBrick.size}</p>
          <p>orientation: {this.state.selectBrick.orientation}</p>
          <ReactCursorPosition>
            <GridBricks />
          </ReactCursorPosition>
        </div>
      </div>
    )
  }
}

export default Editor
