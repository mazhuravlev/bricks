import { connect } from 'react-redux';
import PaintingPanel from '../components/tools/History';
import * as actionCreators from '../actions';

const mapStateToProps = ({ history }) => {
  const props = {
    history,
  };
  return props;
};

const PaintingPanelContainer = connect(
  mapStateToProps,
  actionCreators,
)(PaintingPanel);

export default PaintingPanelContainer;
