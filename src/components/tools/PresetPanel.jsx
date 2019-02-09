import React, { Component } from 'react';
import { Button } from 'reactstrap';

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
    this.props.changePresetName({ name: newPreset });
    this.props.historyRemove();
  }

  changeColorPreset = ({ target: { value } }) => {
    this.props.changePresetName({ name: value });
    this.props.historyRemove();
  }

  render() {
    const { colorPresetName } = this.props;
    const { presetsColl } = this.state;
    return (
      <div>
        <div className="control-panel">
          <span style={{ marginRight: '16px' }}>Вариант</span>
          <select className="white" onChange={this.changeColorPreset} value={colorPresetName}>
            {presetsColl.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button onClick={this.addNewColorPreset} size="sm" className="float-right">+</Button>
        </div>
      </div>
    );
  }
}

export default PaintingPanel;
