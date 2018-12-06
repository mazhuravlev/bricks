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
      color: this.props.color,
    };
    const { bricks } = this.props;
    const brickMatrix = generateBricksMatrix(bricks);
    for (let x = 0; x < newBrick.size.width; x++) {
      for (let y = 0; y < newBrick.size.height; y++) {
        if (brickMatrix[`${x + newBrick.position.left};${y + newBrick.position.top}`]) {
          const { id } = brickMatrix[`${x + newBrick.position.left};${y + newBrick.position.top}`];
          this.props.removeBrick({ id });
        }
      }
    }
    this.props.addBrick({ brick: newBrick });
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
    if (type) {
      const method = {
        [operations.ADD_BRICK]: this.addBrick,
        [operations.REMOVE_BRICK]: this.removeBrick,
        [operations.CHANGE_COLOR_BRICK]: this.changeBrickColor,
      };
      method[type](id);
    }
    setTimeout(() => this.props.updateBrickSector());
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
    } = this.props;

    return (
      <div
        className="bricks-grid"
        onMouseMove={this.cursorPosition}
        onClick={this.handleOperation()}
        style={buildSyleObj(templateSize, step)}
      >
        {Object.values(bricks).map(({ position, size, id }) => {
          const colorId = `${id}-${bricksColors.name}`;
          const color = bricksColors.data[colorId]
            ? bricksColors.data[colorId].color.rgb
            : null;

          return (
            <Brick
              key={id}
              id={id}
              className="brick"
              color={color}
              style={buildSyleObj({ ...position, ...size }, step)}
              handleOperation={this.handleOperation(id)}
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
