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
}, {});


const initTemplateSize = {
  width: 4,
  height: 4,
};
const templateSize = handleActions({
  [actions.changeTemplateSize](state = initTemplateSize, { payload: { newSize } }) {
    return { ...state, ...newSize };
  },
}, initTemplateSize);

export default combineReducers({
  bricks,
  templateSize,
});
