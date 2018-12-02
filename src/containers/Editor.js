import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { changeTemplateSize } from '../actions';

const mapStateToProps = ({ bricks, templateSize }) => {
  const bricksValues = Object.values(bricks);
  const props = {
    bricks: bricksValues,
    templateSize,
  };
  return props;
};

const mapDispatchToProps = dispatch => ({
  changeTemplateSize: newSize => dispatch(changeTemplateSize(newSize)),
});

const EditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);

export default EditorContainer;
