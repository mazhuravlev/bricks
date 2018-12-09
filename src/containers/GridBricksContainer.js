import { connect } from 'react-redux';
import GridBricks from '../components/GridBricks';
import * as actionCreators from '../actions';

const mapStateToProps = (state) => {
  const props = {
    bricks: state.bricks,
    templateSize: state.templateSize,
    brickSize: state.brickSize,
    sector: state.sector,
    bricksColors: state.bricksColors,
    colorPresetName: state.colorPresetName,
  };
  return props;
};

const GridBricksContainer = connect(
  mapStateToProps,
  actionCreators,
)(GridBricks);

export default GridBricksContainer;
