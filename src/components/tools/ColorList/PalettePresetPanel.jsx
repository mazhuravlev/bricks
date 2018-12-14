/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { Component } from 'react';

import { Label, Input } from 'reactstrap';

class PalettePresetPanel extends Component {
  constructor(props) {
    super(props);
    this.addNewPallete = this.addNewPallete.bind(this);
  }

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
          <a className="btn btn-secondary" onClick={() => console.log(12)}>add</a>
        </div>
      </div>
    );
  }
}

export default PalettePresetPanel;
