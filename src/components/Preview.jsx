import React, { Component } from 'react';
import _ from 'lodash';

import Brick from './Brick';
import { buildSyleObj } from '../helpers';

function getColor(bricksColors, brickId, colorPresetName) {
  const color = bricksColors[`${brickId}-${colorPresetName}`];
  return color ? color.color.rgb : null;
}

const isOutside = (position, size, sectorSize) => {
  const conditions = [
    position.left < 0 || position.top < 0,
    position.left + size.width > sectorSize.width,
    position.top + size.height > sectorSize.height,
  ];
  return conditions.some(item => item);
};

const isPair = (brick1, brick2) => {
  const conditions1 = [
    brick1.position.left === brick2.position.left,
    Math.abs(brick1.position.top) + Math.abs(brick2.position.top) === 4,
  ].every(item => item);
  const conditions2 = [
    brick1.position.top === brick2.position.top,
    Math.abs(brick1.position.left) + Math.abs(brick2.position.left) === 4,
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
  return [[head, pair], ...getBrickPairs(tail)];
};

const mixedColors = (bricks, iter) => {
  if (bricks.length === 0) return [];
  return bricks.map((brick, i) => {
    const index = !(i % 2) ? i + 1 : i - 1;
    if (brick.size.width === 1) {
      return (iter >= 2) // 2 - начинаем миксить только со 2 ряда, для вертикальных блоков
        ? { ...brick, id: bricks[index].id }
        : brick;
    }
    return !(iter % 2)
      ? { ...brick, id: bricks[index].id }
      : brick;
  });
};


export class Preview extends Component {
  getInsideBricks() {
    const {
      bricks,
      sectorSize,
    } = this.props;
    return bricks.filter(({ position, size }) => !isOutside(position, size, sectorSize));
  }

  getOutsideBricks() {
    const { bricks, sectorSize } = this.props;
    const outsideBricks = bricks.filter(({ position, size }) => (
      isOutside(position, size, sectorSize)
    ));
    const brickPairs = getBrickPairs(outsideBricks);
    return _.flatten(brickPairs);
  }

  renderBrick(bricks) {
    const {
      bricksColors,
      colorPresetName,
      step,
    } = this.props;
    return bricks.map(({ position, size, id }) => (
      <Brick
        key={id}
        className="brick"
        color={getColor(bricksColors, id, colorPresetName)}
        style={buildSyleObj({ ...position, ...size }, step)}
      />
    ));
  }

  render() {
    const {
      sectorSize,
      step,
    } = this.props;
    const tileArr = new Array(4).fill(null);
    const insideBricks = this.getInsideBricks();
    const outsideBricks = this.getOutsideBricks();
    const tiles = tileArr.map((item, i) => {
      const bricksMixColor = mixedColors(outsideBricks, i);
      return (
        <div key={i} className="sectorItem" style={buildSyleObj({ width: sectorSize.width, height: sectorSize.height }, step)}>
          {this.renderBrick(insideBricks)}
          {this.renderBrick(bricksMixColor)}
        </div>
      );
    });

    return (
      <div
        style={{ gridTemplateColumns: [1, 1].map(() => `${step * this.props.width}px`).join(' ') }}
        className="grid-area-preview"
      >
        {tiles}
      </div>
    );
  }
}

export default Preview;
