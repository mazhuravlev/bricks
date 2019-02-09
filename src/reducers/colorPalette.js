import uuid from 'uuid/v4';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

function makePalette(name = 'new') {
  return { id: uuid(), name, colors: [] };
}

const colorPalette = (initialState) => {
  console.log('INIT PALETTE', initialState);
  return handleActions({
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
    [actions.removeColorFromPalette](state, action) {
      return {
        ...state,
        palettes: {
          ...state.palettes,
          [state.currentPalette]:
            {
              ...state.palettes[state.currentPalette],
              colors: state.palettes[state.currentPalette].colors
                .filter(x => x.code !== action.payload),
            },
        },
      };
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
};

export default colorPalette;
