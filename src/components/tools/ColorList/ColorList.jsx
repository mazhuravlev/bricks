import React, { Component } from 'react';
import './ColorList.css';
import ColorPallete from './ColorPalette';
import { makeRgbStyleProp } from '../../../helpers';

class ColorList extends Component {
  state = {
    colorList: [],
  }

  changeColor(colorCode) {
    const color = this.props.colors[colorCode];
    this.props.changeColor(color);
    const { colorList } = this.state;
    if (colorList.some(x => x.code === colorCode)) return;
    const newColorList = colorList.length > 5
      ? colorList.slice(1).concat([color]) : [...colorList, color];
    this.setState({ colorList: newColorList });
  }

  render() {
    return (
      <div className="color-list">
        <select
          onChange={e => this.changeColor(e.target.value)}
          style={{ backgroundColor: makeRgbStyleProp(this.props.color.rgb), fontSize: '12px', margin: '6px 0 4px' }}
          value={this.props.color.code}
        >
          {Object.values(this.props.colors).map(({ code, rgb }) => (
            <option
              style={{ backgroundColor: makeRgbStyleProp(rgb) }}
              key={code}
              value={code}
            >
              {code}
            </option>))}
        </select>
        <ColorPallete
          color={this.state.currentColor}
          setNewColor={this.props.changeColor}
          colorList={this.state.colorList}
          setColorList={this.setColorList}
          removeColor={this.removeColor}
        />
      </div>
    );
  }
}

export default ColorList;
