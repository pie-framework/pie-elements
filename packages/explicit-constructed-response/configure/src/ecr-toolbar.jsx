import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const findSlateNode = (key) => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

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
    const { correctChoice, node } = this.props;
    const choice = correctChoice || {};

    const domNode = findSlateNode(node.key);

    if (domNode) {
      //eslint-disable-next-line
      const domNodeRect = domNode.getBoundingClientRect();
      const editor = domNode.closest('[data-slate-editor]');
      const editorRect = editor.getBoundingClientRect();
      const top = domNodeRect.top - editorRect.top;
      const left = domNodeRect.left - editorRect.left;

      this.setState({
        markup: choice.label,
        toolbarStyle: {
          position: 'absolute',
          top: `${top + domNodeRect.height + 20}px`,
          left: `${left + 20}px`,
          width: domNodeRect.width,
        },
      });
    }
  }

  onDone = () => {
    const { markup: newValue } = this.state;
    const { node, nodePath, editor, onToolbarDone, onChangeResponse } = this.props;
    const update = { ...node.data, value: newValue };

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
