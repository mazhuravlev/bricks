import { connect } from 'react-redux';
import PresetPanel from '../components/tools/PresetPanel';
import * as actionCreators from '../actions';

const mapStateToProps = (state) => {
  const props = {
    bricksColors: state.bricksColors,
  };
  return props;
};

const PresetPanelContainer = connect(
  mapStateToProps,
  actionCreators,
)(PresetPanel);

export default PresetPanelContainer;
