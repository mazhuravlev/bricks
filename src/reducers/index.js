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
  width: 6,
  height: 6,
};
const templateSize = handleActions({
  [actions.changeTemplateSize](state, { payload: { newSize } }) {
    return { ...state, ...newSize };
  },
}, initTemplateSize);

const initSectorSize = {
  position: {
    left: 1,
    top: 1,
  },
  size: {
    width: 4,
    height: 4,
  },
};
const sector = handleActions({
  [actions.changeSectorSize](state, { payload: { size } }) {
    const newSize = { ...state.size, ...size };
    return { ...state, size: newSize };
  },
  [actions.changeSectorPosition](state, { payload: { position } }) {
    const newPosition = { ...state.position, ...position };
    return { ...state, position: newPosition };
  },
}, initSectorSize);

const brickSector = handleActions({
  [actions.buildBrickSector](state, { payload: { selectedBricks } }) {
    return selectedBricks;
  },
}, []);

const initColorsPreset = {
  name: '',
  data: {},
};
const bricksColors = handleActions({
  [actions.addBrick](state, { payload: { brick: { id, color } } }) {
    const { name, data } = state;
    const presetId = `${id}-${name}`;
    const newData = { ...data, [presetId]: { name, brickId: id, color } };
    return { ...state, data: { ...newData } };
  },
  [actions.changeBrickColor](state, { payload: { id, color } }) {
    const { name, data } = state;
    const presetId = `${id}-${name}`;
    const newData = { ...data, [presetId]: { name, brickId: id, color } };
    return { ...state, data: { ...newData } };
  },
  [actions.changePresetName](state, { payload: { name } }) {
    return { ...state, name };
  },
  [actions.removeBrick](state, { payload: { id } }) {
    const { data } = state;
    const newColors = _.omitBy(data, ({ brickId }) => brickId === id);
    return { ...state, data: newColors };
  },
}, initColorsPreset);

export default combineReducers({
  bricks,
  templateSize,
  brickSize,
  sector,
  brickSector,
  bricksColors,
});
