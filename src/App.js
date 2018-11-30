import React, { Component } from 'react';

import './App.css';
import Editor from './components/Editor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Bricks editor application</h1>
        </header>
        <div className="appContainer">
          <Editor />
        </div>
      </div>
    );
  }
}

export default App;
