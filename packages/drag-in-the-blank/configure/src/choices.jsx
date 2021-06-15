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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

window.renMath = renderMath;

const InfoDialog = ({ open, onOk }) => (
  <Dialog open={open}>
    <DialogTitle>Identical answer choices are not allowed and will be discarded</DialogTitle>
    <DialogActions>
      {onOk && (
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

InfoDialog.propTypes = {
  open: PropTypes.bool,
  onOk: PropTypes.func,
};

const styles = theme => ({
  design: {
    marginTop: theme.spacing.unit * 2
  },
  altChoices: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: '20px 0 0 0',
    '& > *': {
      marginBottom: '20px'
    }
  }
});

export class Choices extends React.Component {
  static propTypes = {
    duplicates: PropTypes.bool,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  state = {
    dialog: {
      open: false
    }
  };

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);

    if (this.focusedNodeRef) {
      this.focusedNodeRef.focus('end');
    }
  }

  onChoiceChanged = (prevValue, val, key) => {
    const { onChange, model } = this.props;
    const { choices, correctResponse, alternateResponses } = model;
    const exists = (choices || []).filter(c => c.value === val);

    if(exists.length) {
      const newChoices = (choices || []).filter(c => c.id !== key);

      onChange(newChoices);

      this.setState({
        dialog: {
          open: true,
          onOk: () => {
            this.setState(
              {
                dialog: {
                  open: false
                }
              }
            );
          }
        }
      });

      return;
    }

    const newChoices = choices
      ? choices.map(c => {
        if (c.id === key) {
          return { ...c, value: val };
        }

        return c;
      })
      : [];

    if (choiceIsEmpty({ value: val })) {
      // if the edited content is empty, its usage has to be searched in the correct response definitions
      let usedForResponse = false;

      if (correctResponse) {
        Object.keys(correctResponse).forEach(responseKey => {
          if (correctResponse[responseKey] === key) {
            usedForResponse = true;
          }
        });
      }

      if (alternateResponses) {
        Object.values(alternateResponses).forEach(alternate => {
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
          const newChoicesWithoutTheEmptyOne = newChoices.filter(choice => choice.id !== key);

          onChange(newChoicesWithoutTheEmptyOne);
        } else {
          onChange(newChoices);
        }
      }
    } else {
      onChange(newChoices);
    }
  };

  onChoiceFocus = id => this.setState({
    focusedEl: id
  });

  onAddChoice = () => {
    const { model: { choices: oldChoices }, onChange } = this.props;

    this.setState({
      focusedEl: `${oldChoices.length}`
    }, () => {
      onChange([
          ...oldChoices,
          {
            id: `${oldChoices.length}`,
            value: ''
          }
        ]
      );
    });
  };

  handleChoiceRemove = id => {
    const { onChange, model: { choices } } = this.props;
    const newChoices = choices.filter(c => c.id !== id);

    onChange(newChoices);
  };

  getVisibleChoices = () => {
    const {
      duplicates,
      model: { choices, correctResponse }
    } = this.props;

    if (!choices) {
      return [];
    }

    if (duplicates) {
      return choices;
    }

    // if duplicates not allowed, remove the choices that are used to define the correct response
    return choices.filter(choice => !find(correctResponse, v => v === choice.id));
  };

  render() {
    const { focusedEl, dialog } = this.state;
    const {
      classes,
      duplicates,
    } = this.props;
    const visibleChoices = this.getVisibleChoices() || [];

    return (
      <div className={classes.design}>
        <InfoDialog
          open={dialog.open}
          onOk={dialog.onOk}
        />
        <Button
          className={classes.addButton}
          variant="contained"
          color="primary"
          onClick={this.onAddChoice}
        >
          Add Choice
        </Button>
        <div
          className={classes.altChoices}
        >
          {
            visibleChoices.map((c, index) => {
              if (focusedEl === c.id) {
                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '100%',
                      zIndex: '100'
                    }}
                  >
                    <EditableHtml
                      ref={ref => (this.focusedNodeRef = ref)}
                      className={classes.prompt}
                      markup={c.value}
                      pluginProps={{
                        video: {
                          disabled: true
                        },
                        audio: {
                          disabled: true
                        }
                      }}
                      onChange={val => this.onChoiceChanged(c.value, val, c.id)}
                      onDone={() => {
                        this.setState({
                          focusedEl: undefined
                        });
                      }}
                      disableUnderline
                    />
                  </div>
                );
              }

              return (
                <Choice
                  key={index}
                  duplicates={duplicates}
                  targetId="0"
                  choice={c}
                  onClick={() => this.onChoiceFocus(c.id)}
                  onRemoveChoice={() => this.handleChoiceRemove(c.id)}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Choices);

export default Styled;
