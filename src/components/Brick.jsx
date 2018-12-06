import React from 'react';
import { makeRgbStyleProp } from '../helpers';

const grayColor = { rgb: '214,199,148' };

export default function Brick({ style, color, handleOperation }) {  //eslint-disable-line
  const brickWidth = style.width > style.height ? style.height : style.width;
  const newColor = color || grayColor;
  const rgbColor = makeRgbStyleProp(newColor);
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
