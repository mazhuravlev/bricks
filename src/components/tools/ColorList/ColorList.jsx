import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'reactstrap';

import '../../../styles/ColorList.css';

import ColorPallete from './ColorPalette';

import colors from '../../../data/colors.json';
import { makeRgbStyleProp } from '../../../helpers';

class ColorList extends Component {
  constructor(props) {
    super(props);
    this.switchPalette = this.switchPalette.bind(this);
  }

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
    this.props.removeColor(code);
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
    this.props.addColor(color);
  }

  switchPalette(e) {
    this.props.switchPalette(e.target.value);
  }

  currentPaletteColors() {
    return this.props.colorPalette.palettes[this.props.colorPalette.currentPalette].colors;
  }

  render() {
    const { currentColor } = this.state;
    return (
      <div className="color-list">
        <div>
          <select style={{ width: '80%' }} className="white" onChange={this.switchPalette} value={this.props.colorPalette.currentPalette}>
            {Object.values(this.props.colorPalette.palettes).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
          <Button size="sm" className="float-right" onClick={this.props.addPalette}>+</Button>
        </div>
        <select
          onChange={this.addNewColor}
          style={{ backgroundColor: makeRgbStyleProp(currentColor.rgb), fontSize: '12px', margin: '8px 0 8px' }}
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
          colorList={this.currentPaletteColors()}
          setColorList={this.setColorList}
          removeColor={this.removeColor}
        />
      </div>
    );
  }
}

export default ColorList;
