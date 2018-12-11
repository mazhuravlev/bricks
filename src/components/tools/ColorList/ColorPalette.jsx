import React, { Component } from 'react';
import _ from 'lodash';

import PalettePresetPanelContainer from '../../../containers/PalettePresetPanelContainer';

import { makeRgbStyleProp } from '../../../helpers';

export class ColorPalette extends Component {
  state = {
    colorList: {},
  }

  setColorList = (colorList) => {
    this.setState({ colorList });
  }

  addNewColor = () => {
    const { color } = this.props;
    const { colorList } = this.state;
    this.setColorList({
      ...colorList,
      [color.code]: color,
    });
  }

  setColor = color => () => {
    this.props.setNewColor(color);
  }

  removeColor = code => (e) => {
    e.preventDefault();
    const { colorList } = this.state;
    this.setState({ colorList: _.omit(colorList, code) });
  }

  renderColorList() {
    const { colorList } = this.state;
    return (
      <div>
        <button onClick={this.addNewColor} type="button">+</button>
        {Object.values(colorList).map(color => (
          <div
            className="color-preview"
            key={color.code}
            style={{ backgroundColor: makeRgbStyleProp(color.rgb) }}
            onClick={this.setColor(color)}
            onContextMenu={this.removeColor(color.code)}
          >
            <p>{color.code}</p>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderColorList()}
        <PalettePresetPanelContainer
          colorList={this.state.colorList}
          setColorList={this.setColorList}
        />
      </div>
    );
  }
}

export default ColorPalette;
