import React from 'react';
import { Provider } from 'react-redux';
import './styles/App.css';
import Editor from './components/Editor';

const App = ({ store }) => (
  <Provider store={store}>
    <Editor />
  </Provider>
);

export default App;
