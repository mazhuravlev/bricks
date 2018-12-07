// import _ from 'lodash';
import { createAction } from 'redux-actions';

export const addBrick = createAction('ADD_BRICK');

export const removeBrick = createAction('REMOVE_BRICK');

export const changeBrickSize = createAction('CHANGE_BRICK_SIZE');

export const changeBrickColor = createAction('CHANGE_BRICK_COLOR');

export const changeTemplateSize = createAction('CHANGE_TEMPLATE_SIZE');

export const setSectorSize = createAction('SET_SECTOR_SIZE');

export const changePresetName = createAction('CHANGE_PRESET_NAME');

export const setColor = createAction('SET_COLOR');

export const changeCurrentPreset = createAction('CHANGE_CURRENT_PRESET');

export const hisoryForward = createAction('FORWARD');
export const hisoryBackward = createAction('BACKWARD');
