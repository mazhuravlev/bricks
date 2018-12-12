import React, { Component } from 'react';

import { Label, Input } from 'reactstrap';

class PalettePresetPanel extends Component {
  state = {
    presetName: '',
  }

  addNewPallete = (e) => {
    e.preventDefault();
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
      <div style={{ marginBottom: '5px', minWidth: '300px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
          <Label for="paletteSelect">Выберите палитру:</Label>
          <Input type="select" name="select" id="paletteSelect" onClick={this.selectPalette}>
            {Object.keys(colorPalette).map(name => (
              <option
                key={name}
                value={name}
              >
                {name}
              </option>))}
          </Input>
        </div>
        <div style={{ display: 'flex', justifyContent: 'start' }}>
          <Label for="palette-name" />
          <Input
            type="text"
            id="palette-name"
            value={this.state.presetName}
            onChange={this.handleNameInput}
            placeholder="Имя новой палитры"
          />
          <a className="btn btn-secondary" href="#" onClick={this.addNewPallete}>add</a>
        </div>
      </div>
    );
  }
}

export default PalettePresetPanel;
