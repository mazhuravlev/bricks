import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _ from 'lodash';
import * as actions from '../actions';
import colorPalette from './colorPalette';

const bricks = handleActions({
  [actions.addBrick](state, { payload: { brick } }) {
    return { ...state, [brick.id]: brick };
  },
  [actions.removeBrick](state, { payload: { brick } }) {
    return _.omit(state, brick.id);
  },
  [actions.resetBricks]() {
    return {};
  },
}, {});

const initBrickSize = {
  width: 1,
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
  left: 3,
  top: 3,
  width: 4,
  height: 4,
};
const sector = handleActions({
  [actions.setSectorSize](state, { payload }) {
    return { ...state, ...payload };
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
  [actions.changePresetName](state) {
    // const defaultColor = {
    //   code: 'gray',
    //   rgb: '214,199,148',
    // };
    return state;
    // return Object.keys(state).reduce((acc, id) => {
    //   const newId = `${state[id].brickId}-${name}`;
    //   const newItem = {
    //     [newId]: {
    //       ...state[id],
    //       color: defaultColor,
    //     },
    //   };
    //   return { ...acc, ...newItem };
    // }, { ...state });
  },
}, {});

const history = handleActions({
  [actions.historyPush](state, { payload: { operations } }) {
    const newHistory = [...state.undo, operations];
    return { undo: newHistory, redo: [] };
  },
  [actions.historySwap](state, { payload: { type } }) {
    const { undo, redo } = state;
    if (type === 'undo') {
      return {
        undo: undo.slice(0, undo.length - 1),
        redo: [...redo, _.last(undo)],
      };
    }
    return {
      undo: [...undo, _.last(redo)],
      redo: redo.slice(0, redo.length - 1),
    };
  },
  [actions.historyRemove]() {
    return { undo: [], redo: [] };
  },
}, { undo: [], redo: [] });

const colorPresetName = handleActions({
  [actions.changePresetName](state, { payload: { name } }) {
    return name;
  },
}, '1');

const textureType = handleActions({
  [actions.switchTextureType](state) {
    if (state === 'brick') return 'tile';
    return 'brick';
  },
}, 'brick');

export default ({ colorPaletteState }) => combineReducers({
  bricks,
  templateSize,
  brickSize,
  sector,
  bricksColors,
  history,
  colorPresetName,
  textureType,
  colorPalette: colorPalette(colorPaletteState),
});
