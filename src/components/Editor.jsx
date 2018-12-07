/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import domtoimage from 'dom-to-image';
import { ADD_BRICK, REMOVE_BRICK, CHANGE_COLOR_BRICK } from '../operations';

import GridBricksContainer from '../containers/GridBricksContainer';
import Tools from './tools';
import Preview from './Preview';
import { generateBricksMatrix } from '../helpers';
import colors from '../data/colors.json';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: { type: ADD_BRICK },
      step: 15,
      fillBackground: false,
      color: Object.values(colors)[0],
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

  setBrickOperation = (width, height) => () => {
    this.props.changeBrickSize({ size: { width, height } });
    this.setOperation({ type: ADD_BRICK });
  }

  changeColor = color => this.setState({ color });

  setPaintOperation = () => this.setOperation({ type: CHANGE_COLOR_BRICK })

  setRemoveBrickOperation = () => this.setOperation({ type: REMOVE_BRICK });

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
    setTimeout(() => this.updateBrickSector());
  };

  updateBrickSector = () => {
    const { sector, bricks, buildBrickSector } = this.props;
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
      buildBrickSector({ selectedBricks: tileBricks });
    } else {
      buildBrickSector({ selectedBricks: [] });
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
    if (window.vasya) {
      window.vasya.save(img);
    }
  }

  render() {
    const {
      brickSector,
      sector: { size },
      bricksColors,
    } = this.props;

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
          <Tools
            setRemoveBrickOperation={this.setRemoveBrickOperation}
            setBrickOperation={this.setBrickOperation}
            setPaintOperation={this.setPaintOperation}
            sectorSize={size}
            setSectorSize={this.setSectorSize}
            changeColor={this.changeColor}
            color={this.state.color}
            save={this.save}
          />
          <ReactCursorPosition>
            <GridBricksContainer
              color={this.state.color}
              currentOperation={this.state.operation}
              step={this.state.step}
              updateBrickSector={this.updateBrickSector}
            />
          </ReactCursorPosition>
        </div>
        <div>
          <Preview
            bricks={brickSector}
            sectorSize={size}
            colors={bricksColors}
            width={size.width}
            step={this.state.step}
          />
        </div>
        <div>
          <img id="preview" style={window.CefSharp ? { position: 'absolute', left: -1000 } : {}} alt="preview" src="https://via.placeholder.com/1" />
        </div>
      </div>
    );
  }
}
