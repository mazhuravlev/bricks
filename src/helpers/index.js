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
