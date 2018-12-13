import React from 'react';
import domtoimage from 'dom-to-image';

import {
  Button, Popover, PopoverHeader, PopoverBody, ButtonGroup,
} from 'reactstrap';


export default class HotKeyPanel extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
    };
  }

  toggle() {
    const { popoverOpen } = this.state;
    this.setState({
      popoverOpen: !popoverOpen,
    });
  }


  // eslint-disable-next-line class-methods-use-this
  async save() {
    const img = await domtoimage.toPng(document.querySelector('.sectorItem'), {
      width: this.props.sector.width * 15,
      height: this.props.sector.height * 15,
    });
    document.querySelector('#preview').src = img;
    document.body.background = this.state.fillBackground ? img : 'none';
    if (window.vasya) {
      window.vasya.save(img);
    }
  }

  render() {
    return (
      <div>
        <ButtonGroup size="sm">
          <Button id="Popover1" onClick={this.toggle} color="link">?</Button>
          <Button onClick={() => this.save()}>Сохранить</Button>
        </ButtonGroup>
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
