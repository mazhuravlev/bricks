import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import { ADD_BRICK, REMOVE_BRICK, CHANGE_COLOR_BRICK } from '../operations';
import { buildSyleObj, isIntersection } from '../helpers';
import Brick from './Brick';

import GridBricksContainer from '../containers/GridBricks';

const colors = ['red', 'yellow', 'black', 'blue'];
const initPresetsColl = [1];

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: {},
      color: colors[0],
      presetsColl: initPresetsColl,
      step: 20,
      tileSize: 4,
    };
  }

  componentWillMount() {
    this.props.changePresetName({ name: initPresetsColl[0] });
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

  changeColorPreset = ({ target: { value } }) => {
    this.props.changePresetName({ name: value });
  }

  addNewColorPreset = () => {
    const { presetsColl } = this.state;
    const newPreset = presetsColl.length + 1;
    this.setState({ presetsColl: [...presetsColl, newPreset] });
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

  handleSectorSize = ({ target }) => {
    const { value, name } = target;
    this.props.changeSectorSize({ size: { [name]: value } });
    setTimeout(() => this.updateBrickSector());
  };

  handleSectorPosition = ({ target }) => {
    const { value, name } = target;
    this.props.changeSectorPosition({ position: { [name]: value } });
    setTimeout(() => this.updateBrickSector());
  };

  renderTile = () => {
    const { step, tileSize } = this.state;
    const { brickSector, sector, bricksColors } = this.props;
    const tileArr = new Array(tileSize).fill(null);
    const arr = tileArr.map((_, i) => (
      <div key={i} className="sectorItem" style={buildSyleObj(sector.size, step)}>
        {brickSector.map(({ position, size, id }) => {
          const colorId = `${id}-${bricksColors.name}`;
          const { color } = bricksColors.data[colorId] || 'gray';
          return (
            <Brick key={id} className="brick" color={color} style={buildSyleObj({ ...position, ...size }, step)} />
          );
        })}
      </div>
    ));
    return arr;
  }

  updateBrickSector = () => {
    const { sector, bricks, buildBrickSector } = this.props;
    const intersectionBricks = Object.values(bricks).filter(brick => isIntersection(brick, sector));
    const tileBricks = intersectionBricks.map((brick) => {
      const { position } = brick;
      const left = position.left - sector.position.left;
      const top = position.top - sector.position.top;
      return { ...brick, position: { left, top } };
    });
    if (intersectionBricks.length > 0) {
      buildBrickSector({ selectedBricks: tileBricks });
    } else {
      buildBrickSector({ selectedBricks: [] });
    }
  }

  render() {
    const { operation, step, presetsColl } = this.state;
    const {
      templateSize: { width, height },
      brickSector,
      sector: { size, position },
      bricksColors,
    } = this.props;

    return (
      <div>
        <div className="toolsPanel">
          <div className="panel-grid-size">
            <div>
              шаг сетки
              <button type="button" onClick={() => this.setState({ step: step + 1 })}>+1</button>
              <button type="button" onClick={() => this.setState({ step: step - 1 })}>-1</button>
            </div>
            <div className="control-panel grid-size-options-panel">
              <p>Параметры шаблона:</p>
              <div className="width">
                <p>Ширина:</p>
                <button type="button" onClick={this.handleGridSize({ width: width - 1 })}>-1</button>
                <label htmlFor="grid-width">
                  <input type="number" min="2" className="input-grid-size" name="width" id="grid-width" value={width} onChange={this.handleGridSize()} />
                </label>
                <button type="button" onClick={this.handleGridSize({ width: width + 1 })}>+1</button>
              </div>
              <div className="height">
                <p>Высота:</p>
                <button type="button" onClick={this.handleGridSize({ height: height - 1 })}>-1</button>
                <label htmlFor="grid-height">
                  <input type="number" min="2" className="input-grid-size" name="height" id="grid-height" value={height} onChange={this.handleGridSize()} />
                </label>
                <button type="button" onClick={this.handleGridSize({ height: height + 1 })}>+1</button>
              </div>
            </div>
          </div>
          <div className="control-panel panel-sector-size">
            <div className="grid-sector-options-panel">
              <p>Параметры сектора:</p>
              <label htmlFor="sector-left">
                left:
                <input type="number" min="0" className="input-sector-size" name="left" id="sector-left" value={position.left} onChange={this.handleSectorPosition} />
              </label>
              <label htmlFor="grid-width">
                top:
                <input type="number" min="0" className="input-sector-size" name="top" id="sector-top" value={position.top} onChange={this.handleSectorPosition} />
              </label>
              <label htmlFor="grid-width">
                width:
                <input type="number" min="2" className="input-sector-size" name="width" id="sector-width" value={size.width} onChange={this.handleSectorSize} />
              </label>
              <label htmlFor="grid-height">
                height:
                <input type="number" min="2" className="input-sector-size" name="height" id="sector-height" value={size.height} onChange={this.handleSectorSize} />
              </label>
            </div>
          </div>
          <div className="control-panel color-preset">
            <p>Набор цветов:</p>
            <select onChange={this.changeColorPreset} value={bricksColors.name}>
              {presetsColl.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={this.addNewColorPreset} type="button">add</button>
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
            <select onChange={this.changeColor}>
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
          <div
            className="grid-area-preview"
            style={{ gridTemplateColumns: [1, 1].map(() => `${this.state.step * size.width}px`).join(' ') }}
          >
            {brickSector.length > 0 ? this.renderTile() : null}
          </div>
        </div>
      </div>
    );
  }
}
