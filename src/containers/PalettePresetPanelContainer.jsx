import { connect } from 'react-redux';
import PalettePresetPanel from '../components/tools/ColorList/PalettePresetPanel';
import * as actionCreators from '../actions';

const mapStateToProps = ({ colorPalette }) => {
  const props = {
    colorPalette,
  };
  return props;
};

const PalettePresetPanelContainer = connect(
  mapStateToProps,
  actionCreators,
)(PalettePresetPanel);

export default PalettePresetPanelContainer;
