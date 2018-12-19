import React from 'react';
import classnames from 'classnames';
import { makeRgbStyleProp } from '../helpers';

export default function Brick({ style, color, onClick, button }) {  //eslint-disable-line
  const brickWidth = style.width > style.height ? style.height : style.width;
  const rgbColor = makeRgbStyleProp(color);
  return (
    <div
      onClick={onClick}
      className={classnames('brick', { button })}
      style={{
        ...style,
        backgroundColor: rgbColor,
        borderWidth: brickWidth * 0.1,
      }}
    />
  );
}
