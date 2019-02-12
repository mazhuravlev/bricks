import domtoimage from 'dom-to-image';
import _ from 'lodash';
import { ADD_BRICK } from '../operations';

export const getGridPos = (x, y, step) => {
  const left = Math.floor(x / step);
  const top = Math.floor(y / step);
  return { left, top };
};

export const buildSyleObj = (styleObj, step) => Object.keys(styleObj)
  .reduce((acc, key) => ({ ...acc, [key]: styleObj[key] * step }), {});

export const gridSizeValidate = (size, gridSizeLimit) => (
  (size > 0) && (size <= gridSizeLimit) ? size : gridSizeLimit);

export function generateBricksMatrix(bricks) {
  const brickMatrix = {};
  Object.values(bricks).forEach((brick) => {
    for (let x = 0; x < brick.size.width; x += 1) {
      for (let y = 0; y < brick.size.height; y += 1) {
        brickMatrix[`${x + brick.position.left};${y + brick.position.top}`] = brick;
      }
    }
  });
  return brickMatrix;
}

export function getBrickPosition(cursorPosition, { width, height }) {
  if (width === 1 && height === 1) return cursorPosition;
  return width > height
    ? { top: cursorPosition.top, left: cursorPosition.left - Math.round(width / 2) }
    : { left: cursorPosition.left, top: cursorPosition.top - Math.round(height / 2) };
}


export const makeRgbStyleProp = rgb => (rgb ? `rgb(${rgb})` : 'rgb(214,199,148)');

export function getBricksInSector(bricks, sector) {
  const brickMatrix = generateBricksMatrix(bricks);
  const bricksInSectorMap = {};
  for (let x = 0; x < sector.width; x += 1) {
    for (let y = 0; y < sector.height; y += 1) {
      const brick = brickMatrix[`${x + sector.left};${y + sector.top}`];
      if (brick && !bricksInSectorMap[brick.id]) {
        bricksInSectorMap[brick.id] = brick;
      }
    }
  }
  const bricksInSector = Object.values(bricksInSectorMap);
  const tileBricks = Object.values(bricksInSector).map((brick) => {
    const { position } = brick;
    const left = position.left - sector.left;
    const top = position.top - sector.top;
    return { ...brick, position: { left, top } };
  });
  if (bricksInSector.length > 0) {
    return tileBricks;
  }
  return [];
}

export async function createImage(sectorWidth, sectorHeight) {
  const img = await domtoimage.toPng(document.querySelector('.sectorItem'), {
    width: sectorWidth * 15,
    height: sectorHeight * 15,
  });
  return img;
}

export function isOutside(position, size, sector) {
  const relPos = { left: position.left - sector.left, top: position.top - sector.top };
  const conditions = [
    relPos.left < 0 || relPos.top < 0,
    relPos.left + size.width > sector.width,
    relPos.top + size.height > sector.height,
  ];
  return conditions.some(item => item);
}

export function isPair(brick1, brick2) {
  const conditions1 = [
    brick1.size.width === 1,
    brick1.position.left === brick2.position.left,
  ].every(item => item);
  const conditions2 = [
    brick1.size.height === 1,
    brick1.position.top === brick2.position.top,
  ].every(item => item);
  return conditions1 || conditions2;
}

export function getBrickPairs(bricks) {
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
}

export function makeBrickColors(bricksPairs, colorMap) {
  const colors = Object.values(colorMap);
  const totalValue = colors.map(x => x.value).reduce((a, c) => a + c);
  const colorParts = colors.map(x => x.value / totalValue);
  const colorBrickCount = colorParts.map(x => Math.round(bricksPairs.length * x));
  const getColor = () => {
    let n = 0;
    while (n < 100) {
      n += 1;
      const i = Math.floor(Math.random() * colorBrickCount.length);
      if (colorBrickCount.reduce((a, c) => a + c) === 0) {
        return colors[i].color;
      }
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
}

export function isBrickButonActive(operation, size, w, h) {
  if (operation.type !== ADD_BRICK) return false;
  return w === size.width && h === size.height;
}

export const getPercent = (colorList, value) => {
  const totalValue = colorList
    .map(colorEntry => colorEntry.value)
    .reduce((a, c) => a + c);
  return (value === 0 ? 0 : Math.round(value / totalValue * 100));
};

export const builGradientForPalette = (randomPalette) => {
  const colorsArr = randomPalette.reduce((acc, item, i) => {
    const { value, color: { rgb } } = item;
    const colorPercent = getPercent(randomPalette, value);
    const color = makeRgbStyleProp(rgb);
    if (i === 0) {
      return [{ color, percent: 0 }, { color, percent: colorPercent }];
    }
    const percentFrom = acc[acc.length - 1].percent;
    const percentTo = percentFrom + colorPercent;
    return [...acc, { color, percent: percentFrom }, { color, percent: percentTo }];
  }, []);

  const result = `linear-gradient(to right, ${colorsArr.map(({ color, percent }) => `${color} ${percent}%`).join(', ')})`;
  return result;
};

const rgbToHex = (r, g, b) => {
  let r1 = r.toString(16);
  let g1 = g.toString(16);
  let b1 = b.toString(16);
  if (r.length === 1) r1 = `0${r}`;
  if (g.length === 1) g1 = `0${g}`;
  if (b.length === 1) b1 = `0${b}`;

  return (r1 + g1 + b1).toUpperCase();
};

export const buildRandomPalleteId = randomPallete => randomPallete
  .map(({ color: { rgb }, value }) => ({ value, color: rgbToHex(...rgb.split(',')) }))
  .sort((a, b) => {
    if (a.color > b.color) return 1;
    if (a.color < b.color) return -1;
    return 0;
  })
  .reduce((acc, { color, value }) => `${acc}${color}${value}`, '');
