import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const findSlateNode = key => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

export class ECRToolbar extends React.Component {
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
        getNextText: PropTypes.func.isRequired
      })
    })
  };

  state = {};

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
          width: domNodeRect.width
        }
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

    onToolbarDone(change, false);
    onChangeResponse(newValue);
  };

  onChange = e => this.setState({ markup: e.target.value });

  render() {
    const { classes } = this.props;
    const { markup, toolbarStyle } = this.state;
    console.log('this.props', this.props);
    console.log('CE SA FACEM?');

    return (
      <div
        id={'BAG ---- PULAAAAA '}
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6'
        }}
      >
        <OutlinedInput
          style={{ width: '100%' }}
          autoFocus
          labelWidth={0}
          classes={{
            input: classes.input
          }}
          onChange={this.onChange}
          onBlur={this.onDone}
          value={markup}
        />
      </div>
    );
  }
}

const StyledECRToolbar = withStyles({
  respArea: {
    backgroundColor: '#fff'
  },
  input: {
    backgroundColor: '#fff',
    padding: '10px 20px 10px 10px'
  }
})(ECRToolbar);

export default StyledECRToolbar;
