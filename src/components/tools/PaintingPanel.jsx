import React, { Component } from 'react';
import _ from 'lodash';
import { makeRgbStyleProp } from '../../helpers';

class PaintingPanel extends Component {
  state = {
    mode: 'manual',
    colorList: {},
  }

  changeMode = ({ target: { value } }) => {
    this.setState({ mode: value });
  }

  addNewColor = () => {
    const { color } = this.props;
    const { colorList } = this.state;
    this.setState({
      colorList: {
        ...colorList,
        [color.code]: color,
      },
    });
  }

  removeColor = code => () => {
    const { colorList } = this.state;
    this.setState({ colorList: _.omit(colorList, code) });
  }

  makeRundomPainting = () => {
    const { colorList } = this.state;
    const { brickSector, colorPresetName } = this.props;
    const colors = Object.values(colorList);
    const maxRandom = colors.length - 1;
    Object.values(brickSector).forEach(({ id }) => {
      this.props.changeBrickColor({
        brickId: id,
        color: colors[_.random(0, maxRandom)],
        colorPresetName,
      });
    });
  }

  renderColorList() {
    const { colorList } = this.state;
    return (
      <div>
        {Object.values(colorList).map(color => (
          <div
            className="color-preview"
            key={color.code}
            style={{ backgroundColor: makeRgbStyleProp(color.rgb) }}
            onClick={this.removeColor(color.code)}
          >
            <p>{color.code}</p>
          </div>
        ))}
      </div>
    );
  }

  renderRandomPaintingPanel() {
    const { colorList } = this.state;
    return (
      <div>
        <button onClick={this.addNewColor} type="button">Добавить выбранный цвет в список</button>
        {Object.values(colorList).length > 0 ? this.renderColorList() : null}
        <button onClick={this.makeRundomPainting} style={{ marginBottom: '5px' }} type="button">Применить расскраску</button>
      </div>
    );
  }

  render() {
    const { mode } = this.state;
    return (
      <div>
        <div>
          <label htmlFor="manual">
            <input onChange={this.changeMode} checked={mode === 'manual'} type="radio" id="manual" name="mode" value="manual" />
            Ручная покраска
          </label>
          <label htmlFor="rundom">
            <input onChange={this.changeMode} checked={mode === 'rundom'} type="radio" id="rundom" name="mode" value="rundom" />
            Случайная покраска
          </label>
        </div>
        {this.state.mode === 'manual' ? null : this.renderRandomPaintingPanel()}
      </div>
    );
  }
}

export default PaintingPanel;
