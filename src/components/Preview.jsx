import React from 'react';
import Brick from './Brick';
import { buildSyleObj } from '../helpers';

function getColor(bricksColors, brickId, colorPresetName) {
  const color = bricksColors[`${brickId}-${colorPresetName}`];
  return color ? color.color.rgb : null;
}

export default function Preview({
  bricks, sector, bricksColors, width, step, colorPresetName,
}) {
  const tileArr = new Array(4).fill(null);
  const tiles = tileArr.map((_, i) => (
    <div key={i} className="sectorItem" style={buildSyleObj({ width: sector.width, height: sector.height }, step)}>
      {bricks.map(({ position, size, id }) => (
        <Brick
          key={id}
          className="brick"
          color={getColor(bricksColors, id, colorPresetName)}
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
