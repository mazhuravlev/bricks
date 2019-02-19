import uuid from 'uuid/v4';
import _ from 'lodash';

const buildBriksForNewSectorSize = (bricks, sector, teilwidth, teilheight) => {
  const newBricks = [];

  bricks.forEach((brick) => {
    for (let x = 0; x < teilwidth; x += 1) {
      for (let y = 0; y < teilheight; y += 1) {
        const left = brick.position.left + x * sector.width;
        const top = brick.position.top + y * sector.height;
        const newBrick = {
          id: uuid(),
          position: { left, top },
          size: { ...brick.size },
        };
        if (!newBricks.some(({ position }) => _.isEqual(position, newBrick.position))) {
          newBricks.push(newBrick);
        }
      }
    }
  });

  return newBricks;
};

export default buildBriksForNewSectorSize;
