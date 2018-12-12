import React, { Component } from 'react';

import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import PalettePresetPanelContainer from '../../../containers/PalettePresetPanelContainer';

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

  renderColorList() {
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
      </div>
    );
  }

  render() {
    return (
      <div>
        <Dropdown direction="right" size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret block>
            Наборы палитр
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem disabled>
              <PalettePresetPanelContainer
                colorList={this.props.colorList}
                setColorList={this.props.setColorList}
              />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {this.renderColorList()}
      </div>
    );
  }
}

export default ColorPalette;
