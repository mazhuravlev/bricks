import React, { Component } from 'react';

import './App.css';
import Editor from './components/Editor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="appContainer">
          <Editor />
        </div>
      </div>
    );
  }
}

export default App;
