/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import domtoimage from 'dom-to-image';
import * as operations from '../operations';

import GridBricksContainer from '../containers/GridBricksContainer';
import Tools from './tools';
import Preview from './Preview';
import { generateBricksMatrix } from '../helpers';
import colors from '../data/colors.json';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: { type: operations.ADD_BRICK },
      step: 15,
      fillBackground: false,
      color: Object.values(colors)[0],
      history: [],
      cancelHistory: [],
      historyState: 0,
      cancelHistoryState: 0,
    };
    this.setBrickOperation = this.setBrickOperation.bind(this);
    this.setRemoveBrickOperation = this.setRemoveBrickOperation.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.setPaintOperation = this.setPaintOperation.bind(this);
    this.updateBrickSector = this.updateBrickSector.bind(this);
  }

  componentDidMount() {
    setInterval(() => this.save(), 1000);
  }

  setOperation(operation) {
    this.setState({ operation });
  }

  setBrickOperation = (width, height) => () => {
    this.props.changeBrickSize({ size: { width, height } });
    this.setOperation({ type: operations.ADD_BRICK });
  }

  changeColor = color => this.setState({ color });

  setPaintOperation = () => this.setOperation({ type: operations.CHANGE_COLOR_BRICK })

  setRemoveBrickOperation = () => this.setOperation({ type: operations.REMOVE_BRICK });

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
  };

  updateBrickSector = () => {
    const { sector, bricks } = this.props;
    const brickMatrix = generateBricksMatrix(bricks);
    const bricksInSectorMap = {};
    for (let x = 0; x < sector.size.width; x++) {
      for (let y = 0; y < sector.size.height; y++) {
        const brick = brickMatrix[`${x + sector.size.left};${y + sector.size.top}`];
        if (brick && !bricksInSectorMap[brick.id]) {
          bricksInSectorMap[brick.id] = brick;
        }
      }
    }
    const bricksInSector = Object.values(bricksInSectorMap);
    const tileBricks = Object.values(bricksInSector).map((brick) => {
      const { position } = brick;
      const left = position.left - sector.size.left;
      const top = position.top - sector.size.top;
      return { ...brick, position: { left, top } };
    });
    if (bricksInSector.length > 0) {
      return tileBricks;
    }
    return [];
  }

  addToHistory = (operationArr) => {
    const { history, historyState } = this.state;
    this.setState({
      history: [...history, ...operationArr],
      historyState: historyState + operationArr.length,
      cancelHistory: [],
      cancelHistoryState: 0,
    });
  }

  makeAction = action => () => {
    const {
      history,
      historyState,
      cancelHistory,
      cancelHistoryState,
    } = this.state;

    if (historyState === 0 && action === 'backward') {
      return;
    }
    if (cancelHistoryState === 0 && action === 'forward') {
      return;
    }
    const { addBrick, removeBrick, changeBrickColor } = this.props;
    const operationMapping = {
      [operations.ADD_BRICK]: ({ brick, color, colorPresetName }) => {
        if (action === 'forward') {
          return addBrick({ brick, color, colorPresetName });
        }
        return removeBrick({ brick });
      },
      [operations.REMOVE_BRICK]: ({ brick, color, colorPresetName }) => {
        if (action === 'backward') {
          return addBrick({ brick, color, colorPresetName });
        }
        return removeBrick({ brick });
      },
      [operations.CHANGE_COLOR_BRICK]: ({ brickId, color, colorPresetName }) => (
        changeBrickColor({
          brickId,
          color: action === 'forward' ? color.new : color.old,
          colorPresetName,
        })
      ),
    };
    const lastOperation = (action === 'forward')
      ? cancelHistory[cancelHistoryState - 1]
      : history[historyState - 1];

    operationMapping[lastOperation.type](lastOperation.data);
    if (action === 'forward') {
      this.setState({
        history: [...history, cancelHistory[cancelHistoryState - 1]],
        historyState: historyState + 1,
        cancelHistoryState: cancelHistoryState - 1,
        cancelHistory: cancelHistory.slice(0, cancelHistory.length - 1),
      });
    } else {
      this.setState({
        history: history.slice(0, history.length - 1),
        historyState: historyState - 1,
        cancelHistoryState: cancelHistoryState + 1,
        cancelHistory: [...cancelHistory, history[historyState - 1]],
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async save() {
    const img = await domtoimage.toPng(document.querySelector('.sectorItem'), {
      width: this.props.sector.size.width * 15,
      height: this.props.sector.size.height * 15,
    });
    document.querySelector('#preview').src = img;
    document.body.background = this.state.fillBackground ? img : 'none';
  }

  render() {
    const { sector: { size }, bricksColors } = this.props;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '360px auto',
      }}
      >
        <div>
          <input
            type="checkbox"
            checked={this.state.fillBackground}
            onChange={() => this.setState(state => ({ fillBackground: !state.fillBackground }))}
          />
          fill background
          <button onClick={this.makeAction('backward')} type="button">backward</button>
          <button onClick={this.makeAction('forward')} type="button">forward</button>
          <Tools
            setRemoveBrickOperation={this.setRemoveBrickOperation}
            setBrickOperation={this.setBrickOperation}
            setPaintOperation={this.setPaintOperation}
            sectorSize={size}
            setSectorSize={this.setSectorSize}
            changeColor={this.changeColor}
            color={this.state.color}
            brickSector={this.updateBrickSector()}
          />
          <ReactCursorPosition>
            <GridBricksContainer
              color={this.state.color}
              currentOperation={this.state.operation}
              step={this.state.step}
              updateBrickSector={this.updateBrickSector}
              addToHistory={this.addToHistory}
            />
          </ReactCursorPosition>
        </div>
        <div>
          <Preview
            bricks={this.updateBrickSector()}
            sectorSize={size}
            bricksColors={bricksColors}
            width={size.width}
            step={this.state.step}
            colorPresetName={this.props.colorPresetName}
          />
        </div>
        <div>
          <p>PNG</p>
          <img id="preview" alt="preview" src="https://via.placeholder.com/1" />
        </div>
      </div>
    );
  }
}
