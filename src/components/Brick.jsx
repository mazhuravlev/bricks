import React from 'react';
import classnames from 'classnames';
import { makeRgbStyleProp } from '../helpers';

const brickBorderColor = 'rgb(0,0,0)';
const tileBorderColor = 'rgb(1,1,1)';


const _brick = ({ style, color, onClick, button, active, textureType }) => {  //eslint-disable-line
  const brickWidth = style.width > style.height ? style.height : style.width;
  const rgbColor = makeRgbStyleProp(color);
  return (
    <div
      onClick={onClick}
      className={classnames('brick', { button, active })}
      style={{
        ...style,
        backgroundColor: rgbColor,
        borderColor: textureType === 'brick' ? brickBorderColor : tileBorderColor,
      }}
    />
  );
};

export default React.memo(_brick);
