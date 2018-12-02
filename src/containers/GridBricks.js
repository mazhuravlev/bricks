import { connect } from 'react-redux';
import GridBricks from '../components/GridBricks';
import * as actionCreators from '../actions';

const mapStateToProps = ({ bricks, templateSize, brickSize }) => {
  const props = {
    bricks,
    templateSize,
    brickSize,
  };
  return props;
};

export default connect(
  mapStateToProps,
  actionCreators,
)(GridBricks);
