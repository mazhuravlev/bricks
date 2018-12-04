/* eslint-disable no-plusplus */
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
    for (let x = 0; x < brick.size.width; x++) {
      for (let y = 0; y < brick.size.height; y++) {
        brickMatrix[`${x + brick.position.left};${y + brick.position.top}`] = brick;
      }
    }
  });
  return brickMatrix;
}
