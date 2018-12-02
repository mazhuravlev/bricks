// import _ from 'lodash';
import { createAction } from 'redux-actions';

export const addBrick = createAction('ADD_BRICK');

export const removeBrick = createAction('REMOVE_BRICK');

export const changeTemplateSize = createAction('CHANGE_TEMPLATE_SIZE');
