/* eslint-disable */

import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import GridBricksContainer from '../containers/GridBricksContainer';
import Preview from '../components/Preview';
import ColorList from '../components/tools/ColorList/ColorList';

import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import * as operations from '../operations';
import colors from '../data/colors.json';
import { getBricksInSector, createImage, isOutside, makeBrickColors, getBrickPairs } from '../helpers';
import HotKeyPanel from '../components/HotKeyPanel';
import './Editor.css';
import PaintingPanel from '../components/tools/PaintingPanel';
import domtoimage from 'dom-to-image';

const keyList = ['left', 'up', 'right', 'down', 'alt', 'shift', 'ctrl+z', 'ctrl+y', '+', '-'];

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
  padding: '6px 0 6px 6px'
    // display: 'grid',
    // gridTemplateRows: '300px'
}

class _NewEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
        operation: { type: operations.ADD_BRICK },
        workareaStep: 20,
        tileStep: 15,
        color: Object.values(colors)[0],
        isDisabledHandleKey: false,
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
        this.setState({preview: await createImage(this.props.sector.width, this.props.sector.height)})
      }, 1000);
  }

  async updatePreview(){
    this.setState({preview: await createImage(this.props.sector.width, this.props.sector.height)})
  }

  changeColor = color => this.setState({ color });

  setSectorSize = (size) => {
    this.props.setSectorSize(size);
  };

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

  getInsideBricks() {
    const {
      bricks,
      sector,
    } = this.props;
    return bricks.filter(({ position, size }) => !isOutside(position, size, sector));
  }

  makeRandomPainting (colorList) {
    if (!Object.keys(colorList).length) return;
    const { bricks, bricksColors } = this.props;
    const colorPresetName = "1";
    const outsideBricks = Object.values(bricks).filter(({ position, size }) => isOutside(position, size, this.props.sector));
    const brickPairs = getBrickPairs(outsideBricks);
    const bricksInPairsIds = _.keyBy(brickPairs, 'id');
    const brickSets = _.chunk(brickPairs, 2)
      .concat(Object.values(bricks).filter(x => !(x.id in bricksInPairsIds)).map(x => [x]));
     const resultColorsList = makeBrickColors(brickSets, colorList);
    // const resultColorsList = fixColorForPairs(brickColors, brickPairs);
    const actions = [];
    Object.keys(resultColorsList).forEach((id) => {
      const color = resultColorsList[id];
      const oldColor = bricksColors[`${id}-${colorPresetName}`] ? bricksColors[`${id}-${colorPresetName}`].color : undefined;
      this.props.changeBrickColor({ brickId: id, color, colorPresetName });
      actions.push({
        type: actions.CHANGE_COLOR_BRICK,
        data: {
          brickId: id,
          color: { old: oldColor, new: color },
          colorPresetName,
        },
      });
    });

    this.props.historyPush({ operations: actions });
  }

  handleKeyDown = (key) => {
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

  setOperation(operation) {
    this.setState({ operation });
  }

  setBrickOperation = (width, height) => () => {
    console.log('set operation ADD_BRICK', width, height);
    this.props.changeBrickSize({ size: { width, height } });
    this.setOperation({ type: operations.ADD_BRICK });
  }

  setPaintOperation = () => this.setOperation({ type: operations.CHANGE_COLOR_BRICK })

  setRemoveBrickOperation = () => this.setOperation({ type: operations.REMOVE_BRICK });

  handleKeyUp = () => {
    this.setState({
      isDisabledHandleKey: false,
      operation: { type: operations.ADD_BRICK },
    });
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
    console.log('object');
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
              sector={this.props.sector}/>
            <ColorList 
              colors={colors}
              color={this.state.color}
              changeColor={this.changeColor}/>
            <ReactCursorPosition>
            <GridBricksContainer
                color={this.state.color}
                currentOperation={this.state.operation}
                step={20}
                updateBrickSector={this.updateBrickSector}
                addToHistory={this.addToHistory}
                setBrickOperation={this.setBrickOperation}
                setRemoveBrickOperation={this.setRemoveBrickOperation}
                setPaintOperation={this.setPaintOperation}
              />
            </ReactCursorPosition>
            <PaintingPanel
              makeRandomPainting={this.makeRandomPainting}
              bricks={this.props.bricks}
              onSave={this.save}
              colors={colors}
              color={this.state.color}/>
        </div>
        <div style={{width:495, height: '100%', padding: '6px 6px 6px'}}>
        <div style={{width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#7f7f7f', position: 'relative', backgroundImage: `url('${this.state.preview}')`}}>
        </div>
        </div>
        <div style={{ position: 'absolute', left: -1000 }}>
        <Preview
              bricks={getBricksInSector(this.props.bricks, this.props.sector)}
              sector={this.props.sector}
              bricksColors={this.props.bricksColors}
              width={this.props.sector.width}
              step={this.state.tileStep}
              colorPresetName="1"
            />
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
    // colorPalette: state.colorPalette,
  };
  return props;
};

const NewEditor = connect(
  mapStateToProps,
  actionCreators,
)(_NewEditor);

export default NewEditor;
