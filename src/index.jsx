import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { createStore } from 'redux';
import uuid from 'uuid/v4';
import * as serviceWorker from './serviceWorker';
import reducers from './reducers';
import App from './App';

function makePalette(name = 'new') {
  return { id: uuid(), name, colors: [] };
}

const palette = makePalette('палитра 0');
const initialPaletteState = { currentPalette: palette.id, palettes: { [palette.id]: palette } };

(async function init() {
  let store;
  if (window.CefSharp) {
    await window.CefSharp.BindObjectAsync('vasya');
    const paletteData = window.vasya.loadString('palette');
    const colorPaletteState = paletteData ? JSON.parse(paletteData) : initialPaletteState;
    /* eslint-disable no-underscore-dangle */
    store = createStore(
      reducers({ colorPaletteState }),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
    /* eslint-enable */
    let currentPalette;
    store.subscribe(() => {
      const prevPalette = currentPalette;
      currentPalette = store.getState().colorPalette;
      if (prevPalette === currentPalette) return;
      window.vasya.saveString('palette', JSON.stringify(currentPalette));
    });
  } else {
    /* eslint-disable no-underscore-dangle */
    store = createStore(
      reducers({ colorPaletteState: initialPaletteState }),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
  /* eslint-enable */
  }
  ReactDOM.render(<App store={store} />, document.getElementById('root'));
}());

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
