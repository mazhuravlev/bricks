import { connect } from 'react-redux';
import Editor from '../components/Editor';
import * as actionCreators from '../actions';

const mapStateToProps = (state) => {
  const props = {
    bricks: state.bricks,
    templateSize: state.templateSize,
    sector: state.sector,
    bricksColors: state.bricksColors,
    colorPresetName: state.colorPresetName,
    history: state.history,
  };
  return props;
};

const EditorContainer = connect(
  mapStateToProps,
  actionCreators,
)(Editor);

export default EditorContainer;
