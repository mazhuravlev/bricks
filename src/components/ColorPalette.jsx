import React, { Component } from 'react';
import colors from '../data/colors.json';
import { makeRgbStyleProp } from '../helpers';

class ColorPalette extends Component {
  state = {
    currentColor: colors[1000],
  }

  componentWillMount() {
    const code = Object.keys(colors)[0];
    this.props.changeColor(makeRgbStyleProp(colors[code].rgb));
  }

  changeColor = ({ target: { value } }) => {
    this.setState({ currentColor: colors[value] });
    this.props.changeColor(makeRgbStyleProp(colors[value].rgb));
  }

  render() {
    const { currentColor } = this.state;
    return (
      <select onChange={this.changeColor} style={{ backgroundColor: makeRgbStyleProp(currentColor.rgb), fontSize: '18px' }}>
        {Object.values(colors).map(({ code, rgb }) => (
          <option style={{ backgroundColor: makeRgbStyleProp(rgb), fontSize: '18px' }} key={code} value={code}>
            {`RAL - ${code}`}
          </option>))}
      </select>
    );
  }
}

export default ColorPalette;
