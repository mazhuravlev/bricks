import React, { Component } from 'react';
import { makeRgbStyleProp } from '../../../helpers';


export class ColorPalette extends Component {
  state = {
    dropdownOpen: false,
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  setColor = color => () => {
    this.props.setNewColor(color);
  }

  removeColor = code => (e) => {
    e.preventDefault();
    this.props.removeColor(code);
  }

  render() {
    const { colorList } = this.props;
    return (
      <div className="color-palette">
        {Object.values(colorList).map(color => (
          <div
            className="color-palette-item"
            key={color.code}
            style={{ backgroundColor: makeRgbStyleProp(color.rgb) }}
            onClick={this.setColor(color)}
            title={color.code}
            onContextMenu={this.removeColor(color.code)}
          />
        ))}
      </div>);
  }
}

export default ColorPalette;
