import React, { Component } from 'react';
import colors from '../../data/colors.json';
import { makeRgbStyleProp } from '../../helpers';

class ColorPalette extends Component {
  state = {
    currentColor: Object.values(colors)[0],
  }

  componentWillMount() {
    const code = Object.keys(colors)[0];
    this.props.changeColor(colors[code]);
  }

  changeColor = ({ target: { value } }) => {
    this.setState({ currentColor: colors[value] });
    this.props.changeColor(colors[value]);
  }

  render() {
    const { currentColor } = this.state;
    return (
      <select onChange={this.changeColor} style={{ backgroundColor: makeRgbStyleProp(currentColor.rgb), fontSize: '14px' }}>
        {Object.values(colors).map(({ code, rgb }) => (
          <option style={{ backgroundColor: makeRgbStyleProp(rgb) }} key={code} value={code}>
            {code}
          </option>))}
      </select>
    );
  }
}

export default ColorPalette;
