/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import domtoimage from 'dom-to-image';
import _ from 'lodash';

import GridBricksContainer from '../containers/GridBricksContainer';
import Tools from './tools';
import Preview from './Preview';
import HotKeyPanel from './HotKeyPanel';

import { generateBricksMatrix } from '../helpers';
import colors from '../data/colors.json';
import * as operations from '../operations';

const keyList = ['left', 'up', 'right', 'down', 'alt', 'shift', 'ctrl+z', 'ctrl+y', '+', '-'];

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: { type: operations.ADD_BRICK },
      step: 15,
      fillBackground: false,
      color: Object.values(colors)[0],
      isDisabledHandleKey: false,
    };
    this.setBrickOperation = this.setBrickOperation.bind(this);
    this.setRemoveBrickOperation = this.setRemoveBrickOperation.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.setPaintOperation = this.setPaintOperation.bind(this);
    this.updateBrickSector = this.updateBrickSector.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    if (window.CefSharp) {
      window.CefSharp.BindObjectAsync('vasya').then(x => console.log('bound vasya', x));
    }
  }

  setOperation(operation) {
    this.setState({ operation });
  }

  handleKyeDown = (key) => {
    const { sector, setSectorSize } = this.props;
    const keyMapping = {
      alt: operations.CHANGE_COLOR_BRICK,
      shift: operations.REMOVE_BRICK,
      'ctrl+z': this.undoredo.bind(this, 'undo'),
      'ctrl+y': this.undoredo.bind(this, 'redo'),
      left: setSectorSize.bind(this, { left: sector.left - 1 }),
      up: setSectorSize.bind(this, { top: sector.top - 1 }),
      right: setSectorSize.bind(this, { left: sector.left + 1 }),
      down: setSectorSize.bind(this, { top: sector.top + 1 }),
    }[key];

    if (_.isFunction(keyMapping)) {
      keyMapping();
    } else {
      this.setState({
        isDisabledHandleKey: true,
        operation: { type: keyMapping },
      });
    }
  }

  handleKyeUp = () => {
    this.setState({
      isDisabledHandleKey: false,
      operation: { type: operations.ADD_BRICK },
    });
  }

  undoredo = (type) => {
    const {
      history,
      addBrick,
      removeBrick,
      changeBrickColor,
    } = this.props;

    const historyLength = history[type].length;

    if (historyLength === 0) {
      return;
    }

    const operationMapping = {
      [operations.ADD_BRICK]: ({ brick, color, colorPresetName }) => {
        if (type === 'redo') {
          return addBrick({ brick, color, colorPresetName });
        }
        return removeBrick({ brick });
      },
      [operations.REMOVE_BRICK]: ({ brick, color, colorPresetName }) => {
        if (type === 'undo') {
          return addBrick({ brick, color, colorPresetName });
        }
        return removeBrick({ brick });
      },
      [operations.CHANGE_COLOR_BRICK]: ({ brickId, color, colorPresetName }) => (
        changeBrickColor({
          brickId,
          color: type === 'redo' ? color.new : color.old,
          colorPresetName,
        })
      ),
    };
    const lastOperations = _.last(history[type]);
    if (_.isArray(lastOperations)) {
      lastOperations.forEach((operation) => {
        operationMapping[operation.type](operation.data);
      });
    } else {
      operationMapping[lastOperations.type](lastOperations.data);
    }
    this.props.historySwap({ type });
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
    for (let x = 0; x < sector.width; x++) {
      for (let y = 0; y < sector.height; y++) {
        const brick = brickMatrix[`${x + sector.left};${y + sector.top}`];
        if (brick && !bricksInSectorMap[brick.id]) {
          bricksInSectorMap[brick.id] = brick;
        }
      }
    }
    const bricksInSector = Object.values(bricksInSectorMap);
    const tileBricks = Object.values(bricksInSector).map((brick) => {
      const { position } = brick;
      const left = position.left - sector.left;
      const top = position.top - sector.top;
      return { ...brick, position: { left, top } };
    });
    if (bricksInSector.length > 0) {
      return tileBricks;
    }
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  async save() {
    const img = await domtoimage.toPng(document.querySelector('.sectorItem'), {
      width: this.props.sector.width * 15,
      height: this.props.sector.height * 15,
    });
    document.querySelector('#preview').src = img;
    document.body.background = this.state.fillBackground ? img : 'none';
    if (window.vasya) {
      window.vasya.save(img);
    }
  }

  render() {
    const { sector, bricksColors } = this.props;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px auto',
          cursor: this.state.isDisabledHandleKey ? 'pointer' : 'default',
        }
      }
      >
        <KeyboardEventHandler
          handleKeys={keyList}
          isDisabled={this.state.isDisabledHandleKey}
          handleEventType="keydown"
          onKeyEvent={this.handleKyeDown}
          handleFocusableElements
        />
        <KeyboardEventHandler
          handleKeys={keyList}
          handleEventType="keyup"
          onKeyEvent={this.handleKyeUp}
          handleFocusableElements
        />
        <div>
          <input
            type="checkbox"
            checked={this.state.fillBackground}
            onChange={() => this.setState(state => ({ fillBackground: !state.fillBackground }))}
          />
          fill background
          <Tools
            setRemoveBrickOperation={this.setRemoveBrickOperation}
            setBrickOperation={this.setBrickOperation}
            setPaintOperation={this.setPaintOperation}
            sector={sector}
            setSectorSize={this.setSectorSize}
            changeColor={this.changeColor}
            color={this.state.color}
            brickSector={this.updateBrickSector()}
            undoredo={this.undoredo}
            save={this.save}
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
            sector={sector}
            bricksColors={bricksColors}
            width={sector.width}
            step={this.state.step}
            colorPresetName={this.props.colorPresetName}
          />
        </div>
        <div>
          <img id="preview" style={window.CefSharp ? { position: 'absolute', left: -1000 } : {}} alt="preview" src="https://via.placeholder.com/1" />
        </div>
        <HotKeyPanel />
      </div>
    );
  }
}
