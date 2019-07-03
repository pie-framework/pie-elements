import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { renderMath } from '@pie-lib/math-rendering';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

class MenuItemComp extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  };

  onRemoveClick = e => {
    const { onRemoveChoice } = this.props;

    e.preventDefault();
    e.stopPropagation();

    onRemoveChoice();
  };

  render() {
    const { classes, onClick, value } = this.props;

    return (
      <div className={classes.wrapper} onClick={onClick}>
        <div
          className={classes.valueHolder}
          dangerouslySetInnerHTML={{
            __html: value
          }}
        />
        <i className={classes.removeIcon} onClick={this.onRemoveClick}>
          x
        </i>
      </div>
    );
  }
}

const MenuItem = withStyles({
  wrapper: {
    background: '#fff',
    borderBottom: '1px solid black',
    boxSizing: 'border-box',
    display: 'block',
    cursor: 'pointer',
    lineHeight: '30px',
    padding: '10px 25px 10px 10px',
    position: 'relative'
  },
  removeIcon: {
    cursor: 'pointer',
    fontSize: '20px',
    fontStyle: 'normal',
    position: 'absolute',
    transform: 'translate(0, -50%)',
    top: '50%',
    right: '5px',
    zIndex: 3
  },
  valueHolder: {
    wordBreak: 'break-all'
  }
})(MenuItemComp);

const findSlateNode = key => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

class RespAreaToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    node: PropTypes.object,
    onDone: PropTypes.func,
    choices: PropTypes.array,
    onAddChoice: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    onSelectChoice: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    value: PropTypes.shape({
      change: PropTypes.func.isRequired,
      document: PropTypes.shape({
        getNextText: PropTypes.func.isRequired
      })
    })
  };

  state = {
    respAreaMarkup: ''
  };

  componentDidMount() {
    const { node } = this.props;

    const domNode = findSlateNode(node.key);

    if (domNode) {
      //eslint-disable-next-line
      const domNodeRect = domNode.getBoundingClientRect();
      const editor = domNode.closest('[data-slate-editor]');
      const editorRect = editor.getBoundingClientRect();
      const top = domNodeRect.top - editorRect.top;
      const left = domNodeRect.left - editorRect.left;

      this.setState({
        toolbarStyle: {
          position: 'absolute',
          top: `${top + domNodeRect.height + 60}px`,
          left: `${left + 25}px`,
          width: domNodeRect.width
        }
      });
    }
  }

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  onRespAreaChange = respAreaMarkup => {
    this.setState({ respAreaMarkup });
  };

  onTemporaryChange = tempValue => {
    this.setState({ tempValue });
  };

  onAddChoice = value => {
    const { node, onAddChoice } = this.props;

    onAddChoice(node.data.get('index'), value);
  };

  onSelectChoice = (newValue, index) => {
    const { node, value, onToolbarDone, onSelectChoice } = this.props;
    const update = { ...node.data.toJSON(), value: newValue };
    const change = value.change().setNodeByKey(node.key, { data: update });

    const nextText = value.document.getNextText(node.key);

    change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);

    onToolbarDone(change, false);

    onSelectChoice(index);
  };

  onRemoveChoice = (val, index) => {
    const { node, value, onToolbarDone, onRemoveChoice } = this.props;

    if (_.isEqual(val, node.data.get('value'))) {
      const update = { ...node.data.toJSON(), value: null };
      const change = value.change().setNodeByKey(node.key, { data: update });

      onToolbarDone(change, false);
    }

    onRemoveChoice(index);
  };

  render() {
    const { classes, onDone, choices } = this.props;
    const { respAreaMarkup, toolbarStyle, tempValue } = this.state;

    if (!toolbarStyle) {
      return null;
    }

    return (
      <div
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6'
        }}
      >
        <div className={classes.itemBuilder}>
          <EditableHtml
            autoFocus={true}
            autoSave
            className={classes.respArea}
            toolbarOpts={{
              position: 'bottom',
              alwaysVisible: false
            }}
            markup={respAreaMarkup}
            onChange={this.onRespAreaChange}
            onTemporaryChange={this.onTemporaryChange}
            onDone={onDone}
            placeholder="Add Choice"
          />
          <i
            style={{
              cursor: 'pointer',
              fontSize: '20px',
              fontStyle: 'normal',
              position: 'absolute',
              top: '50%',
              right: '15px',
              transform: 'translate(0, -50%)'
            }}
            contentEditable={false}
            onMouseDown={() => this.onAddChoice(tempValue)}
          >
            +
          </i>
        </div>
        {choices && (
          <div className={classes.choicesHolder}>
            {choices.map(({ label }, index) => (
              <MenuItem
                key={index}
                onClick={() => this.onSelectChoice(label, index)}
                onRemoveChoice={() => this.onRemoveChoice(label, index)}
                value={label}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

const StyledRespAreaToolbar = withStyles({
  respArea: {
    backgroundColor: '#fff'
  },
  choicesHolder: {
    display: 'flex',
    flexDirection: 'column',
    '& > div:last-child': {
      border: 'none'
    }
  },
  itemBuilder: {
    padding: '8px',
    position: 'relative'
  }
})(RespAreaToolbar);

export default StyledRespAreaToolbar;
