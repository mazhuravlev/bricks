import React from 'react';

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
        <label htmlFor="grid-width">
          <input type="number" min="2" className="input-sector-size form-control" name="width" id="sector-width" value={sector.width} onChange={this.handleSector} />
        </label>
        <label htmlFor="grid-height">
          <input type="number" min="2" className="input-sector-size form-control" name="height" id="sector-height" value={sector.height} onChange={this.handleSector} />
        </label>
        <HotKeyPanel />
      </div>
    );
  }
}
