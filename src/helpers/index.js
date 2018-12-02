export const getGridPos = (x, y, step) => {
  const left = Math.floor(x / step);
  const top = Math.floor(y / step);
  return { left, top };
};

export const buildSyleObj = (styleObj, step) => Object.keys(styleObj)
  .reduce((acc, key) => ({ ...acc, [key]: styleObj[key] * step }), {});

export const isIntersection = (brick, currentCells) => {
  const sector = {
    size: currentCells.size || { width: 1, height: 1 },
    position: currentCells.position,
  };

  const { position, size } = brick;
  const conditionsX1 = [
    sector.position.left <= position.left,
    (sector.position.left + sector.size.width - 1) >= position.left,
  ];
  const conditionsX2 = [
    sector.position.left > position.left,
    sector.position.left <= (position.left + size.width - 1),
  ];
  const conditionsY1 = [
    sector.position.top <= position.top,
    (sector.position.top + sector.size.height - 1) >= position.top,
  ];
  const conditionsY2 = [
    sector.position.top > position.top,
    sector.position.top <= (position.top + size.height - 1),
  ];
  return [
    conditionsX1.every(item => item) && conditionsY1.every(item => item),
    conditionsX1.every(item => item) && conditionsY2.every(item => item),
    conditionsX2.every(item => item) && conditionsY1.every(item => item),
    conditionsX2.every(item => item) && conditionsY2.every(item => item),
  ].some(item => item);
};

export const gridSizeValidate = (size, gridSizeLimit) => (
  (size > 0) && (size <= gridSizeLimit) ? size : gridSizeLimit);
