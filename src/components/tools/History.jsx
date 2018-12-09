import React from 'react';

const History = ({ undoredo }) => (
  <div>
    <button onClick={undoredo.bind(this, 'undo')} type="button">undo</button>
    <button onClick={undoredo.bind(this, 'redo')} type="button">redo</button>
  </div>
);

export default History;
