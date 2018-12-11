import React, { Component } from 'react';

class PalettePresetPanel extends Component {
  state = {
    presetName: '',
  }

  addNewPallete = () => {
    const { presetName } = this.state;
    const { colorList } = this.props;
    this.props.addColorPalette({ name: presetName, palette: colorList });
    this.setState({ presetName: '' });
  }

  selectPalette = ({ target: { value } }) => {
    if (!value) return;
    const { colorPalette } = this.props;
    const palette = colorPalette[value];
    this.props.setColorList(palette);
  }

  handleNameInput = ({ target: { value } }) => {
    this.setState({ presetName: value });
  }

  render() {
    const { colorPalette } = this.props;
    return (
      <div style={{ marginBottom: '5px' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <p style={{ padding: 0, margin: 0 }}>Набор палитр:</p>
          <select onClick={this.selectPalette}>
            {Object.keys(colorPalette).map(name => (
              <option
                key={name}
                value={name}
              >
                {name}
              </option>))}
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'start' }}>
          <label htmlFor="palette-name">
            <input
              type="text"
              id="palette-name"
              value={this.state.presetName}
              onChange={this.handleNameInput}
              placeholder="Имя новой палитры"
            />
          </label>
          <button onClick={this.addNewPallete} type="button">add</button>
        </div>
      </div>
    );
  }
}

export default PalettePresetPanel;
