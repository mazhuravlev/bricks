import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
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

const makeBrickColors = (bricksPairs, colorMap) => {
  const colors = Object.values(colorMap);
  const totalValue = colors.map(x => x.value).reduce((a, c) => a + c);
  const colorParts = colors.map(x => x.value / totalValue);
  const colorBrickCount = colorParts.map(x => Math.round(bricksPairs.length * x));
  const getColor = () => {
    let n = 0;
    while (n < 100) {
      n += 1;
      const i = Math.floor(Math.random() * colorBrickCount.length);
      if (colorBrickCount[i] > 0) {
        colorBrickCount[i] -= 1;
        return colors[i].color;
      }
    }
    throw new Error('coloring iterations exceeded');
  };
  const newColors = {};
  Object.values(bricksPairs).forEach((bricks) => {
    const color = getColor();
    bricks.forEach((b) => {
      newColors[b.id] = color;
    });
  });
  return newColors;
};

// const fixColorForPairs = (brickColors, brickPairs) => brickPairs.reduce((acc, brick, i) => {
//   if (!(i % 2)) return acc;
//   const firstId = brickPairs[i].id;
//   const secondId = brickPairs[i - 1].id;

//   const randomPairIndex = _.random(0, 1);
//   const randomId = [firstId, secondId][randomPairIndex];
//   const color = brickColors[randomId === firstId ? secondId : firstId];
//   return { ...acc, [randomId]: color };
// }, brickColors);


class PaintingPanel extends Component {
  constructor(props) {
    super(props);
    this.changeColorValue = this.changeColorValue.bind(this);
  }

  state = {
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

  addNewColor = () => {
    const { color } = this.props;
    const { colorList } = this.state;
    this.setState({
      colorList: {
        ...colorList,
        [color.code]: { color, value: 1 },
      },
    });
  }

  // eslint-disable-next-line react/sort-comp
  changeColorValue(code, value) {
    this.setState(state => ({
      colorList: {
        ...state.colorList,
        [code]: { color: state.colorList[code].color, value: Number(value) },
      },
    }));
  }

  removeColor = code => () => {
    const { colorList } = this.state;
    this.setState({ colorList: _.omit(colorList, code) });
  }

  makeRandomPainting = () => {
    if (!Object.keys(this.state.colorList).length) return;
    const { bricks, colorPresetName, bricksColors } = this.props;
    console.log(1);
    const outsideBricks = this.getOutsideBricks();
    const brickPairs = getBrickPairs(outsideBricks);
    const bricksInPairsIds = _.keyBy(brickPairs, 'id');
    const brickSets = _.chunk(brickPairs, 2)
      .concat(bricks.filter(x => !(x.id in bricksInPairsIds)).map(x => [x]));
    const resultColorsList = makeBrickColors(brickSets, this.state.colorList);
    // const resultColorsList = fixColorForPairs(brickColors, brickPairs);
    const actions = [];
    Object.keys(resultColorsList).forEach((id) => {
      const color = resultColorsList[id];
      const oldColor = bricksColors[`${id}-${colorPresetName}`] ? bricksColors[`${id}-${colorPresetName}`].color : undefined;
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
    const totalValue = Object.values(colorList)
      .map(colorEntry => colorEntry.value)
      .reduce((a, c) => a + c);
    const getPercent = v => Math.round(v / totalValue * 100);
    return (
      <div>
        {Object.values(colorList).map(colorEntry => (
          <div key={colorEntry.color.code} className="color-preview">
            <div
              className="color"
              style={{ backgroundColor: makeRgbStyleProp(colorEntry.color.rgb) }}
              onClick={this.removeColor(colorEntry.color.code)}
            />
            <input type="number" value={colorEntry.value} min="0" onChange={e => this.changeColorValue(colorEntry.color.code, e.target.value)} />
            <span className="percent">
              {getPercent(colorEntry.value)}
              %
            </span>
          </div>
        ))}
      </div>
    );
  }

  renderRandomPaintingPanel() {
    const { colorList } = this.state;
    return (
      <div>
        <ButtonGroup size="sm">
          <Button onClick={this.addNewColor}>+ цвет</Button>
          <Button onClick={this.makeRandomPainting}>Красить</Button>
        </ButtonGroup>
        {Object.values(colorList).length > 0 ? this.renderColorList() : null}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderRandomPaintingPanel()}
      </div>
    );
  }
}

export default PaintingPanel;
