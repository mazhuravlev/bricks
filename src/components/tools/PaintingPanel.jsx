import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { makeRgbStyleProp } from '../../helpers';

class PaintingPanel extends Component {
  constructor(props) {
    super(props);
    this.changeColorValue = this.changeColorValue.bind(this);
  }

  state = {
    colorList: [],
  }

  addNewColor = () => {
    const { color } = this.props;
    const { colorList } = this.state;
    this.setState({ colorList: [...colorList, { color, value: 1 }] });
  }

  // eslint-disable-next-line react/sort-comp
  changeColorValue(colorIndex, value) {
    const oldColor = this.state.colorList[colorIndex];
    this.setState((state) => {
      const colorList = state.colorList.slice(0);
      colorList.splice(colorIndex, 1, { ...oldColor, value });
      return { colorList };
    });
  }

  deleteColor(colorIndex) {
    this.setState((state) => {
      const colorList = state.colorList.slice(0);
      colorList.splice(colorIndex, 1);
      return { colorList };
    });
  }

  renderColorList() {
    const { colorList } = this.state;
    const totalValue = colorList
      .map(colorEntry => colorEntry.value)
      .reduce((a, c) => a + c);
    const getPercent = v => (v === 0 ? 0 : Math.round(v / totalValue * 100));
    return (
      <>
        {colorList.map((colorEntry, i) => (
          <div key={i} className="color-preview">
            <div className="delete-random-color" onClick={() => this.deleteColor(i)} />
            <div
              className="color"
              style={{ backgroundColor: makeRgbStyleProp(colorEntry.color.rgb) }}
            />
            <input type="number" value={colorEntry.value} min="0" onChange={e => this.changeColorValue(i, Number(e.target.value))} />
            <span className="percent">
              {getPercent(colorEntry.value)}
              %
            </span>
          </div>
        ))}
      </>
    );
  }

  render() {
    return (
      <>
        <div style={{ textAlign: 'right', userSelect: 'none' }}>
          <span style={{ float: 'left', fontSize: 12, marginLeft: 12 }}>Случайная покраска</span>
          <div className="tool-button random-button" style={{ color: 'transparent' }} onClick={() => this.props.makeRandomPainting(this.state.colorList)} size="sm">i</div>
          <div className="tool-button" style={{ marginLeft: 6, textAlign: 'center' }} onClick={this.addNewColor} size="sm">+</div>
        </div>
        <div style={{ height: 150, overflowY: 'scroll', paddingLeft: 16 }}>
          {this.state.colorList.length > 0 ? this.renderColorList() : null}
        </div>
        <Button onClick={this.props.onSave} size="sm" block>Сохранить</Button>
      </>

    );
  }
}

export default PaintingPanel;
