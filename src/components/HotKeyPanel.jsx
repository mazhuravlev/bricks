import React from 'react';
import {
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import NumberInput from './NumberInput';


export default class HotKeyPanel extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
    };
  }

  handleSector = (param, value) => {
    const newSize = { [param]: Number(value) };
    this.props.setSectorSize(newSize);
  }

  toggle() {
    const { popoverOpen } = this.state;
    this.setState({
      popoverOpen: !popoverOpen,
    });
  }

  render() {
    return (
      <div>
        <div className="grid-sector-options-panel">
          <span style={{
            float: 'left', fontSize: 12, marginLeft: 12, position: 'relative', top: 6,
          }}
          >
Размер текстуры
          </span>
          <NumberInput style={{ position: 'relative', top: 4 }} value={this.props.sector.width} min={2} max={11} onChange={v => this.handleSector('width', v)} />
          <NumberInput style={{ position: 'relative', top: 4 }} value={this.props.sector.height} min={2} max={11} onChange={v => this.handleSector('height', v)} />
        </div>
        <div
          className="tool-button"
          style={{
            backgroundColor: 'gray', textAlign: 'center', width: 24, height: 24, borderRadius: 100, position: 'relative', top: 4,
          }}
          id="Popover1"
          onClick={this.toggle}
          color="link"
        >
?

        </div>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
          <PopoverHeader>Помощь</PopoverHeader>
          <PopoverBody>
            <div>
              Для добавления цвета в палитру выберите его из выпадающего списка.
              Удаление из палитры правой клавишей мыши.
              <ul>
                <li>
                  <b>зажатый &#34;alt&#34; - изменить цвет кирпича</b>
                </li>
                <li>
                  <b>зажатый &#34;shift&#34; - удалить кирпич</b>
                </li>
                <li>
                  <b>&#34;ctrl+z&#34; - отменить действие</b>
                </li>
                <li>
                  <b>&#34;ctrl+y&#34; - востановить действие</b>
                </li>
                <li>
                  <b>&#34;up, down, left, right&#34; - изменить положение сектора</b>
                </li>
                <li>
                  <b>&#34;+&#34; - увеличить размер сектора</b>
                </li>
                <li>
                  <b>&#34;-&#34; - уменьшить размер сектора</b>
                </li>
              </ul>
            </div>
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}
