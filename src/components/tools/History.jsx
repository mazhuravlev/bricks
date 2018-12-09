import React, { Component } from 'react';
import _ from 'lodash';

import * as operations from '../../operations';

export class History extends Component {
  makeAction = type => () => {
    const {
      history,
    } = this.props;

    const historyLength = history[type].length;

    if (historyLength === 0) {
      return;
    }

    const { addBrick, removeBrick, changeBrickColor } = this.props;
    const operationMapping = {
      [operations.ADD_BRICK]: ({ brick, color, colorPresetName }) => {
        if (type === 'redo') {
          return addBrick({ brick, color, colorPresetName });
        }
        return removeBrick({ brick });
      },
      [operations.REMOVE_BRICK]: ({ brick, color, colorPresetName }) => {
        if (type === 'undo') {
          return addBrick({ brick, color, colorPresetName });
        }
        return removeBrick({ brick });
      },
      [operations.CHANGE_COLOR_BRICK]: ({ brickId, color, colorPresetName }) => (
        changeBrickColor({
          brickId,
          color: type === 'redo' ? color.new : color.old,
          colorPresetName,
        })
      ),
    };
    const lastOperations = _.last(history[type]);
    if (_.isArray(lastOperations)) {
      lastOperations.forEach((operation) => {
        operationMapping[operation.type](operation.data);
      });
    } else {
      operationMapping[lastOperations.type](lastOperations.data);
    }
    this.props.historySwap({ type });
  }

  render() {
    return (
      <div>
        <button onClick={this.makeAction('undo')} type="button">undo</button>
        <button onClick={this.makeAction('redo')} type="button">redo</button>
      </div>
    );
  }
}

export default History;
