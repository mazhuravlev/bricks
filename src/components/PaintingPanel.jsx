import React, { Component } from 'react';

class PaintingPanel extends Component {
  state = {
    mode: 'manual',
  }

  changeMode = ({ target: { value } }) => {
    this.setState({ mode: value });
  }

  renderRandomPaintingPanel() {
    return (
      <div>
        <p>
          Режим:
          {this.state.mode}
        </p>
        <p>Здесь будет панель для рандомной раскраски</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor="manual">
            <input onChange={this.changeMode} type="radio" id="manual" name="mode" value="manual" />
            Ручная покраска
          </label>
          <label htmlFor="rundom">
            <input onChange={this.changeMode} type="radio" id="rundom" name="mode" value="rundom" />
            Случайная покраска
          </label>
        </div>
        {this.state.mode === 'manual' ? null : this.renderRandomPaintingPanel()}
      </div>
    );
  }
}

export default PaintingPanel;
