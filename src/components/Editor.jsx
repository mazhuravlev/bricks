import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import { ADD_BRICK, REMOVE_BRICK, CHANGE_COLOR_BRICK } from '../operations';
import { isIntersection } from '../helpers';

import GridBricksContainer from '../containers/GridBricks';
import Tools from './Tools';
import Preview from './Preview';

const colors = ['red', 'yellow', 'black', 'blue'];
const initPresetsColl = [1];

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: { type: ADD_BRICK, data: { size: 1 } },
      color: colors[0],
      presetsColl: initPresetsColl,
      step: 30,
    };
    this.setBrickOperation = this.setBrickOperation.bind(this);
    this.setRemoveBrickOperation = this.setRemoveBrickOperation.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.setPaintOperation = this.setPaintOperation.bind(this);
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

  changeColor = color => this.setState({ color });

  setPaintOperation = () => this.setOperation({ type: CHANGE_COLOR_BRICK })

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

  setSectorSize = (size) => {
    this.props.setSectorSize(size);
    setTimeout(() => this.updateBrickSector());
  };

  updateBrickSector = () => {
    const { sector, bricks, buildBrickSector } = this.props;
    const intersectionBricks = Object.values(bricks).filter(brick => isIntersection(brick, sector));
    const tileBricks = intersectionBricks.map((brick) => {
      const { position } = brick;
      const left = position.left - sector.size.left;
      const top = position.top - sector.size.top;
      return { ...brick, position: { left, top } };
    });
    if (intersectionBricks.length > 0) {
      buildBrickSector({ selectedBricks: tileBricks });
    } else {
      buildBrickSector({ selectedBricks: [] });
    }
  }

  render() {
    const {
      brickSector,
      sector: { size },
      bricksColors,
    } = this.props;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '360px auto',
      }}
      >
        <div>
          <Tools
            setRemoveBrickOperation={this.setRemoveBrickOperation}
            setBrickOperation={this.setBrickOperation}
            setPaintOperation={this.setPaintOperation}
            sectorSize={size}
            setSectorSize={this.setSectorSize}
            changeColor={this.changeColor}
            colors={colors}
          />
          <ReactCursorPosition>
            <GridBricksContainer
              color={this.state.color}
              currentOperation={this.state.operation}
              step={this.state.step}
            />
          </ReactCursorPosition>
        </div>
        <div>
          <Preview
            bricks={brickSector}
            sectorSize={size}
            colors={bricksColors}
            width={size.width}
            step={this.state.step}
          />
        </div>
      </div>
    );
  }
}
