import React, { Component } from 'react';
import uuid from 'uuid/v4';

import classnames from 'classnames';
import Brick from './Brick';
import * as operations from '../operations';
import {
  getGridPos, buildSyleObj, generateBricksMatrix, getBrickPosition, isBrickButonActive,
} from '../helpers';

function makeCursor(operation) {
  switch (operation.type) {
    case 'CHANGE_COLOR_BRICK':
      return 'crosshair';
    case 'REMOVE_BRICK':
      return 'default';
    case 'ADD_BRICK':
      return 'default';
    default: return 'default';
  }
}

const containerStyle = {
  display: 'grid',
  gridTemplateColumns: '26px auto',
  gridTemplateRows: '26px auto',
  justifyItems: 'left',
  alignItems: 'left',
  gridTemplateAreas: '"top-tool top-tool" "left-tool editor"',
};

const topToolStyle = {
  gridArea: 'top-tool', display: 'block', width: '100%', height: '100%',
};

class GridBricks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorPosition: { left: 0, top: 0 },
    };
  }

  cursorPosition = () => {
    const { position: { x, y }, step } = this.props;
    const currentCell = getGridPos(x - 26, y - 26, step);
    this.setState({ cursorPosition: currentCell });
  };

  keyBoardEvents = (event) => {
    console.log(event.key);
  }

  addBrick = () => {
    const newBrick = {
      id: uuid(),
      position: getBrickPosition(this.state.cursorPosition, this.props.brickSize),
      size: this.props.brickSize,
    };
    const { bricks, colorPresetName, color } = this.props;
    const brickMatrix = generateBricksMatrix(bricks);
    const actions = [];
    for (let x = 0; x < newBrick.size.width; x += 1) {
      for (let y = 0; y < newBrick.size.height; y += 1) {
        if (brickMatrix[`${x + newBrick.position.left};${y + newBrick.position.top}`]) {
          return; // off auto remove bricks
          // const brick =
          //  brickMatrix[`${x + newBrick.position.left};${y + newBrick.position.top}`];

          // const oldColor = this.props.bricksColors[`${brick.id}-${colorPresetName}`]
          //   ? this.props.bricksColors[`${brick.id}-${colorPresetName}`].color
          //   : { rgb: 'rgb(214,199,148)' };

          // this.props.removeBrick({ brick });
          // actions.push({
          //   type: operations.REMOVE_BRICK,
          //   data: { brick, color: oldColor, colorPresetName },
          // });
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

  changeBrickColor = (brick) => {
    if (brick) {
      const { color, colorPresetName, bricksColors } = this.props;
      const oldColor = bricksColors[`${brick.id}-${colorPresetName}`] ? bricksColors[`${brick.id}-${colorPresetName}`].color : undefined;

      this.props.changeBrickColor({ brickId: brick.id, color, colorPresetName });
      const action = {
        type: this.props.currentOperation.type,
        data: {
          brickId: brick.id,
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
    const { step, sector } = this.props;
    const lineThickness = 2;
    const lineH1 = {
      left: 0,
      top: 0,
      width: sector.width * step,
      height: lineThickness,
    };
    const lineH2 = {
      left: 0,
      top: sector.height * step,
      width: sector.width * step,
      height: lineThickness,
    };
    const lineV1 = {
      left: 0,
      top: 0,
      width: lineThickness,
      height: sector.height * step,
    };
    const lineV2 = {
      left: sector.width * step,
      top: 0,
      width: lineThickness,
      height: sector.height * step + lineThickness,
    };
    return (
      <div className="templateSector" style={{ ...buildSyleObj(sector, this.props.step), width: 0, height: 0 }}>
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
        textureType={this.props.textureType}
      />
    );
  }

  render() {
    const {
      isActive,
      currentOperation,
      step,
      bricks,
      bricksColors,
      colorPresetName,
    } = this.props;

    const templateSize = { height: 11, width: 11 };
    return (
      <div style={containerStyle}>
        <div style={topToolStyle}>
          {[1, 2, 3, 4].map(x => (
            <Brick
              button
              active={isBrickButonActive(currentOperation, this.props.brickSize, x, 1)}
              onClick={this.props.setBrickOperation(x, 1)}
              key={x}
              style={{
                width: x * 20, height: 20, position: 'relative', marginRight: 6,
              }}
              textureType={this.props.textureType}
            />
          )) }
          <div
            className={classnames('tool-button', 'paint-button',
              { buttonActive: currentOperation.type === operations.CHANGE_COLOR_BRICK })}
            onClick={this.props.setPaintOperation}
            style={{
              backgroundColor: `rgb(${this.props.color.rgb})`,
              display: 'inline-block',
              marginLeft: 1,
              top: -1,
              position: 'relative',
            }}
          />
        </div>
        <div style={{ gridArea: 'left-tool', width: 20, paddingTop: 3 }}>
          {[2, 3, 4].map(x => (
            <Brick
              button
              onClick={this.props.setBrickOperation(1, x)}
              active={isBrickButonActive(currentOperation, this.props.brickSize, 1, x)}
              key={x}
              data-w={1}
              data-h={x}
              style={{
                width: 20, height: 20 * x, position: 'relative', marginBottom: 7, marginTop: -4,
              }}
              textureType={this.props.textureType}
            />
          )) }
          <div
            className={classnames('tool-button', 'trash-button',
              { buttonActive: currentOperation.type === operations.REMOVE_BRICK })}
            onClick={this.props.setRemoveBrickOperation}
            style={{ marginTop: -4 }}
          />
        </div>
        <div
          className="bricks-grid"
          onMouseMove={this.cursorPosition}
          onClick={this.handleOperation()}
          style={{ ...buildSyleObj(templateSize, step), cursor: makeCursor(currentOperation), gridArea: 'editor' }}
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
                onClick={this.handleOperation(brick)}
                textureType={this.props.textureType}
              />);
          })}
          {isActive && currentOperation.type === operations.ADD_BRICK
            && this.props.position.x > 40 && this.props.position.y > 40
            ? this.renderBrickPreview(this.state.cursorPosition) : null}
          {this.renderSector()}
        </div>
      </div>
    );
  }
}

export default GridBricks;
