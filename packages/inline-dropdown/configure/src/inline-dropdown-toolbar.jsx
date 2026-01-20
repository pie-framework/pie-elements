import { getPluginProps } from './utils';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { renderMath } from '@pie-lib/math-rendering';
import { styled } from '@mui/material/styles';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { color } from '@pie-lib/render-ui';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const MenuItemWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  position: 'relative',
  background: theme.palette.common.white,
  borderBottom: `1px solid ${theme.palette.grey[400]}`,

  '&:last-child': {
    borderRadius: '0 0 4px 4px',
  },
}));

const SelectedIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  color: theme.palette.common.white,
  fontSize: theme.typography.fontSize,
  fontStyle: 'normal',
  position: 'absolute',
  transform: 'translate(0, -50%)',
  backgroundColor: color.correct(),
  borderRadius: '50%',
  top: theme.spacing(2),
  left: theme.spacing(1),
  zIndex: 3,
}));

const ValueHolder = styled('div')(({ theme, correct }) => ({
  flex: 1,
  padding: theme.spacing(0.75),
  paddingLeft: theme.spacing(3.5),
  ...(correct && {
    background: color.correctSecondary(),
  }),
}));

const ActionButtons = styled('div')(({ theme }) => ({
  margin: theme.spacing(0.5),
  display: 'flex',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: theme.typography.fontSize,
  padding: theme.spacing(0.5),
  color: theme.palette.common.black,
}));

class MenuItemComp extends React.Component {
  static propTypes = {
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
    const { correct, onClick, value } = this.props;

    return (
      <MenuItemWrapper>
        {correct && (
          <SelectedIcon onClick={onClick}>
            <CheckIcon fontSize="inherit" />
          </SelectedIcon>
        )}
        <ValueHolder
          correct={correct}
          onClick={onClick}
          dangerouslySetInnerHTML={{
            __html: value,
          }}
        />
        <ActionButtons>
          <StyledIconButton onClick={this.onEditClick} size="small" aria-label="Edit">
            <EditIcon fontSize="inherit" />
          </StyledIconButton>
          <StyledIconButton onClick={this.onRemoveClick} size="small" aria-label="Remove">
            <CloseIcon fontSize="inherit" />
          </StyledIconButton>
        </ActionButtons>
      </MenuItemWrapper>
    );
  }
}

const MenuItem = MenuItemComp;

const findSlateNode = (key) => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');

  div.innerHTML = (htmlString || '').trim();

  return div;
};

const ResponseContainer = styled('div')(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: '4px',
  width: '400px',
}));

const RespArea = styled(EditableHtml)(({ theme }) => ({
  borderRadius: '4px',
  backgroundColor: theme.palette.common.white,
  '& [data-slate-editor="true"]': {
    minHeight: 'initial !important',
  },
}));

const AddButton = styled(IconButton)(({ theme }) => ({
  fontSize: theme.typography.fontSize + 2,
  padding: theme.spacing(0.5),
  color: theme.palette.common.black,
  position: 'absolute',
  top: '50%',
  right: theme.spacing(2),
  transform: 'translate(0, -50%)',
}));

const ChoicesHolder = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  '& > div:last-child': {
    border: 'none',
  },
});

const ItemBuilder = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
  position: 'relative',
}));

class RespAreaToolbar extends React.Component {
  static propTypes = {
    node: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
    onDone: PropTypes.func,
    choices: PropTypes.array,
    onAddChoice: PropTypes.func.isRequired,
    onCheck: PropTypes.func,
    onRemoveChoice: PropTypes.func.isRequired,
    onSelectChoice: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    value: PropTypes.shape({
      change: PropTypes.func.isRequired,
      document: PropTypes.shape({
        getNextText: PropTypes.func.isRequired,
      }),
    }),
    spellCheck: PropTypes.bool,
  };
  clickedInside = false;
  preventDone = false;

  state = {
    respAreaMarkup: '',
    editedChoiceIndex: -1,
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
      onAddChoice(node.data.get('index'), val, editedChoiceIndex);
    }

    this.setState({ editedChoiceIndex: -1 });
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

    if (isEqual(val, node.data.get('value'))) {
      const update = { ...node.data.toJSON(), value: null };
      const change = value.change().setNodeByKey(node.key, { data: update });

      onToolbarDone(change, false);
    }

    onRemoveChoice(index);
  };

  onEditChoice = (val, index) => {
    this.onRespAreaChange(val);
    this.setState({ editedChoiceIndex: index });
  };

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.preventDone = false;
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

    const { node, choices, onCheck, onToolbarDone, value } = this.props;
    const correctResponse = (choices || []).find((choice) => choice.correct);

    this.onAddChoice();
    if (!choices || (choices && choices.length < 2) || !correctResponse) {
      onCheck(() => {
        const change = value.change();

        change.removeNodeByKey(node.get('key'));
        onToolbarDone(change, false);
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
    const {
      choices,
      spellCheck,
      uploadSoundSupport,
      mathMlOptions = {},
      baseInputConfiguration = {},
      responseAreaInputConfiguration = {},
    } = this.props;
    const { respAreaMarkup, toolbarStyle } = this.state;

    if (!toolbarStyle) {
      return null;
    }

    return (
      <ResponseContainer
        style={{
          ...toolbarStyle,
          backgroundColor: '#E0E1E6',
        }}
        onMouseDown={this.onClickInside}
      >
        <ItemBuilder>
          <RespArea
            ref={(ref) => {
              if (ref) {
                this.editorRef = ref;
              }
            }}
            autoFocus={true}
            autoSave
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
              if (!e.relatedTarget) {
                return;
              }

              const isInInsertCharacter = !!(e.relatedTarget && e.relatedTarget.closest('.insert-character-dialog'));
              const isInDoneButton = !!(e.relatedTarget && e.relatedTarget.closest('[aria-label="Done"]'));

              this.preventDone = isInInsertCharacter || isInDoneButton;
              if (isInInsertCharacter || isInDoneButton) {
                this.clickedInside = true;
              }
              this.onBlur(e);
            }}
            placeholder="Add Choice"
            pluginProps={getPluginProps(responseAreaInputConfiguration?.inputConfiguration, baseInputConfiguration)}
            spellCheck={spellCheck}
            uploadSoundSupport={uploadSoundSupport}
            mathMlOptions={mathMlOptions}
          />
          <AddButton
            onMouseDown={() => this.focusInput()}
            onClick={() => this.onAddChoice()}
            size="small"
            aria-label="Add"
          >
            <AddIcon fontSize="inherit" />
          </AddButton>
        </ItemBuilder>

        {choices && (
          <ChoicesHolder>
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
          </ChoicesHolder>
        )}
      </ResponseContainer>
    );
  }
}

const StyledRespAreaToolbar = RespAreaToolbar;

export default StyledRespAreaToolbar;
