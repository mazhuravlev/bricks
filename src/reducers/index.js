import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';

import * as actions from '../actions';

const bricks = handleActions({
  [actions.addBrick](state, { payload: { brick } }) {
    return { ...state, [brick.id]: brick };
  },
  [actions.removeBrick](state, { payload: { id } }) {
    return _.omit(state, id);
  },
  [actions.changeBrickColor](state, { payload: { id, color } }) {
    const selectBrick = state[id];
    return { ...state, [id]: { ...selectBrick, color } };
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
  [actions.changeTemplateSize](state = initTemplateSize, { payload: { newSize } }) {
    return { ...state, ...newSize };
  },
}, initTemplateSize);

export default combineReducers({
  bricks,
  templateSize,
  brickSize,
});
