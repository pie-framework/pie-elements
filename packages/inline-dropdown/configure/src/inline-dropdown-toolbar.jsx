import React from 'react';
import ReactDOM from 'react-dom';
import { ReactEditor } from 'slate-react';
import PropTypes from 'prop-types';
import {EditableHtml} from '@pie-lib/pie-toolbox/editable-html';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
import { withStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { DEFAULT_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';
import { color } from '@pie-lib/pie-toolbox/render-ui';

import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

class MenuItemComp extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    correct: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    onEditChoice: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  onRemoveClick = (e) => {
    const { onRemoveChoice } = this.props;

    e.preventDefault();
    e.stopPropagation();

    onRemoveChoice();
  };

  onEditClick = (e) => {
    const { onEditChoice } = this.props;

    e.preventDefault();
    e.stopPropagation();

    onEditChoice();
  };

  render() {
    const { classes, correct, onClick, value } = this.props;

    return (
      <div className={classes.wrapper}>
        {correct && (
          <div className={classes.selectedIcon} onClick={onClick}>
            <CheckIcon fontSize="inherit" />
          </div>
        )}
        <div
          className={classnames(classes.valueHolder, { [classes.correct]: correct })}
          onClick={onClick}
          dangerouslySetInnerHTML={{
            __html: value,
          }}
        />
        <div className={classes.actionButtons}>
          <IconButton className={classes.iconButton} onClick={this.onEditClick} size="small" aria-label="Edit">
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton className={classes.iconButton} onClick={this.onRemoveClick} size="small" aria-label="Remove">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
    );
  }
}

const MenuItem = withStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    background: theme.palette.common.white,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,

    '&:last-child': {
      borderRadius: '0 0 4px 4px',
    },
  },
  correct: {
    background: color.correctSecondary(),
  },
  actionButtons: {
    margin: theme.spacing.unit / 2,
    display: 'flex',
  },
  iconButton: {
    fontSize: theme.typography.fontSize,
    padding: theme.spacing.unit / 2,
    color: theme.palette.common.black,
  },
  selectedIcon: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.common.white,
    fontSize: theme.typography.fontSize,
    fontStyle: 'normal',
    position: 'absolute',
    transform: 'translate(0, -50%)',
    backgroundColor: color.correct(),
    borderRadius: '50%',
    top: theme.spacing.unit * 2,
    left: theme.spacing.unit,
    zIndex: 3,
  },
  valueHolder: {
    flex: 1,
    padding: theme.spacing.unit * 0.75,
    paddingLeft: theme.spacing.unit * 3.5,
  },
}))(MenuItemComp);

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');

  div.innerHTML = (htmlString || '').trim();

  return div;
};

