/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import './NumberInput.css';

function handleInc(props) {
  if (!props.onChange || !(props.onChange instanceof Function)) return;
  if (props.value >= props.max) return;
  props.onChange(props.value + 1);
}

function handleDec(props) {
  if (!props.onChange || !(props.onChange instanceof Function)) return;
  if (props.value <= props.min) return;
  props.onChange(props.value - 1);
}

function NumberInput(props) {
  return (
    <div style={props.style} className="number-input">
      <div className="ctl" onClick={() => handleDec(props)}>-</div>
      <div className="val">{props.value}</div>
      <div className="ctl" onClick={() => handleInc(props)}>+</div>
    </div>
  );
}

export default NumberInput;
