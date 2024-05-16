import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const findSlateNode = (key) => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

export class MathTemplatedToolbar extends React.Component {
  static propTypes = {
    correctChoice: PropTypes.object,
    classes: PropTypes.object,
    node: PropTypes.object,
    onDone: PropTypes.func,
    onChangeResponse: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    value: PropTypes.shape({
      change: PropTypes.func.isRequired,
      document: PropTypes.shape({
        getNextText: PropTypes.func.isRequired,
      }),
    }),
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
    const { node, value, onToolbarDone, onChangeResponse } = this.props;
    const update = { ...node.data.toJSON(), value: newValue };
    const change = value.change().setNodeByKey(node.key, { data: update });

    const nextText = value.document.getNextText(node.key);

    change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);

    onToolbarDone(change, true);
    onChangeResponse(newValue);
  };

  onChange = (e) => this.setState({ markup: e.target.value });

  render() {
    const { classes, maxLengthPerChoiceEnabled } = this.props;
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
          value={markup || ''}
          inputProps={inputProps}
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
