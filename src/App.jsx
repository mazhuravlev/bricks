import React from 'react';
import { Provider } from 'react-redux';
import './styles/App.css';
import NewEditor from './containers/NewEditor';

const App = ({ store }) => (
  <Provider store={store}>
    <NewEditor />
  </Provider>
);

export default App;
