import React from 'react';
import { Provider } from 'react-redux';
import './styles/App.css';
import NewEditor from './containers/NewEditor';
import 'bootstrap/dist/css/bootstrap.css';

const App = ({ store }) => (
  <Provider store={store}>
    <NewEditor />
  </Provider>
);

export default App;
