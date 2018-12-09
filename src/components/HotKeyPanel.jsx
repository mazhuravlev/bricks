import React from 'react';

function HotKeyPanel() {
  return (
    <div>
      <h3>Клавиши управления</h3>
      <ul>
        <li>
          <b>зажатый alt - изменить цвет кирпича</b>
        </li>
        <li>
          <b>зажатый shift - удалить кирпич</b>
        </li>
        <li>
          <b>ctrl+z - отменить действие</b>
        </li>
        <li>
          <b>ctrl+y - востановить действие</b>
        </li>
        <li>
          <b>up, down, left, right - изменить положение сектора</b>
        </li>
      </ul>
    </div>
  );
}

export default HotKeyPanel;
