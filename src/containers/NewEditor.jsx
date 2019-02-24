import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { connect } from 'react-redux';
import domtoimage from 'dom-to-image';
import _ from 'lodash';
import { Base64 } from 'js-base64';

import GridBricksContainer from './GridBricksContainer';
import Preview from '../components/Preview';
import ColorList from '../components/tools/ColorList/ColorList';
import NumberInput from '../components/NumberInput';

import * as actionCreators from '../actions';
import * as operations from '../operations';
import colors from '../data/colors.json';
import {
  getBricksInSector, createImage, isOutside, makeBrickColors, getBrickPairs,
} from '../helpers';
import buildBriksForNewSectorSize from '../helpers/bricksBuilder';
import HotKeyPanel from '../components/HotKeyPanel';
import './Editor.css';
import PaintingPanel from '../components/tools/PaintingPanel';

const keyList = ['left', 'up', 'right', 'down', 'alt', 'shift', 'ctrl+z', 'ctrl+y', '+', '-'];
const sectorSizeControlButton = new Set(['left', 'up', 'right', 'down', '+', '-']);

const containerStyle = {
  minHeight: 454,
  display: 'inline-grid',
  border: '1px solid gray',
  gridTemplateColumns: 'auto auto',
  gridTemplateRows: 'auto',
  gridColumnGap: '10px',
  gridRowGap: '15px',
  placeItems: 'flex-start',
  gridTemplateAreas: '"editor preview"',
};

const editorLayout = {
  padding: '6px 0 6px 6px',
  // display: 'grid',
  // gridTemplateRows: '300px'
};

