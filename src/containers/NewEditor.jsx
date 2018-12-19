/* eslint-disable */

import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import GridBricksContainer from '../containers/GridBricksContainer';
import Preview from '../components/Preview';

import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import * as operations from '../operations';
import colors from '../data/colors.json';
import { getBricksInSector, createImage } from '../helpers';

const keyList = ['left', 'up', 'right', 'down', 'alt', 'shift', 'ctrl+z', 'ctrl+y', '+', '-'];

const containerStyle = {
  minHeight: 454,
  display: 'inline-grid',
  border: '1px solid gray',
  gridTemplateColumns: 'auto auto',
  gridTemplateRows: 'auto',
  gridColumnGap: '10px',
  gridRowGap: '15px',
  justifyItems: 'center',
  alignItems: 'center',
  gridTemplateAreas: '"editor preview"',
};

const editorLayout = {
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
      this.setBrickOperation = this.setBrickOperation.bind(this);
      this.setPaintOperation = this.setPaintOperation.bind(this);
      this.setRemoveBrickOperation = this.setRemoveBrickOperation.bind(this);
  }

  componentDidMount() {
      setInterval(async () => {
        this.setState({preview: await createImage(this.props.sector.width, this.props.sector.height)})
      }, 1000);
  }

  setSectorSize = (size) => {
    this.props.setSectorSize(size);
  };

  handleKeyDown = (key) => {
    const { sector, setSectorSize } = this.props;
    const keyMapping = {
      alt: operations.CHANGE_COLOR_BRICK,
      shift: operations.REMOVE_BRICK,
    //   'ctrl+z': this.undoredo.bind(this, 'undo'),
    //   'ctrl+y': this.undoredo.bind(this, 'redo'),
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
            <div></div>
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
        </div>
        <div style={{width:495, height: 495, overflow: 'hidden', position: 'relative', backgroundImage: `url('${this.state.preview}')`}}>
        </div>
        <div style={{ position: 'absolute', left: -1000 }}>
        <Preview
              bricks={getBricksInSector(this.props.bricks, this.props.sector)}
              sector={this.props.sector}
              bricksColors={this.props.bricksColors}
              width={this.props.sector.width}
              step={this.state.tileStep}
              colorPresetName={this.props.colorPresetName}
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
    // history: state.history,
    // colorPalette: state.colorPalette,
  };
  return props;
};

const NewEditor = connect(
  mapStateToProps,
  actionCreators,
)(_NewEditor);

export default NewEditor;
