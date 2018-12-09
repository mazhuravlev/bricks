import React, { Component } from 'react';

const initPresetsColl = [1];

class PaintingPanel extends Component {
  state = { presetsColl: initPresetsColl }

  componentWillMount() {
    this.props.changePresetName({ name: initPresetsColl[0] });
  }

  addNewColorPreset = () => {
    const { presetsColl } = this.state;
    const newPreset = presetsColl.length + 1;
    this.setState({ presetsColl: [...presetsColl, newPreset] });
  }

  changeColorPreset = ({ target: { value } }) => {
    this.props.changePresetName({ name: value });
  }


  render() {
    const { colorPresetName } = this.props;
    const { presetsColl } = this.state;
    return (
      <div>
        <div className="control-panel">
          <p>Набор цветов:</p>
          <select onChange={this.changeColorPreset} value={colorPresetName}>
            {presetsColl.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={this.addNewColorPreset} type="button">add</button>
        </div>
      </div>
    );
  }
}

export default PaintingPanel;
