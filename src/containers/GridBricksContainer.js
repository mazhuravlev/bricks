import { connect } from 'react-redux';
import GridBricks from '../components/GridBricks';
import * as actionCreators from '../actions';

const mapStateToProps = (state) => {
  const props = {
    bricks: state.bricks,
    templateSize: state.templateSize,
    brickSize: state.brickSize,
    sector: state.sector,
    brickSector: state.brickSector,
    bricksColors: state.bricksColors,
  };
  return props;
};

const GridBricksContainer = connect(
  mapStateToProps,
  actionCreators,
)(GridBricks);

export default GridBricksContainer;
