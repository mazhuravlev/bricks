import { connect } from 'react-redux';
import PaintingPanel from '../components/tools/PaintingPanel';
import * as actionCreators from '../actions';

const mapStateToProps = (state) => {
  const props = {
    brickSector: state.brickSector,
  };
  return props;
};

const PaintingPanelContainer = connect(
  mapStateToProps,
  actionCreators,
)(PaintingPanel);

export default PaintingPanelContainer;
