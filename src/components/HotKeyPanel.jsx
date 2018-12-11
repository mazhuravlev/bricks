import React from 'react';

function HotKeyPanel() {
  return (
    <div>
      <h3>Клавиши управления</h3>
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
  );
}

export default HotKeyPanel;
