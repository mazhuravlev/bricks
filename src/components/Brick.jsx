import React from 'react';

export default function Brick({ style, color, handleOperation }) {  //eslint-disable-line
  const brickWidth = style.width > style.height ? style.height : style.width;
  return (
    <div
      onClick={handleOperation}
      className="brick"
      style={{
        ...style,
        backgroundColor: color,
        borderWidth: brickWidth * 0.1,
      }}
    />
  );
}
