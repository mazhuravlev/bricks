import React from 'react';

export default function Brick({ style, color, handleOperation }) {  //eslint-disable-line
  const orientationClass = style.width > style.height ? 'hor' : 'ver';
  return (
    <div onClick={handleOperation} className="brick" style={style}>
      <div className={orientationClass} style={{ backgroundColor: color }} />
    </div>
  );
}
