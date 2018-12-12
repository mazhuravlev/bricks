import React from 'react';

import {
  Button, Popover, PopoverHeader, PopoverBody,
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

  render() {
    return (
      <div>
        <Button id="Popover1" onClick={this.toggle}>
          Help
        </Button>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
          <PopoverHeader>Клавиши управления</PopoverHeader>
          <PopoverBody>
            <div>
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
