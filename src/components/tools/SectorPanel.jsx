import React from 'react';

import { UncontrolledTooltip } from 'reactstrap';
import HotKeyPanel from '../HotKeyPanel';

export default class SectorPanel extends React.Component {
  handleSector = (e) => {
    const newSize = { [e.target.name]: Number(e.target.value) };
    this.props.setSectorSize(newSize);
  }

  render() {
    const { sector } = this.props;
    return (
      <div className="grid-sector-options-panel">
        <input type="number" min="2" className="input-sector-size" name="width" id="sector-width" value={sector.width} onChange={this.handleSector} />
        <UncontrolledTooltip target="sector-width">Ширина</UncontrolledTooltip>
        <input type="number" min="2" className="input-sector-size" name="height" id="sector-height" value={sector.height} onChange={this.handleSector} />
        <UncontrolledTooltip target="sector-height">Высота</UncontrolledTooltip>
        <HotKeyPanel sector={sector} />
      </div>
    );
  }
}
