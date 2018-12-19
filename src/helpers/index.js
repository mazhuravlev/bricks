import domtoimage from 'dom-to-image';

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
  /* eslint-disable */
  const brickMatrix = generateBricksMatrix(bricks);
  const bricksInSectorMap = {};
  for (let x = 0; x < sector.width; x++) {
    for (let y = 0; y < sector.height; y++) {
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