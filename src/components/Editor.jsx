import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import { ADD_BRICK, REMOVE_BRICK, CHANGE_COLOR_BRICK } from '../operations';
import { buildSyleObj } from '../helpers';
import Brick from './Brick';

import GridBricksContainer from '../containers/GridBricks';

const colors = ['red', 'yellow', 'black', 'blue'];

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: {},
      color: colors[0],
      step: 10,
      tileSize: 4,
    };
  }

  setOperation(operation) {
    this.setState({ operation });
  }

  setBrickOperation = (width, height) => () => {
    this.props.changeBrickSize({ size: { width, height } });
    this.setOperation({ type: ADD_BRICK });
  }

  changeColor = ({ target: { value } }) => {
    this.setOperation({ type: CHANGE_COLOR_BRICK });
    this.setState({ color: value });
  }

  setRemoveBrickOperation = () => this.setOperation({ type: REMOVE_BRICK });

  handleGridSize = newSize => ({ target }) => {
    const { changeTemplateSize } = this.props;
    const { value, name } = target;
    if (newSize) {
      changeTemplateSize({ newSize });
    } else {
      changeTemplateSize({ newSize: { [name]: value } });
    }
  };

  renderTile = () => {
    const { step, tileSize } = this.state;
    const { bricks, templateSize } = this.props;
    const tileArr = new Array(tileSize).fill(null);
    const arr = tileArr.map((_, i) => (
      <div key={i} className="tileItem" style={buildSyleObj(templateSize, step)}>
        {bricks.map(({ position, size, id, color }) => (  //eslint-disable-line
          <Brick key={id} className="brick" color={color} style={buildSyleObj({ ...position, ...size }, step)} />
        ))}
      </div>
    ));
    return arr;
  }

  render() {
    const { operation } = this.state;
    const {
      bricks,
      templateSize: { width, height },
    } = this.props;

    return (
      <div>
        <div className="toolsPanel">
          <div className="panel-grid-size">
            <div>
              шаг сетки 
                <button onClick={() => this.setState({step: this.state.step + 1})}>+1</button> 
                <button onClick={() => this.setState({step: this.state.step - 1})}>-1</button> 
            </div>
            <div className="grid-size-options-panel">
              <div className="width">
                <p>Ширина:</p>
                <button type="button" onClick={this.handleGridSize({ width: width - 1 })}>-1</button>
                <label htmlFor="grid-width">
                  <input
                    type="text"
                    className="input-grid-size"
                    name="width"
                    id="grid-width"
                    value={width}
                    onChange={this.handleGridSize()}
                  />
                </label>
                <button type="button" onClick={this.handleGridSize({ width: width + 1 })}>+1</button>
              </div>
              <div className="height">
                <p>Высота:</p>
                <button type="button" onClick={this.handleGridSize({ height: height - 1 })}>-1</button>
                <label htmlFor="grid-height">
                  <input
                    type="text"
                    className="input-grid-size"
                    name="height"
                    id="grid-height"
                    value={height}
                    onChange={this.handleGridSize()}
                  />
                </label>
                <button type="button" onClick={this.handleGridSize({ height: height + 1 })}>+1</button>
              </div>
            </div>
          </div>
          <div className="btn-group bricks-horizontal-size">
            <button onClick={this.setBrickOperation(4, 1)} type="button">4x1</button>
            <button onClick={this.setBrickOperation(3, 1)} type="button">3x1</button>
            <button onClick={this.setBrickOperation(2, 1)} type="button">2x1</button>
            <button onClick={this.setBrickOperation(1, 1)} type="button">1x1</button>
          </div>
          <div className="btn-group bricks-vertical-size">
            <button onClick={this.setBrickOperation(1, 4)} type="button">1x4</button>
            <button onClick={this.setBrickOperation(1, 3)} type="button">1x3</button>
            <button onClick={this.setBrickOperation(1, 2)} type="button">1x2</button>
          </div>
          <div>
            <select
              onChange={this.changeColor}
            >
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={this.setRemoveBrickOperation} type="button">Delete</button>
          </div>
        </div>
        <div className="workArea">
          <ReactCursorPosition>
            <GridBricksContainer
              color={this.state.color}
              currentOperation={operation}
              step={this.state.step}
            />
          </ReactCursorPosition>
        </div>
        <div>
        <div className="grid-area-preview"
         style={{gridTemplateColumns: [1,1].map(x => this.state.step * this.props.templateSize.width + 'px').join(' ')}}>
          {bricks.length > 0 ? this.renderTile() : null}
        </div>
        </div>
      </div>
    );
  }
}
