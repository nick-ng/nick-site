import React, { PropTypes } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

import css from './styles.css';

const STYLING_CONTROLS = [
  { action: 'BOLD', name: 'B' },
  { action: 'ITALIC', name: 'I' },
];

export default class PostEditor extends React.Component {
  static restoreContent(contentJSON) {
    if (!contentJSON) {
      return EditorState.createEmpty();
    }
    let rawContent;
    if (contentJSON && contentJSON.constructor === Object) {
      rawContent = contentJSON;
    } else {
      rawContent = JSON.parse(contentJSON);
    }
    return EditorState.createWithContent(convertFromRaw(rawContent));
  }

  constructor(props) {
    super(props);
    this.state = {
      editorState: PostEditor.restoreContent(props.initialPost),
      savedPost: null,
    };
    this.changeHandler = editorState => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.stylingControls = this.stylingControls.bind(this);
    this.renderStylingControl = this.renderStylingControl.bind(this);
    this.savePost = this.savePost.bind(this);
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.changeHandler(newState);
      return 'handled';
    }
    return 'not handled';
  }

  stylingControls(action) {
    return () => this.changeHandler(RichUtils.toggleInlineStyle(this.state.editorState, action));
  }

  savePost() {
    const postData = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.setState({ savedPost: postData });
  }

  renderStylingControl({ action, name }) {
    return (
      <button
        className={css.buttonStyle}
        onClick={this.stylingControls(action)}
        key={name}
      >
        {name}
      </button>
    );
  }

  render() {
    return (
      <div>
        {STYLING_CONTROLS.map(this.renderStylingControl)}
        <div className={css.editorStyle}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.changeHandler}
          />
        </div>
        <button
          onClick={this.savePost}
        >
          Save
        </button>
        {this.state.savedPost &&
        <div>
          <hr />
          <div>Saved Post:</div>
          <Editor
            editorState={PostEditor.restoreContent(this.state.savedPost)}
            readOnly
          />
        </div>}
      </div>

    );
  }
}

PostEditor.propTypes = {
  initialPost: PropTypes.oneOf([
    PropTypes.object,
    PropTypes.string,
  ]),
};

PostEditor.defaultProps = {
  initialPost: null,
};
