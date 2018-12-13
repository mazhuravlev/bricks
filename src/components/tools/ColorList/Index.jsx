import React, { Component } from 'react';
import _ from 'lodash';

import '../../../styles/ColorList.css';

import ColorPallete from './ColorPalette';

import colors from '../../../data/colors.json';
import { makeRgbStyleProp } from '../../../helpers';

class ColorList extends Component {
  state = {
    currentColor: Object.values(colors)[0],
    colorList: {},
  }

  componentWillMount() {
    const code = Object.keys(colors)[0];
    this.props.changeColor(colors[code]);
  }

  setColorList = (colorList) => {
    this.setState({ colorList });
  }

  removeColor = (code) => {
    const { colorList } = this.state;
    this.setState({ colorList: _.omit(colorList, code) });
  }

  setNewColor = (color) => {
    this.setState({ currentColor: color });
    this.props.changeColor(color);
  }

  addNewColor = ({ target: { value } }) => {
    const { colorList } = this.state;
    const color = colors[value];
    const newColorList = {
      ...colorList,
      [color.code]: color,
    };
    this.setColorList(newColorList);
    this.setNewColor(color);
  }

  render() {
    const { currentColor } = this.state;
    return (
      <div className="color-list">
        <select
          onChange={this.addNewColor}
          style={{ backgroundColor: makeRgbStyleProp(currentColor.rgb), fontSize: '12px' }}
          value={this.state.currentColor.code}
        >
          {Object.values(colors).map(({ code, rgb }) => (
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
          setNewColor={this.setNewColor}
          colorList={this.state.colorList}
          setColorList={this.setColorList}
          removeColor={this.removeColor}
        />
      </div>
    );
  }
}

export default ColorList;
