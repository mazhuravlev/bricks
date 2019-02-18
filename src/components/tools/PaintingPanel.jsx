import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { makeRgbStyleProp, builGradientForPalette } from '../../helpers';

import importIcon from '../../images/import.svg';
import exportIcon from '../../images/export.svg';

import '../../styles/randomPalettePanel.css';

class PaintingPanel extends Component {
  constructor(props) {
    super(props);
    this.changeColorValue = this.changeColorValue.bind(this);
    this.changeColor = this.changeColor.bind(this);
  }

  state = {
    colorList: [],
    historyColorList: [],
    palettesVisible: false,
  }

  addNewColor = () => {
    const { color } = this.props;
    const { colorList } = this.state;
    this.setState({ colorList: [...colorList, { color, value: 1 }] });
  }

  handleHisoryListClick = randomPalette => () => {
    this.setState({ colorList: [...randomPalette], palettesVisible: false });
  }

  handlePreviewListClick = randomPalette => () => {
    const { historyColorList } = this.state;
    const newHistory = historyColorList.length === 5
      ? [...historyColorList.slice(1, 5), randomPalette]
      : [...historyColorList, randomPalette];
    this.setState({
      colorList: [...randomPalette],
      historyColorList: newHistory,
    });
  }

  handlePalettesVisible = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ palettesVisible: !this.state.palettesVisible });
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

  changeColor(colorIndex, newColorCode) {
    const oldColor = this.state.colorList[colorIndex];
    this.setState((state) => {
      const colorList = state.colorList.slice(0);
      colorList.splice(colorIndex, 1,
        { color: this.props.colors[newColorCode], value: oldColor.value });
      return { colorList };
    });
  }

  onClickRandomPalett = (randomPalette) => {
    const { historyColorList } = this.state;
    this.setState({ historyColorList: [...historyColorList, randomPalette] });
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
            <select
              onChange={e => this.changeColor(i, e.target.value)}
              style={{ backgroundColor: makeRgbStyleProp(colorEntry.color.rgb) }}
            >
              {Object.values(this.props.colors).map(c => (
                <option
                  value={c.code}
                  key={c.code}
                  style={{ backgroundColor: makeRgbStyleProp(c.rgb) }}
                >
                  {c.code}
                </option>
              ))}
            </select>
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

  renderPreviewHistory() {
    return (
      <div className="preview-history-wrapper">
        <div className="preview-history">
          {this.state.historyColorList.length === 0
            ? null
            : this.state.historyColorList.map((randomPalette, i) => (
              <div
                onClick={this.handleHisoryListClick(randomPalette)}
                key={i}
                className="preview-history-item"
              >
                <div style={{
                  background: builGradientForPalette(randomPalette), backgroundSize: 'contain', width: '100%', height: '100%',
                }}
                />
              </div>
            ))}
          <div className="button-open-palette-list">
            <div onClick={this.handlePalettesVisible} />
          </div>
        </div>
      </div>
    );
  }

  renderRandomPalette() {
    return (
      <>
        <div onClick={() => this.setState({ palettesVisible: false })} className="preview-list">
          {Object.keys(this.props.randomPalettes).length === 0
            ? null
            : Object.keys(this.props.randomPalettes).map((key, i) => {
              console.log(this.props.randomPalettes[key]);
              return (
                <div
                  className="preview-list-item"
                  key={i}
                >
                  <div
                    className="img"
                    style={{ background: builGradientForPalette(this.props.randomPalettes[key]) }}
                    onClick={this.handlePreviewListClick(this.props.randomPalettes[key])}

                  />
                  <div
                    className="tool-button trash-button"
                    style={{ width: '34px', height: '34px', margin: '1px 0 0 5px' }}
                    onClick={this.props.removeRandomPalette(key)}
                  />
                </div>
              );
            })}
        </div>
      </>
    );
  }

  render() {
    return (
      <>
        <div className="texture-panel-container">
          {this.renderPreviewHistory()}
          {/* <div className="add-texture-button"
            onClick={this.props.onSaveRandomPalette(this.state.colorList)}>
            Cохранить палитру
          </div> */}
          {this.state.palettesVisible ? this.renderRandomPalette() : null}
        </div>
        <div style={{ textAlign: 'right', userSelect: 'none' }}>
          <span style={{ float: 'left', fontSize: 12, marginLeft: 12 }}>Случайная покраска</span>
          <div className="tool-button" style={{ marginLeft: 6, backgroundImage: `url(${importIcon})` }} size="sm">
            {window.vasya ? <div className="custom-file-input" onClick={this.props.importPaintingPalettes} />
              : (
                <input
                  type="file"
                  className="custom-file-input"
                  required
                  onChange={this.props.importPaintingPalettes}
                />
              )}
          </div>
          <div className="tool-button" style={{ marginLeft: 6, backgroundImage: `url(${exportIcon})` }} onClick={this.props.exportPaintingPalettes} size="sm" />
          <div className="tool-button random-button" style={{ marginLeft: 6, color: 'transparent' }} onClick={() => this.props.makeRandomPainting(this.state.colorList)} size="sm">i</div>
          <div className="tool-button" style={{ textAlign: 'center' }} onClick={this.addNewColor} size="sm">+</div>
        </div>
        <div style={{
          height: '87px', overflowY: 'auto', position: 'relative', marginBottom: '5px',
        }}
        >
          {this.state.colorList.length > 0 ? this.renderColorList() : null}
          <Button
            style={{ backgroundColor: 'lightgray', color: 'black' }}
            onClick={this.props.onSaveRandomPalette(this.state.colorList)}
            size="sm"
            block
          >
            Сохранить палитру
          </Button>
        </div>
        <Button onClick={this.props.onSave} size="sm" block>Сохранить</Button>
      </>

    );
  }
}

export default PaintingPanel;
