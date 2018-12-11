import React, { Component } from 'react';

import ColorPallete from './ColorPalette';

import colors from '../../../data/colors.json';
import { makeRgbStyleProp } from '../../../helpers';

class ColorList extends Component {
  state = {
    currentColor: Object.values(colors)[0],
  }

  componentWillMount() {
    const code = Object.keys(colors)[0];
    this.props.changeColor(colors[code]);
  }

  setNewColor = (color) => {
    this.setState({ currentColor: color });
    this.props.changeColor(color);
  }

  changeColor = ({ target: { value } }) => {
    const color = colors[value];
    this.setNewColor(color);
  }

  render() {
    const { currentColor } = this.state;
    return (
      <div>
        <select
          onChange={this.changeColor}
          style={{ backgroundColor: makeRgbStyleProp(currentColor.rgb), fontSize: '14px' }}
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
        />
      </div>
    );
  }
}

export default ColorList;
