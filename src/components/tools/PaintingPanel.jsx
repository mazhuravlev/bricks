import React, { Component } from 'react';
import _ from 'lodash';

import { makeRgbStyleProp } from '../../helpers';
import { CHANGE_COLOR_BRICK } from '../../operations';

const isOutside = (position, size, sector) => {
  const conditions = [
    position.left < 0 || position.top < 0,
    position.left + size.width > sector.width,
    position.top + size.height > sector.height,
  ];
  return conditions.some(item => item);
};

const isPair = (brick1, brick2) => {
  const conditions1 = [
    brick1.size.width === 1,
    brick1.position.left === brick2.position.left,
  ].every(item => item);
  const conditions2 = [
    brick1.size.height === 1,
    brick1.position.top === brick2.position.top,
  ].every(item => item);
  return conditions1 || conditions2;
};

const getBrickPairs = (bricks) => {
  if (bricks.length < 2) return [];
  const [head, ...tail] = bricks;
  const [pair] = tail.filter(brick => isPair(head, brick));
  if (!pair && tail.length === 0) {
    return [];
  }
  if (!pair && tail.length > 0) {
    return getBrickPairs(tail);
  }

  const restBricks = _.without(tail, pair);
  if (restBricks.length === 0) {
    return [head, pair];
  }
  return _.flatten([[head, pair], ...getBrickPairs(restBricks)]);
};

const makeBrickColors = (bricks, colors) => {
  const maxRandom = colors.length - 1;
  return Object.values(bricks).reduce((acc, brick) => {
    const color = colors[_.random(0, maxRandom)];
    return { ...acc, [brick.id]: color };
  }, {});
};

const fixColorForPairs = (brickColors, brickPairs) => brickPairs.reduce((acc, brick, i) => {
  if (!(i % 2)) return acc;
  const firstId = brickPairs[i].id;
  const secondId = brickPairs[i - 1].id;

  const randomPairIndex = _.random(0, 1);
  const randomId = [firstId, secondId][randomPairIndex];
  const color = brickColors[randomId === firstId ? secondId : firstId];
  return { ...acc, [randomId]: color };
}, brickColors);


class PaintingPanel extends Component {
  state = {
    mode: 'manual',
    colorList: {},
  }

  getInsideBricks() {
    const {
      bricks,
      sector,
    } = this.props;
    return bricks.filter(({ position, size }) => !isOutside(position, size, sector));
  }

  getOutsideBricks() {
    const { bricks, sector } = this.props;
    const outsideBricks = bricks.filter(({ position, size }) => (
      isOutside(position, size, sector)
    ));
    return outsideBricks;
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
    const { bricks, colorPresetName, bricksColors } = this.props;

    const outsideBricks = this.getOutsideBricks();
    const brickPairs = getBrickPairs(outsideBricks);

    const colors = Object.values(colorList);
    const brickColors = makeBrickColors(bricks, colors);

    const resultColorsList = fixColorForPairs(brickColors, brickPairs);
    const actions = [];
    Object.keys(resultColorsList).forEach((id) => {
      const color = resultColorsList[id];
      const oldColor = bricksColors[`${id}-${colorPresetName}`].color;
      this.props.changeBrickColor({ brickId: id, color, colorPresetName });

      actions.push({
        type: CHANGE_COLOR_BRICK,
        data: {
          brickId: id,
          color: { old: oldColor, new: color },
          colorPresetName,
        },
      });
    });

    this.props.historyPush({ operations: actions });
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
