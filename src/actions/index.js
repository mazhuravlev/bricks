// import _ from 'lodash';
import { createAction } from 'redux-actions';

export const addBrick = createAction('ADD_BRICK');

export const removeBrick = createAction('REMOVE_BRICK');

export const resetBricks = createAction('RESET_BRICKS');


export const changeBrickSize = createAction('CHANGE_BRICK_SIZE');

export const changeBrickColor = createAction('CHANGE_BRICK_COLOR');

export const changeTemplateSize = createAction('CHANGE_TEMPLATE_SIZE');

export const setSectorSize = createAction('SET_SECTOR_SIZE');

export const changePresetName = createAction('CHANGE_PRESET_NAME');

export const setColor = createAction('SET_COLOR');

export const changeCurrentPreset = createAction('CHANGE_CURRENT_PRESET');

export const historyPush = createAction('HISTORY_PUSH');
export const historySwap = createAction('HISTORY_SWAP');
export const historyRemove = createAction('HISTORY_REMOVE');

export const addColorPalette = createAction('ADD_COLOR_PALETTE');
export const removeColorPalette = createAction('REMOVE_COLOR_PALETTE');
export const addColorToPalette = createAction('ADD_COLOR_TO_PALETTE');
export const removeColorFromPalette = createAction('REMOVE_COLOR_TO_PALETTE');
export const switchPalette = createAction('SWITCH_PALETTE');

export const switchTextureType = createAction('SWITCH_TEXTURE_TYPE');

export const addRandomPalette = createAction('ADD_RANDOM_PALETTE');
export const setRandomPalettes = createAction('SET_RANDOM_PALETTE');
export const removeRandomPalette = createAction('REMOVE_RANDOM_PALETTE');