class _NewEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: { type: operations.ADD_BRICK },
      // workareaStep: 20,
      tileStep: 15,
      color: Object.values(colors)[0],
      isDisabledHandleKey: false,
      teilwidth: 1,
      teilheight: 1,
      defaultPainting: true,
      customSectorBricks: [],
      customSector: this.props.sector,
      customSectorBrickColors: {},
      gridSize: {
        width: Math.ceil(480 / (this.props.sector.width * 15)),
        height: Math.ceil(539 / (this.props.sector.height * 15)),
      },
      showGrid: false,
    };
    this.setSectorSize = this.setSectorSize.bind(this);
    this.setBrickOperation = this.setBrickOperation.bind(this);
    this.setPaintOperation = this.setPaintOperation.bind(this);
    this.setRemoveBrickOperation = this.setRemoveBrickOperation.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.makeRandomPainting = this.makeRandomPainting.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    setInterval(async () => {
      if (this.state.defaultPainting) {
        this.setState({
          preview: await createImage(this.props.sector.width, this.props.sector.height),
        });
      } else {
        const { width, height } = this.state.customSector;
        this.setState({
          preview: await createImage(width, height),
        });
      }
    }, 1000);
  }


  setSectorSize = (size) => {
    this.props.setSectorSize(size);
  };

  getInsideBricks() {
    const {
      bricks,
      sector,
    } = this.props;
    return bricks.filter(({ position, size }) => !isOutside(position, size, sector));
  }


  setOperation(op) {
    // eslint-disable-next-line react/no-access-state-in-setstate
    if (op.type === operations.CHANGE_COLOR_BRICK && !this.state.defaultPainting) return;
    this.setState({ operation: op });
  }

  confirmChangeSectorSize = () => {
    if (Object.keys(this.props.bricks).length > 0) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('При изменении размера текстуры все кирпичи будут удалены. Продолжить?')) {
        this.props.resetBricks();
        return true;
      }
      return false;
    }
    return true;
  }

  handleKeyDown = (key) => {
    const { sector, setSectorSize } = this.props;
    if (sectorSizeControlButton.has(key)) {
      if (!this.confirmChangeSectorSize()) return;
    }

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

  changeColor = color => this.setState({ color });


  setBrickOperation = (width, height) => () => {
    console.log('set operation ADD_BRICK', width, height);
    this.props.changeBrickSize({ size: { width, height } });
    this.setOperation({ type: operations.ADD_BRICK });
  }

  setPaintOperation = () => this.setOperation({ type: operations.CHANGE_COLOR_BRICK })

  setRemoveBrickOperation = () => this.setOperation({ type: operations.REMOVE_BRICK });

  onSaveRandomPalette = randomPallete => () => {
    if (randomPallete.length === 0) return;
    this.props.addRandomPalette(randomPallete);
  }

  removeRandomPalette = paletteId => (event) => {
    event.stopPropagation();
    this.props.removeRandomPalette(paletteId);
  }

  importPaintingPalettes = (event) => {
    event.preventDefault();
    if (window.vasya) {
      const json = window.vasya.loadPalette();
      if (json) {
        const randomPaletts = JSON.parse(json);
        this.props.setRandomPalettes(randomPaletts);
      }
    } else {
      const { files } = event.target;

      if (files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const json = Base64.decode(reader.result);
        if (json.length !== 0) {
          const randomPaletts = JSON.parse(json);
          this.props.setRandomPalettes(randomPaletts);
        }
      };

      reader.readAsText(file);
    }
  }

  exportPaintingPalettes = () => {
    if (Object.keys(this.props.randomPalettes).length === 0) return;
    const json = JSON.stringify(this.props.randomPalettes);
    if (window.vasya) {
      window.vasya.savePalette(json);
    } else {
      const data = new Blob([Base64.encode(json)], {
        type: 'application/json',
      });

      const csvURL = window.URL.createObjectURL(data);
      const tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'template.txt');
      tempLink.click();
    }
  }

  switchTextureType = () => {
    this.props.changeBrickSize({ size: { width: 3, height: 1 } });
    this.props.switchTextureType();
  }

  handleKeyUp = () => {
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

  makeRandomPainting = (colorList) => {
    if (!Object.keys(colorList).length) return;
    if (!this.state.defaultPainting) {
      this.makePainingForCustomSectorSize(colorList);
    }
  }

  makePainingForCustomSectorSize = (colorList) => {
    const { teilwidth, teilheight, customSector } = this.state;
    console.log('TCL: makePainingForCustomSectorSize -> teilheight', teilheight);
    console.log('TCL: makePainingForCustomSectorSize -> teilwidth', teilwidth);
    const { bricks, sector } = this.props;

    const bricksInSector = getBricksInSector(bricks, sector);

    const newBriks = buildBriksForNewSectorSize(bricksInSector, sector, teilwidth, teilheight);

    const colorPresetName = '1';


    const outsideBricks = Object.values(newBriks)
      .filter(({ position: { left, top }, size }) => (
        isOutside(
          { left: left + customSector.left, top: top + customSector.top },
          size, customSector,
        )));

    const brickPairs = getBrickPairs(outsideBricks);

    const bricksInPairsIds = _.keyBy(brickPairs, 'id');
    const brickSets = _.chunk(brickPairs, 2)
      .concat(Object.values(newBriks).filter(x => !(x.id in bricksInPairsIds)).map(x => [x]));
    const resultColorsList = makeBrickColors(brickSets, colorList);

    const brickColors = {};
    Object.keys(resultColorsList).forEach((id) => {
      const color = resultColorsList[id];

      const presetId = `${id}-${colorPresetName}`;
      brickColors[presetId] = { colorPresetName, brickId: id, color };
    });

    this.setState({
      customSectorBricks: newBriks,
      customSectorBrickColors: brickColors,
      operation: { type: operations.ADD_BRICK },
    });
    this.props.historyRemove();
    this.props.resetBrickColors();
  }

  handleTileSize = (param, v) => {
    console.log(param, v);
    if (this.state.defaultPainting) {
      this.setState({
        teilwidth: 1, teilheight: 1, customSectorBricks: [], customSector: { ...this.props.sector },
      });
      return;
    }
    const { customSector, tileStep } = this.state;
    // 480, 539 ширина и высота окна с тайлом
    const newTailWidth = param === 'width' ? v : this.state.teilwidth;
    const newTailHeight = param === 'height' ? v : this.state.teilheight;

    const widthGrixdSize = Math.ceil(480 / (newTailWidth * this.props.sector.width * tileStep));
    console.log(this.props.sector.width * this.state.tileStep * this.state.teilwidth);
    const heightGridSize = Math.ceil(539 / (newTailHeight * this.props.sector.height * tileStep));
    console.log('TCL: handleTileSize -> tileStep', tileStep);
    this.setState({
      [`teil${param}`]: v,
      customSector: { ...customSector, [param]: this.props.sector[param] * v },
      gridSize: { width: widthGrixdSize, height: heightGridSize },
      customSectorBricks: [],
    });
  }

  async updatePreview() {
    this.setState({
      preview: await createImage(this.props.sector.width, this.props.sector.height),
    });
  }

  async save() {
    const img = await domtoimage.toPng(document.querySelector('.sectorItem'), {
      width: (this.state.defaultPainting
        ? this.props.sector.width : this.state.customSector.width) * 15,
      height: (this.state.defaultPainting
        ? this.props.sector.height : this.state.customSector.height) * 15,
    });
    document.querySelector('#preview').src = img;
    document.body.background = this.state.fillBackground ? img : 'none';
    if (window.vasya) {
      window.vasya.save(img);
    }
  }

  textureTypePanel() {
    return (
      <div className="textureTypePanel">
        <p className="textureTypePanel-item">Тип текстуры:</p>
        <p className="textureTypePanel-item">
          Кирпич
          <input
            className="input"
            type="radio"
            name="textureType"
            checked={this.props.textureType === 'brick'}
            onChange={this.switchTextureType}
          />
        </p>
        <p className="textureTypePanel-item">
          Плитка
          <input
            className="input"
            type="radio"
            name="textureType"
            checked={this.props.textureType === 'tile'}
            onChange={this.switchTextureType}
          />
        </p>
      </div>
    );
  }

  renderGrid() {
    const rows = [];
    for (let i = 0; i < this.state.gridSize.height; i += 1) {
      rows.push(i);
    }
    const cols = [];
    for (let i = 0; i < this.state.gridSize.width; i += 1) {
      cols.push(i);
    }
    return (
      rows.map((x, i) => (
        cols.map((y, j) => (
          <div
            key={`${i}:${j}`}
            style={{
              width: this.props.sector.width * this.state.tileStep * this.state.teilwidth,
              height: this.props.sector.height * this.state.tileStep * this.state.teilheight,
              border: '1px solid red',
              boxSizing: 'border-box',
              position: 'absolute',
              left: j * this.props.sector.width * this.state.tileStep * this.state.teilwidth,
              top: i * this.props.sector.height * this.state.tileStep * this.state.teilheight,
            }}
          >
            {''}
          </div>
        ))))
    );
  }

  render() {
    return (
      <div style={containerStyle}>
        <KeyboardEventHandler
          handleKeys={keyList}
          isDisabled={this.state.isDisabledHandleKey}
          handleEventType="keydown"
          onKeyEvent={this.handleKeyDown}
          handleFocusableElements
        />
        <KeyboardEventHandler
          handleKeys={keyList}
          handleEventType="keyup"
          onKeyEvent={this.handleKeyUp}
          handleFocusableElements
        />
        <div style={editorLayout}>
          <HotKeyPanel
            setSectorSize={this.setSectorSize}
            confirmChangeSectorSize={this.confirmChangeSectorSize}
            sector={this.props.sector}
          />
          <ColorList
            colors={colors}
            color={this.state.color}
            changeColor={this.changeColor}
          />
          {this.textureTypePanel()}
          <ReactCursorPosition>
            <GridBricksContainer
              color={this.state.color}
              currentOperation={this.state.operation}
              step={20}
              setBrickOperation={this.setBrickOperation}
              setRemoveBrickOperation={this.setRemoveBrickOperation}
              setPaintOperation={this.setPaintOperation}
              disablePaintButton={!this.state.defaultPainting}
            />
          </ReactCursorPosition>
          <PaintingPanel
            makeRandomPainting={this.makeRandomPainting}
            onSaveRandomPalette={this.onSaveRandomPalette}
            removeRandomPalette={this.removeRandomPalette}
            bricks={this.props.bricks}
            onSave={this.save}
            colors={colors}
            color={this.state.color}
            randomPalettes={this.props.randomPalettes}
            importPaintingPalettes={this.importPaintingPalettes}
            exportPaintingPalettes={this.exportPaintingPalettes}
            defaultPainting={this.state.defaultPainting}
          />
        </div>
        <div style={{
          width: 495, height: '100%', padding: '6px 6px 6px', overflow: 'hidden',
        }}
        >
          <div className="tile-options-panel">
            <div>
              <NumberInput
                style={{ position: 'relative' }}
                value={this.state.teilwidth}
                min={1}
                max={6}
                onChange={v => this.handleTileSize('width', v)}
              />
              <NumberInput
                style={{ position: 'relative' }}
                value={this.state.teilheight}
                min={1}
                max={6}
                onChange={v => this.handleTileSize('height', v)}
              />
            </div>
            <p style={{ padding: 0, display: 'block', margin: '0' }}>
              <input
                style={{ marginRight: '5px' }}
                type="checkbox"
                name="paintingType"
                checked={!this.state.defaultPainting}
                onChange={() => this.setState({
                  // eslint-disable-next-line react/no-access-state-in-setstate
                  defaultPainting: !this.state.defaultPainting,
                  teilwidth: 1,
                  customSectorBricks: [],
                  teilheight: 1,
                  customSector: { ...this.props.sector },
                  gridSize: {
                    width: Math.ceil(480 / (this.props.sector.width * 15)),
                    height: Math.ceil(539 / (this.props.sector.height * 15)),
                  },
                })}
              />
            Меланж
            </p>
            <p style={{ padding: 0, display: 'block', margin: '0' }}>
              <input
                style={{ marginRight: '5px' }}
                type="checkbox"
                name="paintingType"
                checked={this.state.showGrid}
              // eslint-disable-next-line react/no-access-state-in-setstate
                onChange={() => this.setState({ showGrid: !this.state.showGrid })}
              />
            Показать сетку
            </p>
          </div>
          <div style={{
            width: '480px', height: '539px', overflow: 'hidden', backgroundColor: '#7f7f7f', position: 'relative', backgroundImage: `url('${this.state.preview}')`,
          }}
          >
            {this.state.showGrid ? this.renderGrid() : null}
          </div>
        </div>
        <div style={{ position: 'absolute', left: -1000 }}>
          {this.state.defaultPainting
            ? (
              <Preview
                bricks={getBricksInSector(this.props.bricks, this.props.sector)}
                sector={this.props.sector}
                bricksColors={this.props.bricksColors}
                width={this.props.sector.width}
                step={this.state.tileStep}
                colorPresetName="1"
                textureType={this.props.textureType}
              />
            )
            : (
              <Preview
                bricks={this.state.customSectorBricks}
                sector={this.state.customSector}
                bricksColors={this.state.customSectorBrickColors}
                width={this.state.customSector.width}
                step={this.state.tileStep}
                colorPresetName="1"
                textureType={this.props.textureType}
              />
            )
          }
          <img id="preview" alt="preview" src="https://via.placeholder.com/1" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    bricks: state.bricks,
    templateSize: state.templateSize,
    sector: state.sector,
    bricksColors: state.bricksColors,
    // colorPresetName: state.colorPresetName,
    history: state.history,
    textureType: state.textureType,
    randomPalettes: state.randomPaletts,
    // colorPalette: state.colorPalette,
  };
  return props;
};

const NewEditor = connect(
  mapStateToProps,
  actionCreators,
)(_NewEditor);

export default NewEditor;
