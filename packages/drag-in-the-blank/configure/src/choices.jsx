import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { renderMath } from '@pie-lib/math-rendering';
import { AlertDialog } from '@pie-lib/config-ui';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Choice from './choice';
import { choiceIsEmpty } from './markupUtils';

const StyledDesign = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(1.5),
}));

const StyledAddButton = styled(Button)(({ theme }) => ({
  marginLeft: 'auto',
}));

const StyledAltChoices = styled('div')(({ theme }) => ({
  alignItems: 'flex-start',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  marginTop: theme.spacing(1),

  '& > *': {
    margin: theme.spacing(1),
  },
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingBottom: theme.spacing(2),
}));

export class Choices extends React.Component {
  static propTypes = {
    duplicates: PropTypes.bool,
    error: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    toolbarOpts: PropTypes.object,
    pluginProps: PropTypes.object,
    maxChoices: PropTypes.number,
    uploadSoundSupport: PropTypes.object,
    maxImageWidth: PropTypes.number,
    maxImageHeight: PropTypes.number,
    maxLength: PropTypes.number,
  };

  state = { warning: { open: false } };
  preventDone = false;

  componentDidMount() {
    this.rerenderMath();
  }

  componentDidUpdate() {
    this.rerenderMath();

    if (this.focusedNodeRef) {
      this.focusedNodeRef.focus('end');
    }
  }

  rerenderMath = () => {
    // Use double requestAnimationFrame to defer renderMath
    // This allows speech-rule-engine to initialize and prevents conflicts
    setTimeout(() => {
      //eslint-disable-next-line
      const domNode = ReactDOM.findDOMNode(this);
      if (domNode) {
        console.log('[configure/choices.jsx] Calling renderMath on choices container');
        //  renderMath(domNode);
      }
    }, 0);
  };

  onChoiceChanged = (prevValue, val, key) => {
    const { onChange, model } = this.props;
    const { choices, correctResponse, alternateResponses } = model;
    const duplicatedValue = (choices || []).find((c) => c.value === val && c.id !== key);

    // discard the new added choice or the changes if the choice would be a duplicate to one that already exists
    if (duplicatedValue) {
      if (prevValue === '') {
        // remove the new added choice from choices
        const newChoices = (choices || []).filter((c) => c.id !== key);

        onChange(newChoices);
      }

      this.setState({
        warning: {
          open: true,
          text: 'Identical answer choices are not allowed and the changes will be discarded.',
        },
      });

      return;
    }

    const newChoices = choices?.map((choice) => (choice.id === key ? { ...choice, value: val } : choice)) || [];

    if (!choiceIsEmpty({ value: val })) {
      onChange(newChoices);

      return;
    }

    // if the edited content is empty, its usage has to be searched in the correct response definitions
    let usedForResponse = false;

    if (correctResponse) {
      Object.keys(correctResponse).forEach((responseKey) => {
        if (correctResponse[responseKey] === key) {
          usedForResponse = true;
        }
      });
    }

    if (alternateResponses && !usedForResponse) {
      Object.values(alternateResponses).forEach((alternate) => {
        if (alternate.indexOf(key) >= 0) {
          usedForResponse = true;
        }
      });
    }

    if (usedForResponse) {
      this.setState({
        warning: {
          open: true,
          text: 'Answer choices cannot be blank and the changes will be discarded.',
        },
      });

      return;
    }

    const newChoicesWithoutTheEmptyOne = newChoices.filter((choice) => choice.id !== key);

    onChange(newChoicesWithoutTheEmptyOne);

    this.setState({
      warning: {
        open: true,
        text: 'Answer choices cannot be blank.',
      },
    });
  };

  onChoiceFocus = (id) =>
    this.setState({
      focusedEl: id,
    });

  onAddChoice = () => {
    const {
      model: { choices: oldChoices },
      onChange,
    } = this.props;

    // find the maximum existing id and add 1 to generate the new id so we avoid duplicates
    const maxId = oldChoices.length > 0 
      ? Math.max(...oldChoices.map(choice => parseInt(choice.id, 10) || 0))
      : -1;
    const newId = `${maxId + 1}`;

    this.setState(
      {
        focusedEl: newId,
      },
      () => {
        onChange([
          ...oldChoices,
          {
            id: newId,
            value: '',
          },
        ]);
      },
    );
  };

  onChoiceRemove = (id) => {
    const {
      onChange,
      model: { choices },
    } = this.props;
    const newChoices = (choices || []).filter((choice) => choice.id !== id);

    onChange(newChoices);
  };

  getVisibleChoices = () => {
    const {
      duplicates,
      model: { choices, correctResponse },
    } = this.props;

    if (!choices) {
      return [];
    }

    if (duplicates) {
      return choices;
    }

    // if duplicates not allowed, remove the choices that are used to define the correct response
    return choices.filter((choice) => !(correctResponse && Object.values(correctResponse).includes(choice.id)));
  };

  render() {
    const { focusedEl, warning } = this.state;
    const {
      duplicates,
      error,
      mathMlOptions = {},
      maxChoices,
      model: { choices },
      toolbarOpts,
      uploadSoundSupport,
      imageSupport = {},
      pluginProps = {},
      maxImageWidth,
      maxImageHeight,
      maxLength,
    } = this.props;
    const visibleChoices = this.getVisibleChoices() || [];
    return (
      <StyledDesign>
        <StyledAddButton
          variant="contained"
          color="primary"
          onClick={this.onAddChoice}
          disabled={maxChoices && choices && maxChoices === choices.length}
        >
          Add Choice
        </StyledAddButton>

        <StyledAltChoices>
          {visibleChoices.map((choice, index) => {
            if (!choice || !choice.id) {
              return null;
            }

            return focusedEl === choice.id ? (
              <div
                key={index}
                style={{
                  minWidth: '100%',
                  zIndex: '100',
                }}
              >
                <EditableHtml
                  ref={(ref) => (this.focusedNodeRef = ref)}
                  imageSupport={imageSupport}
                  markup={choice.value}
                  pluginProps={pluginProps}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                  onChange={(val) => {
                    if (this.preventDone) {
                      return;
                    }

                    this.onChoiceChanged(choice.value, val, choice.id);
                  }}
                  onDone={() => {
                    if (this.preventDone) {
                      return;
                    }

                    this.setState({
                      focusedEl: undefined,
                    });
                  }}
                  onBlur={(e) => {
                    const inInInsertCharacter = e.relatedTarget && e.relatedTarget.closest('.insert-character-dialog');

                    this.preventDone = inInInsertCharacter;
                  }}
                  disableUnderline
                  toolbarOpts={toolbarOpts}
                  uploadSoundSupport={uploadSoundSupport}
                  mathMlOptions={mathMlOptions}
                  maxImageHeight={maxImageHeight}
                  maxImageWidth={maxImageWidth}
                  charactersLimit={maxLength}
                />
              </div>
            ) : (
              <Choice
                key={index}
                duplicates={duplicates}
                choice={choice}
                error={error}
                onClick={() => this.onChoiceFocus(choice.id)}
                onRemoveChoice={() => this.onChoiceRemove(choice.id)}
              />
            );
          })}
        </StyledAltChoices>
        {error && <ErrorText>{error}</ErrorText>}

        <AlertDialog
          open={warning.open}
          title="Warning"
          text={warning.text}
          onConfirm={() => this.setState({ warning: { open: false } })}
        />
      </StyledDesign>
    );
  }
}

export default Choices;
