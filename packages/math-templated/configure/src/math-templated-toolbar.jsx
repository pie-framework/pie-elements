import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const findSlateNode = (key) => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

export class MathTemplatedToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    node: PropTypes.object,
    onToolbarDone: PropTypes.func.isRequired
  };

  state = {
    markup: '',
  };

  componentDidMount() {
    const { node } = this.props;
    const value = node.data.get('value');

    const domNode = findSlateNode(node.key);

    if (domNode) {
      //eslint-disable-next-line
      const domNodeRect = domNode.getBoundingClientRect();
      const editor = domNode.closest('[data-slate-editor]');
      const editorRect = editor.getBoundingClientRect();
      const top = domNodeRect.top - editorRect.top;
      const left = domNodeRect.left - editorRect.left;

      this.setState({
        markup: value,
        toolbarStyle: {
          position: 'absolute',
          top: `${top + domNodeRect.height + 20}px`,
          left: `${left + 20}px`,
          width: domNodeRect.width,
        },
      });
    }
  }

  render() {
    const { classes, node } = this.props;
    const {  toolbarStyle } = this.state;
    const value = node.data.get('value');

    return (
      <div
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6',
        }}
      >
        <OutlinedInput
          style={{ width: '100%' }}
          disabled={true}
          autoFocus
          labelWidth={0}
          classes={{
            input: classes.input,
          }}
          value={value}
        />
      </div>
    );
  }
}

const StyledTemplatedToolbar = withStyles((theme) => ({
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
}))(MathTemplatedToolbar);

export default StyledTemplatedToolbar;
