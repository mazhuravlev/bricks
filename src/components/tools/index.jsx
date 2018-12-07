/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

import ColorPalette from './ColorPalette';
import PaintingPanelContainer from '../../containers/PaintingPanelContainer';
import PresetPanelContainer from '../../containers/PresetPanelContainer';

export default class Tools extends Component {
  constructor(props) {
    super(props);
    this.handleSector = this.handleSector.bind(this);
  }

  handleSector(e) {
    const newSize = { ...this.props.sectorSize, [e.target.name]: Number(e.target.value) };
    this.props.setSectorSize(newSize);
  }

  render() {
    const { sectorSize } = this.props;
    return (
      <div style={{ padding: 8 }}>
        <div>
          <button onClick={this.save} type="button">save</button>
        </div>
        <div>
          <button onClick={this.props.setBrickOperation(4, 1)} type="button">H 4</button>
          <button onClick={this.props.setBrickOperation(3, 1)} type="button">H 3</button>
          <button onClick={this.props.setBrickOperation(2, 1)} type="button">H 2</button>
          <button onClick={this.props.setBrickOperation(1, 1)} type="button">1</button>
        </div>
        <div>
          <button onClick={this.props.setBrickOperation(1, 4)} type="button">V 4</button>
          <button onClick={this.props.setBrickOperation(1, 3)} type="button">V 3</button>
          <button onClick={this.props.setBrickOperation(1, 2)} type="button">V 2</button>
          <button onClick={this.props.setPaintOperation} type="button">color</button>
        </div>
        <div>
          <button onClick={this.props.setRemoveBrickOperation} type="button">Delete</button>
        </div>
        <ColorPalette
          changeColor={this.props.changeColor}
        />
        <PresetPanelContainer />
        <PaintingPanelContainer
          color={this.props.color}
          brickSector={this.props.brickSector}
        />
        <div className="grid-sector-options-panel">
          <label htmlFor="sector-left">
                x:
            <input type="number" min="0" className="input-sector-size" name="left" id="sector-left" value={sectorSize.left} onChange={this.handleSector} />
          </label>
          <label htmlFor="grid-width">
                y:
            <input type="number" min="0" className="input-sector-size" name="top" id="sector-top" value={sectorSize.top} onChange={this.handleSector} />
          </label>
          <label htmlFor="grid-width">
                w:
            <input type="number" min="2" className="input-sector-size" name="width" id="sector-width" value={sectorSize.width} onChange={this.handleSector} />
          </label>
          <label htmlFor="grid-height">
                h:
            <input type="number" min="2" className="input-sector-size" name="height" id="sector-height" value={sectorSize.height} onChange={this.handleSector} />
          </label>
        </div>
      </div>
    );
  }
}
