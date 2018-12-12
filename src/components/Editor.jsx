/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import domtoimage from 'dom-to-image';
import _ from 'lodash';

import '../styles/Editor.css';
import 'bootstrap/dist/css/bootstrap.css';

// import Tools from './tools';
import GridBricksContainer from '../containers/GridBricksContainer';
import PaintingPanelContainer from '../containers/PaintingPanelContainer';
import PresetPanelContainer from '../containers/PresetPanelContainer';

import Preview from './Preview';
import BricksPanel from './tools/BricksPanel';
import ColorList from './tools/ColorList/Index';
import SectorPanel from './tools/SectorPanel';

import { generateBricksMatrix } from '../helpers';
import colors from '../data/colors.json';
import * as operations from '../operations';

const keyList = ['left', 'up', 'right', 'down', 'alt', 'shift', 'ctrl+z', 'ctrl+y', '+', '-'];

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: { type: operations.ADD_BRICK },
      workareaStep: 20,
      tileStep: 15,
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
      '+': setSectorSize.bind(this, { width: sector.width + 1, height: sector.height + 1 }),
      '-': setSectorSize.bind(this, { width: sector.width - 1, height: sector.height - 1 }),
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
    console.log(width, height);
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

  makeKeyHandlers() {
    return (
      <>
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
      </>
    );
  }

  render() {
    const { sector, bricksColors } = this.props;

    return (
      <>
        <div className="editor-container" style={{ cursor: this.state.isDisabledHandleKey ? 'pointer' : 'default' }}>
          <div className="editor-item palette">
            <ColorList
              changeColor={this.changeColor}
            />
          </div>
          <div className="editor-item workarea">
            <ReactCursorPosition>
              <GridBricksContainer
                color={this.state.color}
                currentOperation={this.state.operation}
                step={this.state.workareaStep}
                updateBrickSector={this.updateBrickSector}
                addToHistory={this.addToHistory}
              />
            </ReactCursorPosition>
          </div>
          <div className="editor-item briks">
            <BricksPanel
              setRemoveBrickOperation={this.setRemoveBrickOperation}
              setBrickOperation={this.setBrickOperation}
              setPaintOperation={this.setPaintOperation}
            />
          </div>
          <div className="editor-item tile">
            <Preview
              bricks={this.updateBrickSector()}
              sector={sector}
              bricksColors={bricksColors}
              width={sector.width}
              step={this.state.tileStep}
              colorPresetName={this.props.colorPresetName}
            />
          </div>
          <div className="editor-item tools">
            <SectorPanel
              sector={this.props.sector}
              setSectorSize={this.props.setSectorSize}
            />
            <PresetPanelContainer />
            <PaintingPanelContainer
              color={this.state.color}
              bricks={this.updateBrickSector()}
            />
          </div>
        </div>
        {this.makeKeyHandlers()}
        <img id="preview" style={window.CefSharp ? { position: 'absolute', left: -1000 } : {}} alt="preview" src="https://via.placeholder.com/1" />
      </>
    );
  }
}
