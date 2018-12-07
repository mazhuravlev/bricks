import { handleActions } from 'redux-actions';
import _ from 'lodash';

import * as actions from '../actions';
import combineReducers from './combineReducers';

const bricks = handleActions({
  [actions.addBrick](state, { payload: { brick } }) {
    return { ...state, [brick.id]: brick };
  },
  [actions.removeBrick](state, { payload: { brick } }) {
    return _.omit(state, brick.id);
  },
}, {});

const initBrickSize = {
  width: 4,
  height: 1,
};
export const brickSize = handleActions({
  [actions.changeBrickSize](state, { payload: { size } }) {
    return size;
  },
}, initBrickSize);

const initTemplateSize = {
  width: 10,
  height: 10,
};
const templateSize = handleActions({
  [actions.changeTemplateSize](state, { payload: { newSize } }) {
    return { ...state, ...newSize };
  },
}, initTemplateSize);

const initSectorSize = {
  size: {
    left: 3,
    top: 3,
    width: 4,
    height: 4,
  },
};
const sector = handleActions({
  [actions.setSectorSize](state, { payload }) {
    return { ...state, size: payload };
  },
}, initSectorSize);

const bricksColors = handleActions({
  [actions.addBrick](state, { payload: { brick: { id }, color, colorPresetName } }) {
    const presetId = `${id}-${colorPresetName}`;
    return { ...state, [presetId]: { colorPresetName, brickId: id, color } };
  },
  [actions.changeBrickColor](state, { payload: { brickId, color, colorPresetName } }) {
    const presetId = `${brickId}-${colorPresetName}`;
    return { ...state, [presetId]: { colorPresetName, brickId, color } };
  },
  [actions.removeBrick](state, { payload: { brick } }) {
    return _.omitBy(state, ({ brickId }) => brickId === brick.id);
  },
}, {});

// const history = handleActions({
//   [actions.addBrick](state, { payload: { brick } }, _state) {
//     console.log(_state);
//     return [...state, { type: 'addBrick', action: actions.removeBrick(), data: { brick } }];
//   },
//   // [actions.removeBrick](state, { payload: { brick } }) {
//   //   return _.omitBy(state, ({ brickId }) => brickId === id);
//   // },
//   // [actions.changeBrickColor](state, { payload: { brickId, color, colorPresetName } }) {
//   //   const presetId = `${brickId}-${colorPresetName}`;
//   //   return { ...state, [presetId]: { colorPresetName, brickId, color } };
//   // },
//   [actions.removeActionFromHistory](state) {
//     if (state.length > 0) {
//       return state.slice(0, state.length - 1);
//     }
//     return [];
//   },
// }, []);

const history = (partialState = [], action, state) => {
  const { payload, type } = action;
  switch (type) {
    case 'ADD_BRICK': {
      const newAction = { action, data: payload.brick };
      return [...partialState, newAction];
    }
    case 'REMOVE_BRICK': {
      console.log('REMOVE_BRICK');
      const { brick } = payload;
      const { colorPresetName }
      const newAction = { action, data: payload.brick };
      return [...partialState, newAction];
    }
    case 'CHANGE_BRICK_COLOR': {
      console.log('CHANGE_BRICK_COLOR');
      return partialState;
    }
    case 'FORWARD': {
      console.log('CHANGE_BRICK_COLOR');
      return partialState;
    }
    case 'BACKWARD': {
      console.log('CHANGE_BRICK_COLOR');
      return partialState;
    }
    default:
      return partialState;
  }
};

const colorPresetName = handleActions({
  [actions.changePresetName](state, { payload: { name } }) {
    return name;
  },
}, '1');

export default combineReducers({
  bricks,
  templateSize,
  brickSize,
  sector,
  bricksColors,
  history,
  colorPresetName,
});
