import uuid from 'uuid/v4';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

function makePalette(name = 'new') {
  return { id: uuid(), name, colors: [] };
}

const palette = makePalette('палитра 0');
const initialState = { currentPalette: palette.id, palettes: { [palette.id]: palette } };

const colorPalette = handleActions({
  [actions.addColorPalette](state) {
    const newPalette = makePalette(`палитра ${Object.keys(state.palettes).length}`);
    return {
      ...state,
      currentPalette: newPalette.id,
      palettes: { ...state.palettes, [newPalette.id]: newPalette },
    };
  },
  [actions.switchPalette](state, action) {
    // TODO: assert
    return { ...state, currentPalette: action.payload };
  },
  [actions.addColorToPalette](state, action) {
    const currentPalette = state.palettes[state.currentPalette];
    return {
      ...state,
      palettes: {
        ...state.palettes,
        [state.currentPalette]: {
          ...currentPalette,
          colors: currentPalette.colors.concat([action.payload]),
        },
      },
    };
  },
}, initialState);

export default colorPalette;