export class RespAreaToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    node: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
    onDone: PropTypes.func,
    choices: PropTypes.array,
    onAddChoice: PropTypes.func.isRequired,
    onCheck: PropTypes.func,
    onRemoveChoice: PropTypes.func.isRequired,
    onSelectChoice: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    spellCheck: PropTypes.bool,
    editor: PropTypes.object.isRequired,
    nodePath: PropTypes.array.isRequired,
  };
  clickedInside = false;
  preventDone = false;

  state = {
    respAreaMarkup: '',
    editedChoiceIndex: -1,
  };

  componentDidMount() {
    const { node, editor } = this.props;
    const domNode = ReactEditor.toDOMNode(editor, node);

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
        },
      });
    }
  }

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  onRespAreaChange = (respAreaMarkup) => {
    this.setState({ respAreaMarkup });
  };

  onAddChoice = () => {
    if (this.editorRef) {
      this.editorRef.finishEditing();
    }
  };

  onDone = (val) => {
    const { choices, node, value, onAddChoice, onToolbarDone } = this.props;
    const { editedChoiceIndex } = this.state;
    const onlyText = createElementFromHTML(val).textContent.trim();

    if (editedChoiceIndex >= 0 && choices?.[editedChoiceIndex]?.correct) {
      const update = { ...node.data.toJSON(), value: val };
      const change = value.change().setNodeByKey(node.key, { data: update });

      onToolbarDone(change, false);
    }

    if (!isEmpty(onlyText)) {
      onAddChoice(node.data.index, val, editedChoiceIndex);
    }

    this.setState({ editedChoiceIndex: -1 });
  };

  onSelectChoice = (newValue, index) => {
    const { node, nodePath, editor, onToolbarDone, onSelectChoice } = this.props;
    const update = { ...node.data, value: newValue };

    editor.apply({
      type: 'set_node',
      path: nodePath,
      properties: {
        data: node.data
      },
      newProperties: { data: update }
    });

    onToolbarDone(false);
    onSelectChoice(index);
  };

  onRemoveChoice = (val, index) => {
    const { node, nodePath, editor, onToolbarDone, onRemoveChoice } = this.props;

    if (isEqual(val, node.data.value)) {
      const update = { ...node.data, value: null };

      editor.apply({
        type: 'set_node',
        path: nodePath,
        properties: {
          data: node.data
        },
        newProperties: { data: update }
      });

      onToolbarDone(false);
    }

    onRemoveChoice(index);
  };

  onEditChoice = (val, index) => {
    this.onRespAreaChange(val);
    this.setState({ editedChoiceIndex: index });
  };

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.onAddChoice();
      // Cancelling event
      return false;
    }
  };

  onBlur = () => {
    if (this.clickedInside) {
      this.clickedInside = false;
      return;
    }

    const { nodePath, choices, onCheck, onToolbarDone, editor } = this.props;
    const correctResponse = (choices || []).find((choice) => choice.correct);

    this.onAddChoice();

    if (!choices || (choices && choices.length < 2) || !correctResponse) {
      onCheck(() => {
        editor.apply({
          type: 'remove_node',
          path: nodePath
        });

        onToolbarDone(false);
      });
    }
  };

  onClickInside = () => {
    this.clickedInside = true;
  };

  focusInput = () => {
    // we need to focus the input so that math is saved even without pressing the green checkmark
    const slateEditorRef = this.editorRef && this.editorRef.rootRef && this.editorRef.rootRef.slateEditor;
    const inputRef = slateEditorRef && slateEditorRef.editorRef && slateEditorRef.editorRef.element;

    if (inputRef) {
      inputRef.focus();
    }
  };

  render() {
    const { classes, choices, spellCheck, uploadSoundSupport, mathMlOptions = {} } = this.props;
    const { respAreaMarkup, toolbarStyle } = this.state;

    const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
      (p) => p !== 'table' && p !== 'bulleted-list' && p !== 'numbered-list',
    );
    const labelPlugins = {
      audio: { disabled: true },
      video: { disabled: true },
    };

    if (!toolbarStyle) {
      return null;
    }

    return (
      <div
        className={classes.responseContainer}
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6',
        }}
        onMouseDown={this.onClickInside}
      >
        <div className={classes.itemBuilder}>
          <EditableHtml
            ref={(ref) => {
              if (ref) {
                this.editorRef = ref;
              }
            }}
            autoFocus={true}
            autoSave
            className={classes.respArea}
            toolbarOpts={{
              position: 'top',
              alwaysVisible: false,
              showDone: false,
              doneOn: 'blur',
            }}
            markup={respAreaMarkup}
            onKeyDown={this.onKeyDown}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            onChange={(respAreaMarkup) => {
              if (this.preventDone) {
                return;
              }

              this.onRespAreaChange(respAreaMarkup);
            }}
            onDone={(val) => {
              if (this.preventDone) {
                return;
              }

              this.onDone(val);
            }}
            onBlur={(e) => {
              const inInInsertCharacter = e.relatedTarget && e.relatedTarget.closest('.insert-character-dialog');

              this.preventDone = inInInsertCharacter;

              this.onBlur(e);
            }}
            placeholder="Add Choice"
            activePlugins={filteredDefaultPlugins}
            pluginProps={labelPlugins}
            spellCheck={spellCheck}
            uploadSoundSupport={uploadSoundSupport}
            mathMlOptions={mathMlOptions}
          />
          <IconButton
            className={classes.addButton}
            onMouseDown={() => this.focusInput()}
            onClick={() => this.onAddChoice()}
            size="small"
            aria-label="Add"
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </div>

        {choices && (
          <div className={classes.choicesHolder}>
            {choices.map(({ label, correct }, index) => (
              <MenuItem
                key={index}
                onClick={() => this.onSelectChoice(label, index)}
                onRemoveChoice={() => this.onRemoveChoice(label, index)}
                onEditChoice={() => this.onEditChoice(label, index)}
                value={label}
                correct={correct}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

const StyledRespAreaToolbar = withStyles((theme) => ({
  responseContainer: {
    boxShadow: theme.shadows[2],
    borderRadius: '4px',
    width: '400px',
  },
  respArea: {
    borderRadius: '4px',
    backgroundColor: theme.palette.common.white,
    '& [data-slate-editor="true"]': {
      minHeight: 'initial !important',
    },
  },
  addButton: {
    fontSize: theme.typography.fontSize + 2,
    padding: theme.spacing.unit / 2,
    color: theme.palette.common.black,
    position: 'absolute',
    top: '50%',
    right: theme.spacing.unit * 2,
    transform: 'translate(0, -50%)',
  },
  choicesHolder: {
    display: 'flex',
    flexDirection: 'column',
    '& > div:last-child': {
      border: 'none',
    },
  },
  itemBuilder: {
    padding: theme.spacing.unit / 2,
    position: 'relative',
  },
}))(RespAreaToolbar);

export default StyledRespAreaToolbar;
