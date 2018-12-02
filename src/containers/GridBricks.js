import { connect } from 'react-redux';
import GridBricks from '../components/GridBricks';
import { addBrick, removeBrick } from '../actions';

const mapStateToProps = ({ bricks, templateSize }) => {
  const bricksValues = Object.values(bricks);
  const props = {
    bricks: bricksValues,
    templateSize,
  };
  return props;
};

const mapDispatchToProps = dispatch => ({
  addBrick: brick => dispatch(addBrick(brick)),
  removeBrick: id => dispatch(removeBrick(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GridBricks);
