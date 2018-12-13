import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';


export default class BricksPanel extends React.Component {
  state = {
    dropdownOpen: false,
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    const {
      setRemoveBrickOperation, setBrickOperation, setPaintOperation,
    } = this.props;

    return (
      <div className="bricks-panel">
        <ButtonGroup className="bricks-panel-group" size="sm">
          <Button onClick={setBrickOperation(4, 1)}>H 4</Button>
          <Button onClick={setBrickOperation(3, 1)}>H 3</Button>
          <Button onClick={setBrickOperation(2, 1)}>H 2</Button>
          <Button onClick={setBrickOperation(1, 1)}>1</Button>
        </ButtonGroup>
        <ButtonGroup className="bricks-panel-group" size="sm">
          <Button onClick={setBrickOperation(1, 4)}>V 4</Button>
          <Button onClick={setBrickOperation(1, 3)}>V 3</Button>
          <Button onClick={setBrickOperation(1, 2)}>V 2</Button>
        </ButtonGroup>
        <ButtonGroup className="bricks-panel-group">
          <Button onClick={setPaintOperation} id="paint">🖌</Button>
          <Button onClick={setRemoveBrickOperation} id="delete">⨯</Button>
        </ButtonGroup>
      </div>
    );
  }
}
