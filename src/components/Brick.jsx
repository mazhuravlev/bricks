import React from 'react';
import { makeRgbStyleProp } from '../helpers';

export default function Brick({ style, color, handleOperation }) {  //eslint-disable-line
  const brickWidth = style.width > style.height ? style.height : style.width;
  const rgbColor = makeRgbStyleProp(color);
  return (
    <div
      onClick={handleOperation}
      className="brick"
      style={{
        ...style,
        backgroundColor: rgbColor,
        borderWidth: brickWidth * 0.1,
      }}
    />
  );
}
