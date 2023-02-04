import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { renderMath } from '@pie-lib/math-rendering';
import find from 'lodash/find';
import Button from '@material-ui/core/Button';
import Choice from './choice';
import { choiceIsEmpty } from './markupUtils';
import { withStyles } from '@material-ui/core/styles';
import { AlertDialog } from '@pie-lib/config-ui';

window.renMath = renderMath;

const styles = (theme) => ({
  design: {
    marginTop: theme.spacing.unit * 2,
  },
  altChoices: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    margin: `${theme.spacing.unit}px 0`,

    '& > *': {
      margin: theme.spacing.unit,
    },
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: 'red',
    paddingBottom: theme.spacing.unit * 2,
  },
});

export class Choices extends React.Component {
  static propTypes = {
    duplicates: PropTypes.bool,
    error: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    toolbarOpts: PropTypes.object,
    maxChoices: PropTypes.number,
    uploadSoundSupport: PropTypes.object,
  };

  editorInstance = null;
  state = { showWarning: false };

  componentDidMount() {
    this.rerenderMath();
  }

  componentDidUpdate() {
    this.rerenderMath();
  }

  rerenderMath = () => {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
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

      this.setState({ showWarning: true });

      return;
    }

    const newChoices = choices?.map((choice) => (choice.id === key ? { ...choice, value: val } : choice)) || [];

    if (choiceIsEmpty({ value: val })) {
      // if the edited content is empty, its usage has to be searched in the correct response definitions
      let usedForResponse = false;

      if (correctResponse) {
        Object.keys(correctResponse).forEach((responseKey) => {
          if (correctResponse[responseKey] === key) {
            usedForResponse = true;
          }
        });
      }

      if (alternateResponses) {
        Object.values(alternateResponses).forEach((alternate) => {
          if (alternate.indexOf(key) >= 0) {
            usedForResponse = true;
          }
        });
      }

      if (usedForResponse) {
        alert('Answer choices cannot be blank.');
      } else {
        if (!choiceIsEmpty({ value: prevValue })) {
          // if the previous value was not empty, it means that the choice can be deleted
          const newChoicesWithoutTheEmptyOne = newChoices.filter((choice) => choice.id !== key);

          onChange(newChoicesWithoutTheEmptyOne);
        } else {
          onChange(newChoices);
        }
      }
    } else {
      onChange(newChoices);
    }
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

    this.setState(
      {
        focusedEl: `${oldChoices.length}`,
      },
      () => {
        onChange([
          ...oldChoices,
          {
            id: `${oldChoices.length}`,
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
    return choices.filter((choice) => !find(correctResponse, (v) => v === choice.id));
  };

  render() {
    const { focusedEl, showWarning } = this.state;
    const {
      classes,
      duplicates,
      error,
      maxChoices,
      model: { choices },
      toolbarOpts,
      uploadSoundSupport,
    } = this.props;
    const visibleChoices = this.getVisibleChoices() || [];

    return (
      <div className={classes.design}>
        <Button
          className={classes.addButton}
          variant="contained"
          color="primary"
          onClick={this.onAddChoice}
          disabled={maxChoices && choices && maxChoices === choices.length}
        >
          Add Choice
        </Button>

        <div className={classes.altChoices}>
          {visibleChoices.map((choice, index) =>
            focusedEl === choice.id ? (
              <div
                key={index}
                style={{
                  minWidth: '100%',
                  zIndex: '100',
                }}
              >
                <EditableHtml
                  onEditor={editor => (this.editorInstance = editor)}
                  className={classes.prompt}
                  markup={choice.value}
                  pluginProps={{
                    video: {
                      disabled: true,
                    },
                    audio: {
                      disabled: true,
                    },
                  }}
                  onChange={(val) => this.onChoiceChanged(choice.value, val, choice.id)}
                  onDone={() => {
                    this.setState({
                      focusedEl: undefined,
                    });
                  }}
                  disableUnderline
                  toolbarOpts={toolbarOpts}
                  uploadSoundSupport={uploadSoundSupport}
                />
              </div>
            ) : (
              <Choice
                key={index}
                duplicates={duplicates}
                targetId="0"
                choice={choice}
                error={error}
                onClick={() => this.onChoiceFocus(choice.id)}
                onRemoveChoice={() => this.onChoiceRemove(choice.id)}
              />
            ),
          )}
        </div>
        {error && <div className={classes.errorText}>{error}</div>}

        <AlertDialog
          open={showWarning}
          title="Warning"
          text="Identical answer choices are not allowed and the changes will be discarded."
          onConfirm={() => this.setState({ showWarning: false })}
        />
      </div>
    );
  }
}

const Styled = withStyles(styles)(Choices);

export default Styled;
