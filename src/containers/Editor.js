import { connect } from 'react-redux';
import Editor from '../components/Editor';
import * as actionCreators from '../actions';

const mapStateToProps = ({ bricks, templateSize }) => {
  const bricksValues = Object.values(bricks);
  const props = {
    bricks: bricksValues,
    templateSize,
  };
  return props;
};

const EditorContainer = connect(
  mapStateToProps,
  actionCreators,
)(Editor);

export default EditorContainer;
