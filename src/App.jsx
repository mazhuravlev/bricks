import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './styles/App.css';
import reducers from './reducers';
import EditorContainer from './containers/Editor';


/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

const App = () => (
  <div className="App">
    <div className="appContainer">
      <Provider store={store}>
        <EditorContainer />
      </Provider>
    </div>
  </div>
);

export default App;
