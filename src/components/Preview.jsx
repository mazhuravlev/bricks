import React from 'react';
import Brick from './Brick';
import { buildSyleObj } from '../helpers';

function getColor(colors, brickId) {
  const color = colors.data[`${brickId}-${colors.name}`];
  return color ? color.color.rgb : null;
}

export default function Preview({
  bricks, sectorSize, colors, width, step,
}) {
  const tileArr = new Array(4).fill(null);
  const tiles = tileArr.map((_, i) => (
    <div key={i} className="sectorItem" style={buildSyleObj({ width: sectorSize.width, height: sectorSize.height }, step)}>
      {bricks.map(({ position, size, id }) => (
        <Brick
          key={id}
          className="brick"
          color={getColor(colors, id)}
          style={buildSyleObj({ ...position, ...size }, step)}
        />
      ))}
    </div>
  ));
  return (
    <div
      style={{ gridTemplateColumns: [1, 1].map(() => `${step * width}px`).join(' ') }}
      className="grid-area-preview"
    >
      {tiles}
    </div>
  );
}
