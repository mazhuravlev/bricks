/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import uuid from 'uuid/v4';
// import { has } from 'lodash';

import Brick from './Brick';
import * as operations from '../operations';
import {
  getGridPos, buildSyleObj, generateBricksMatrix, getBrickPosition,
} from '../helpers';

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
      position: getBrickPosition(this.state.cursorPosition, this.props.brickSize),
      size: this.props.brickSize,
    };
    const { bricks, colorPresetName, color } = this.props;
    const brickMatrix = generateBricksMatrix(bricks);
    const actions = [];
    for (let x = 0; x < newBrick.size.width; x++) {
      for (let y = 0; y < newBrick.size.height; y++) {
        if (brickMatrix[`${x + newBrick.position.left};${y + newBrick.position.top}`]) {
          const brick = brickMatrix[`${x + newBrick.position.left};${y + newBrick.position.top}`];
          this.props.removeBrick({ brick });
          actions.push({
            type: operations.REMOVE_BRICK,
            data: { brick, color, colorPresetName },
          });
        }
      }
    }
    this.props.addBrick({ brick: newBrick, color, colorPresetName });

    const lastAction = ({
      type: this.props.currentOperation.type,
      data: { brick: newBrick, color, colorPresetName },
    });
    const resultAction = actions.length > 0 ? [...actions, lastAction] : lastAction;
    this.props.historyPush({ operations: resultAction });
  }

  removeBrick = (brick) => {
    const { colorPresetName, color } = this.props;
    if (brick) {
      this.props.removeBrick({ brick });
      const action = {
        type: this.props.currentOperation.type,
        data: { brick, color, colorPresetName },
      };
      this.props.historyPush({ operations: action });
    }
  }

  changeBrickColor = ({ id }) => {
    if (id) {
      const { color, colorPresetName, bricksColors } = this.props;
      const oldColor = bricksColors[`${id}-${colorPresetName}`].color;
      this.props.changeBrickColor({ brickId: id, color, colorPresetName });
      const action = {
        type: this.props.currentOperation.type,
        data: {
          brickId: id,
          color: { old: oldColor, new: color },
          colorPresetName,
        },
      };
      this.props.historyPush({ operations: action });
    }
  }

  handleOperation = brick => (e) => {
    e.stopPropagation();
    const { currentOperation: { type } } = this.props;
    if (type) {
      const method = {
        [operations.ADD_BRICK]: this.addBrick,
        [operations.REMOVE_BRICK]: this.removeBrick,
        [operations.CHANGE_COLOR_BRICK]: this.changeBrickColor,
      };
      method[type](brick);
    }
  }

  renderSector() {
    const { size } = this.props.sector;
    const { step } = this.props;
    const lineThickness = 2;
    const lineH1 = {
      left: 0,
      top: 0,
      width: size.width * step,
      height: lineThickness,
    };
    const lineH2 = {
      left: 0,
      top: size.height * step,
      width: size.width * step,
      height: lineThickness,
    };
    const lineV1 = {
      left: 0,
      top: 0,
      width: lineThickness,
      height: size.height * step,
    };
    const lineV2 = {
      left: size.width * step,
      top: 0,
      width: lineThickness,
      height: size.height * step + lineThickness,
    };
    return (
      <div className="templateSector" style={{ ...buildSyleObj(size, this.props.step), width: 0, height: 0 }}>
        <div className="sectorLine" style={lineH1} />
        <div className="sectorLine" style={lineH2} />
        <div className="sectorLine" style={lineV1} />
        <div className="sectorLine" style={lineV2} />
      </div>
    );
  }

  renderBrickPreview(cursorPosition) {
    const position = getBrickPosition(cursorPosition, this.props.brickSize);
    const style = buildSyleObj({ ...this.props.brickSize, ...position }, this.props.step);
    return (
      <Brick
        style={style}
        color={this.props.color.rgb}
      />
    );
  }

  render() {
    const {
      isActive,
      currentOperation,
      templateSize,
      step,
      bricks,
      bricksColors,
      colorPresetName,
    } = this.props;

    return (
      <div
        className="bricks-grid"
        onMouseMove={this.cursorPosition}
        onClick={this.handleOperation()}
        style={buildSyleObj(templateSize, step)}
      >
        {Object.values(bricks).map((brick) => {
          const colorId = `${brick.id}-${colorPresetName}`;
          const color = bricksColors[colorId]
            ? bricksColors[colorId].color.rgb
            : null;

          return (
            <Brick
              key={brick.id}
              id={brick.id}
              className="brick"
              color={color}
              style={buildSyleObj({ ...brick.position, ...brick.size }, step)}
              handleOperation={this.handleOperation(brick)}
            />);
        })}
        {isActive && currentOperation.type === operations.ADD_BRICK
          ? this.renderBrickPreview(this.state.cursorPosition) : null}
        {this.renderSector()}
      </div>
    );
  }
}

export default GridBricks;
