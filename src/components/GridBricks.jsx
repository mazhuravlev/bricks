import React, { Component } from 'react';
import uuid from 'uuid/v4';

import Brick from './Brick';
import * as operations from '../operations';
import { getGridPos, buildSyleObj, isIntersection } from '../helpers';

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
      position: this.state.cursorPosition,
      size: this.props.brickSize,
      color: this.props.color,
    };
    const { bricks } = this.props;
    const result = Object.values(bricks).map(brick => isIntersection(brick, newBrick));
    if (result.every(item => !item)) {
      this.props.addBrick({ brick: newBrick });
    }
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
    setTimeout(() => this.updateBrickSector());
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
    if (tileBricks.length > 0) {
      buildBrickSector({ selectedBricks: tileBricks });
    } else {
      buildBrickSector({ selectedBricks: [] });
    }
  }

  render() {
    const {
      isActive,
      currentOperation: { type },
      templateSize,
      step,
      bricks,
      sector,
      bricksColors,
    } = this.props;

    const { cursorPosition } = this.state;

    return (
      <>
        <div
          className="bricks-grid"
          onMouseMove={this.cursorPosition}
          onClick={this.handleOperation()}
          style={buildSyleObj(templateSize, step)}
        >
          {isActive && type === operations.ADD_BRICK ? (
            <div className="brick" style={buildSyleObj({ ...this.props.brickSize, ...cursorPosition }, step)} />
          )
            : null
          }
          <div className="templateSector" style={buildSyleObj({ ...sector.position, ...sector.size }, step)} />
          {Object.values(bricks).map(({ position, size, id }) => {
            const colorId = `${id}-${bricksColors.name}`;
            const { color } = bricksColors.data[colorId] || 'gray';
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
        </div>
      </>
    );
  }
}

export default GridBricks;
