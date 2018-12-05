import { connect } from 'react-redux';
import Editor from '../components/Editor';
import * as actionCreators from '../actions';

const mapStateToProps = (state) => {
  const props = {
    bricks: state.bricks,
    templateSize: state.templateSize,
    sector: state.sector,
    brickSector: state.brickSector,
    bricksColors: state.bricksColors,
  };
  return props;
};

const EditorContainer = connect(
  mapStateToProps,
  actionCreators,
)(Editor);

export default EditorContainer;
