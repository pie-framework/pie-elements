import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { ReactEditor } from 'slate-react';

export class ECRToolbar extends React.Component {
  static propTypes = {
    correctChoice: PropTypes.object,
    classes: PropTypes.object,
    node: PropTypes.object,
    nodePath: PropTypes.array,
    onDone: PropTypes.func,
    onChangeResponse: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    editor: PropTypes.object,
    maxLengthPerChoiceEnabled: PropTypes.bool,
  };

  state = {
    markup: '',
  };

  componentDidMount() {
    const { editor, correctChoice, node } = this.props;
    const choice = correctChoice || {};

    const domNode = ReactEditor.toDOMNode(editor, node);

    if (domNode) {
      // eslint-disable-next-line
      const domNodeRect = domNode.getBoundingClientRect();
      const editorDOM = domNode.closest('[data-slate-editor]');
      const editorRect = editorDOM.getBoundingClientRect();
      const top = domNodeRect.top - editorRect.top;
      const left = domNodeRect.left - editorRect.left;

      this.setState({
        markup: choice.label,
        toolbarStyle: {
          position: 'absolute',
          top: `${top + domNodeRect.height - 1}px`,
          left: `${left + 17}px`,
          width: domNodeRect.width,
        },
      });
    }
  }

  onDone = (e) => {
    const { markup: newValue } = this.state;
    const { node, nodePath, editor, onToolbarDone, onChangeResponse } = this.props;
    const update = { ...node.data, value: newValue };

    const domNode = ReactEditor.toDOMNode(editor, node);
    const slateWrapperForNode = domNode?.closest('[data-slate-wrapper]')

    if (e?.relatedTarget && e.relatedTarget.closest('[data-slate-wrapper]') === slateWrapperForNode) {
      // no need to call the blur function if the click is on the slate editor
      return;
    }

    editor && editor.apply({
      type: 'set_node',
      path: nodePath,
      properties: {
        data: node.data
      },
      newProperties: { data: update }
    });

    onToolbarDone(true);
    onChangeResponse(newValue);
  };

  onChange = (e) => this.setState({ markup: e.target.value });

  render() {
    const { classes, node, maxLengthPerChoiceEnabled } = this.props;
    const { markup, toolbarStyle } = this.state;
    const inputProps = maxLengthPerChoiceEnabled ? {} : { maxLength: 25 };

    return (
      <div
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6',
        }}
      >
        <OutlinedInput
          style={{ width: '100%' }}
          autoFocus
          labelWidth={0}
          classes={{
            input: classes.input,
          }}
          onChange={this.onChange}
          onBlur={this.onDone}
          value={markup || node?.data?.value || ''}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

const StyledECRToolbar = withStyles((theme) => ({
  respArea: {
    backgroundColor: theme.palette.common.white,
  },
  input: {
    backgroundColor: theme.palette.common.white,
    padding: '10px 20px 10px 10px',
  },
  errorInput: {
    border: `2px solid ${theme.palette.error.main}`,
  },
}))(ECRToolbar);

export default StyledECRToolbar;
